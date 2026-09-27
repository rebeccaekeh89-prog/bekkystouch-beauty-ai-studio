export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Catalogue is not configured yet.' });
  try {
    const result = await fetch(`${url}/rest/v1/studio_products?select=id,name,price&active=eq.true&order=id.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store'
    });
    if (!result.ok) return res.status(503).json({ error: 'Catalogue is temporarily unavailable.' });
    return res.status(200).json(await result.json());
  } catch {
    return res.status(503).json({ error: 'Catalogue is temporarily unavailable.' });
  }
}
