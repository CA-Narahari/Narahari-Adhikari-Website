'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ExternalLink,
  LogOut,
  Menu,
  Search,
  Bell,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type AdminHeaderProps = { onMenuClick: () => void };

const pageNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/updates': 'Updates & Circulars',
  '/admin/blog': 'Articles & Knowledge Base',
  '/admin/services': 'Services & Advisory',
  '/admin/announcements': 'Announcements',
  '/admin/resources': 'Resources & Links',
  '/admin/appointments': 'Appointments & Consultations',
  '/admin/applications': 'Job Applications & CVs',
  '/admin/careers': 'Careers & Vacancies',
  '/admin/users': 'Staff Access Management',
  '/admin/settings': 'Site Settings',
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { appointments, applications, blogPosts, services, taxUpdates, vacancies, downloads } = useApp();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const newApplications = applications.filter((a) => a.status === 'new');
  const totalNotifications = pendingAppointments.length + newApplications.length;

  const title = pageNames[pathname] ?? 'CMS Portal';
  const searchItems = [
    ...blogPosts.map((item) => ({ title: item.title, detail: `Article · ${item.category}`, href: '/admin/blog' })),
    ...services.map((item) => ({ title: item.title, detail: 'Service', href: '/admin/services' })),
    ...taxUpdates.map((item) => ({ title: item.title, detail: 'Update', href: '/admin/updates' })),
    ...vacancies.map((item) => ({ title: item.title, detail: 'Career opening', href: '/admin/careers' })),
    ...appointments.map((item) => ({ title: item.client_name, detail: `Appointment · ${item.service_title}`, href: '/admin/appointments' })),
    ...applications.map((item) => ({ title: item.applicant_name, detail: `Application · ${item.vacancy_title}`, href: '/admin/applications' })),
    ...downloads.map((item) => ({ title: item.title, detail: 'Download', href: '/admin/resources' })),
  ];
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const searchResults = normalizedQuery
    ? searchItems.filter((item) => `${item.title} ${item.detail}`.toLocaleLowerCase().includes(normalizedQuery)).slice(0, 7)
    : [];

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
    <header className="sticky top-0 z-30 border-b border-[#E6EFEA] bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex h-[70px] items-center justify-between gap-4">
        {/* Left: Mobile menu trigger & Clean Page Title (Removed Website > Workspace breadcrumb) */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#33475B] hover:bg-[#F1F6F4] md:hidden cursor-pointer"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base sm:text-lg font-extrabold text-[#0D3B3E]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side: Search, Notifications, Profile, Public site link, Sign out */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Search bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              role="combobox"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CMS content..."
              aria-label="Search CMS content"
              aria-autocomplete="list"
              aria-expanded={normalizedQuery.length > 0}
              aria-haspopup="listbox"
              aria-controls="admin-search-results"
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-3.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#1A8F4B] focus:bg-white focus:outline-hidden transition-all shadow-2xs"
            />
            {normalizedQuery && (
              <div id="admin-search-results" role="listbox" aria-label="CMS search results" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                {searchResults.length > 0 ? searchResults.map((result, index) => (
                  <Link
                    key={`${result.href}-${result.title}-${index}`}
                    href={result.href}
                    role="option"
                    aria-selected="false"
                    onClick={() => setSearchQuery('')}
                    className="block border-b border-slate-100 px-3.5 py-2.5 last:border-0 hover:bg-[#F3F8F5] focus-visible:bg-[#F3F8F5] focus-visible:outline-none"
                  >
                    <span className="block truncate text-xs font-semibold text-[#0D3B3E]">{result.title}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-500">{result.detail}</span>
                  </Link>
                )) : (
                  <p className="px-3.5 py-3 text-xs text-slate-500">No CMS content found for “{searchQuery.trim()}”.</p>
                )}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {totalNotifications > 0 && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-[#0D3B3E]">Notifications</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    {totalNotifications} new
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pt-1">
                  {totalNotifications === 0 ? (
                    <p className="py-4 text-center text-slate-400 text-xs">No pending notifications</p>
                  ) : (
                    <>
                      {pendingAppointments.map((apt) => (
                        <Link
                          key={apt.id}
                          href="/admin/appointments"
                          onClick={() => setShowNotifications(false)}
                          className="block py-2 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                        >
                          <p className="font-bold text-slate-800 truncate">
                            New Consultation: {apt.client_name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {apt.date} · {apt.time_slot}
                          </p>
                        </Link>
                      ))}
                      {newApplications.map((app) => (
                        <Link
                          key={app.id}
                          href="/admin/applications"
                          onClick={() => setShowNotifications(false)}
                          className="block py-2 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                        >
                          <p className="font-bold text-slate-800 truncate">
                            CV: {app.applicant_name}
                          </p>
                          <p className="text-[10px] text-slate-500">{app.vacancy_title}</p>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="hidden sm:flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-xl hover:bg-[#F1F6F4] transition-colors">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0C4A4E] text-white font-bold text-[11px] shadow-xs ring-2 ring-[#EAF6F0]">
              <span>NA</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-semibold text-[#0D3B3E] leading-tight">
                Narahari Adhikari
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-7 bg-slate-200" />

          {/* View Public Website */}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            title="View Public Website"
          >
            <span>View Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#1A8F4B]" />
          </Link>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isSigningOut ? '...' : 'Sign out'}</span>
          </button>
        </div>
      </div>
      {error && <p role="status" className="pb-2 text-xs text-red-700">{error}</p>}
    </header>
  );
}
