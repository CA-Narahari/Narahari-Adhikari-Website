import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax and Finance Calculators',
  description: 'Estimate common tax and finance figures with simple calculators. Confirm results against current official guidance.',
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
