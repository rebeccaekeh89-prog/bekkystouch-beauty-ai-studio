import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/orders.js';

const validOrder = { customer_name: 'Test Customer', email: 'test@example.com', phone: '01234567890', address: '1 Test Road', city: 'Colchester', postcode: 'CO1 1AA', items: [{ product_id: 1, quantity: 2, shade: 'Ivory' }] };
function response() {
  return { headers: {}, setHeader(k,v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
const reply = (data, ok = true) => ({ ok, json: async () => data });
async function run(req, fetcher) {
  const original = globalThis.fetch;
  globalThis.fetch = fetcher || (() => { throw new Error('Unexpected network request'); });
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test';
  const res = response();
  try { await handler({ headers: {}, ...req }, res); return res; }
  finally { globalThis.fetch = original; }
}

test('order history requires authentication and disables caching', async () => {
  const res = await run({ method: 'GET' });
  assert.equal(res.code, 401);
  assert.equal(res.headers['Cache-Control'], 'private, no-store');
});
test('invalid session cannot query orders', async () => {
  let calls = 0;
  const res = await run({ method: 'GET', headers: { authorization: 'Bearer invalid' } }, async () => { calls++; return reply({}, false); });
  assert.equal(res.code, 401); assert.equal(calls, 1);
});
test('email wildcard characters are literal in both order tables', async () => {
  const urls = [];
  const res = await run({ method: 'GET', headers: { authorization: 'Bearer session' } }, async (url, options) => {
    urls.push(url);
    if (url.includes('/auth/')) return reply({ email: 'a_%*@example.com' });
    assert.equal(new URL(url).searchParams.get('email'), 'eq."a_%*@example.com"');
    assert.equal(options.headers.Authorization, undefined);
    return urls.length === 2 ? reply({}, false) : reply([{ id: 'own-order' }]);
  });
  assert.equal(res.code, 200); assert.equal(urls.length, 3);
});
test('database failure is not reported as empty history', async () => {
  const res = await run({ method: 'GET', headers: { authorization: 'Bearer session' } }, async url => url.includes('/auth/') ? reply({ email: 'test@example.com' }) : reply({}, false));
  assert.equal(res.code, 503);
});
for (const item of [null, {}, { product_id: 0, quantity: 1 }, { product_id: 1, quantity: -1 }, { product_id: 1, quantity: 21 }, { product_id: 1, quantity: 1.5 }]) {
  test(`rejects malformed item ${JSON.stringify(item)}`, async () => {
    const res = await run({ method: 'POST', body: { ...validOrder, items: [item] } });
    assert.equal(res.code, 400);
  });
}
test('server calculates price and discount and stores only offline pending orders', async () => {
  const res = await run({ method: 'POST', body: { ...validOrder, total: 0, payment_method: 'paid', promo_code: 'WELCOME10' } }, async (url, options) => {
    if (url.includes('products')) {
      assert.equal(new URL(url).searchParams.get('active'), 'eq.true');
      return reply([{ id: 1, name: 'Foundation', price: 28 }]);
    }
    const saved = JSON.parse(options.body);
    assert.equal(saved.total, 50.4); assert.equal(saved.discount, 5.6);
    assert.equal(saved.payment_method, 'offline'); assert.equal(saved.status, 'pending');
    assert.equal(saved.items[0].unit_price, 28);
    return reply([{ id: 'order-1' }]);
  });
  assert.equal(res.code, 201); assert.equal(res.body.total, 50.4);
});
test('rejects unavailable products', async () => {
  const res = await run({ method: 'POST', body: validOrder }, async () => reply([]));
  assert.equal(res.code, 400);
});
test('legacy service role keys authenticate database reads and writes', async () => {
  let calls = 0;
  const original = globalThis.fetch;
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'eyJ.test.key';
  globalThis.fetch = async (url, options) => {
    calls++; assert.equal(options.headers.Authorization, 'Bearer eyJ.test.key');
    return url.includes('products') ? reply([{ id: 1, name: 'Foundation', price: 28 }]) : reply([{ id: 'order-2' }]);
  };
  const res = response();
  try { await handler({ method: 'POST', headers: {}, body: validOrder }, res); }
  finally { globalThis.fetch = original; }
  assert.equal(res.code, 201); assert.equal(calls, 2);
});
test('does not silently substitute a public key when server secret is missing', async () => {
  delete process.env.SUPABASE_SECRET_KEY;
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test';
  const res = response();
  await handler({ method: 'POST', headers: {}, body: validOrder }, res);
  assert.equal(res.code, 503);
});
