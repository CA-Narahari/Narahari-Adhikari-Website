-- Database-owned public content and calculator assumptions.
create table if not exists public.calculator_configs (
  id uuid primary key default gen_random_uuid(),
  calculator_key text unique not null,
  fiscal_year text not null default '',
  assumptions jsonb not null default '{}'::jsonb,
  source_name text not null default '',
  source_url text not null default '',
  effective_from date,
  reviewed_by text not null default '',
  reviewed_at date,
  updated_at timestamptz not null default now()
);

alter table public.calculator_configs enable row level security;

drop policy if exists "calculator configs are public" on public.calculator_configs;
create policy "calculator configs are public" on public.calculator_configs for select using (true);
drop policy if exists "staff manage calculator configs" on public.calculator_configs;
create policy "staff manage calculator configs" on public.calculator_configs for all using (public.is_admin_or_staff()) with check (public.is_admin_or_staff());

insert into public.calculator_configs (calculator_key, fiscal_year, assumptions, source_name, source_url, effective_from, reviewed_by, reviewed_at)
values
  ('vat', 'Current', '{"rate": 0.13}'::jsonb, 'Inland Revenue Department (IRD)', 'https://ird.gov.np/category/taxrateincentives/', current_date, '', null),
  ('individual-tax', 'FY 2081/82', '{"unmarried_slabs":[500000,700000,1000000,2000000],"married_slabs":[600000,800000,1100000,2000000],"rates":[0.01,0.10,0.20,0.30,0.39]}'::jsonb, 'Inland Revenue Department (IRD)', 'https://ird.gov.np/category/taxrateincentives/', '2024-07-16', '', null),
  ('ssf', 'Current', '{"employee_rate":0.11,"employer_rate":0.20}'::jsonb, 'Social Security Fund Nepal', 'https://ssf.gov.np/', current_date, '', null),
  ('capital-gains', 'Current', '{"equity_short":7.5,"equity_long":5,"property_short":7.5,"property_long":5}'::jsonb, 'Inland Revenue Department (IRD)', 'https://ird.gov.np/category/taxrateincentives/', current_date, '', null)
on conflict (calculator_key) do nothing;
