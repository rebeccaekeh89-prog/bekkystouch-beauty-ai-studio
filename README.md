# Bekky’s Touch Beauty
Coursework e-commerce application built with React, TypeScript and Vite, deployed to Vercel with Supabase authentication and PostgreSQL.

Production: https://bekkystouch-beauty.vercel.app/
Repository: https://github.com/rebeccaekeh89-prog/bekkystouch-beauty-ai-studio

## Run locally
Install Node.js 24 or later and Git.
```sh
git clone https://github.com/rebeccaekeh89-prog/bekkystouch-beauty-ai-studio.git
cd bekkystouch-beauty-ai-studio
npm install
npm run dev
```
Private repositories require access from the owner. Copy the configuration below into an untracked .env.local file:
```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```
Client keys are public identifiers; database RLS must enforce access. Never put a secret or service-role key in a VITE_ variable or commit it.

## Server configuration
Set these in Vercel project Environment Variables:
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SECRET_KEY (server only)

Redeploy after changing server configuration. Vite alone does not run the api/ Vercel Functions. Use the Vercel development environment for local API tests. No Gemini key is required for the current store workflows.

## Verification
```sh
npm run lint
npm run build
node tests/orders.test.mjs
node tests/wishlist.test.mjs
```
Customer checks: registration, email confirmation, sign-in/out, password recovery, profile settings, offline checkout, order history, saved addresses, wishlist, and contact submission. Email-based authentication was tested by the project owner. Cross-device storage should be tested using the same account in two browser sessions.

## Implemented customer features
- Dedicated Our Story, Contact, My Account, Shade Finder, Gifts & Sets and Shipping & Returns pages.
- Supabase email/password authentication and recovery.
- Product catalogue, shade selection, search and category filtering.
- Offline coursework checkout; server validates catalogue prices and promotional codes.
- Order history from studio_orders, with bt_orders as fallback.
- Saved addresses in studio_address_books, protected by customer ownership policies.
- Contact enquiries genuinely saved to contact_messages; no automatic email notifications.
- Signed-in wishlists persist in studio_wishlists across devices; existing customer browser favourites migrate on sign-in. Guest favourites remain local.
- Basket persists in the current browser.

## Database structure versus application integration
Tables existing in the database are not evidence of complete customer workflows.
| Structure | Application status |
| --- | --- |
| bt_products / studio_products | Catalogue and checkout price validation |
| studio_orders / bt_orders | Offline order creation and history |
| profiles / auth.users | Account identity structure and authentication |
| studio_address_books | Account-based address persistence |
| contact_messages | Real contact submission |
| newsletter_subscribers | Subscription endpoint exists; end-to-end delivery unverified |
| studio_wishlists | Account-synced favourites with ownership policies |
| wishlists | Legacy structure; live catalogue uses studio_wishlists |
| carts / cart_items | Structure exists; basket is browser-based |
| categories / product_variants / product_images | Structure exists; full database-driven integration pending |
| bt_order_items / orders / order_items | Structures exist; current checkout uses embedded studio order items |
| coupons | Structure exists; current promo codes are server-defined |
| inventory / stock_movements | Structure implemented; application integration pending |
| payments / payment_events | Structure implemented; online payments intentionally excluded |
| shipping_deliveries | Structure implemented; tracking workflow pending |
| reviews | Structure implemented; customer review submission integration pending |
| notifications / audit_logs | Structure implemented; complete workflow verification pending |
| customer_addresses | Structure exists; current website uses studio_address_books |

## Security and limitations
Sensitive data access is controlled by database policies and server validation. RLS is enabled on public tables; a full policy audit of every table has not been completed. Address ownership read isolation was checked. Wishlist owner inserts/deletes and cross-account read/insert/delete denial were tested in a rolled-back database transaction. Anonymous and customer reads of contact messages are denied. Server secrets stay in Vercel, not browser code. Do not include customer data, secrets, backups or .env.local in a public repository.

This is a coursework prototype: offline payments, no automated fulfilment, no online payment processing. Backup restoration has not been tested in a separate project.

## Database and recovery documentation
The complete public application structure snapshot is in supabase/schema.sql. Recovery procedures and exclusions are in RECOVERY.md. The snapshot includes the recorded address, contact and wishlist migrations; do not apply those migrations a second time after restoring it. A structural snapshot is not a data or media backup.
