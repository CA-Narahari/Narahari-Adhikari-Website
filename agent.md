# CA Firm Website + Admin Portal — Complete Build Spec

Single source of truth for the build. Everything the coding agent needs — architecture, features, stack, MCP/plugin setup, design rules, compliance checklist, and QA checklist — lives in this one file.

> **Themes:** Not decided yet. A visual theme/design system (colors, typography, tone) will be supplied later. Until then, build with a neutral, professional placeholder theme (see "Placeholder Theme" section) using tokens/variables so the real theme can be swapped in without touching component logic.

---

## 1. Project Summary

A modern, professional, easy-to-manage website for a Chartered Accountant (CA) firm, made of two separate interfaces:

- **Public Website** (`www.firm.com`) — premium, minimal, professional. What clients, job seekers, and the general public see.
- **Admin Portal / CMS** (`admin.firm.com` or `/admin`) — functional, simple, dashboard-like. Where the firm's staff manage everything without touching code.

Core principle: **the CMS is the product.** The public site isn't the hard part — a non-technical admin managing the entire site without a developer is.

Built to be **multi-client reusable**: don't hardcode this one firm's details into the app. Company info, branding, services, contact, office hours, nav, and footer should all be admin-configurable so this same codebase can be reused for future clients (Client A: CA Firm, Client B: Accounting Firm, Client C: Tax Consultancy).

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js + React + TypeScript |
| Styling / UI | Tailwind CSS + shadcn/ui |
| Backend | Next.js Server Actions / API routes |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Email | Resend (or SMTP) |
| Calendar (optional) | Google Calendar / Google Meet integration |
| Deployment | Vercel |
| DNS / Security | Cloudflare (DNS + SSL) |

**Why this stack:** no separate backend server needed initially, everything deploys free/low-cost (Vercel free tier, Supabase free tier, Cloudflare free DNS+SSL), and it stays fully AI-editable (no fighting a WordPress theme or page builder).

**What NOT to do:** don't hand-roll a custom backend server, custom database engine, custom auth, custom file storage, or custom email server from scratch. Use managed services for infrastructure; spend build time on the actual product experience.

---

## 3. Architecture

```
                                  CA FIRM PLATFORM
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
         PUBLIC WEBSITE (Frontend)                    ADMIN PORTAL (CMS)
   ┌───────────────────────────────────┐    ┌───────────────────────────────────┐
   │ 1. Home                           │    │ • Secure Auth (Supabase Admin)   │
   │ 2. About                          │    │ • Dashboard (Metrics & Feeds)    │
   │ 3. Services                       │    │ • Tax Updates (Draft & Publish)  │
   │ 4. TaxUpdates                     │    │ • Blog & Knowledge Center        │
   │ 5. Blog                           │    │ • Services Manager               │
   │ 6. Resources (Tools & Downloads)  │    │ • Vacancies & Hiring Toggle      │
   │ 7. Careers (Admin ON/OFF Toggle)  │    │ • Job Applications & CVs Vault   │
   │ 8. Contact (WhatsApp & Forms)     │    │ • Appointments & Slot Control    │
   │ + Book Appointment Button (Header)│    │ • Announcements & Alert Banners  │
   └─────────────────┬─────────────────┘    │ • Government Links Directory     │
                     │                      │ • Team & Office Hours Manager    │
                     │                      │ • Site Settings (Multi-Client)   │
                     │                      └─────────────────┬─────────────────┘
                     └───────────────────┬────────────────────┘
                                         ▼
                               DATABASE (Supabase)
```

Visitor flow: **Visitor browses website → takes action (books appointment, reads tax updates, applies for job, uses calculators, contacts via WhatsApp) → Admin logs in securely to `/admin` → Admin manages content, toggles hiring status, updates availability, and manages applications → Changes immediately reflect live on the public site without writing code.**

### 3.1 Complete Database Schema

| Table | Key fields | Purpose |
|---|---|---|
| `users` | id, name, email, role (admin/staff), created_at | Admin authentication & staff access |
| `tax_updates` | id, title, slug, content, category (Income Tax, VAT, Customs, Corporate, Circular), source_url, source_name, is_urgent, status (draft/published), published_at | Official tax notifications and circulars |
| `posts` | id, title, slug, content, category, featured_image, read_time, status (draft/published), published_at | Knowledge base & firm blog articles |
| `services` | id, title, slug, summary, description, icon_name, target_audience, display_order, is_featured | Firm service offerings & detail pages |
| `vacancies` | id, title, department, employment_type, location, description, requirements, deadline, is_active | Job openings posted by the firm |
| `applications` | id, vacancy_id, applicant_name, applicant_email, applicant_phone, cover_note, cv_file_url, status (new/review/shortlist/rejected), created_at | Candidate applications and uploaded CVs |
| `appointments` | id, client_name, client_email, client_phone, service_id, consultation_type (office/phone/online), requested_date, requested_time, notes, status (pending/confirmed/rescheduled/cancelled), created_at | Client appointment bookings |
| `availability_slots` | id, day_of_week, start_time, end_time, slot_interval_minutes, is_available | Configurable meeting slots for appointment engine |
| `announcements` | id, title, message, link_url, is_active, display_location (top_banner/popup/none), expires_at | Urgent notice banner & alerts |
| `government_links` | id, name, description, url, category, display_order | Official regulatory authority directory |
| `download_resources` | id, title, file_url, file_size, category (form/guide/template), download_count | PDF forms, tax guides, and templates |
| `faqs` | id, question, answer, category (tax/accounting/audit/general), display_order | Dynamic client FAQs |
| `team_members` | id, name, title, qualification (e.g. FCA, ACA), bio, photo_url, linkedin_url, display_order | Firm partners and staff profiles |
| `office_hours` | id, day_of_week, open_time, close_time, is_closed | Dynamic office hours per day |
| `site_settings` | id, key, value | Multi-client config (company_name, brand_logo, contact_email, phone, whatsapp_number, address, map_embed, careers_enabled, meta_title, meta_description) |

### 3.2 Multi-Client Reusability Architecture

Keep all branding and operational data dynamically stored in `site_settings`. No company-specific details are hardcoded in React components:
- `company_name`: "Narahari Adhikari & Associates"
- `whatsapp_number`: Direct international WhatsApp format
- `careers_enabled`: `true` or `false` (controls navbar link + `/careers` route availability)
- `office_hours`: Rendered live from database
- This enables the exact same codebase to be deployed for Client A (CA Firm), Client B (Accounting Firm), or Client C (Tax Consultancy) by simply updating settings in the Admin Panel.

---

## 4. Feature List & Specifications

### 4.1 Public Website (Navbar & Visitor Experience)

The public website consists strictly of the approved navbar navigation, header CTA, and associated utility pages:

1. **Header Navigation (Fixed & Responsive)**
   - **1. Home (`/`)**: Value proposition hero, core service cards, latest tax updates alert bar, about teaser, why choose us, dynamic stats, quick consultation booking widget.
   - **2. About (`/about`)**: Firm profile, Founder & Senior Partner CA profiles, core principles, legal & regulatory registration details.
   - **3. Services (`/services`)**: Tax Advisory, Audit & Assurance, Accounting & Business Services, Company Secretarial, Financial Consulting. Each links to its dedicated detail view.
   - **4. TaxUpdates (`/tax-updates`)**: Dedicated tax portal with category filters (Income Tax, VAT, Customs, Corporate Tax, Regulatory Circulars), search bar, publication date, and official regulatory source link.
   - **5. Blog (`/blog`)**: Knowledge center with categorized articles (e.g., Company Registration in Nepal, VAT filing compliance), reading time, and related article links.
   - **6. Resources (`/resources`)**:
     - **Financial Calculators Hub**: EMI Calculator, Income Tax Estimator, VAT Calculator, Salary Calculator, Compound Interest Calculator.
     - **Download Center**: Official government tax forms, checklists, and firm templates in PDF format.
     - **Government Links Directory**: Curated direct links to official authorities (IRD, Nepal Rastra Bank, SEBON, OCR, SSF, Department of Customs).
   - **7. Careers (`/careers`) — *Dynamic / Conditional***:
     - **Hiring Window Active (`careers_enabled = true`)**: "Careers" link appears in the main navbar. Visitors can view open positions, job descriptions, requirements, and apply directly via an application form with **CV file upload (PDF/DOCX)**.
     - **Hiring Window Closed (`careers_enabled = false`)**: "Careers" link is **completely removed from the navbar**. If a visitor types `/careers` directly, they are greeted with an on-brand message: *"We are not currently hiring. Check back during our next recruitment drive."* or automatically redirected to Home.
   - **8. Contact (`/contact`)**: Firm physical address, interactive map, live office hours badge, inquiry form with topic selector (General, Tax, Audit, Career), **One-click WhatsApp chat redirect button**, and direct click-to-email.
   - **Header CTA: "Book Appointment" Button**: High-visibility button on the right of the navbar. Opens the booking journey: select service → consultation mode (Office Meeting / Phone / Online Meet) → select date & available time slot → submit contact details → instant confirmation.

2. **Compliance & Legal Pages (Footer Navigation)**
   - Privacy Policy (`/privacy`)
   - Terms & Conditions (`/terms`)
   - Cookies Policy & Consent Banner (`/cookies`)
   - Branded 404 Page (`/not-found`)

---

### 4.2 Admin Portal (CMS) — Complete Module Breakdown

The Admin Portal lives at `/admin` and is protected by Supabase Auth (Admin Role required). Non-technical firm staff can manage every single aspect of the site without touching code:

```
┌────────────────────────────────────────────────────────────────────────┐
│ CA FIRM ADMIN                                           [Admin User ▼] │
├──────────────────────┬─────────────────────────────────────────────────┤
│ 📊 Dashboard         │ Good Morning, Admin 👋                          │
│                      │ Here's what's happening with your website.      │
│ 📰 Tax Articles      │                                                 │
│ ✍️ Blogs             │ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
│ 💼 Vacancies         │ │ 12           │ │ 4            │ │ 3         │ │
│ 📥 Applications      │ │ Tax Articles │ │ Applications │ │ Meetings  │ │
│ 🛠️ Services          │ └──────────────┘ └──────────────┘ └───────────┘ │
│ 📢 Announcements     │                                                 │
│ 📑 Downloads         │ Quick Actions:                                  │
│ 🏛️ Govt Links        │ [+ New Tax Post] [+ Post Vacancy] [+ New Blog]  │
│ 📅 Appointments      │ [📢 Alert Bar]   [⏰ Office Hours] [⚙️ Settings] │
│ 👥 Team              │                                                 │
│ ⏰ Office Hours      │ Recent Activity:                                │
│ ❓ FAQs              │ • New application received: Senior Accountant   │
│ ⚙️ Site Settings     │ • Tax update published: New VAT Rules 2025      │
└──────────────────────┴─────────────────────────────────────────────────┘
```

#### Detailed Admin CMS Modules:

1. **Dashboard & Metrics**
   - High-level metric cards: Total Tax Articles, Unread Applications, Upcoming Consultations, Total Active Vacancies.
   - Quick Action buttons for instant content creation.
   - Live activity timeline showing recent bookings, candidate submissions, and published content.

2. **Careers & Vacancy Management (Hiring Toggle Control)**
   - **Master Switch: `Hiring Status: [ON / OFF]`**:
     - Single click toggles `careers_enabled` in the database.
     - Immediately adds or removes "Careers" from the public navbar in real time.
     - Enables or disables the public job application form.
   - **Vacancy Manager**: Add/edit/archive job listings with Job Title, Department, Employment Type (Full-time/Part-time/Internship), Requirements, and Application Deadline.

3. **Job Applications & CV Vault**
   - List view of all candidate submissions with filter tags: *New, Under Review, Shortlisted, Rejected*.
   - View candidate name, email, phone number, applied position, and cover note.
   - **One-click CV Download**: Direct access to candidate resumes stored in private Supabase Storage buckets.
   - Candidate status updater & internal notes for the hiring team.

4. **Tax Updates Management**
   - Comprehensive CRUD table for official tax notifications.
   - Fields: Title, Slug, Category (Income Tax, VAT, Customs, Corporate, Finance Acts), Full Content (Rich Text Editor), Official Source URL & Source Label, Effective Date.
   - **Workflow Status**: Toggle between `Draft` and `Published`.
   - **"Mark as Urgent Alert" Toggle**: When checked, displays in the public homepage alert ticker.

5. **Blog & Knowledge Center**
   - Full WYSIWYG rich text editor for publishing accounting insights and articles.
   - Featured image upload (via Supabase Storage).
   - Category assignment, tags, estimated reading time, and author selection.
   - Status: Draft / Published with scheduled publish dates.

6. **Services Manager**
   - Manage firm offerings without developer assistance.
   - Reorder service display order, edit icons, descriptions, deliverables, and target client types.
   - Feature/Unfeature services on the home page.

7. **Appointments & Availability Engine**
   - **Booking Management**: View all incoming consultation requests with client contact info, requested service, preferred date/time, and meeting mode (Office / Phone / Online).
   - **Action Controls**: Confirm, Reschedule, or Cancel bookings with automated email notifications.
   - **Slot & Availability Settings**: Configure daily consultation slots (e.g. 10:00 AM – 5:00 PM, 30/45/60 min duration, maximum bookings per day).

8. **Announcements & Emergency Alert Bar**
   - Top-of-page alert banner editor (e.g., *"Urgent: Corporate Tax Return filing deadline extended by IRD"*).
   - Toggle banner `Active / Inactive`, set target link, and set automatic expiration dates.

9. **Resources & Download Center Manager**
   - Upload official PDF forms, VAT checklists, tax templates, and guides.
   - Set titles, descriptions, and file categories.
   - Track public download counts.

10. **Government Links Manager**
    - Add, edit, or delete external official links (IRD, NRB, SEBON, Company Registrar, Customs).
    - Categorize and order them for the public Resources directory.

11. **Team Profiles Manager**
    - Add partners, CAs, and audit staff profiles.
    - Fields: Full Name, Professional Title, Qualifications (e.g., FCA, CA, ACCA), Bio, Profile Photo, and LinkedIn URL.

12. **Office Hours & Contact Settings**
    - Day-by-day business hours editor (Sunday through Saturday).
    - Set custom status (e.g. "Closed", "10:00 AM - 5:00 PM", "By Appointment Only").
    - Updates the public contact page, footer, and live availability badge instantly.

13. **FAQ Manager**
    - Add and organize frequently asked questions by category (Tax, Audit, Accounting, General).

14. **Site Settings & Multi-Client Brand Configuration**
    - General brand settings: Firm Name, Tagline, Logo upload, Favicon upload.
    - Communication channels: Primary Email, Phone Numbers, **WhatsApp Direct Chat Number** (used for floating button and contact page redirects), Office Physical Address, Google Maps iframe URL.
    - SEO Meta: Global Page Title template, Meta Description, OpenGraph share preview image.

### 4.3 User Flow & Journey

1. **Visitor Journey**: Browses website → explores Tax Updates, Services, Blog, Calculators, or Download Center → Books consultation or applies for an open vacancy → Submits form / CV → Receives immediate confirmation.
2. **Admin Operations Journey**: Firm staff logs into `/admin` securely → reviews pending appointments / CVs → updates office hours or toggles the Careers switch → edits tax drafts or posts announcements → live website updates instantly.

---

## 5. Development Phases & Roadmap

### Phase 0: Project Inception, Environment & System Scaffolding (COMPLETED ✓)
- **Status:** Done. Next.js App Router + TypeScript + Tailwind CSS initialized directly in project root.
- **Design Tokens:** Swiss Corporate Minimalism with Deep Navy (`#0F172A`), Slate, and Warm Gold/Amber accents (`#D97706`). Strict compliance with hard design rules: no purple gradients, no pill buttons, no emoji icons (using Lucide React SVG).
- **Core Architecture:** Dual-interface setup with Public Website under `app/(public)` and Admin Portal under `app/admin`.

### Phase 1: Core Layout, Navigation & Dynamic Hiring Toggle (COMPLETED ✓)
- **Status:** Done & Verified.
- **Exact Navbar Implemented:**
  1. Home (`/`)
  2. About (`/about`)
  3. Services (`/services`)
  4. TaxUpdates (`/tax-updates`)
  5. Blog (`/blog`)
  6. Resources (`/resources`)
  7. Careers (`/careers`) — **Dynamic Hiring Switch**: Automatically shows/hides based on `careers_enabled` controlled via `/admin/careers`.
  8. Contact (`/contact`) — With One-Click WhatsApp redirect and inquiry routing.
  + **CTA Button:** "Book Appointment" (`/book-appointment`) prominent header action.
- **Admin Portal Shell & Modules:** Full sidebar matching `architecture.png` (Dashboard, Tax Articles, Blogs, Vacancies, Applications & CV Vault, Services, Announcements, Resources, Appointments, Office Hours, Settings).
- **Dev Server Status:** Running and tested on `http://localhost:3000` with 0 build errors. All 13 routes verified with HTTP 200 OK.
- **Deliverables:**
  1. Public Navbar with items: 1. Home, 2. About, 3. Services, 4. TaxUpdates, 5. Blog, 6. Resources, 7. Careers (conditional), 8. Contact + "Book Appointment" CTA button.
  2. Real-time hiring switch behavior: Navbar hides/shows Careers automatically based on `careers_enabled`.
  3. Complete institutional Footer with legal links, contact info, and dynamic office hours.
  4. Admin dashboard shell (`/admin`) with sidebar matching `architecture.png`.

### Phase 2: Public Website Pages & Interactive Hubs (COMPLETED ✓)
- **Status:** Done & Verified.
- **Visual Design Realization (Aligned with `Ideas/` references & `ui-ux-pro-max`):**
  - **Color & Aesthetic:** Prestigious Chartered Accountant palette featuring Deep Corporate Navy (`#0F172A`/`#14213D`), Warm Coral/Orange CTA buttons (`#F26430`), crisp white cards with fine borders (`border-slate-200/90`), and subheadings with trailing line accents (`heading-accent-line`).
  - **Typography:** `Playfair Display` serif for authoritative editorial headlines paired with `Inter` for clean tabular and narrative reading.
  - **Header & Navbar:** Exactly 8 items + "Book Appointment" CTA in signature coral-orange (`#F26430`) + search trigger + live Careers toggle badge.
  - **Home (`/`):** Hero section with CA license badge, 4 trust chips (Professional Expertise, Client Focused, Integrity, Long-Term Partnerships), 3 pillar cards (Structured Audits, Confidential & Secure dark card, Clear Communication), 5-stat counter bar, 6-service grid, and bottom appointment strip.
  - **About (`/about`):** Firm profile, "Who We Are", 3 mission/vision/values cards, 15+ years experience counter, and "Meet Our Experts" team cards.
  - **Services (`/services`):** Full practice spectrum, 6 service cards with direct inquiry links, and featured Tax & Compliance breakdown.
  - **TaxUpdates (`/tax-updates`):** Categorized tax circulars portal with live search, category tabs, and official IRD source citations.
  - **Blog (`/blog`):** Hero with featured publication, category pills, 2-column layout with 6 articles and right sidebar (Categories count, recent posts, newsletter subscription).
  - **Resources (`/resources`):** Interactive Loan EMI Calculator, 13% VAT Invoice Calculator, Download Center for statutory PDF forms, and Government Directory (IRD, NRB, OCR, SSF, SEBON).
  - **Careers (`/careers`):** Conditional hiring page with active vacancy cards and direct application form with CV file upload (PDF/DOCX).
  - **Contact (`/contact`):** Direct office details, WhatsApp instant chat redirect, inquiry form with topic selector, and Kathmandu office location details.
  - **Book Appointment (`/book-appointment`):** Complete multi-step consultation booking engine.
- **Build Status:** Next.js Turbopack production build verified with 23 static pages generated and 0 errors. Dev server running on `http://localhost:3000`.

### Phase 3: Admin Portal (CMS) — Content & Operations
- **Goal:** Build the functional admin dashboard for firm staff to manage content without code.
- **Deliverables:**
  1. **Admin Dashboard**: Overview metrics (tax articles, new applications, upcoming appointments, vacancies) and recent activity stream.
  2. **Tax Updates CMS**: Add/edit/delete tax circulars, draft/publish workflow, "urgent alert" ticker flag.
  3. **Blog CMS**: WYSIWYG article editor, image uploads, category tagging.
  4. **Services CMS**: Reorder, add, or modify firm offerings and deliverables.
  5. **Announcements Manager**: Urgent top notification banner toggle.
  6. **Government Links & Downloads Manager**: Upload forms and manage regulatory links.

### Phase 4: Business Engines, Careers Hiring Switch & Appointments
- **Goal:** Wire up the operational workflows that drive the firm's business.
- **Deliverables:**
  1. **Careers & Vacancy Manager**:
     - One-click master toggle `Hiring Status: [ON / OFF]` to instantly control public visibility and applications.
     - Add/edit job openings with requirements and deadlines.
  2. **Job Applications & CV Vault**: Review applicant submissions, status tags (New/Shortlisted/Rejected), and 1-click CV download.
  3. **Appointment & Availability Engine**: Manage bookings, approve/reschedule consultations, and configure time slots per day.
  4. **Office Hours & Settings**: Day-by-day hours editor and WhatsApp/Email contact configuration.

### Phase 5: Polish, Compliance, SEO & Security
- **Goal:** Ensure legal compliance, accessibility, security, and top performance.
- **Deliverables:**
  1. Legal pages: Privacy Policy, Terms & Conditions, Cookies Policy & Consent Banner.
  2. Accessibility (WCAG AA compliant contrast, aria attributes, keyboard navigation).
  3. SEO metadata (custom OpenGraph, unique titles & meta descriptions per page).
  4. Rate limiting and input sanitization on all forms.

### Phase 6: Testing, QA & Production Deployment
- **Goal:** End-to-end verification and launch on Vercel + Supabase + Cloudflare.
- **Deliverables:**
  1. Cross-browser and mobile responsiveness verification.
  2. Form testing (CV upload, appointment booking, contact inquiries).
  3. Admin authentication & permission audits.
  4. Production deployment checklist.

---

## 6. MCP / Plugin Setup (Antigravity)

Before starting the build, add these MCP servers/plugins to **Google Antigravity**. Antigravity reads MCP config from `.agents/mcp_config.json` (project-level) or `~/.gemini/antigravity/mcp_config.json` (global). To edit the global config from inside the IDE: open the `…` menu at the top of the agent panel → **MCP Servers** → **Manage MCP Servers** → **View raw config**, then merge in the blocks below.

### 6.1 Supabase MCP

Gives the agent direct, live access to your Supabase project — schema, tables, queries — instead of manually checking the dashboard.

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=<your-project-ref>"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

- Get a personal access token from Supabase → Account Settings → Access Tokens.
- Get `<your-project-ref>` from Supabase → Project Settings → General.
- Drop `--read-only` once you want the agent to be able to write migrations/data directly (use with care).

### 6.2 Playwright MCP (browser automation / testing)

Lets the agent open a real browser, navigate the site, click through forms, and verify things actually work (not just that the code compiles).

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

CLI equivalent (if using Claude Code alongside Antigravity):
```bash
claude mcp add playwright npx @playwright/mcp@latest
```

### 6.3 shadcn/ui MCP ("Skill UI" plugin)

Since the stack uses shadcn/ui, this MCP gives the agent live access to the real component registry — correct install commands, current props, and code examples — instead of guessing or hallucinating component APIs.

Quick install (run inside the project):
```bash
pnpm dlx shadcn@latest mcp init --client claude
```

Or add manually:
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### 6.4 Context7 MCP (up-to-date docs)

Pulls current, version-accurate documentation and code examples for whatever library you're using directly into context — prevents outdated/hallucinated API usage (Next.js, Supabase, Tailwind, etc.).

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Usage: add "use context7" to a prompt when you want the agent to pull fresh docs before writing code, e.g. *"Set up Supabase Auth with Next.js server actions. use context7."*

> After adding all four, restart Antigravity (or reload the MCP servers panel) and confirm each shows as connected before starting the build.

---

## 7. Placeholder Theme (Until Real Theme Is Supplied)

No final theme yet. Build now with:
- Neutral, professional palette (e.g. deep navy / charcoal + one accent, plenty of white space) — **not** the "AI-generated SaaS" purple-blue gradient look
- System font stack or one clean serif/sans pairing for headings vs. body
- All colors, spacing, and type as design tokens/CSS variables (Tailwind theme config), never hardcoded hex values in components — so swapping the real theme later is a config change, not a rewrite

---

## 8. Hard Design Rules — Never Use

1. **Purple gradients** — no purple-to-blue/pink gradient hero sections, buttons, or backgrounds (the generic "AI startup" look)
2. **Pill-shaped buttons** — use rectangular or slightly rounded (subtle radius) buttons, not fully rounded/capsule buttons
3. **Fake reviews** — no invented testimonials or review content
4. **Fake metrics** — no made-up stats ("500+ happy clients", "10,000+ filings") unless the firm gives real, verifiable numbers
5. **Vague hero text** — no generic filler like "Your Trusted Partner for Success" with nothing specific; hero copy must say concretely what the firm does and for whom
6. **Emoji icons** — use a proper icon set (e.g. Lucide, via shadcn/ui), never emoji as UI icons
7. **Em dashes** — don't use em dashes anywhere in site copy or UI text
8. **Crazy scroll animations** — no parallax overload, scroll-jacking, or heavy scroll-triggered animation; motion should be subtle and functional only

### 8.1 Additional content/UI bans

- No "Made with AI" / builder watermark badge anywhere — remove it
- No stock "slop" photography (generic handshake/laptop stock photos) — use real firm photos, or clean illustration/iconography if real photos aren't available yet
- No AI-slop copywriting (generic, hedge-y, buzzword-stuffed marketing text)
- No fake cursor animations
- No fake "customer counter" widgets (live visitor counts, fake activity notifications like "John just booked an appointment")
- No false or unverifiable claims anywhere on the site (services, credentials, guarantees)

---

## 9. Required Pages

- Home, About, Services, Tax Updates/News, Blog/Resources, Careers (time-gated), Resources/Calculators, Appointments, Contact
- **Privacy Policy** page
- **Terms & Conditions** page
- **Cookies Policy** page (can be combined with Privacy Policy or standalone — confirm with firm)
- **Custom 404** page (branded, with navigation back to key pages, not a blank error)
- No placeholder/empty-state pages left in the live build — every route that exists must have real content or be removed

---

## 10. Legal, Privacy & Compliance Checklist

- [ ] Cookies policy published, and a cookie consent banner shown before non-essential cookies load
- [ ] Explicit consent checkbox on every form that collects personal data (contact form, appointment booking, job application), linking to the Privacy Policy
- [ ] Only collect data that's actually necessary for the stated purpose (name/email/phone for contact; CV/cover letter for applications; no extra fields "just in case")
- [ ] Audit and document every tracking script in use (analytics, pixels) — disclose them in the Privacy/Cookies policy
- [ ] Audit every third-party embed (maps, calendar widgets, chat widgets, fonts loaded from external CDNs) for what data they send out
- [ ] Real business details published: legal firm name, registration/license number if applicable, physical address, phone, email
- [ ] Every image used has proper licensing/copyright clearance (owned by the firm, or a properly licensed stock/library image) — no unlicensed scraped images
- [ ] No false or unverifiable claims in copy (credentials, results, years in business, guarantees)

---

## 11. Accessibility Checklist

- [ ] All `<img>` and meaningful icons have descriptive `alt` text (decorative images use empty `alt=""`)
- [ ] Text and UI color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text/UI components)
- [ ] All forms are fully keyboard-navigable (tab order, visible focus states, no keyboard traps)
- [ ] Every button and link has a clear, descriptive label (no bare "Click here" / icon-only buttons without `aria-label`)
- [ ] Semantic HTML and proper heading hierarchy (one `<h1>` per page, logical `<h2>`/`<h3>` nesting)
- [ ] Form fields have associated `<label>` elements, not placeholder-only labeling

---

## 12. Technical / SEO / QA Checklist

- [ ] No horizontal scroll on any page or breakpoint
- [ ] Unique, descriptive meta description on every page
- [ ] Unique, descriptive `<title>` on every page
- [ ] Favicon added (all standard sizes — browser tab, iOS home screen, Android)
- [ ] All images compressed and served in a modern format (WebP/AVIF) with proper `width`/`height` to avoid layout shift
- [ ] No broken links (internal or external) — link-check before launch
- [ ] Fully responsive / mobile-optimized on all breakpoints, tested on real device sizes
- [ ] Clear inline error messages on every form (validation errors, submission failures)
- [ ] Clear success confirmation on every form (submitted contact form, booked appointment, submitted application)
- [ ] Custom, on-brand 404 page (see Required Pages)
- [ ] No leftover empty-state / placeholder pages in production
- [ ] Basic security pass: HTTPS enforced, input sanitization/validation on all forms, rate-limiting on public forms and login

---

## 13. Open Items / To Confirm With Firm

- Final visual theme (colors, typography, tone) — pending
- Real service list and exact service names/descriptions
- Real team bios and photos
- Legal business details (registration number, licensing body, physical address)
- Career page visibility window (when exactly it should open/close)
- Whether Google Calendar/Meet integration is wanted for appointments
- Cookies policy: standalone page or merged into Privacy Policy