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
    description:
      'We provide audit and assurance services to enhance transparency, build stakeholder trust, and ensure regulatory compliance.',
    image: '/services/service-audit.jpg',
    icon: FileText,
    accentColor: '#023A51',
    articleParagraphs: [
      'An audit should leave you with a clearer understanding of the business, not just another report. We review the records, controls, and decisions behind the numbers and explain what needs attention.',
      'Our work follows the Nepal Standards on Auditing and the professional requirements of ICAN. We plan the engagement around your business, keep communication direct, and document the points that matter.',
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
        heading: 'Related support',
        description: 'Where an audit raises a wider question, we can help with the next step as well:',
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
    description:
      'Clear support for tax filings, reviews, planning, and conversations with the tax authority.',
    image: '/services/service-tax.jpg',
    icon: TrendingUp,
    accentColor: '#023A51',
    articleParagraphs: [
      'Tax questions rarely arrive in a neat order. We help businesses make sense of their filings, notices, transactions, and decisions before a small issue becomes an expensive one.',
      'That can mean preparing a return, reviewing a VAT position, planning a transaction, or responding to an IRD query. We explain the options and the records needed for each one.',
    ],
    sections: [
      {
        heading: 'Where we help',
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
        heading: 'Regulatory reading',
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
    description:
      'Support for transaction reviews, financial due diligence, valuations, and the practical steps involved in a merger or acquisition.',
    image: '/services/service-ma.jpg',
    icon: Handshake,
    accentColor: '#023A51',
    articleParagraphs: [
      'A merger or acquisition changes more than the shareholding. It affects contracts, people, tax positions, reporting, and the way the combined business will operate.',
      'We help buyers and sellers understand the numbers and the practical risks before they commit, then stay involved through the financial and reporting work that follows completion.',
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
    description:
      'Guidance for planning, evaluating options, and making informed decisions as your organisation changes.',
    image: '/services/service-advisory.jpg',
    icon: MessageSquareQuote,
    accentColor: '#023A51',
    articleParagraphs: [
      'Sometimes a business needs an outside view before it changes direction. We work with owners and finance teams on the practical questions behind growth, risk, controls, and cash.',
      'The work may be a focused review or a longer project. Either way, we start with the decision you need to make and build the analysis around it.',
    ],
    sections: [
      {
        heading: 'Management Consulting',
        description:
          'We review the numbers, processes, and responsibilities that shape day-to-day decisions, then turn the findings into a practical plan.',
      },
      {
        heading: 'Standard Operating Procedure (SOP) Formulation and Compliance Test',
        description:
          'We help teams document the way important work should be done and test whether the process is being followed in practice.',
      },
      {
        heading: 'Public Procurement Policy Compliances',
        description:
          'We review procurement steps, approvals, and records so purchases follow the applicable public procurement rules and make commercial sense.',
      },
      {
        heading: 'Fraud Risk Assessment',
        description:
          'We review controls and responsibilities to find gaps early and reduce the chance of fraud or avoidable loss.',
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
    description:
      'Reliable back-office support for the records, filings, and approvals that keep a business moving.',
    image: '/services/service-bpo.jpg',
    icon: HeartHandshake,
    accentColor: '#023A51',
    articleParagraphs: [
      'We take care of recurring records, filings, and administrative work so owners and finance teams can focus on the business. The scope can be a single process or a regular monthly service.',
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
        description: 'We keep books current and prepare records that are easier to review, reconcile, and use.',
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
    description:
      'Support with financial reporting policies, transition planning, and applying NFRS or IFRS requirements to your reporting.',
    image: '/services/service-ifrs.jpg',
    icon: LineChart,
    accentColor: '#023A51',
    articleParagraphs: [
      'NFRS/IFRS work is easier when the team knows what changes, why it changes, and what evidence will support the final numbers. We help finance teams map that work before the reporting deadline.',
      'Our support can cover opening balances, accounting policies, disclosures, and training for the people who prepare and review the statements.',
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
    description:
      'Practical sessions for teams on taxation, financial reporting, business structuring, and compliance.',
    image: '/services/service-training.jpg',
    icon: GraduationCap,
    accentColor: '#023A51',
    articleParagraphs: [
      'Our sessions are built around the work people actually have to do: prepare a filing, read a standard, improve a control, or explain a financial decision. Sessions can be run for a small team or a larger organisation.',
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
