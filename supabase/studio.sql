-- Run this migration in the existing Supabase project's SQL editor before deploying checkout.
-- These tables are separate from the previous site's bt_* tables.
CREATE TABLE IF NOT EXISTS public.studio_products (
  id integer PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  active boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS public.studio_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postcode text NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  discount numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  promo_code text,
  payment_method text NOT NULL DEFAULT 'offline',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.studio_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_orders ENABLE ROW LEVEL SECURITY;
-- Public catalog browsing; orders have no public read policy.
DROP POLICY IF EXISTS "Studio product browse" ON public.studio_products;
CREATE POLICY "Studio product browse" ON public.studio_products FOR SELECT TO anon, authenticated USING (active);
INSERT INTO public.studio_products (id, name, price, active) VALUES
(1, 'Second Skin Foundation', 28.0, true),
(2, 'Cloud Blush', 18.0, true),
(3, 'Brighten Concealer', 20.0, true),
(4, 'Sculpt & Glow Duo', 24.0, true),
(5, 'Velvet Eyeshadow Palette', 34.0, true),
(6, 'Precision Liquid Liner', 15.0, true),
(7, 'Lift & Length Mascara', 17.0, true),
(8, 'Sculpting Brow Pencil', 14.0, true),
(9, 'Feather Hold Brow Gel', 16.0, true),
(10, 'Satin Kiss Lipstick', 19.0, true),
(11, 'Glass Lip Oil', 17.0, true),
(12, 'Flawless Finish Brush', 22.0, true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price, active=EXCLUDED.active;

CREATE OR REPLACE FUNCTION public.create_studio_order(order_data jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  line jsonb;
  p record;
  clean_items jsonb := '[]'::jsonb;
  subtotal_amount numeric(10,2) := 0;
  discount_amount numeric(10,2);
  promo text := upper(trim(coalesce(order_data->>'promo_code','')));
  order_uuid uuid;
  qty integer;
  product_id integer;
  name_value text := trim(coalesce(order_data->>'customer_name',''));
  email_value text := trim(coalesce(order_data->>'email',''));
BEGIN
  IF length(name_value) < 2 OR length(email_value) > 254 OR email_value !~* '^[^@ ]+@[^@ ]+\.[^@ ]+$'
     OR length(trim(coalesce(order_data->>'phone',''))) < 5
     OR length(trim(coalesce(order_data->>'address',''))) < 4
     OR length(trim(coalesce(order_data->>'city',''))) < 2
     OR length(trim(coalesce(order_data->>'postcode',''))) < 4
     OR jsonb_typeof(order_data->'items') IS DISTINCT FROM 'array'
     OR jsonb_array_length(order_data->'items') < 1
     OR jsonb_array_length(order_data->'items') > 30 THEN
    RAISE EXCEPTION 'Invalid order details';
  END IF;
  FOR line IN SELECT value FROM jsonb_array_elements(order_data->'items') LOOP
    IF (line->>'product_id') !~ '^[0-9]+$' OR (line->>'quantity') !~ '^[0-9]+$' THEN
      RAISE EXCEPTION 'Invalid item';
    END IF;
    product_id := (line->>'product_id')::integer;
    qty := (line->>'quantity')::integer;
    IF qty < 1 OR qty > 20 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
    SELECT id, name, price INTO p FROM public.studio_products WHERE id = product_id AND active;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product unavailable'; END IF;
    subtotal_amount := subtotal_amount + p.price * qty;
    clean_items := clean_items || jsonb_build_object('product_id', p.id, 'name', p.name, 'unit_price', p.price, 'quantity', qty, 'shade', left(coalesce(line->>'shade',''), 80));
  END LOOP;
  IF subtotal_amount > 10000 THEN RAISE EXCEPTION 'Order too large'; END IF;
  IF promo NOT IN ('', 'WELCOME10', 'BEKKYTOUCH', 'GLOW20') THEN RAISE EXCEPTION 'Invalid promo code'; END IF;
  discount_amount := round(subtotal_amount * CASE promo WHEN 'WELCOME10' THEN .10 WHEN 'BEKKYTOUCH' THEN .15 WHEN 'GLOW20' THEN .20 ELSE 0 END, 2);
  INSERT INTO public.studio_orders (customer_name, email, phone, address, city, postcode, items, subtotal, discount, total, promo_code)
  VALUES (left(name_value,120), email_value, left(order_data->>'phone',40), left(order_data->>'address',250), left(order_data->>'city',100), left(order_data->>'postcode',20), clean_items, subtotal_amount, discount_amount, subtotal_amount-discount_amount, nullif(promo,''))
  RETURNING id INTO order_uuid;
  RETURN jsonb_build_object('orderId', order_uuid, 'subtotal', subtotal_amount, 'discount', discount_amount, 'total', subtotal_amount-discount_amount);
END; $$;
REVOKE ALL ON FUNCTION public.create_studio_order(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_studio_order(jsonb) TO anon, authenticated;
