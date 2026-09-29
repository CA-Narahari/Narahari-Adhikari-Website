import React from 'react';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import NotFoundGlitch from '@/components/ui/NotFoundGlitch';

export const metadata = {
  title: '404 - Page Not Found | Narahari Adhikari Chartered Accountants',
  description: 'The requested page or record could not be found on Narahari Adhikari Chartered Accountants.',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#33475B]">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <NotFoundGlitch
          code="404"
          title="Page Not Found"
          description="The page or record you are trying to reach does not exist or has been relocated. Please verify the URL or return to our practice areas."
          homeHref="/"
          homeLabel="Return to Home"
          browseHref="/services"
          browseLabel="Our Services"
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
