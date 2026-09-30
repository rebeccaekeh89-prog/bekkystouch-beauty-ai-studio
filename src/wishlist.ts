import { getAuthToken, supabaseUrl, supabasePublishableKey } from './auth';

async function wishlistRequest(path: string, init: RequestInit = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Please sign in again to sync your wishlist.');
  const response = await fetch(`${supabaseUrl}/rest/v1/studio_wishlists${path}`, {
    ...init,
    headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', ...init.headers }
  });
  if (!response.ok) throw new Error('Could not sync your wishlist. Please refresh and try again.');
  return response.status === 204 || response.status === 201 ? null : response.json();
}

export async function loadWishlist(): Promise<number[]> {
  const rows = await wishlistRequest('?select=product_id&order=created_at.asc');
  return rows.map((row: { product_id: number }) => row.product_id).filter(Number.isSafeInteger);
}

export async function saveWishlistItem(productId: number): Promise<void> {
  await wishlistRequest('?on_conflict=user_id,product_id', {
    method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ product_id: productId })
  });
}

export async function removeWishlistItem(productId: number): Promise<void> {
  await wishlistRequest(`?product_id=eq.${productId}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}

export function readSavedWishlist(key: string): number[] {
  const raw = localStorage.getItem(key);
  const saved = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(saved)) throw new Error('Your saved wishlist could not be read.');
  return [...new Set(saved.filter((id): id is number => Number.isSafeInteger(id) && id > 0))];
}
