
  # Open Learning Type

  This is a code bundle for Open Learning Type. The original project is available at https://www.figma.com/design/SSzYgZmuOPlu60KhVvDvkP/Open-Learning-Type.

  ## Running the app

  From this directory, run `pnpm install` to install the dependencies.

  Run `pnpm dev` to start the development server, `pnpm build` to create a production build, or `pnpm preview` to serve that build locally.

## Supabase authentication

Configure the Vite build with a Supabase project URL and a **public** key. The preferred
names are `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; `SUPABASE_URL`
plus `SUPABASE_PUBLISHABLE_KEY` (or a legacy anon `SUPABASE_KEY`) are also supported.
The app rejects secret/service-role keys. On Vercel, add the variables for every
deployment environment and redeploy after changing them.

For a real Supabase presentation, create these users in Supabase under
**Authentication → Users**, set a password for each one, and confirm their email:

- `educator.demo@example.com`
- `reviewer.demo@example.com`
- `admin.demo@example.com`

Then run [`supabase/demo_accounts.sql`](./supabase/demo_accounts.sql) in the Supabase SQL
Editor. It creates/updates the application profiles as `Educator`, `Reviewer` (Executive
Director view), and `Admin`. The script stops with a clear error if any Auth user is
missing. Enter the matching email and password in the sign-in form. The SQL intentionally
does not insert directly into `auth.users` or store
passwords: create Auth users through Supabase so passwords are safely hashed and Auth
metadata is properly initialized. Never put demo passwords or service-role keys in
frontend code.

For a local, non-Supabase presentation instead, set `VITE_ENABLE_DEMO_LOGIN=true` in
`EduMind/.env.local` and run `pnpm dev`. Use one of these local demo accounts (the shared
password is `EduMindDemo2026!`):

- Educator / Faculty: `educator.demo@edumind.local`
- Reviewer / Executive Director: `reviewer.demo@edumind.local`
- Admin: `admin.demo@edumind.local`

These hard-coded credentials only simulate sign-in for presentations; they do not access
Supabase or its data. The demo mode is automatically disabled in production builds
regardless of the flag. Do not use these credentials for real accounts.
  