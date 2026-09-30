REVOKE ALL ON public.contact_messages FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS "Visitors can submit contact enquiries" ON public.contact_messages;
REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon;
DROP POLICY IF EXISTS "Allow public order placement" ON public.bt_orders;
DROP POLICY IF EXISTS "Allow read access to payment events" ON public.payment_events;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
