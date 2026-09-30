import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Consultation',
  description: 'Request an in-person meeting with CA Narahari Adhikari in Kathmandu or choose an available online appointment through Calendly.',
};

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
