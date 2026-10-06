'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ArrowRight, BookOpen, Building2, CalendarDays, Clock3, ExternalLink,
  FileText, FolderOpen, Megaphone, Plus, Users,
} from 'lucide-react';

const dateLabel = (value?: string) => {
  if (!value) return 'Date not set';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
};

export default function AdminDashboardPage() {
  const {
    settings, taxUpdates, blogPosts, applications, appointments, vacancies, services,
    downloads, toggleCareers, updateAppointmentStatus,
  } = useApp();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const pendingAppointments = appointments.filter((item) => item.status === 'pending');
  const publishedArticles = blogPosts.filter((item) => item.status === 'published');
  const publishedUpdates = taxUpdates.filter((item) => item.status === 'published');
  const newApplications = applications.filter((item) => item.status === 'new');
  const activeVacancies = vacancies.filter((item) => item.is_active).length;
  const metrics = [
    { label: 'Inquiries', value: appointments.length, note: `${pendingAppointments.length} need a response`, href: '/admin/appointments', icon: CalendarDays, theme: 'emerald' },
    { label: 'Articles', value: publishedArticles.length, note: `${blogPosts.length - publishedArticles.length} drafts`, href: '/admin/blog', icon: BookOpen, theme: 'blue' },
    { label: 'Updates', value: publishedUpdates.length, note: 'Published notices', href: '/admin/updates', icon: FileText, theme: 'violet' },
    { label: 'Services', value: services.length, note: 'Practice areas', href: '/admin/services', icon: Building2, theme: 'cyan' },
    { label: 'CV Vault', value: applications.length, note: `${newApplications.length} new applications`, href: '/admin/applications', icon: Users, theme: 'amber' },
    { label: 'Downloads', value: downloads.length, note: 'Forms and resources', href: '/admin/resources', icon: FolderOpen, theme: 'rose' },
  ] as const;

  const shortcuts = [
    { label: 'Publish an update', href: '/admin/updates', icon: Plus, detail: 'Share a circular or notice' },
    { label: 'Edit articles', href: '/admin/blog', icon: BookOpen, detail: 'Manage insights and posts' },
    { label: 'Manage services', href: '/admin/services', icon: Building2, detail: 'Update practice areas' },
    { label: 'Review applications', href: '/admin/applications', icon: Users, detail: `${newApplications.length} new to review` },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <section className="flex flex-col gap-6 rounded-2xl border border-[#E2ECE6] bg-white px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-8">
        <div className="max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#168A4A]">
            <span className="size-2 rounded-full bg-[#2CBC63]" /> ICAN Reg. No. 1024/2078
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">{greeting}, CA Narahari Adhikari</h2>
          <p className="mt-2 text-sm leading-6 text-[#56686A]">Your central workspace for consultations, practice updates, and website content.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] transition-colors hover:bg-[#F5FAF7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168A4A]">
            View Website <ExternalLink aria-hidden="true" className="size-4 text-[#168A4A]" />
          </Link>
          <Link href="/admin/updates" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#083D3F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168A4A]">
            <Plus aria-hidden="true" className="size-4 text-[#65D99A]" /> Publish Update
          </Link>
        </div>
      </section>

      <section aria-label="CMS overview" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {metrics.map(({ label, value, note, href, icon: Icon, theme }) => {
          const themes = {
            emerald: 'bg-[#EAF8F1] text-[#149553]', blue: 'bg-[#EAF3FF] text-[#2877D2]',
            violet: 'bg-[#F3ECFF] text-[#8552D6]', cyan: 'bg-[#E7F9FB] text-[#0E91A5]',
            amber: 'bg-[#FFF5DE] text-[#C6810A]', rose: 'bg-[#FFF0F2] text-[#D55769]',
          };
          return (
            <Link key={label} href={href} className="group min-h-[142px] rounded-2xl border border-[#E5ECE8] bg-white p-4 transition-colors hover:border-[#B9D8C7] hover:bg-[#FCFEFD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168A4A] sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#607174] sm:text-[11px]">{label}</span>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${themes[theme]}`}><Icon aria-hidden="true" className="size-4" /></span>
              </div>
              <span className="mt-3 block text-2xl font-bold tabular-nums text-[#073E43]">{value}</span>
              <span className="mt-1 block truncate text-[10px] text-[#627477] sm:text-[11px]">{note}</span>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white xl:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECF1EE] px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-sm font-bold text-[#103F40]">Consultation requests</h3>
              <p className="mt-1 text-xs text-[#66797A]">{pendingAppointments.length ? `${pendingAppointments.length} waiting for a response` : 'You are up to date'}</p>
            </div>
            <Link href="/admin/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-[#14864B] hover:underline">Open inbox <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
          </div>
          {appointments.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <CalendarDays aria-hidden="true" className="mx-auto size-8 text-[#86B99A]" />
              <p className="mt-3 text-sm font-semibold text-[#314E4E]">No requests yet</p>
              <p className="mt-1 text-xs text-[#718181]">New website consultations will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F3F1]">
              {appointments.slice(0, 4).map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EAF7F0] text-xs font-bold text-[#147448]">{item.client_name.slice(0, 1).toUpperCase()}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#163F40]">{item.client_name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-[#718181]">{item.service_title} · {dateLabel(item.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.status === 'pending' ? 'bg-[#FFF4DF] text-[#98610D]' : item.status === 'confirmed' ? 'bg-[#EAF7F0] text-[#177449]' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span>
                    {item.status === 'pending' && <button type="button" onClick={() => updateAppointmentStatus(item.id, 'confirmed')} className="rounded-lg border border-[#D9E8DF] px-2.5 py-1 text-[10px] font-semibold text-[#177449] transition-colors hover:bg-[#EAF7F0] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#168A4A]">Confirm</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5 xl:col-span-5">
          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#728481]">Practice status</p>
                <h3 className="mt-1 text-sm font-bold text-[#103F40]">Recruitment portal</h3>
                <p className="mt-1 text-xs text-[#66797A]">{activeVacancies} active {activeVacancies === 1 ? 'vacancy' : 'vacancies'} · {newApplications.length} new applications</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${settings.careers_enabled ? 'bg-[#EAF7F0] text-[#177449]' : 'bg-slate-100 text-slate-600'}`}>{settings.careers_enabled ? 'OPEN' : 'CLOSED'}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#ECF1EE] pt-4">
              <button type="button" onClick={() => toggleCareers()} className={`min-h-9 rounded-lg px-3 text-xs font-semibold text-white transition-colors ${settings.careers_enabled ? 'bg-[#A53D48] hover:bg-[#8F303A]' : 'bg-[#168A4A] hover:bg-[#117740]'}`}>
                {settings.careers_enabled ? 'Close careers portal' : 'Open careers portal'}
              </button>
              <Link href="/admin/careers" className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-[#DCE7E1] px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7]">Manage vacancies <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#728481]">Shortcuts</p>
                <h3 className="mt-1 text-sm font-bold text-[#103F40]">Content workspace</h3>
              </div>
              <Megaphone aria-hidden="true" className="size-5 text-[#17884D]" />
            </div>
            <div className="mt-3 divide-y divide-[#EEF2EF]">
              {shortcuts.map(({ label, href, icon: Icon, detail }) => (
                <Link key={label} href={href} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF8F2] text-[#18844B]"><Icon aria-hidden="true" className="size-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-[#244647]">{label}</span><span className="mt-0.5 block truncate text-[10px] text-[#758584]">{detail}</span></span>
                  <ArrowRight aria-hidden="true" className="size-4 text-[#91A39A]" />
                </Link>
              ))}
              <Link href="/admin/announcements" className="flex items-center gap-3 border-t border-[#EEF2EF] py-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E5] text-[#BF780D]"><Megaphone aria-hidden="true" className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-[#244647]">Announcement banner</span><span className="mt-0.5 block text-[10px] text-[#758584]">{settings.announcement_active ? 'Currently visible on the website' : 'Currently turned off'}</span></span>
                <ArrowRight aria-hidden="true" className="size-4 text-[#91A39A]" />
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2ECE6] bg-white px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#F0F7F3] text-[#17884D]"><Clock3 aria-hidden="true" className="size-4" /></span>
            <div><h3 className="text-xs font-bold text-[#244647]">Recent publishing activity</h3><p className="mt-0.5 text-[10px] text-[#758584]">Quick access to your latest website content</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/blog" className="rounded-lg border border-[#E0E9E3] px-3 py-2 text-[11px] font-semibold text-[#315253] hover:bg-[#F7FAF8]">Articles <span className="ml-1 text-[#168A4A]">{publishedArticles.length}</span></Link>
            <Link href="/admin/updates" className="rounded-lg border border-[#E0E9E3] px-3 py-2 text-[11px] font-semibold text-[#315253] hover:bg-[#F7FAF8]">Updates <span className="ml-1 text-[#168A4A]">{publishedUpdates.length}</span></Link>
            <Link href="/admin/resources" className="rounded-lg border border-[#E0E9E3] px-3 py-2 text-[11px] font-semibold text-[#315253] hover:bg-[#F7FAF8]">Resources <span className="ml-1 text-[#168A4A]">{downloads.length}</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
