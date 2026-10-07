alter table public.announcements
  add column if not exists poster_url text,
  add column if not exists target_path text;

alter table public.announcements
  alter column display_location set default 'all_pages';

update public.announcements
set display_location = 'all_pages'
where display_location = 'top_banner' or display_location is null;

drop policy if exists "staff manage announcements" on public.announcements;
create policy "staff manage announcements"
  on public.announcements
  for all
  using (public.is_admin_or_staff())
  with check (public.is_admin_or_staff());
