CREATE TABLE public.studio_wishlists (
user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
product_id bigint NOT NULL REFERENCES public.bt_products(id) ON DELETE CASCADE,
created_at timestamptz NOT NULL DEFAULT now(),
PRIMARY KEY (user_id, product_id)
);
ALTER TABLE public.studio_wishlists ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.studio_wishlists FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.studio_wishlists TO authenticated;
GRANT ALL ON public.studio_wishlists TO service_role;
CREATE POLICY "Customers read own favourites" ON public.studio_wishlists FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Customers save own favourites" ON public.studio_wishlists FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Customers remove own favourites" ON public.studio_wishlists FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);