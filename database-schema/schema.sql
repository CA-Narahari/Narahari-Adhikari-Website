-- Narahari Adhikari CMS schema
-- Run this in Supabase SQL Editor after creating the project.
-- Create the first Auth user in Supabase Authentication, then add its id to profiles.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('admin', 'staff');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum ('new', 'review', 'shortlisted', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.appointment_status as enum ('pending', 'confirmed', 'rescheduled', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  role public.app_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.tax_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  summary text not null default '',
  content text not null,
  source_name text not null default '',
  source_url text not null default '',
  is_urgent boolean not null default false,
  status public.content_status not null default 'draft',
  update_type text,
  topic text,
  sector text,
  effective_date text,
  published_at date,
  meta_title text not null default '',
  meta_description text not null default '',
  focus_keyword text not null default '',
  image_alt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  excerpt text not null default '',
  content text not null,
  author text not null default '',
  read_time text not null default '',
  featured_image text,
  image_name text not null default '',
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  published_at date,
  meta_title text not null default '',
  meta_description text not null default '',
  focus_keyword text not null default '',
  image_alt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text not null default '',
  full_description text not null default '',
  deliverables text[] not null default '{}',
  article_section_title text not null default 'Key Scope Deliverables',
  article_guarantee_title text not null default 'Statutory Independence & Working Papers Guarantee',
  article_guarantee_body text not null default 'All engagements are performed under the direct oversight of licensed Chartered Accountants registered with ICAN. Client working papers, trial balances, and strategic financial records are maintained under statutory confidentiality and strict professional privilege.',
  target_audience text not null default '',
  icon text not null default 'Briefcase',
  display_order integer not null default 0,
  is_featured boolean not null default false,
  image text,
  image_name text not null default '',
  image_alt text not null default '',
  meta_title text not null default '',
  meta_description text not null default '',
  focus_keyword text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null default '',
  location text not null default '',
  employment_type text not null default 'Full-time',
  description text not null default '',
  requirements text[] not null default '{}',
  deadline date,
  is_active boolean not null default true,
  attachment_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid references public.vacancies(id) on delete set null,
  vacancy_title text not null default '',
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text not null,
  qualification text not null default '',
  cover_note text not null default '',
  cv_file_url text,
  cv_filename text,
  privacy_consent boolean not null default false,
  status public.application_status not null default 'new',
  submitted_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  company_name text not null default '',
  service_title text not null default '',
  consultation_type text not null default 'Office Meeting',
  requested_date date not null,
  requested_time text not null,
  notes text not null default '',
  privacy_consent boolean not null default false,
  status public.appointment_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.applications add column if not exists qualification text not null default '';

alter table public.appointments add column if not exists company_name text not null default '';
alter table public.appointments add column if not exists privacy_consent boolean not null default false;

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_interval_minutes integer not null default 45,
  is_available boolean not null default true
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  message text not null,
  link_url text,
  poster_url text,
  is_active boolean not null default false,
  display_location text not null default 'all_pages',
  target_path text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.government_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null default '',
  description text not null default '',
  url text not null,
  category text not null default 'Regulatory Authority',
  display_order integer not null default 0,
  logo_url text,
  logo_alt text
);
alter table public.government_links add column if not exists logo_url text;
alter table public.government_links add column if not exists logo_alt text;
alter table public.announcements add column if not exists poster_url text;
alter table public.announcements add column if not exists target_path text;

create unique index if not exists government_links_url_key on public.government_links (url);

create table if not exists public.download_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Guide',
  file_format text not null default 'PDF',
  file_size text not null default '',
  download_url text not null,
  downloads_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  organization text not null default '',
  message text not null,
  privacy_consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  constraint contact_messages_privacy_consent_check check (privacy_consent = true)
);

alter table public.applications add column if not exists privacy_consent boolean not null default false;
alter table public.appointments add column if not exists privacy_consent boolean not null default false;

-- CVs are private and should only be uploaded and downloaded by server routes.
insert into storage.buckets (id, name, public)
values ('application-cvs', 'application-cvs', false)
on conflict (id) do nothing;

-- Public CMS media and downloadable files support every format accepted by the upload route.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('website-media', 'website-media', true, 10485760, array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  ('download-resources', 'download-resources', true, 10485760, array[
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip', 'application/x-zip-compressed'
  ])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create index if not exists tax_updates_published_idx on public.tax_updates (status, published_at desc);
create index if not exists posts_published_idx on public.posts (status, published_at desc);
create index if not exists vacancies_active_idx on public.vacancies (is_active, deadline);
create index if not exists appointments_status_idx on public.appointments (status, requested_date);
create index if not exists contact_messages_status_created_idx on public.contact_messages (status, created_at desc);

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.tax_updates enable row level security;
alter table public.posts enable row level security;
alter table public.services enable row level security;
alter table public.vacancies enable row level security;
alter table public.applications enable row level security;
alter table public.appointments enable row level security;
alter table public.availability_slots enable row level security;
alter table public.announcements enable row level security;
alter table public.government_links enable row level security;
alter table public.download_resources enable row level security;
alter table public.contact_messages enable row level security;

create or replace function public.is_admin_or_staff()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "published tax updates are public" on public.tax_updates for select using (status = 'published');
create policy "site settings are public" on public.site_settings for select using (true);
create policy "published posts are public" on public.posts for select using (status = 'published');
create policy "featured services are public" on public.services for select using (is_featured = true);
create policy "active vacancies are public" on public.vacancies for select using (is_active = true);
create policy "active announcements are public" on public.announcements for select using (is_active = true and (expires_at is null or expires_at > now()));
create policy "government links are public" on public.government_links for select using (true);
create policy "downloads are public" on public.download_resources for select using (true);
-- Public submissions are accepted only by the validated server routes, which use the service role.
-- There is intentionally no anonymous INSERT policy for private appointment/application tables.

create policy "staff manage content" on public.tax_updates for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage posts" on public.posts for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage services" on public.services for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage vacancies" on public.vacancies for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff view applications" on public.applications for select using (public.is_admin_or_staff());
create policy "staff manage applications" on public.applications for update using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff view appointments" on public.appointments for select using (public.is_admin_or_staff());
create policy "staff manage appointments" on public.appointments for update using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage contact messages" on public.contact_messages for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage announcements" on public.announcements for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage links" on public.government_links for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage downloads" on public.download_resources for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create policy "staff manage settings" on public.site_settings for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
