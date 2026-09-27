type AuthUser = { email: string; user_metadata?: { full_name?: string } };
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const storageKey = 'bekkys_touch_session';

async function request(path: string, body: object) {
  if (!url || !key) throw new Error('Account access is not configured yet.');
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || data.error_description || data.message || 'Account request failed.');
  return data;
}

export async function signIn(email: string, password: string) {
  const data = await request('token?grant_type=password', { email, password });
  localStorage.setItem(storageKey, JSON.stringify({ access_token: data.access_token, refresh_token: data.refresh_token }));
  return { email: data.user.email as string, name: data.user.user_metadata?.full_name || data.user.email };
}
export async function signUp(name: string, email: string, password: string) {
  const data = await request('signup', { email, password, data: { full_name: name } });
  if (data.session?.access_token) {
    localStorage.setItem(storageKey, JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }));
    return { email: data.user.email as string, name };
  }
  return null; // Email confirmation is required.
}
export async function resetPassword(email: string) {
  await request('recover', { email });
}
export function signOut() { localStorage.removeItem(storageKey); }
export async function restoreUser() {
  if (!url || !key) return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    let session = JSON.parse(raw);
    let response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${session.access_token}` } });
    if (response.status === 401 && session.refresh_token) {
      const refreshed = await request('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
      session = { access_token: refreshed.access_token, refresh_token: refreshed.refresh_token };
      localStorage.setItem(storageKey, JSON.stringify(session));
      response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${session.access_token}` } });
    }
    if (!response.ok) throw new Error('Session expired');
    const user: AuthUser = await response.json();
    return { email: user.email, name: user.user_metadata?.full_name || user.email };
  } catch { signOut(); return null; }
}
