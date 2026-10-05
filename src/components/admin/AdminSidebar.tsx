'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PenLine,
  FolderOpen,
  Mail,
  Users,
  Settings,
  ReceiptText,
  Briefcase,
  Megaphone,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

type AdminSidebarProps = {
  mobileOpen: boolean;
  onNavigate: () => void;
  role: 'admin' | 'staff' | null;
};

export default function AdminSidebar({ mobileOpen, onNavigate, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const { applications, appointments } = useApp();

  const newApplications = applications.filter((application) => application.status === 'new').length;
  const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending').length;

  const mainNav: { name: string; href: string; icon: LucideIcon; count?: number }[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pages', href: '/admin/services', icon: FileText },
    { name: 'Blog / Updates', href: '/admin/blog', icon: PenLine },
    { name: 'Media', href: '/admin/resources', icon: FolderOpen },
    { name: 'Contact Inquiries', href: '/admin/appointments', icon: Mail, count: pendingAppointments },
    ...(role === 'admin' ? [{ name: 'Staff Management', href: '/admin/users', icon: Users }] : []),
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const secondaryNav: { name: string; href: string; icon: LucideIcon; count?: number }[] = [
    { name: 'Tax Updates', href: '/admin/tax-updates', icon: ReceiptText },
    { name: 'Job Applications', href: '/admin/applications', icon: Users, count: newApplications },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Office Hours', href: '/admin/office-hours', icon: Clock },
  ];

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#023A51]/30 backdrop-blur-xs md:hidden"
          aria-label="Close navigation menu"
          onClick={onNavigate}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] shrink-0 flex-col border-r border-[#E6EFEA] bg-white text-[#1E293B] shadow-xl md:shadow-none transition-transform duration-200 md:sticky md:top-0 md:z-20 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="CMS navigation"
      >
        {/* Top Brand Header */}
        <div className="flex h-[80px] items-center justify-between border-b border-[#EAF1ED] px-5 bg-white">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] duration-150"
            title="Narahari Adhikari Chartered Accountants"
          >
            <Image
              src="/Logo.png"
              alt="Narahari Adhikari Chartered Accountants"
              width={190}
              height={48}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden"
            onClick={onNavigate}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
          {/* Main Primary Links */}
          <nav aria-label="Main menu">
            <ul className="space-y-1.5">
              {mainNav.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-10 items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                        active
                          ? 'bg-[#EAF6F0] text-[#0C4A4E] shadow-2xs font-bold'
                          : 'text-[#4E6266] hover:bg-[#F3F8F5] hover:text-[#0C4A4E]'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            active ? 'text-[#1A8F4B]' : 'text-[#6C8286]'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{link.name}</span>
                      </span>
                      {link.count !== undefined && link.count > 0 && (
                        <span
                          className={`min-w-5 rounded-full px-2 py-0.5 text-center text-[10px] font-bold tabular-nums ${
                            active
                              ? 'bg-[#1A8F4B] text-white'
                              : 'bg-[#E7F6EC] text-[#16723B]'
                          }`}
                        >
                          {link.count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Secondary Operational Links */}
          <section aria-label="Firm sections" className="pt-2 border-t border-[#EEF4F0]">
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#82999B]">
              More Content
            </h2>
            <ul className="space-y-1">
              {secondaryNav.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-9 items-center justify-between gap-3 rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                        active
                          ? 'bg-[#EAF6F0] text-[#0C4A4E] font-bold'
                          : 'text-[#5A6E72] hover:bg-[#F3F8F5] hover:text-[#0C4A4E]'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${
                            active ? 'text-[#1A8F4B]' : 'text-[#7D9497]'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{link.name}</span>
                      </span>
                      {link.count !== undefined && link.count > 0 && (
                        <span className="min-w-4 rounded-full px-1.5 py-0.2 text-center text-[10px] font-bold bg-[#E7F6EC] text-[#16723B]">
                          {link.count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Bottom Sidebar Brand Watermark (Matching Image 2) */}
        <div className="relative overflow-hidden border-t border-[#EAF1ED] p-4 bg-[#FAFDFB]">
          {/* Subtle decorative monogram watermark */}
          <div className="absolute -bottom-3 -right-2 pointer-events-none opacity-[0.08] select-none text-[#1A8F4B]">
            <svg width="90" height="90" viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 80 L35 20 L50 20 L50 80 L38 80 L38 42 L22 80 Z" />
              <path d="M55 80 L75 20 L90 80 L78 80 L73 64 L62 64 L57 80 Z M64 54 L71 54 L67.5 42 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-1 text-left">
            <p className="text-xs font-extrabold text-[#0D3B3E] leading-snug">
              Accuracy Builds
              <br />
              Trust.
            </p>
            <p className="text-[10.5px] text-[#698083] font-medium leading-tight pt-1">
              Narahari Adhikari
              <br />
              Chartered Accountants
            </p>

            <div className="pt-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1A8F4B] hover:text-[#127038] transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
