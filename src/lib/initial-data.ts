import {
  SiteSettings,
  TaxUpdate,
  BlogPost,
  Vacancy,
  JobApplication,
  Appointment,
  GovernmentLink,
  DownloadResource,
  ServiceItem,
} from '@/types';

export const initialSiteSettings: SiteSettings = {
  company_name: 'Narahari Adhikari',
  tagline: 'Chartered Accountants & Strategic Financial Advisors',
  ca_reg_number: 'ICAN Reg. No. 1024/2078',
  email: 'info@narahariadhikari.com',
  phone: '+977 1 4423890',
  whatsapp_number: '+9779851000000',
  address: 'Level 4, Corporate Heights, New Baneshwor, Kathmandu, Nepal',
  office_hours_summary: 'Sunday – Friday: 09:30 AM – 05:30 PM (Saturday Closed)',
  careers_enabled: true, // Master Hiring Toggle
  announcement_active: false,
  announcement_text: '',
  announcement_link: '/updates',
};

export const initialTaxUpdates: TaxUpdate[] = [];

// Blog posts are dynamically loaded from Supabase database and CMS portal
export const initialBlogPosts: BlogPost[] = [];

export const initialServices: ServiceItem[] = [];

export const initialVacancies: Vacancy[] = [];

export const initialJobApplications: JobApplication[] = [];

export const initialAppointments: Appointment[] = [];

export const initialGovernmentLinks: GovernmentLink[] = [
  {
    id: 'gov-1',
    name: 'Institute of Chartered Accountants of Nepal (ICAN)',
    short_name: 'ICAN Nepal',
    description: 'Statutory accounting regulatory body established under the Nepal Chartered Accountants Act 1997.',
    url: 'https://en.ican.org.np/en/',
    category: 'Accounting & Auditing Regulator',
  },
  {
    id: 'gov-2',
    name: 'Inland Revenue Department (IRD)',
    short_name: 'IRD Nepal',
    description: 'Official revenue administration portal for PAN/VAT, tax filing, circulars, and tax clearance.',
    url: 'https://ird.gov.np/',
    category: 'Taxation & Revenue Administration',
  },
  {
    id: 'gov-3',
    name: 'Department of Customs',
    short_name: 'Customs Department',
    description: 'Customs valuation, tariff classifications, ASYCUDA clearance, and foreign trade guidelines.',
    url: 'https://www.customs.gov.np/',
    category: 'Customs & Trade Valuation',
  },
  {
    id: 'gov-4',
    name: 'Office of Company Registrar (OCR)',
    short_name: 'OCR Nepal',
    description: 'Company incorporation, online name approval, statutory filings, and shareholder registry.',
    url: 'https://www.ocr.gov.np/',
    category: 'Corporate Registration & Governance',
  },
  {
    id: 'gov-5',
    name: 'Nepal Rastra Bank (NRB)',
    short_name: 'NRB Central Bank',
    description: 'Monetary policy directives, foreign currency approvals, FDI tracking, and banking regulations.',
    url: 'https://www.nrb.org.np/',
    category: 'Central Banking & Foreign Exchange',
  },
  {
    id: 'gov-6',
    name: 'Ministry of Finance',
    short_name: 'MoF Nepal',
    description: 'Annual national budget announcements, fiscal acts, economic surveys, and revenue policies.',
    url: 'https://mof.gov.np/',
    category: 'Fiscal & Economic Policy',
  },
  {
    id: 'gov-7',
    name: 'Nepal Investment Board',
    short_name: 'IBN Nepal',
    description: 'Facilitating large-scale infrastructure investments, PPP projects, and single-window clearances.',
    url: 'https://ibn.gov.np/',
    category: 'Foreign & Strategic Investment',
  },
  {
    id: 'gov-8',
    name: 'Securities Board of Nepal (SEBON)',
    short_name: 'SEBON',
    description: 'Apex securities regulator governing capital markets, stock exchanges, IPOs, and mutual funds.',
    url: 'https://sebon.gov.np/',
    category: 'Capital Markets & Securities',
  },
  {
    id: 'gov-9',
    name: 'National Insurance Authority',
    short_name: 'NIA Nepal',
    description: 'Statutory supervisory authority regulating life, non-life, and reinsurance enterprises.',
    url: 'https://nia.gov.np/',
    category: 'Insurance Regulation & Risk',
  },
  {
    id: 'gov-10',
    name: 'Social Security Fund (SSF)',
    short_name: 'SSF Nepal',
    description: 'Mandatory statutory contribution portal for employee and employer social security schemes.',
    url: 'https://ssf.gov.np/',
    category: 'Social Security & Labor Welfare',
  },
  {
    id: 'gov-11',
    name: 'Office of the Auditor General',
    short_name: 'OAG Nepal',
    description: 'Supreme audit institution responsible for public finance accountability and constitutional audits.',
    url: 'https://oag.gov.np/en',
    category: 'Supreme Constitutional Audit',
  },
];

export const initialDownloads: DownloadResource[] = [];
