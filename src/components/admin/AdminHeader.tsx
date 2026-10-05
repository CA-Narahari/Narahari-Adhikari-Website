'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ExternalLink, LogOut, Menu, ChevronRight, Calendar, User } from 'lucide-react';

type AdminHeaderProps = { onMenuClick: () => void };

const pageNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/tax-updates': 'Tax Updates & Circulars',
  '/admin/blog': 'Articles & Insights',
  '/admin/services': 'Pages & Services',
  '/admin/announcements': 'Announcements',
  '/admin/resources': 'Media & Downloads',
  '/admin/appointments': 'Contact Inquiries & Consultations',
  '/admin/applications': 'Job Applications & CVs',
  '/admin/careers': 'Careers & Vacancies',
  '/admin/office-hours': 'Office Hours',
  '/admin/users': 'Staff Management',
  '/admin/settings': 'Site Settings',
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentDateTime({ date: dateStr, time: timeStr });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const title = pageNames[pathname] ?? 'CMS Portal';

  const handleLogout = async () => {
    setIsSigningOut(true);
    setError('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST' });
      if (!response.ok) throw new Error('Sign out did not complete. Please try again.');
      router.replace('/admin/login');
      router.refresh();
    } catch {
      setError('Could not sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E6EFEA] bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex h-[72px] items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page Identity */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#33475B] hover:bg-[#F1F6F4] md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="hidden items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A8F4B] sm:flex">
              <span>CMS Portal</span>
              <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
              <span className="text-[#59667D]">{title}</span>
            </div>
            <h1 className="truncate text-base font-extrabold text-[#0D3B3E] sm:text-lg">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Date/Time + System Status + User Pill + Logout Button */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {error && (
            <span role="status" className="hidden max-w-48 text-xs text-red-700 sm:block">
              {error}
            </span>
          )}

          {/* Dynamic Date & Time Widget (Image 2) */}
          <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#F6FAF8] border border-[#E4EEE8]">
            <Calendar className="w-4 h-4 text-[#1A8F4B]" />
            <div className="text-left leading-tight">
              <span className="block text-[11px] font-bold text-[#0D3B3E]">
                {currentDateTime.date || 'Today'}
              </span>
              <span className="block text-[10px] text-[#698083] font-medium">
                {currentDateTime.time}
              </span>
            </div>
          </div>

          {/* System Online Indicator (Image 2) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF6F0] text-[#16723B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2CBC63] animate-pulse" />
            <span>System Online</span>
          </div>

          {/* View Website Link */}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DCE5E2] bg-white text-xs font-semibold text-[#0D3B3E] hover:bg-[#F6FAF8] transition-colors"
          >
            <span>View Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#1A8F4B]" aria-hidden="true" />
          </Link>

          <div className="hidden h-7 w-px bg-[#E3ECE8] sm:block" />

          {/* Admin User Profile Pill (Image 2) */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF6F0] text-xs font-bold text-[#1A8F4B] border border-[#2CBC63]/20 shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-[#0D3B3E] leading-tight">
                Admin
              </span>
              <span className="block text-[10.5px] font-medium text-[#698083] leading-tight">
                Administrator
              </span>
            </div>
          </div>

          {/* Logout Button (Deep Teal button matching Image 2) */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] active:scale-95 text-white px-3.5 text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            aria-label="Logout"
            title="Sign out of CMS"
          >
            <LogOut className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            <span className="hidden sm:inline">{isSigningOut ? 'Logging out…' : 'Logout'}</span>
          </button>
        </div>
      </div>
      {error && <p role="status" className="pb-2 text-xs text-red-700 sm:hidden">{error}</p>}
    </header>
  );
}
