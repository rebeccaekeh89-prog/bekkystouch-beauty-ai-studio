# Database access audit — 30 September 2026
Scope: live public application schema (29 tables), client-role grants, public/storage policies, public views and privileged application functions. This is a scoped access-control review, not a penetration test or certification of complete security.

## Findings and fixes
- Removed TRUNCATE, REFERENCES and TRIGGER privileges from PUBLIC, anon and authenticated across public tables. TRUNCATE bypasses row-level policies; clients must not have it.
- Removed direct client INSERT permission and the permissive INSERT policy on contact_messages. The existing Vercel contact endpoint uses the server credential and continues to save enquiries.
- Reduced newsletter_subscribers permissions to anon INSERT only, preserving the existing newsletter endpoint. RLS already denies customer/anonymous reading of subscriber lists; redundant broad grants were removed.
- Removed dormant permissive bt_orders INSERT and payment_events SELECT policies. Existing grants already denied client access, but these policies were unsafe if grants were expanded later.
- No customer records were deleted by the migrations.

## Verified access model
All 29 public tables have RLS enabled. Effective grants checked for anon and authenticated across SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES and TRIGGER (406 assertions).
- bt_products and studio_products: client SELECT only; active-product policies.
- newsletter_subscribers: anon INSERT only; no client read/update/delete.
- studio_address_books: authenticated SELECT/INSERT/UPDATE, restricted by auth.uid() ownership.
- studio_wishlists: authenticated SELECT/INSERT/DELETE, restricted by auth.uid() ownership.
- Remaining 24 tables: no direct client table privileges, including contact_messages and order tables. Server credentials or privileged dashboard access are used where required.
- No public views/materialized views were found.
- Both public application SECURITY DEFINER functions (create_bt_order and handle_new_user) deny execution by anon and authenticated.
- No storage.objects policies were present. Public buckets intentionally allow media download; client uploads/mutations have no allow policy.

## Tests
supabase/tests/access_audit.sql passed against the live database. It checks the 29-table grant matrix and tests own-address updates, cross-account address read/update/upsert denial, ownership reassignment denial, own-wishlist creation and cross-account wishlist read/insert/delete denial. Test writes were rolled back.
Earlier order and wishlist application tests are in tests/orders.test.mjs and tests/wishlist.test.mjs. The project owner also confirmed desktop/mobile wishlist synchronization and removal.

## Remaining checks
- Supabase dashboard-account MFA, organization members/roles, Vercel team access and GitHub collaborators/2FA cannot be verified through the currently available database/repository connectors. Account owner must check these settings.
- Security advisor reports leaked-password protection disabled. Review availability and enable in Supabase Auth settings if supported by the project plan.
- Informational RLS-without-policy notices are expected for intentionally inaccessible/server-only tables; do not add broad policies merely to remove notices.
- This audit does not certify backups, all server endpoint abuse controls, dependencies, Git history secrets, default privileges for future objects, or a custom admin panel. There is no custom admin panel.
- Re-run the tests whenever schema, grants or policies change.

## Applied changes
supabase/security-hardening.sql records the SQL applied through two migrations: harden_contact_newsletter_and_legacy_policies and revoke_customer_table_administration_privileges. The current schema snapshot includes these changes; do not reapply migrations after restoring the snapshot.

## Owner dashboard checks
Supabase: account security MFA; organization team membership/roles; Auth password protection.
GitHub: account 2FA and repository collaborator access.
Vercel: account login protection and project/team members.
Never record MFA enrollment secrets, recovery factors or private credentials in this repository.
