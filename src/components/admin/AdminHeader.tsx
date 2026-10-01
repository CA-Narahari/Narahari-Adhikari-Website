'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ExternalLink, LogOut, Menu, ChevronRight } from 'lucide-react';

type AdminHeaderProps = { onMenuClick: () => void };

const pageNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/tax-updates': 'Tax updates',
  '/admin/blog': 'Articles',
  '/admin/services': 'Services',
  '/admin/announcements': 'Announcements',
  '/admin/resources': 'Resources & links',
  '/admin/appointments': 'Appointments',
  '/admin/applications': 'Job applications',
  '/admin/careers': 'Careers',
  '/admin/office-hours': 'Office hours',
  '/admin/settings': 'Site settings',
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const title = pageNames[pathname] ?? 'Website workspace';

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
    <header className="sticky top-0 z-30 border-b border-[#E3E9E8] bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex h-[68px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#33475B] hover:bg-[#F1F6F4] md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="hidden items-center gap-2 text-[11px] font-medium text-[#7B8992] sm:flex">
              <span>Website</span><ChevronRight className="h-3 w-3" aria-hidden="true" /><span>Workspace</span>
            </div>
            <h1 className="truncate text-[15px] font-bold text-[#023A51] sm:mt-0.5 sm:text-base">{title}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {error && <span role="status" className="hidden max-w-48 text-xs text-red-700 sm:block">{error}</span>}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#DCE5E3] px-3 text-xs font-semibold text-[#33475B] hover:bg-[#F5F8F7]"
          >
            <span className="hidden sm:inline">View website</span><span className="sm:hidden">Website</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <div className="hidden h-8 w-px bg-[#E3E9E8] sm:block" />
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#023A51] text-xs font-bold text-white shadow-xs">
              CA
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-bold text-[#023A51]">CA Narahari Adhikari</span>
              <span className="block text-[10.5px] font-semibold text-[#258E50]">Practice Admin</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-[#59667D] hover:bg-[#F5F8F7] hover:text-[#023A51] disabled:opacity-60"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      </div>
      {error && <p role="status" className="pb-2 text-xs text-red-700 sm:hidden">{error}</p>}
    </header>
  );
}
