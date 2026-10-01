'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  BookOpenText,
  BriefcaseBusiness,
  UsersRound,
  Building2,
  Megaphone,
  Landmark,
  CalendarDays,
  Clock3,
  Settings2,
  UserPlus,
  ExternalLink,
  X,
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

  const groups: { label: string; links: { name: string; href: string; icon: LucideIcon; count?: number }[] }[] = [
    {
      label: 'Workspace',
      links: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
      label: 'Website content',
      links: [
        { name: 'Tax updates', href: '/admin/tax-updates', icon: ReceiptText },
        { name: 'Articles', href: '/admin/blog', icon: BookOpenText },
        { name: 'Services', href: '/admin/services', icon: Building2 },
        { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        { name: 'Resources & links', href: '/admin/resources', icon: Landmark },
      ],
    },
    {
      label: 'Practice',
      links: [
        { name: 'Appointments', href: '/admin/appointments', icon: CalendarDays, count: pendingAppointments },
        { name: 'Job applications', href: '/admin/applications', icon: UsersRound, count: newApplications },
        { name: 'Careers', href: '/admin/careers', icon: BriefcaseBusiness },
        { name: 'Office hours', href: '/admin/office-hours', icon: Clock3 },
      ],
    },
    {
      label: 'Configuration',
      links: [
        { name: 'Site settings', href: '/admin/settings', icon: Settings2 },
        ...(role === 'admin' ? [{ name: 'Staff access', href: '/admin/users', icon: UserPlus }] : []),
      ],
    },
  ];

  const isActive = (href: string) => href === '/admin' ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#023A51]/35 md:hidden"
          aria-label="Close navigation menu"
          onClick={onNavigate}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[272px] shrink-0 flex-col border-r border-white/10 bg-[#023A51] text-white shadow-xl transition-transform duration-200 md:sticky md:top-0 md:z-20 md:translate-x-0 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="CMS navigation"
      >
        <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-4">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-xs transition-opacity hover:opacity-95"
            title="Narahari Adhikari Chartered Accountants"
          >
            <Image
              src="/Logo.png"
              alt="Narahari Adhikari Chartered Accountants"
              width={180}
              height={45}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button type="button" className="rounded-lg p-2 text-white/75 hover:bg-white/10 md:hidden" onClick={onNavigate} aria-label="Close navigation">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5" aria-label="Main menu">
          {groups.map((group) => (
            <section key={group.label} className="mb-6 last:mb-0" aria-label={group.label}>
              <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{group.label}</h2>
              <ul className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2CBC63] ${active ? 'bg-white text-[#023A51] shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#1A8F4B]' : 'text-white/65'}`} aria-hidden="true" />
                          <span className="truncate">{link.name}</span>
                        </span>
                        {link.count !== undefined && link.count > 0 && (
                          <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold tabular-nums ${active ? 'bg-[#E7F6EC] text-[#16723B]' : 'bg-white/15 text-white'}`}>
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
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-10 items-center justify-between rounded-lg border border-white/15 px-3 text-xs font-semibold text-white/90 transition-colors hover:border-white/30 hover:bg-white/10"
          >
            <span>View public website</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#78D59A]" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-center text-[10px] text-white/45">Practice content &amp; enquiries</p>
        </div>
      </aside>
    </>
  );
}
