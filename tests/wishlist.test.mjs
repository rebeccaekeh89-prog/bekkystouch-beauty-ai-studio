import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const source = fs.readFileSync(new URL('../src/wishlist.ts', import.meta.url), 'utf8')
  .replace("import { getAuthToken, supabaseUrl, supabasePublishableKey } from './auth';",
    "const getAuthToken = () => globalThis.testWishlistToken; const supabaseUrl = 'https://test.supabase.co'; const supabasePublishableKey = 'public-test';");
const compiled = stripTypeScriptTypes(source);
const wishlist = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('signed-out customers cannot submit account requests', async () => {
  globalThis.testWishlistToken = null;
  globalThis.fetch = () => { throw new Error('Unexpected request'); };
  await assert.rejects(wishlist.loadWishlist(), /sign in again/);
});

test('account wishlist writes use session authentication and idempotent inserts', async () => {
  globalThis.testWishlistToken = 'own-session';
  globalThis.fetch = async (url, init) => {
    assert.equal(init.headers.Authorization, 'Bearer own-session');
    assert.equal(init.headers.apikey, 'public-test');
    assert.equal(JSON.parse(init.body).product_id, 15);
    assert.equal(JSON.parse(init.body).user_id, undefined);
    assert.equal(new URL(url).searchParams.get('on_conflict'), 'user_id,product_id');
    assert.match(init.headers.Prefer, /ignore-duplicates/);
    return { ok: true, status: 204 };
  };
  await wishlist.saveWishlistItem(15);
});

test('loading another browser retrieves server favourites', async () => {
  globalThis.testWishlistToken = 'own-session';
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => [{ product_id: 1 }, { product_id: 15 }] });
  assert.deepEqual(await wishlist.loadWishlist(), [1, 15]);
});

test('failed sync is reported rather than treated as success', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 403 });
  await assert.rejects(wishlist.saveWishlistItem(15), /Could not sync/);
});

test('legacy browser favourites are read without removing the original', () => {
  let removed = false;
  globalThis.localStorage = { getItem: () => '[1,15,15,"16",null]', removeItem: () => { removed = true; } };
  assert.deepEqual(wishlist.readSavedWishlist('legacy'), [1, 15]);
  assert.equal(removed, false);
});
