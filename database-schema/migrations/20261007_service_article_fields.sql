-- Make the visible service article sections editable from the CMS.
alter table public.services
  add column if not exists article_section_title text not null default 'Key Scope Deliverables',
  add column if not exists article_guarantee_title text not null default 'Statutory Independence & Working Papers Guarantee',
  add column if not exists article_guarantee_body text not null default 'All engagements are performed under the direct oversight of licensed Chartered Accountants registered with ICAN. Client working papers, trial balances, and strategic financial records are maintained under statutory confidentiality and strict professional privilege.';
