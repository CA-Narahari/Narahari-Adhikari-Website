import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan & EMI Calculator',
  description: 'Calculate exact loan installments, periodic interest breakdowns, and full amortization schedules for corporate and personal borrowings.',
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
