begin;

alter table public.contact_messages
  drop constraint if exists contact_messages_status_check;

update public.contact_messages
set status = 'in_progress'
where status = 'reviewed';

alter table public.contact_messages
  add constraint contact_messages_status_check
  check (status in ('new', 'in_progress', 'closed'));

commit;
