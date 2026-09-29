'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/book-appointment');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#2CBC63] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-[#023A51]">Directing to Appointment & Consultation Desk...</p>
      </div>
    </div>
  );
}
