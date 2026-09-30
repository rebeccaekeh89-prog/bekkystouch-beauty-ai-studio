import { getAuthToken, supabaseUrl, supabasePublishableKey } from './auth';

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

async function accountRequest(path: string, init: RequestInit = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Please sign in again to access your saved addresses.');
  const response = await fetch(`${supabaseUrl}/${path}`, {
    ...init,
    headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers }
  });
  if (!response.ok) throw new Error('Could not sync your addresses. Please try again.');
  return response.status === 204 ? null : response.json();
}

export async function loadAddressBook(): Promise<SavedAddress[]> {
  const rows = await accountRequest('rest/v1/studio_address_books?select=addresses');
  return rows[0]?.addresses || [];
}

export async function saveAddressBook(addresses: SavedAddress[]): Promise<void> {
  const user = await accountRequest('auth/v1/user');
  await accountRequest('rest/v1/studio_address_books?on_conflict=user_id', {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: user.id, addresses })
  });
}
