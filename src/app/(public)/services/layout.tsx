import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounting, Tax and Audit Services',
  description: 'Explore accounting, tax, audit, financial reporting, and business advisory services for organisations in Nepal.',
  alternates: { canonical: '/services' },
  openGraph: { type: 'website', title: 'Accounting, Tax and Audit Services', description: 'Explore accounting, tax, audit, financial reporting, and business advisory services for organisations in Nepal.' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
