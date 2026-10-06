-- Move the remaining code-owned global content into CMS tables without overwriting existing rows.
insert into public.site_settings (key, value)
values
  ('company_name', '"Narahari Adhikari"'::jsonb),
  ('tagline', '"Chartered Accountants & Strategic Financial Advisors"'::jsonb),
  ('ca_reg_number', '"ICAN Reg. No. 1024/2078"'::jsonb),
  ('email', '"info@narahariadhikari.com"'::jsonb),
  ('phone', '"+977 1 4423890"'::jsonb),
  ('whatsapp_number', '"+9779851000000"'::jsonb),
  ('address', '"Level 4, Corporate Heights, New Baneshwor, Kathmandu, Nepal"'::jsonb),
  ('office_hours_summary', '"Sunday – Friday: 09:30 AM – 05:30 PM (Saturday Closed)"'::jsonb),
  ('careers_enabled', 'true'::jsonb),
  ('announcement_active', 'false'::jsonb),
  ('announcement_text', '""'::jsonb),
  ('announcement_link', '"/updates"'::jsonb)
on conflict (key) do nothing;

create unique index if not exists government_links_url_key on public.government_links (url);

insert into public.government_links (name, short_name, description, url, category, display_order)
values
  ('Institute of Chartered Accountants of Nepal (ICAN)', 'ICAN Nepal', 'Statutory accounting regulatory body established under the Nepal Chartered Accountants Act 1997.', 'https://en.ican.org.np/en/', 'Accounting & Auditing Regulator', 1),
  ('Inland Revenue Department (IRD)', 'IRD Nepal', 'Official revenue administration portal for PAN/VAT, tax filing, circulars, and tax clearance.', 'https://ird.gov.np/', 'Taxation & Revenue Administration', 2),
  ('Department of Customs', 'Customs Department', 'Customs valuation, tariff classifications, ASYCUDA clearance, and foreign trade guidelines.', 'https://www.customs.gov.np/', 'Customs & Trade Valuation', 3),
  ('Office of Company Registrar (OCR)', 'OCR Nepal', 'Company incorporation, online name approval, statutory filings, and shareholder registry.', 'https://www.ocr.gov.np/', 'Corporate Registration & Governance', 4),
  ('Nepal Rastra Bank (NRB)', 'NRB Central Bank', 'Monetary policy directives, foreign currency approvals, FDI tracking, and banking regulations.', 'https://www.nrb.org.np/', 'Central Banking & Foreign Exchange', 5),
  ('Ministry of Finance', 'MoF Nepal', 'Annual national budget announcements, fiscal acts, economic surveys, and revenue policies.', 'https://mof.gov.np/', 'Fiscal & Economic Policy', 6),
  ('Nepal Investment Board', 'IBN Nepal', 'Facilitating large-scale infrastructure investments, PPP projects, and single-window clearances.', 'https://ibn.gov.np/', 'Foreign & Strategic Investment', 7),
  ('Securities Board of Nepal (SEBON)', 'SEBON', 'Apex securities regulator governing capital markets, stock exchanges, IPOs, and mutual funds.', 'https://sebon.gov.np/', 'Capital Markets & Securities', 8),
  ('National Insurance Authority', 'NIA Nepal', 'Statutory supervisory authority regulating life, non-life, and reinsurance enterprises.', 'https://nia.gov.np/', 'Insurance Regulation & Risk', 9),
  ('Social Security Fund (SSF)', 'SSF Nepal', 'Mandatory statutory contribution portal for employee and employer social security schemes.', 'https://ssf.gov.np/', 'Social Security & Labor Welfare', 10),
  ('Office of the Auditor General', 'OAG Nepal', 'Supreme audit institution responsible for public finance accountability and constitutional audits.', 'https://oag.gov.np/en', 'Supreme Constitutional Audit', 11)
on conflict (url) do nothing;
