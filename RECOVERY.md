# Database recovery and backup
Schema snapshot: supabase/schema.sql, captured from the live application's public tables, columns, enum types, sequences, constraints, indexes, functions, auth profile trigger, RLS policies and explicit table/function grants on 30 September 2026.

## Scope
The SQL is a structural snapshot, not a data backup. It includes bucket definitions, not uploaded objects. Supabase-managed auth and storage schemas, login credentials, email delivery settings, OAuth settings, redirects, project secrets and Vercel configuration must be recreated separately. No customer rows, authentication users or secrets are committed. The current database includes prototype structures that are not yet used in the application.

## Before an incident
1. Obtain a database backup through the project's Supabase dashboard or use pg_dump with the project's connection details in a trusted environment.
2. Keep backups encrypted outside GitHub. Record when each backup was taken and restrict access.
3. Back up product media separately; verify the downloaded objects and file counts.
4. Keep project configuration and secret recovery details in a secure password manager, not this repository.
5. Record the source GitHub commit used by the deployed website.
6. Check your project's actual backup availability and retention in the dashboard. This repository does not guarantee an automatic backup or point-in-time recovery plan.

For a structural comparison/export on a trusted machine with Supabase CLI installed:
```sh
supabase db dump --db-url "$DATABASE_URL" --schema public --file public-schema.sql
```
Use the vendor export/restore tools for a full backup including application data and authentication users. A public-schema-only export will not preserve login accounts. Never print a database password or connection string in a shared terminal transcript.

## Restore to a NEW project
Do not run schema.sql on the existing production database: it creates tables/types and will conflict with existing objects.
1. Create a separate Supabase project for restoration verification.
2. Confirm managed auth/storage schemas and anon/authenticated/service_role roles exist.
3. Apply supabase/schema.sql using that project's SQL editor or an authenticated database client. The transaction should commit entirely or roll back on an error.
4. Restore application data from a protected compatible backup. Restore authentication users through supported Supabase backup procedures; user IDs must match foreign-key references.
5. Reset serial sequences after importing IDs so new records do not collide.
6. Restore uploaded media into the matching buckets. Reconfigure authentication Site URL, allowed redirect URLs and email delivery.
7. Deploy a Vercel preview with the NEW project's environment variables. Never point a test restore at production.
8. Compare table, column, constraint, policy, trigger and grant counts with the source snapshot. Test two accounts: each must see only its own addresses, orders and wishlist.
9. Test registration and email confirmation, password recovery, offline checkout, contact delivery, catalogue images and address/wishlist migration.
10. Only after independent validation should an owner decide whether to switch production configuration.

## Known status
Snapshot generated and checked for structural coverage. Recovery instructions documented. An isolated restoration has NOT been executed; do not describe disaster recovery as tested.
The snapshot reflects existing policies and prototype limitations. It is not a security certification or an invitation to expose database credentials.
