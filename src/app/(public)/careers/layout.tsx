import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers and Open Vacancies',
  description: 'See current job openings and articleship vacancies at the Narahari Adhikari practice in Kathmandu.',
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
