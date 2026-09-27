# Deploy the AI Studio website

The AI Studio repository is the source of truth for this website. The previous Next.js repository is not needed for the new deployment.

1. In the **existing Supabase project**, open SQL Editor and run `supabase/studio.sql` once. It creates separate `studio_products` and `studio_orders` tables and an order function. The old tables remain untouched. Confirm 12 rows appear in `studio_products`.
2. In Vercel, open the existing Bekky's Touch project → **Settings → Git** and change the connected GitHub repository to `rebeccaekeh89-prog/bekkystouch-beauty-ai-studio`. Use branch `main` after this integration PR has been merged. Keep the existing project/domain; do not make a second production site.
3. In **Settings → Build and Deployment**, choose Vite (or Other with build command `npm run build` and output directory `dist`). Root directory is the repository root.
4. In **Settings → Environment Variables**, add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY`. Both URLs point to the same Supabase project; both keys are its publishable/anon public key. The `VITE_` variables are intentionally visible to site visitors. Never enter a service role/secret key into a `VITE_` variable. Set these for production and preview.
5. In Supabase **Authentication → URL Configuration**, set Site URL to the actual Vercel production URL and add the Vercel preview URL(s) under Redirect URLs as needed for confirmation and password recovery.
6. Deploy, then test product images, account signup/confirmation/sign in/password recovery, a newsletter subscription, and a single offline test order. Verify the order row in `studio_orders`, including its total and status. Delete the test order from the dashboard if desired.

The checkout displays Card, Apple Pay and Klarna as coursework demo choices. No payment is collected. Orders are saved with status `pending` for offline payment. The order history shown in the account modal is stored in the current browser and is not a complete cross-device order history.
