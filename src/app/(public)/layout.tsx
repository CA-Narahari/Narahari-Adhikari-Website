import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import EntryPopup from '@/components/ui/EntryPopup';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#33475B]">
      <AnnouncementBanner />
      <Navbar />
      <main className="public-main flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <EntryPopup />
    </div>
  );
}
