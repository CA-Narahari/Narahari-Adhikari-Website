# Reusable database schema

1. Create a Supabase project and copy its URL and publishable key into a local `.env.local` using `.env.example` as the template.
2. Run `schema.sql` in the Supabase SQL Editor for a new project. For an existing project, run the applicable SQL files in `migrations/`; the current appointment and application fields are in `20261006_appointments_company_name.sql`.
   Apply the additive migrations in filename order after reviewing the target: `20261006_appointments_company_name.sql`, `20261007_security_content_integrity.sql`, `20261007_seed_service_articles.sql`, `20261007_seed_global_content.sql`, and `20261007_content_calculator.sql`. The seed files use conflict-safe inserts and do not overwrite existing CMS rows.
3. Create or invite each authorised user in Supabase Authentication. In production, keep public sign-ups disabled and provision staff accounts intentionally.
4. Add each Auth user's UUID to `public.profiles`, supplying its required profile fields. For example, replace the placeholders and run `insert into public.profiles (id, username, display_name, role) values ('AUTH_USER_UUID', 'unique-profile-name', 'Staff Member Name', 'admin');`. Use `role = 'staff'` for staff accounts. The `username` column is profile metadata; it is not used to sign in.
5. Staff sign in to `/admin/login` with the email address and password for their own Supabase Auth account. There is no default practice ID or password. A valid Auth account without an `admin` or `staff` profile is denied access.
6. Keep `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` server-only. Never expose them in `NEXT_PUBLIC_*` variables or client components.

Set or reset passwords through Supabase Auth or a trusted server-side provisioning flow. Passwords are not stored in this repository or SQL.
