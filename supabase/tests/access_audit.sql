BEGIN;
DO $audit$
DECLARE t record; r text; op text; expected boolean; actual boolean; table_count integer;
BEGIN
 SELECT count(*) INTO table_count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r';
 IF table_count<>29 THEN RAISE EXCEPTION 'Expected 29 tables, got %',table_count; END IF;
 FOR t IN SELECT c.oid,c.relname,c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' LOOP
 IF NOT t.relrowsecurity THEN RAISE EXCEPTION 'RLS disabled: %',t.relname; END IF;
 FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
 FOREACH op IN ARRAY ARRAY['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'] LOOP
 expected := (t.relname IN ('bt_products','studio_products') AND op='SELECT')
 OR (t.relname='newsletter_subscribers' AND r='anon' AND op='INSERT')
 OR (t.relname='studio_address_books' AND r='authenticated' AND op IN ('SELECT','INSERT','UPDATE'))
 OR (t.relname='studio_wishlists' AND r='authenticated' AND op IN ('SELECT','INSERT','DELETE'));
 actual:=has_table_privilege(r,t.oid,op);
 IF actual IS DISTINCT FROM expected THEN RAISE EXCEPTION 'Unexpected grant: % % % expected % got %',t.relname,r,op,expected,actual; END IF;
 END LOOP; END LOOP; END LOOP;
END $audit$;
DO $isolation$
DECLARE u uuid; v uuid; p bigint; seen integer; changed integer;
BEGIN
 SELECT id INTO u FROM auth.users ORDER BY created_at LIMIT 1;
 SELECT id INTO v FROM auth.users WHERE id<>u ORDER BY created_at LIMIT 1;
 SELECT id INTO p FROM public.bt_products WHERE active LIMIT 1;
 IF u IS NULL OR v IS NULL OR p IS NULL THEN RAISE EXCEPTION 'Two users and one active product required'; END IF;
 INSERT INTO public.studio_address_books(user_id,addresses) VALUES(u,'[]'),(v,'[]') ON CONFLICT DO NOTHING;
 INSERT INTO public.studio_wishlists(user_id,product_id) VALUES(u,p),(v,p) ON CONFLICT DO NOTHING;
 PERFORM set_config('request.jwt.claims',json_build_object('sub',u,'role','authenticated')::text,true);
 EXECUTE 'SET LOCAL ROLE authenticated';
 SELECT count(*) INTO seen FROM public.studio_address_books WHERE user_id=v;
 IF seen<>0 THEN RAISE EXCEPTION 'Cross-account address read allowed'; END IF;
 UPDATE public.studio_address_books SET addresses='[]' WHERE user_id=v; GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>0 THEN RAISE EXCEPTION 'Cross-account address update allowed'; END IF;
 BEGIN
 INSERT INTO public.studio_address_books(user_id,addresses) VALUES(v,'[]') ON CONFLICT(user_id) DO UPDATE SET addresses=EXCLUDED.addresses;
 RAISE EXCEPTION 'Cross-account address upsert allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
 UPDATE public.studio_address_books SET user_id=gen_random_uuid() WHERE user_id=u;
 RAISE EXCEPTION 'Address ownership reassignment allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE public.studio_address_books SET addresses=addresses WHERE user_id=u; GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>1 THEN RAISE EXCEPTION 'Owner address update failed'; END IF;
 SELECT count(*) INTO seen FROM public.studio_wishlists WHERE user_id=v;
 IF seen<>0 THEN RAISE EXCEPTION 'Cross-account wishlist read allowed'; END IF;
 DELETE FROM public.studio_wishlists WHERE user_id=v; GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed<>0 THEN RAISE EXCEPTION 'Cross-account wishlist delete allowed'; END IF;
 BEGIN
 INSERT INTO public.studio_wishlists(user_id,product_id) VALUES(v,p);
 RAISE EXCEPTION 'Cross-account wishlist insert allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 DELETE FROM public.studio_wishlists WHERE user_id=u AND product_id=p;
 INSERT INTO public.studio_wishlists(product_id) VALUES(p);
 EXECUTE 'RESET ROLE';
END $isolation$;
SELECT 'PASS: all 29 table grants/RLS and address/wishlist ownership tests; transaction rolled back' AS result;
ROLLBACK;