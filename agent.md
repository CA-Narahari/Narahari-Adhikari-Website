# AGENT.md — CA Firm Website (Multi-Tenant, White-Label)

This file is the single source of truth for this project. Work through the **Phases in section 3 strictly in order** — do not start a later phase until the previous one is verified working. This prevents rework and half-finished features piling up.

## 1. Project Summary

A professional website for a Chartered Accountancy (CA) firm with two portals:
1. **Public Portal** — no login. Prospective/current clients.
2. **Admin Portal** — authenticated staff area to manage all dynamic content (blogs, news, services, team, contact info, inquiries) without touching code.

The codebase must be **reusable across multiple CA firm clients** — one repo, each firm gets its own deployment with its own branding/theme and its own content, without forking the code (see Section 6).

## 2. Tech Stack (decided)

| Layer | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev/build, no framework lock-in, matches your preference |
| UI framework | React + TypeScript | Standard, huge shadcn/component ecosystem |
| Routing | React Router v6 | Standard client-side routing for a Vite SPA |
| Styling / Components | **Tailwind CSS + shadcn/ui**, blocks sourced from **21st.dev** | Copy-in components (not a runtime package), full control, consistent minimal/professional look |
| Database | Supabase (Postgres) | Relational fit for services/blogs/team; free tier covers this easily |
| Auth | Supabase Auth | Admin login only, not for public users |
| File/Image storage | Supabase Storage (bucket: `media`) | Free tier; images upload live, no rebuild needed |
| Hosting | Vercel or Netlify (free tier) — static SPA build | Zero cost for this traffic level |
| Rich text editor | Tiptap | Blog/news post body |
| Form validation | Zod + React Hook Form | Contact form, admin forms |

**Important honest note on Vite:** Vite builds a client-rendered SPA by default, which is weaker for SEO than server-rendered pages — and a CA firm's blog/publications content benefits from being indexable by Google. Mitigate this with:
- `react-helmet-async` for per-page `<title>`/meta tags (works even without SSR).
- Prerendering the public routes at build time with `vite-react-ssg` (renders static HTML for each public route while keeping the Vite+React+shadcn stack you asked for) — add this in Phase 3 once public pages have real content, not before.
Flag this to the client-decision-maker if organic search traffic turns out to matter a lot; full SSR (Next.js) remains the fallback option if so.

## 3. Build Phases — work through these in order

### Phase 0 — Tooling Setup
- `npm create vite@latest` (React + TypeScript template).
- Install Tailwind CSS, configure `tailwind.config.ts`.
- Initialize shadcn/ui (`npx shadcn@latest init`) — set up the base theme, CSS variables, `components.json`.
- Install React Router, ESLint/Prettier config.
- Set up folder structure (Section 5) as empty folders.
- **Verify:** `npm run dev` shows a blank Vite+Tailwind+shadcn page with no errors.

### Phase 1 — Directory & Page Skeleton (routing only, zero content)
- Create every route listed in Section 4 as a placeholder page component that renders only the page name and path (e.g. `<h1>Services Page — /services</h1>`).
- Wire up React Router with all public and admin routes.
- Add a temporary plain-text nav (just links, unstyled) so every route is reachable and clickable.
- **Verify before moving on:** every URL in Section 4 loads the correct placeholder, no 404s on any listed route, browser back/forward works, direct URL entry (refresh on a nested route) works correctly (check Vite SPA fallback / `_redirects` config).

### Phase 2 — Shared Shell: Navbar, Footer, Landing Page
- Build the real Navbar and Footer components using shadcn/21st.dev blocks, wired into a shared public layout.
- Build the real landing page (hero, services teaser, latest posts teaser, CTA) — placeholder/lorem content is fine here, but real component structure and styling.
- Apply the minimal/professional design direction (Section 7).
- **Verify:** navbar links match Phase 1 routes exactly, footer renders on every public page, layout is responsive (mobile/tablet/desktop).

### Phase 3 — Individual Public Pages (real features, one at a time)
Build each of these fully, in this order, verifying each before moving to the next:
1. About + Team
2. Services (list + dynamic detail page)
3. Industries (list + dynamic detail page)
4. Blog (list + single post page)
5. News (list + single post page)
6. Career (listings + application form)
7. Contact (form + office info + map)

Each page's data starts as static/mock JSON so layout can be verified, then gets wired to Supabase once the schema (Section 8) exists. Add `vite-react-ssg` prerendering here once content is real (see Vite note above).

### Phase 4 — Admin Dashboard
- Supabase Auth login page (`/admin/login`).
- Auth guard: protected route wrapper checking a valid session + `profiles.role`.
- Dashboard home (counts, recent inquiries).
- CRUD screens for: Posts (blog/news), Services, Industries, Team, Careers, Inquiries (read-only inbox), Settings (site info/branding).
- Use shadcn/21st.dev admin blocks (data tables, stat cards, sidebar nav, forms) rather than building these from scratch.
- **Verify:** every admin action (create/edit/delete post, upload image, update settings) reflects immediately on the public pages without a rebuild.

### Phase 5 — Multi-Tenant / White-Label Layer
See Section 6 for the design. Implement:
- `tenant.config.ts` driven by env vars (logo, colors, fonts, firm name, contact defaults).
- Confirm a second theme (different colors/logo/fonts) can be applied by only changing env vars + assets — no code changes.

### Phase 6 — Security Pass
Go through the full checklist in Section 9 before launch. Do not skip this phase.

### Phase 7 — Deployment
Section 10.

## 4. Route Map

### Public (no auth)
```
/                       Home
/about                  Firm overview
/about/team             Partners/leadership
/services               Services grid
/services/:slug         Service detail (dynamic)
/industries             Industries grid
/industries/:slug       Industry detail (dynamic)
/blog                   Blog listing (paginated)
/blog/:slug             Single blog post
/news                   News/press releases listing
/news/:slug             Single news item
/career                 Open positions + application form
/contact                Contact form + office details
```

### Admin (Supabase-authenticated)
```
/admin/login
/admin                       Dashboard
/admin/posts                 Blog/news list
/admin/posts/new
/admin/posts/:id/edit
/admin/services
/admin/services/:id/edit
/admin/industries
/admin/industries/:id/edit
/admin/team
/admin/careers
/admin/inquiries
/admin/settings               Site info + branding/theme values
```

## 5. Folder Structure

```
/src
  /pages
    /public
      Home.tsx  About.tsx  Team.tsx
      Services.tsx  ServiceDetail.tsx
      Industries.tsx  IndustryDetail.tsx
      Blog.tsx  BlogPost.tsx
      News.tsx  NewsPost.tsx
      Career.tsx  Contact.tsx
    /admin
      Login.tsx  Dashboard.tsx
      Posts.tsx  PostForm.tsx
      Services.tsx  ServiceForm.tsx
      Industries.tsx  IndustryForm.tsx
      Team.tsx  Careers.tsx  Inquiries.tsx  Settings.tsx
  /components
    /public          -- Navbar, Footer, ServiceCard, PostCard, ContactForm
    /admin           -- AdminSidebar, DataTable, ImageUploader, RichTextEditor
    /ui              -- shadcn primitives (button, input, dialog, table, ...)
  /layouts
    PublicLayout.tsx  -- Navbar + Footer wrapper
    AdminLayout.tsx   -- Sidebar + auth guard wrapper
  /lib
    supabaseClient.ts
    validators.ts      -- zod schemas
  /routes
    router.tsx          -- all route definitions
    ProtectedRoute.tsx   -- admin auth guard
  /config
    tenant.config.ts     -- reads VITE_ env vars, exports active theme/branding
  /types
    database.ts          -- generated Supabase types
  /styles
    globals.css           -- Tailwind base + CSS variables (theme tokens)
/public                    -- static assets: default favicon, fallback logo
```

## 6. Multi-Tenant / White-Label Design

Goal: **one codebase**, deployed separately for each CA firm client, each with its own look and its own content — without maintaining forks.

**Approach:**
- Each firm gets its own deployment (its own Vercel/Netlify project) built from the same repo, and its own Supabase project (content stays fully separate between firms — no shared database, no risk of one firm's data touching another's).
- All visual identity lives in `tenant.config.ts`, populated entirely from `VITE_`-prefixed environment variables set per deployment:
  ```
  VITE_FIRM_NAME=
  VITE_LOGO_URL=
  VITE_COLOR_PRIMARY=      -- written into CSS variables at runtime
  VITE_COLOR_ACCENT=
  VITE_FONT_HEADING=
  VITE_FONT_BODY=
  VITE_CONTACT_PHONE=
  VITE_CONTACT_EMAIL=
  VITE_CONTACT_ADDRESS=
  VITE_SOCIAL_LINKS=        -- JSON string
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
  ```
- Tailwind theme tokens (`--color-primary`, `--color-accent`, `--font-heading`, `--font-body`) are set as CSS variables from `tenant.config.ts` at app boot — component code never hardcodes a color or font, it only ever references the tokens. This is what makes "same code, different design" actually work.
- Content (services offered, team members, blog posts, contact info beyond branding) is owned entirely by each firm's own Supabase project via the admin panel — never hardcoded, never shared.
- To onboard a new firm: new Supabase project + run schema migration, new Vercel/Netlify project pointed at the same repo with new env vars, upload their logo/assets. No code branching required.

## 7. Design Direction (minimal & professional)

- One neutral (navy or charcoal) + one accent color, white/off-white background — no more than 2 colors as a rule, per-tenant via CSS variables above.
- Generous whitespace, no gradients, no stock "corporate handshake" photography.
- Max 2 typefaces: one distinctive serif/sans for headings, one clean system sans for body — also tenant-configurable.
- No carousels/sliders. Sparse, purposeful motion only (subtle fade/slide on scroll, nothing more).
- Source components/blocks from shadcn/ui + 21st.dev (navbar, footer, service-card grids, team grids, admin data tables/stat cards/sidebars) — copy code in, don't add as a dependency, then re-theme via the CSS variables above.

## 8. Database Schema (per-tenant Supabase project)

```sql
profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text default 'editor', -- 'admin' | 'editor'
  created_at timestamptz default now()
)

posts ( -- shared table for blog + news
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('blog','news')),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,               -- sanitized HTML from rich text editor
  cover_image_url text,
  category text,
  published boolean default false,
  published_at timestamptz,
  author_id uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

services (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text unique not null,
  summary text, body text, icon text, sort_order int default 0
)

industries (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text unique not null,
  summary text, body text, image_url text, sort_order int default 0
)

team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null, designation text, photo_url text, bio text, sort_order int default 0
)

job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, is_open boolean default true,
  created_at timestamptz default now()
)

inquiries (
  id uuid primary key default gen_random_uuid(),
  name text, email text, phone text, message text,
  type text default 'contact', -- 'contact' | 'career'
  created_at timestamptz default now()
)

site_settings (
  key text primary key,
  value text
)
```

RLS: public `SELECT` on published content only; `INSERT/UPDATE/DELETE` restricted to authenticated admin/editor roles; `inquiries` allows public `INSERT` only, read restricted to staff.

## 9. Security Checklist (Phase 6 — complete before launch)

- **RLS enabled and tested on every table**, not just written — actually attempt an anonymous write to a protected table and confirm it's rejected.
- Supabase **service role key is never used in client-side code** — it has zero place in a Vite SPA bundle; only the public `anon` key goes into `VITE_` env vars. Any privileged operation (if ever needed) goes through a serverless function, not the browser.
- All form inputs (contact form, admin forms) validated with Zod on submit — never trust client input server-side either (RLS policies are the real enforcement layer).
- Rich text blog/news body is **sanitized with DOMPurify before rendering** (`dangerouslySetInnerHTML` is an XSS risk otherwise) — sanitize on save AND on render.
- File uploads to Supabase Storage: restrict allowed MIME types (images only for post covers) and max file size, both in the Storage bucket policy and in the upload form.
- Admin routes protected by both a client-side route guard (UX) and RLS (actual security) — never rely on the client guard alone.
- Contact form protected against spam/bots: honeypot field at minimum; add reCAPTCHA/hCaptcha if spam becomes an issue.
- Enforce HTTPS everywhere (default on Vercel/Netlify — confirm no mixed content).
- Admin password policy: require strong passwords; consider enabling Supabase MFA for admin accounts.
- Keep dependencies patched — run `npm audit` before each deployment.
- Environment variables per tenant kept out of the repo (`.env` files gitignored; set directly in hosting provider's dashboard).
- CORS on Supabase project restricted to the deployed domain(s) in production.

## 10. Deployment Checklist (zero-cost, per tenant)

1. Create a new Supabase project for the firm → run schema migrations → enable + test RLS policies.
2. Create Storage bucket `media`, set public read, restrict upload MIME types/size.
3. Create first admin user in Supabase Auth → insert matching `profiles` row with `role = 'admin'`.
4. New Vercel/Netlify project from the same repo → set all `VITE_` env vars (branding + Supabase keys) for this tenant.
5. Configure SPA fallback routing (`vercel.json` rewrites or Netlify `_redirects`) so deep links work on refresh.
6. Point the firm's custom domain at the deployment (the one recurring cost).
7. Run through the Section 9 checklist once more against the live deployment before sharing the link.

## 11. Out of Scope for v1

- Client login/document portal (schema leaves room for a future `clients` table).
- Payment processing.
- Multi-language support (add later via `react-i18next` if needed).