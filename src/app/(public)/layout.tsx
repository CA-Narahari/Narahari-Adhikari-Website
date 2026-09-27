import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
