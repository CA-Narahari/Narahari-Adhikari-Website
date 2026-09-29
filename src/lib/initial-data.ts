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
    title: 'New VAT Rule Directives & E-Billing (CBMS) Mandatory Integration 2081/82',
    slug: 'new-vat-rule-directives-e-billing-2081-82',
    category: 'VAT',
    update_type: 'Update',
    topic: 'VAT & Invoicing',
    effective_date: '01 Shrawan 2081',
    summary: 'Inland Revenue Department circular mandating real-time Central Billing Monitoring System (CBMS) integration for taxpayers exceeding turnover threshold.',
    content: `The Inland Revenue Department (IRD) has released updated procedural directives regarding electronic billing (CBMS integration) and mandatory VAT reporting.

What this means for you:
1. All commercial taxpayers with aggregate annual turnover above NRs 250 Million must synchronize directly with the Central Billing Monitoring System (CBMS).
2. Credit note reconciliation timeline reduced to 7 working days from date of issuance.
3. Penalties for delayed monthly VAT statement uploads have been revised in accordance with Section 19 of the Value Added Tax Act.

Action Checklist:
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
    title: 'Filing Reminder: Monthly VAT & Withholding Tax (TDS) Deposit Deadline',
    slug: 'filing-reminder-monthly-vat-tds-deposit-deadline',
    category: 'VAT',
    update_type: 'Deadline',
    topic: 'Compliance Deadline',
    effective_date: '25th of Every Nepali Month',
    summary: 'Mandatory statutory deadline for filing monthly VAT returns, input tax claim adjustments, and electronic withholding tax (E-TDS) payments.',
    content: `All VAT registered entities in Nepal are reminded to complete and file their monthly VAT return along with applicable withholding tax (TDS) by the 25th of the current Nepali calendar month.

What this means for you:
• Delays incur statutory fine of 0.1% per day or NPR 1,000 per month (whichever is higher) under Sec 19 of VAT Act.
• Input VAT credits not submitted within the prescribed period will trigger manual scrutiny during statutory audit.
• Withholding tax vouchers must be issued directly via IRD portal to ensure vendor reconciliation.`,
    source_name: 'IRD Compliance Directorate',
    source_url: 'https://ird.gov.np',
    is_urgent: true,
    status: 'published',
    published_at: '2026-09-18',
  },
  {
    id: 'tax-3',
    title: 'How NFRS/IFRS Transition Directly Affects Your Corporate Financial Reporting',
    slug: 'how-nfrs-ifrs-transition-affects-corporate-financial-reporting',
    category: 'Finance Acts',
    update_type: 'Guide',
    topic: 'Financial Reporting',
    effective_date: 'Effective FY 2081/82 onwards',
    summary: 'Comprehensive breakdown of opening balance sheet reconciliations, fair value asset measurement, and technical disclosures mandated by ICAN.',
    content: `As the Institute of Chartered Accountants of Nepal (ICAN) expands the mandatory enforcement of Nepal Financial Reporting Standards (NFRS), organizations must upgrade beyond traditional accounting methods.

What this means for you:
1. Balance Sheet Transition: Reclassification of operating leases into Right-of-Use (ROU) assets and corresponding lease liabilities under NFRS 16.
2. Financial Instruments: Adoption of Expected Credit Loss (ECL) provisioning rather than incurred loss models under NFRS 9.
3. Revenue Recognition: Multi-step contract evaluations under NFRS 15 for businesses with bundle contracts or milestone-based delivery.

Strategic Advisory Note:
Our technical advisory team conducts gap-analysis audits to ensure audit committees and executive directors maintain zero qualification risk.`,
    source_name: 'Technical Standards Desk / ICAN',
    source_url: 'https://en.ican.org.np/en/',
    is_urgent: false,
    status: 'published',
    published_at: '2026-09-12',
  },
  {
    id: 'tax-4',
    title: 'Hydropower Sector Regulatory Note: Royalty Payments, Carbon Revenue & Tax Holidays',
    slug: 'hydropower-sector-regulatory-note-royalty-tax-holidays',
    category: 'Corporate Tax',
    update_type: 'Sector Note',
    topic: 'Hydropower & Energy',
    sector: 'Hydropower',
    effective_date: 'Gazette Notice 2081',
    summary: 'Specialized regulatory insights on 100% income tax exemption timelines, subsequent 50% concession periods, and transmission wheeling tax guidelines.',
    content: `Energy producers operating commercial hydropower generation projects in Nepal operate under specific statutory tax incentive structures enacted in the Income Tax Act Section 11.

What this means for you:
• 10-Year Full Tax Holiday: 100% tax exemption for first 10 years of commercial generation, followed by 50% exemption for subsequent 5 years.
• Local Government Royalty: Exact calculation of royalty split between Department of Electricity Development and provincial/local authorities.
• Capital Goods Customs Concessions: Verified documentation required for 1% customs duty import of electromechanical components.`,
    source_name: 'Department of Electricity Development / IRD',
    source_url: 'https://mof.gov.np',
    is_urgent: false,
    status: 'published',
    published_at: '2026-09-05',
  },
  {
    id: 'tax-5',
    title: 'What the New National Fiscal Budget Means for SMEs & Manufacturing Units',
    slug: 'what-new-budget-means-for-smes-manufacturing',
    category: 'Income Tax',
    update_type: 'Guide',
    topic: 'Budget & SMEs',
    sector: 'Manufacturing',
    effective_date: 'Fiscal Year 2081/82',
    summary: 'Executive summary detailing changes in corporate income tax concessions, special export subsidies, and revised turnover tax brackets.',
    content: `The current fiscal budget contains several critical measures aimed at incentivizing domestic production and formalizing micro and small businesses.

What this means for you:
• Concessional 20% Corporate Rate for manufacturing units utilizing domestic raw materials.
• Simplified Turnover Tax thresholds for small taxpayers with annual revenue below NPR 30 Lakhs and NPR 1 Crore.
• Digital Payment Rebate: 10% VAT refund for consumers paying via electronic QR/card systems directly reflected on cash registers.`,
    source_name: 'Ministry of Finance',
    source_url: 'https://mof.gov.np',
    is_urgent: false,
    status: 'published',
    published_at: '2026-08-25',
  },
  {
    id: 'tax-6',
    title: 'Banking & Financial Institutions Note: NRB Unified Directives & Capital Adequacy',
    slug: 'banking-financial-institutions-nrb-unified-directives',
    category: 'Circulars',
    update_type: 'Sector Note',
    topic: 'Banking & Finance',
    sector: 'Banking',
    effective_date: 'NRB Directive Circular 04/2081',
    summary: 'Actionable guidance on loan loss provisioning, working capital guidelines compliance, and single borrower limits for commercial banks.',
    content: `Nepal Rastra Bank (NRB) has issued unified directives updating asset classification criteria and regulatory capital buffers.

What this means for you:
• Rigorous classification of overdue loans and stricter provisioning for restructured credit facilities.
• Verification of borrower audited financial statements against IRD tax portal records before credit sanction.
• Enhanced internal governance expectations for bank statutory auditors during annual closing reviews.`,
    source_name: 'Nepal Rastra Bank (NRB)',
    source_url: 'https://www.nrb.org.np/',
    is_urgent: false,
    status: 'published',
    published_at: '2026-08-20',
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
    department: 'Assurance & Direct Tax',
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
  {
    id: 'vac-3',
    title: 'Tax Associate & Corporate Secretarial Officer',
    department: 'Taxation & Legal',
    location: 'Kathmandu Office (On-site)',
    employment_type: 'Full-time',
    description: 'Responsible for managing monthly VAT returns, withholding tax (TDS) filings, company incorporation, and OCR annual compliances for corporate clients.',
    requirements: [
      'Semi-Qualified CA / ACCA or BBA/MBS with 1+ year direct tax filing experience.',
      'Proficiency in IRD portal, OCR electronic filings, and CBMS billing synchronization.',
      'Detail-oriented with strong statutory deadline adherence.',
    ],
    deadline: '2026-10-25',
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
