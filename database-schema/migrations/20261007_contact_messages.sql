create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  organization text not null default '',
  message text not null,
  privacy_consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  created_at timestamptz not null default now(),
  constraint contact_messages_privacy_consent_check check (privacy_consent = true)
);

alter table public.contact_messages enable row level security;
drop policy if exists "staff manage contact messages" on public.contact_messages;
create policy "staff manage contact messages" on public.contact_messages
  for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());
create index if not exists contact_messages_status_created_idx
  on public.contact_messages (status, created_at desc);
