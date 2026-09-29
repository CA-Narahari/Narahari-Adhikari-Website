import {
  FileText,
  TrendingUp,
  Handshake,
  MessageSquareQuote,
  HeartHandshake,
  LineChart,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceSection {
  heading: string;
  items?: string[];
  description?: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  image: string;
  icon: LucideIcon;
  accentColor: string;
  articleParagraphs: string[];
  sections: ServiceSection[];
}

export const servicesData: ServiceData[] = [
  {
    slug: 'audit-and-assurance',
    title: 'Audit & Assurance',
    shortTitle: 'Audit & Assurance',
    tagline: 'Transparency, Trust & Regulatory Compliance',
    description:
      'We provide audit and assurance services to enhance transparency, build stakeholder trust, and ensure regulatory compliance.',
    image: '/services/service-audit.jpg',
    icon: FileText,
    accentColor: '#023A51',
    articleParagraphs: [
      'We provide comprehensive audit and assurance services designed to enhance transparency, strengthen stakeholder trust, and ensure compliance with regulatory standards. Our experienced team is committed to delivering the highest level of accuracy, integrity, and value in every engagement.',
      'We follow globally accepted audit procedures aligned with the Nepal Standards on Auditing (NSA)/International Standards on Auditing (ISA) and the professional codes prescribed by the Institute of Chartered Accountants of Nepal. At the core of our services is a steadfast commitment to delivering high-quality assurance.',
    ],
    sections: [
      {
        heading: 'Audit Services',
        items: [
          'Regulatory Audit',
          'Risk based Internal Audit',
          'Donor Audit',
          'Fund Audit',
          'Tax Audit',
          'Compliance Audit',
          'Information System Audit',
          'Management Audit',
          'Revenue Audit',
          'Cost Audit',
          'Operation Audit',
          'Social Audit',
          'Project Certifications',
        ],
      },
      {
        heading: 'Other Quality Services',
        description: 'Other than auditing services, we provide the following additional quality services as well:',
        items: [
          'NFRS/IFRS Implementation and Compliance',
          'Due Diligence Review',
          'Management Consultancy Service',
          'Agreed upon procedures',
          'Accounting Advisory Services',
          'Project Certifications',
          'Capital and Investment Certifications',
          'Capacity Assessment of Implementing Partners',
          'Micro Assessment',
          'Financial Projections',
        ],
      },
    ],
  },
  {
    slug: 'taxation-consultancy',
    title: 'Taxation Consultancy Services',
    shortTitle: 'Taxation Consultancy',
    tagline: '31 Years of Unmatched Tax Advisory',
    description:
      'With 31 years of experience and leadership in Nepal\'s tax system, we offer unmatched tax advisory and policy expertise.',
    image: '/services/service-tax.jpg',
    icon: TrendingUp,
    accentColor: '#023A51',
    articleParagraphs: [
      'With a strong foundation in taxation, shaped by our founding partner\'s extensive involvement as a Member of the High-level Tax System Review Commission, IRD and Member of the Expert Committee, IRD, Ministry of Finance and with our experience of 31 years, the firm offers unparalleled expertise in tax advisory and policy development.',
      'We specialize in helping businesses adhere the complexities of local and international tax regulations, and develop effective tax strategies that supports growth while ensuring compliance. If you are dealing with contentious tax issues, need assistance with policy development, or seek greater transparency in your tax operations, our team of experts is here to help.',
    ],
    sections: [
      {
        heading: 'Our Tax Consulting Expertise on:',
        items: [
          'Tax Planning and Strategy',
          'Tax Policy Development',
          'Tax Compliance & Reporting',
          'Cross-Border Tax Advisory',
          'Transfer Pricing Services',
          'Mergers & Acquisitions Tax Advisory',
        ],
      },
      {
        heading: 'Others:',
        items: [
          'Acts',
          'Tax Facilities',
          'Regulatory Standards and Guidelines',
        ],
      },
    ],
  },
  {
    slug: 'mergers-and-acquisitions',
    title: 'Mergers and Acquisitions',
    shortTitle: 'Mergers & Acquisitions',
    tagline: 'Pioneers in M&A Transactions in Nepal',
    description:
      'As pioneers in Mergers and Acquisitions, we have facilitated numerous successful transactions in Nepal.',
    image: '/services/service-ma.jpg',
    icon: Handshake,
    accentColor: '#023A51',
    articleParagraphs: [
      'Merger and Acquisitions are being widely implemented as strategic decisions in Nepalese business sectors. S.R. Pandey & Co., Chartered Accountants has been a pioneer in the Mergers and Acquisitions in the country which has assisted in successful mergers and acquisitions of numerous entities over the years.',
      'Our team of expertise with extensive industry knowledge and experience help you confidently navigate the complexities of uniting organizations. Mergers and acquisitions are significant undertakings that can shape the future of your business. To navigate these complex transactions for mergers and acquisitions successfully, partnering with an experienced and dedicated mergers and acquisitions firm is crucial.',
    ],
    sections: [
      {
        heading: '1. Pre-merger Advisory Services',
        description: 'Identification and evaluation of potential M & A opportunities and preliminary due diligence.',
      },
      {
        heading: '2. Financial Assessment',
        items: [
          'Financial Due Diligence of the entities.',
          'Analysis of Future Projections of merging entities as well as the newly formed entities to identify synergies and create a vision for the combined entity.',
          'Analysis of compliance of all the statutory requirements of regulatory bodies.',
        ],
      },
      {
        heading: '3. Post Merger Advisory Services',
        items: [
          'Negotiation of deal terms.',
          'Develop merged entity\'s structures.',
          'HR Integration and Management Consultancy.',
          'Merger Implementation of Financial and Accounting Aspects.',
        ],
      },
    ],
  },
  {
    slug: 'advisory-services',
    title: 'Advisory Services',
    shortTitle: 'Advisory Services',
    tagline: 'Strategic Consulting for Sustainable Growth',
    description:
      'Our growth is linked to our clients\' success, driving our commitment to strategic advisory services.',
    image: '/services/service-advisory.jpg',
    icon: MessageSquareQuote,
    accentColor: '#023A51',
    articleParagraphs: [
      'We believe that our growth is directly connected to the growth of our clients which drives our commitment to providing comprehensive advisory services to help businesses navigate changing priorities and achieve sustainable growth.',
      'To support our clients, we provide a wide range of advisory services which includes – Management Consulting, Risk Consulting, Compliance Review, Taxation Consulting, Strategic Planning and other consultancy as required by our clients.',
    ],
    sections: [
      {
        heading: 'Management Consulting',
        description:
          'We provide strategic advisory services to help businesses optimize operations, improve efficiency, and drive growth. Our consulting expertise covers financial planning, risk management, business process improvement, business restructuring and turnaround and strategic decision-making.',
      },
      {
        heading: 'Standard Operating Procedure (SOP) Formulation and Compliance Test',
        description:
          'S.R. Pandey & Co., Chartered Accountants, provides specialized services in Standard Operating Procedure (SOP) Formulations in businesses to setup the Internal procedures of the organization and to help strength the structures and internal control systems.',
      },
      {
        heading: 'Public Procurement Policy Compliances',
        description:
          'We help entities ensure that the procurements of the goods and services of both capital and revenue nature are in compliance with the requirements of the Public Procurement Policies and to ensure that such procurements are made at most economical option available.',
      },
      {
        heading: 'Fraud Risk Assessment',
        description:
          'We help entities asses their internal structures and control systems so that loopholes and gaps in their systems may be detected on a timely manner and potential frauds may be avoided beforehand.',
      },
      {
        heading: 'Fraud Investigations',
        description:
          'Our services include detailed investigations of fraud and misappropriations in any organizations for assessment of losses and identification of channels that have been put to use in such frauds as well as the individuals.',
      },
    ],
  },
  {
    slug: 'business-support-outsourcing',
    title: 'Business Support and Outsourcing',
    shortTitle: 'Support & Outsourcing',
    tagline: 'Tailored Back-Office & Compliance Solutions',
    description:
      'We grow alongside our clients, providing strategic advisory services to help businesses adapt and achieve sustainable success.',
    image: '/services/service-bpo.jpg',
    icon: HeartHandshake,
    accentColor: '#023A51',
    articleParagraphs: [
      'Our firm provides comprehensive business support and outsourcing solutions tailored to meet your unique needs. With our expertise, we help you focus on your core operations while we handle the complexities of compliance, approvals, and administrative functions.',
    ],
    sections: [
      {
        heading: 'Business Registration',
        description: 'We assist in business setup by managing registrations, approvals, and compliance with regulatory requirements.',
      },
      {
        heading: 'Foreign Direct Investment (FDI) Approval',
        description: 'We simplify the FDI process in Nepal by facilitating due diligence and securing approvals for company registration and banking needs.',
      },
      {
        heading: 'Financial Consulting and Bookkeeping',
        description: 'Our expertise ensures accurate bookkeeping and compliance with accounting standards and legal requirements.',
      },
      {
        heading: 'Cost Accounting',
        description: 'We provide Cost accounting services to help businesses track, analyze, and control costs to improve profitability and efficiency.',
      },
      {
        heading: 'HR Management & Payroll Processing',
        description: 'We offer complete HR solutions, including recruitment, payroll management, and regulatory filings.',
      },
      {
        heading: 'Corporate Legal Compliance and Reporting',
        description: 'We handle periodic legal reporting, return filings, and compliance, ensuring your business meets all regulatory obligations.',
      },
    ],
  },
  {
    slug: 'nfrs-ifrs-implementation',
    title: 'NFRS/IFRS Implementation',
    shortTitle: 'NFRS/IFRS Implementation',
    tagline: 'Pioneering Financial Reporting Transformation',
    description:
      'We have led financial reporting transformation, contributing to NFRS/IFRS adoption.',
    image: '/services/service-ifrs.jpg',
    icon: LineChart,
    accentColor: '#023A51',
    articleParagraphs: [
      'We have been at the forefront of financial reporting transformation in Nepal, actively contributing to the adoption and implementation of NFRS/IFRS. Our team of skilled professionals led by partners with extensive expertise in the field has strengthened our ability to guide businesses through complex financial reporting challenges.',
      'Whether in preparing for initial adoption or enhancing compliance with NFRS/IFRS, our expertise ensures that your financial reporting aligns with global standards. We have track record of successfully implementing NFRS in banks, insurance companies, micro finance companies, investment companies, capital markets, mutual funds and other service industries. We have been delivering specialized training on NFRS/IFRS to various regulatory organizations, banks, insurance companies, microfinance institutions, investment firms, capital markets, mutual funds, and other service industries, while also providing comprehensive assistance to ensure a smooth and efficient NFRS/IFRS implementation.',
    ],
    sections: [
      {
        heading: 'Implementation & Advisory Scope',
        items: [
          'Initial NFRS/IFRS Adoption & Transition Roadmap',
          'Opening Balance Sheet Preparation & GAAP Reconciliation',
          'Sector-Specific Implementation (Banks, Insurance, Capital Markets)',
          'Complex Standards Advisory (IFRS 9, IFRS 15, IFRS 16, IFRS 17)',
          'Accounting Policy Manual Development & Disclosure Checklists',
          'Capacity Building & Training for Corporate Regulators and Institutions',
        ],
      },
    ],
  },
  {
    slug: 'training-and-seminar',
    title: 'Training and Seminar',
    shortTitle: 'Training & Seminar',
    tagline: 'Practical Skills for Financial & Compliance Excellence',
    description:
      'We provide expert training in taxation, financial reporting, business structuring, and compliance.',
    image: '/services/service-training.jpg',
    icon: GraduationCap,
    accentColor: '#023A51',
    articleParagraphs: [
      'We have been actively providing various trainings designed for professionals, business and regulators to equip with practical skills in taxation, financial reporting, business structuring/ restructuring, merger and acquisition, financial management and regulatory compliance with the goal of promoting financial expertise, ensuring smooth operations and long-term business success.',
    ],
    sections: [
      {
        heading: 'Specialized Training Programs',
        items: [
          'Practical Taxation & VAT Compliance Workshops',
          'NFRS / IFRS Technical Standards & Hands-On Reporting',
          'Business Structuring, Reorganization & M&A Strategy',
          'Financial Management & Risk Governance for Executives',
          'Corporate Legal & Public Procurement Compliance Seminars',
          'Customized In-House Programs for Corporates and Regulators',
        ],
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((s) => s.slug === slug);
}
