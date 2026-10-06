
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

For a presentation, create these users in Supabase under **Authentication → Users**:

- `educator.demo@example.com`
- `reviewer.demo@example.com`

Set a password for each account in Supabase, then run [`supabase/demo_accounts.sql`](./supabase/demo_accounts.sql)
in the Supabase SQL Editor. This creates the educator profile and assigns the reviewer
profile the `Reviewer` role used for the Executive Director view. The app offers buttons
to fill either demo email; enter the corresponding password to sign in. Do not put demo
passwords, service-role keys, or other secrets in frontend code.
  