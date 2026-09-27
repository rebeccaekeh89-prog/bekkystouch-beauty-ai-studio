// Vercel serverless endpoint. The database function validates products and calculates prices.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Checkout is not configured yet.' });
  try {
    const response = await fetch(`${url}/rest/v1/rpc/create_studio_order`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_data: req.body })
    });
    if (!response.ok) {
      console.error('Supabase order request failed', response.status);
      return res.status(response.status === 400 ? 400 : 503).json({ error: 'We could not place your order. Please check the details and try again.' });
    }
    const result = await response.json();
    return res.status(201).json(result);
  } catch (error) {
    console.error('Order endpoint error', error);
    return res.status(503).json({ error: 'Checkout is temporarily unavailable.' });
  }
}
