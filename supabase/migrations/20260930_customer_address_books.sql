create table public.studio_address_books (
user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
addresses jsonb not null default '[]'::jsonb check (jsonb_typeof(addresses) = 'array' and jsonb_array_length(addresses) <= 50)
);
alter table public.studio_address_books enable row level security;
revoke all on public.studio_address_books from anon;
grant select, insert, update on public.studio_address_books to authenticated;
create policy "Customers read own address book" on public.studio_address_books for select to authenticated using ((select auth.uid()) = user_id);
create policy "Customers create own address book" on public.studio_address_books for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Customers update own address book" on public.studio_address_books for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
