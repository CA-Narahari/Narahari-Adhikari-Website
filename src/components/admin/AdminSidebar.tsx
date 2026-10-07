'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  BookOpen,
  Building2,
  Megaphone,
  Landmark,
  Calendar,
  UserSearch,
  Briefcase,
  Sliders,
  Users,
  Mail,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

type AdminSidebarProps = {
  mobileOpen: boolean;
  onNavigate: () => void;
  role: 'admin' | 'staff' | null;
};

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar({ mobileOpen, onNavigate, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const { applications, appointments } = useApp();

  const newApplications = applications.filter((application) => application.status === 'new').length;
  const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending').length;

  // Sidebar Sections matching EXACTLY the requested structure (Office hours removed)
  const navSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutGrid },
      ],
    },
    {
      title: 'WEBSITE CONTENT',
      items: [
        { name: 'Updates', href: '/admin/updates', icon: FileText },
        { name: 'Articles', href: '/admin/blog', icon: BookOpen },
        { name: 'Services', href: '/admin/services', icon: Building2 },
        { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        { name: 'Resources & links', href: '/admin/resources', icon: Landmark },
      ],
    },
    {
      title: 'PRACTICE',
      items: [
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar, count: pendingAppointments },
        { name: 'Website enquiries', href: '/admin/messages', icon: Mail },
        { name: 'Job applications', href: '/admin/applications', icon: UserSearch, count: newApplications },
        { name: 'Careers', href: '/admin/careers', icon: Briefcase },
      ],
    },
    {
      title: 'CONFIGURATION',
      items: [
        { name: 'Site settings', href: '/admin/settings', icon: Sliders },
        { name: 'Staff access', href: '/admin/users', icon: Users },
      ],
    },
  ];

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#023A51]/30 backdrop-blur-xs md:hidden cursor-pointer"
          aria-label="Close navigation menu"
          onClick={onNavigate}
        />
      )}
      <aside
        data-role={role ?? undefined}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] shrink-0 flex-col border-r border-[#E6EFEA] bg-white text-[#1E293B] shadow-xl md:shadow-none transition-transform duration-200 md:sticky md:top-0 md:z-20 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="CMS navigation"
      >
        {/* Top Brand Header */}
        <div className="flex h-[70px] items-center justify-between border-b border-[#EAF1ED] px-5 bg-white shrink-0">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] duration-150"
            title="Narahari Adhikari Chartered Accountants"
          >
            <Image
              src="/Logo.png"
              alt="Narahari Adhikari Chartered Accountants"
              width={175}
              height={42}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden cursor-pointer"
            onClick={onNavigate}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {navSections.map((section) => (
            <section key={section.title} aria-label={section.title} className="space-y-1">
              <h2 className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#82999B]">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-10 items-center justify-between gap-3 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all ${
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
            </section>
          ))}
        </div>

        {/* Bottom Branding */}
        <div className="border-t border-[#EAF1ED] px-5 py-3 bg-[#FAFDFB] shrink-0">
          <p className="text-[10px] font-medium text-[#82999B] leading-relaxed">
            Narahari Adhikari &amp; Co.<br />
            Chartered Accountants
          </p>
        </div>
      </aside>
    </>
  );
}
