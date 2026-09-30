# Supabase setup

1. Create a Supabase project and copy its URL and publishable key into a local `.env.local` using `.env.example` as the template.
2. Run `schema.sql` in the Supabase SQL Editor.
3. Create the first user in Supabase Authentication. Use an email address owned by the firm; Supabase Auth does not support a username-only login.
4. Insert the Auth user id into `public.profiles` with `username = 'Narahari_Adhikari_Admin'` and `role = 'admin'`.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` server-only. Never expose them in `NEXT_PUBLIC_*` variables or client components.

The requested admin password must be entered through Supabase Authentication or a server-side provisioning step. It is intentionally not stored in this repository or SQL so it cannot become a leaked production credential.
