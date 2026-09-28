import {
  SiteSettings,
  TaxUpdate,
  BlogPost,
  ServiceItem,
  Vacancy,
  JobApplication,
  Appointment,
  GovernmentLink,
  DownloadResource,
  OfficeHourDay,
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
  announcement_active: true,
  announcement_text: 'Notice: Income Tax & VAT Return submission deadline for Quarter 2 extended by IRD.',
  announcement_link: '/tax-updates',
};

export const initialTaxUpdates: TaxUpdate[] = [
  {
    id: 'tax-1',
    title: 'New VAT Rule Directives & E-Billing Implementation Guidance 2081/82',
    slug: 'new-vat-rule-directives-e-billing-2081-82',
    category: 'VAT',
    summary: 'Detailed explanation of new Inland Revenue Department mandatory digital invoicing requirements for entities with turnover exceeding NRs 25 Crore.',
    content: `The Inland Revenue Department (IRD) has released updated procedural directives regarding electronic billing (CBMS integration) and mandatory VAT reporting.

Key Takeaways:
1. All commercial taxpayers with aggregate annual turnover above NRs 250 Million must synchronize directly with the Central Billing Monitoring System (CBMS).
2. Credit note reconciliation timeline reduced to 7 working days from date of issuance.
3. Penalties for delayed monthly VAT statement uploads have been revised in accordance with Section 19 of the Value Added Tax Act.

Compliance Checklist:
• Confirm software certification with IRD approved vendors.
• Ensure daily fiscal closure reports are stored on encrypted local backup.
• Reconcile monthly sales register against CBMS transmission logs prior to the 25th of each Nepali month.`,
    source_name: 'Inland Revenue Department (IRD)',
    source_url: 'https://ird.gov.np',
    is_urgent: true,
    status: 'published',
    published_at: '2026-09-15',
  },
  {
    id: 'tax-2',
    title: 'Corporate Income Tax Assessment Guidelines for Financial Institutions & SMEs',
    slug: 'corporate-income-tax-assessment-guidelines-smes',
    category: 'Corporate Tax',
    summary: 'Standard operating procedures for advance tax installment calculation and allowable business expenditure deductions.',
    content: `A comprehensive overview of allowable expense heads, depreciation schedules under Pool A through Pool D, and withholding tax adjustments for fiscal year filings.`,
    source_name: 'Ministry of Finance / IRD',
    source_url: 'https://mof.gov.np',
    is_urgent: false,
    status: 'published',
    published_at: '2026-09-08',
  },
  {
    id: 'tax-3',
    title: 'Customs Valuation and Harmonized System Code Updates',
    slug: 'customs-valuation-hs-code-updates',
    category: 'Customs',
    summary: 'Summary of import tariff modifications on industrial machinery and capital goods under the latest gazette notice.',
    content: `Updated tariff structures and documentation mandates for raw material imports and bonded warehouse facilities.`,
    source_name: 'Department of Customs',
    source_url: 'https://customs.gov.np',
    is_urgent: false,
    status: 'published',
    published_at: '2026-08-28',
  },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How to Register a Private Limited Company in Nepal: Step-by-Step Legal & Tax Blueprint',
    slug: 'how-to-register-private-limited-company-nepal',
    category: 'Corporate Compliance',
    excerpt: 'A practical walkthrough from Office of Company Registrar (OCR) name reservation to PAN/VAT registration and local government ward licensing.',
    content: `Registering a company requires structured adherence to Company Act 2063 procedures. In this guide, our senior partners outline the exact procedural path, fee structures, and post-incorporation tax mandates.`,
    author: 'CA Narahari Adhikari, FCA',
    read_time: '6 min read',
    status: 'published',
    published_at: '2026-09-10',
  },
  {
    id: 'blog-2',
    title: 'Internal Audit vs Statutory Audit: What Growing Businesses Often Misunderstand',
    slug: 'internal-audit-vs-statutory-audit-differences',
    category: 'Auditing',
    excerpt: 'Clarifying the legal requirements, scope differences, and risk-management value of internal operational reviews versus annual statutory audits.',
    content: `While statutory audit is a compliance mandate for filing annual financial statements, internal audit is an executive tool for operational governance and risk mitigation.`,
    author: 'Senior Audit Team',
    read_time: '4 min read',
    status: 'published',
    published_at: '2026-09-01',
  },
];

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-tax',
    title: 'Tax Advisory & Compliance',
    slug: 'tax-advisory-compliance',
    short_description: 'Strategic tax structuring, corporate return filings, VAT advisory, and dispute resolution with tax authorities.',
    full_description: 'Our Tax Advisory practice assists corporate entities, partnerships, and high-net-worth individuals in navigating complex tax regimes with maximum compliance and optimal structural efficiency.',
    deliverables: [
      'Corporate & Individual Income Tax Return Filing',
      'Monthly VAT & Withholding Tax (TDS) Compliance',
      'Tax Audit Representation & Appellate Tribunal Support',
      'International Taxation & Cross-Border Advisory',
    ],
    target_audience: 'SMEs, Corporations, Exporters, and High-Net-Worth Individuals',
    icon: 'ReceiptText',
    is_featured: true,
  },
  {
    id: 'srv-audit',
    title: 'Audit & Assurance',
    slug: 'audit-assurance',
    short_description: 'Statutory audits, internal process reviews, forensic audits, and comprehensive management assurance.',
    full_description: 'We deliver objective, rigorous assurance services compliant with International Standards on Auditing (ISA) and Nepal Standards on Auditing (NSA), building stakeholder trust.',
    deliverables: [
      'Statutory & Regulatory Audits',
      'Risk-Based Internal Audits & Internal Control Evaluations',
      'Due Diligence & Special Forensic Investigations',
      'Project Audits for INGOs & Bilateral Development Agencies',
    ],
    target_audience: 'Listed Companies, Banks, Insurance Entities, INGOs, and Manufacturing Firms',
    icon: 'ShieldCheck',
    is_featured: true,
  },
  {
    id: 'srv-accounting',
    title: 'Accounting & Business Advisory',
    slug: 'accounting-business-advisory',
    short_description: 'Cloud accounting, financial statement preparation, payroll management, and CFO advisory services.',
    full_description: 'Modern bookkeeping and outsourced financial controller services that give business owners live financial visibility and complete regulatory peace of mind.',
    deliverables: [
      'Complete Bookkeeping & Financial Statement Compilation',
      'Payroll Management & Social Security Fund (SSF) Reporting',
      'Fractional CFO & Cashflow Management',
      'Accounting Software (ERP/Tally) Setup & Training',
    ],
    target_audience: 'Growing Startups, Tech Firms, Wholesalers, and Retail Enterprises',
    icon: 'TrendingUp',
    is_featured: true,
  },
  {
    id: 'srv-secretarial',
    title: 'Corporate Secretarial & Legal Advisory',
    slug: 'corporate-secretarial-legal',
    short_description: 'Company incorporation, annual OCR filings, share transfers, capital restructuring, and liquidation.',
    full_description: 'Full-spectrum company law compliance ensuring your enterprise adheres to Company Act obligations from formation through expansion.',
    deliverables: [
      'Company Incorporation & Branch Office Registration',
      'OCR Annual Compliance (Shareholder registry, minutes, 51/78 filings)',
      'Foreign Direct Investment (FDI) Approvals (NRB & Department of Industry)',
      'Mergers, Acquisitions, & Share Valuation',
    ],
    target_audience: 'New Founders, Foreign Investors, and Expanding Corporate Groups',
    icon: 'Building2',
    is_featured: true,
  },
];

export const initialVacancies: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'Senior Audit Associate',
    department: 'Assurance & Audit',
    location: 'Kathmandu Office (On-site)',
    employment_type: 'Full-time',
    description: 'We are seeking an experienced Audit Associate to lead statutory and internal audit engagements for corporate clients across diverse sectors.',
    requirements: [
      'CA Semi-Qualified / ACCA Affiliate or Masters in Accounting with 2+ years audit experience.',
      'Strong command of Nepal Standards on Auditing (NSA) and Income Tax Act.',
      'Proficiency in ERP systems, Tally, and advanced Excel financial modeling.',
      'Strong client communication and team leadership capabilities.',
    ],
    deadline: '2026-10-15',
    is_active: true,
  },
  {
    id: 'vac-2',
    title: 'Article Trainee (Chartered Accountancy)',
    department: 'Tax & Assurance',
    location: 'Kathmandu Office (On-site)',
    employment_type: 'Article Trainee',
    description: 'ICAN registered students who have cleared CAP-II / Intermediate level seeking 3-year rigorous practical training in taxation, statutory audit, and corporate compliance.',
    requirements: [
      'Cleared ICAN CAP-II examinations.',
      'Eager to learn and work under direct supervision of Senior Chartered Accountants.',
      'Sound analytical skills and commitment to professional ethics.',
    ],
    deadline: '2026-10-20',
    is_active: true,
  },
];

export const initialJobApplications: JobApplication[] = [
  {
    id: 'app-101',
    vacancy_id: 'vac-1',
    vacancy_title: 'Senior Audit Associate',
    applicant_name: 'Prakash Sharma',
    applicant_email: 'prakash.sharma@example.com',
    applicant_phone: '+977 9841234567',
    cover_note: 'I have 3 years of audit experience with manufacturing and banking clients. Completed CAP-II and currently preparing for Final.',
    cv_filename: 'Prakash_Sharma_CV.pdf',
    status: 'review',
    submitted_at: '2026-09-26 14:30',
  },
  {
    id: 'app-102',
    vacancy_id: 'vac-2',
    vacancy_title: 'Article Trainee (Chartered Accountancy)',
    applicant_name: 'Anjali Khadka',
    applicant_email: 'anjali.khadka@example.com',
    applicant_phone: '+977 9818765432',
    cover_note: 'Recently cleared ICAN CAP-II with distinction in Taxation and Auditing. Seeking articleship under Narahari Sir.',
    cv_filename: 'Anjali_Khadka_Resume.pdf',
    status: 'new',
    submitted_at: '2026-09-27 08:15',
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-201',
    client_name: 'Sunil Bajracharya',
    client_email: 'sunil@himalayantraders.com',
    client_phone: '+977 9851122334',
    service_title: 'Tax Advisory & Compliance',
    consultation_type: 'Office Meeting',
    date: '2026-09-28',
    time_slot: '11:00 AM – 11:45 AM',
    notes: 'Discussion regarding new VAT e-invoicing threshold for our wholesale branches.',
    status: 'confirmed',
    created_at: '2026-09-26 10:20',
  },
  {
    id: 'apt-202',
    client_name: 'Rashmi Shrestha',
    client_email: 'rashmi@fintechsolution.io',
    client_phone: '+977 9801239876',
    service_title: 'Corporate Secretarial & Legal Advisory',
    consultation_type: 'Online Meeting',
    date: '2026-09-28',
    time_slot: '02:30 PM – 03:15 PM',
    notes: 'Consultation for cross-border software revenue withholding tax and NRB repatriation clearance.',
    status: 'pending',
    created_at: '2026-09-26 16:40',
  },
];

export const initialGovernmentLinks: GovernmentLink[] = [
  {
    id: 'gov-1',
    name: 'Inland Revenue Department (IRD)',
    short_name: 'IRD Nepal',
    description: 'Official portal for taxpayer registration (PAN/VAT), tax returns filing, CBMS invoicing, and tax clearance certificates.',
    url: 'https://ird.gov.np',
    category: 'Taxation & Revenue',
  },
  {
    id: 'gov-2',
    name: 'Office of the Company Registrar (OCR)',
    short_name: 'OCR Nepal',
    description: 'Portal for online company incorporation, name reservation, share transfer, and annual statutory return submissions.',
    url: 'https://ocr.gov.np',
    category: 'Corporate Registry',
  },
  {
    id: 'gov-3',
    name: 'Nepal Rastra Bank (NRB)',
    short_name: 'Central Bank',
    description: 'Regulatory monetary policies, foreign exchange approvals, commercial banking directives, and interest rate benchmarks.',
    url: 'https://nrb.org.np',
    category: 'Monetary & Banking',
  },
  {
    id: 'gov-4',
    name: 'Department of Customs',
    short_name: 'Customs Department',
    description: 'ASYCUDA World portal, customs tariff valuation, EXIM code registration, and bonded warehouse guidelines.',
    url: 'https://customs.gov.np',
    category: 'Trade & Tariff',
  },
  {
    id: 'gov-5',
    name: 'Social Security Fund (SSF)',
    short_name: 'SSF Nepal',
    description: 'Employer and employee contribution management, pension schemes, and statutory social security compliance.',
    url: 'https://ssf.gov.np',
    category: 'Labor & Social Welfare',
  },
  {
    id: 'gov-6',
    name: 'Securities Board of Nepal (SEBON)',
    short_name: 'SEBON',
    description: 'Capital market regulations, public listing approvals, and securities guidelines.',
    url: 'https://sebon.gov.np',
    category: 'Capital Markets',
  },
];

export const initialDownloads: DownloadResource[] = [
  {
    id: 'dl-1',
    title: 'Income Tax Return (ITR) Schedule 1 to 5 Prescribed Forms',
    category: 'Tax Form',
    file_format: 'PDF',
    file_size: '2.4 MB',
    download_url: '#',
    downloads_count: 342,
  },
  {
    id: 'dl-2',
    title: 'Annual Statutory Audit Readiness Checklist for Businesses',
    category: 'Checklist',
    file_format: 'PDF',
    file_size: '680 KB',
    download_url: '#',
    downloads_count: 819,
  },
  {
    id: 'dl-3',
    title: 'Standard Board Resolution & Shareholder Meeting Minutes Template',
    category: 'Template',
    file_format: 'DOCX',
    file_size: '420 KB',
    download_url: '#',
    downloads_count: 512,
  },
  {
    id: 'dl-4',
    title: 'Comprehensive VAT Compliance Guide & Input Tax Credit Rules',
    category: 'Guide',
    file_format: 'PDF',
    file_size: '1.8 MB',
    download_url: '#',
    downloads_count: 670,
  },
];

export const initialOfficeHours: OfficeHourDay[] = [
  { day: 'Sunday', hours: '09:30 AM – 05:30 PM', is_open: true },
  { day: 'Monday', hours: '09:30 AM – 05:30 PM', is_open: true },
  { day: 'Tuesday', hours: '09:30 AM – 05:30 PM', is_open: true },
  { day: 'Wednesday', hours: '09:30 AM – 05:30 PM', is_open: true },
  { day: 'Thursday', hours: '09:30 AM – 05:30 PM', is_open: true },
  { day: 'Friday', hours: '09:30 AM – 04:00 PM', is_open: true },
  { day: 'Saturday', hours: 'Closed (Weekly Holiday)', is_open: false },
];
