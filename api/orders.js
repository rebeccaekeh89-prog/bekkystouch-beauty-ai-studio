// Server-side Vercel Function. Never expose SUPABASE_SECRET_KEY in VITE_ variables.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Checkout is not configured yet.' });
  const order = req.body || {};
  const text = field => String(order[field] || '').trim();
  const name = text('customer_name');
  const email = text('email');
  const phone = text('phone');
  const address = text('address');
  const city = text('city');
  const postcode = text('postcode');
  const items = order.items;
  if (name.length < 2 || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 ||
      phone.length < 5 || phone.length > 40 || address.length < 4 || address.length > 250 ||
      city.length < 2 || city.length > 100 || postcode.length < 4 || postcode.length > 20 ||
      !Array.isArray(items) || items.length < 1 || items.length > 30) {
    return res.status(400).json({ error: 'Please complete all required order details.' });
  }
  const ids = [...new Set(items.map(item => Number(item.product_id)))];
  if (items.some(item => !Number.isSafeInteger(Number(item.product_id)) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || String(item.shade || '').length > 80)) {
    return res.status(400).json({ error: 'Invalid order item.' });
  }
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  try {
    const catalogResponse = await fetch(`${url}/rest/v1/studio_products?select=id,name,price&active=eq.true&id=in.(${ids.join(',')})`, { headers, cache: 'no-store' });
    if (!catalogResponse.ok) throw new Error('Catalog unavailable');
    const products = new Map((await catalogResponse.json()).map(p => [p.id, p]));
    if (products.size !== ids.length) return res.status(400).json({ error: 'An item is no longer available.' });
    let subtotal = 0;
    const cleanItems = items.map(item => {
      const p = products.get(Number(item.product_id));
      const price = Number(p.price);
      if (!Number.isFinite(price) || price < 0) throw new Error('Invalid catalog price');
      subtotal += price * item.quantity;
      return { product_id: p.id, name: p.name, unit_price: price, quantity: item.quantity, shade: String(item.shade || '') };
    });
    if (subtotal > 10000) return res.status(400).json({ error: 'Order is too large.' });
    const promo = String(order.promo_code || '').trim().toUpperCase();
    const rates = { WELCOME10: .10, BEKKYTOUCH: .15, GLOW20: .20 };
    if (promo && !Object.hasOwn(rates, promo)) return res.status(400).json({ error: 'Invalid promo code.' });
    const discount = Math.round(subtotal * (rates[promo] || 0) * 100) / 100;
    const total = Math.round((subtotal - discount) * 100) / 100;
    const saved = await fetch(`${url}/rest/v1/studio_orders?select=id`, {
      method: 'POST', headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ customer_name: name, email, phone, address, city, postcode, items: cleanItems,
        subtotal, discount, total, promo_code: promo || null, payment_method: 'offline', status: 'pending' })
    });
    if (!saved.ok) throw new Error('Order save failed');
    const [row] = await saved.json();
    return res.status(201).json({ orderId: row.id, subtotal, discount, total });
  } catch (error) {
    console.error('Order endpoint error', error);
    return res.status(503).json({ error: 'Checkout is temporarily unavailable.' });
  }
}
