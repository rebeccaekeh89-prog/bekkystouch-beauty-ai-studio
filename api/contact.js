export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const text = field => typeof req.body?.[field] === 'string' ? req.body[field].trim() : '';
  const name = text('name'), email = text('email'), phone = text('phone');
  const subject = text('subject'), message = text('message');
  if (!name || name.length > 150 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 ||
      phone.length > 50 || !subject || subject.length > 150 || message.length < 10 || message.length > 10000) {
    return res.status(400).json({ error: 'Please check your contact details and enter a message between 10 and 10,000 characters.' });
  }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return res.status(503).json({ error: 'Contact service is temporarily unavailable. Please try again later.' });
  try {
    const result = await fetch(`${url}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: { apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
        'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ name, email, phone, subject, message })
    });
    if (!result.ok) throw new Error('Submission failed');
    return res.status(201).json({ success: true });
  } catch {
    return res.status(503).json({ error: 'Your message could not be sent. Please try again.' });
  }
}
