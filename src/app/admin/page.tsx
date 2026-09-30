'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  BriefcaseBusiness,
  CircleCheck,
  Clock3,
  Plus,
  ReceiptText,
  UsersRound,
} from 'lucide-react';

const formatDate = (value?: string) => {
  if (!value) return 'Date not set';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return 'Date not set';
  return new Intl.DateTimeFormat('en-NP', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export default function AdminDashboardPage() {
  const { taxUpdates, blogPosts, applications, appointments, vacancies } = useApp();

  const newApplications = applications.filter((application) => application.status === 'new');
  const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending');
  const publishedTaxUpdates = taxUpdates.filter((update) => update.status === 'published').length;
  const publishedArticles = blogPosts.filter((post) => post.status === 'published').length;
  const draftCount = taxUpdates.filter((update) => update.status === 'draft').length + blogPosts.filter((post) => post.status === 'draft').length;
  const activeVacancies = vacancies.filter((vacancy) => vacancy.is_active).length;

  const metrics = [
    { label: 'Appointments to review', value: pendingAppointments.length, helper: 'Awaiting a reply', href: '/admin/appointments', icon: CalendarDays, tone: 'green' },
    { label: 'New applications', value: newApplications.length, helper: 'Need an initial review', href: '/admin/applications', icon: UsersRound, tone: 'blue' },
    { label: 'Published articles', value: publishedArticles, helper: `${publishedTaxUpdates} tax updates live`, href: '/admin/blog', icon: FileText, tone: 'mint' },
    { label: 'Draft content', value: draftCount, helper: `${activeVacancies} active vacancies`, href: '/admin/tax-updates', icon: ReceiptText, tone: 'amber' },
  ] as const;

  return (
    <div className="mx-auto max-w-[1280px] space-y-7">
      <section className="flex flex-col gap-5 border-b border-[#DDE6E3] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#258E50]">Practice workspace</p>
          <h1 className="mt-2 text-[27px] font-bold tracking-tight text-[#023A51] sm:text-3xl">Your website and enquiries, at a glance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59667D]">Review the latest requests, keep useful information up to date, and publish when it is ready.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blog" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2CBC63] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#25A456]">
            <Plus className="h-4 w-4" aria-hidden="true" /> New article
          </Link>
          <Link href="/admin/tax-updates" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D7E1DE] bg-white px-4 text-xs font-semibold text-[#33475B] hover:bg-[#F8FBFA]">
            <ReceiptText className="h-4 w-4 text-[#258E50]" aria-hidden="true" /> Add tax update
          </Link>
        </div>
      </section>

      <section aria-label="Practice overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const iconClass = metric.tone === 'amber' ? 'bg-[#FFF5E6] text-[#A85F00]' : metric.tone === 'blue' ? 'bg-[#EAF2F7] text-[#285E79]' : 'bg-[#E7F6EC] text-[#21844A]';
          return (
            <Link key={metric.label} href={metric.href} className="group rounded-xl border border-[#E0E8E5] bg-white p-4 shadow-[0_1px_2px_rgba(2,58,81,0.03)] transition-colors hover:border-[#B9D9C6] hover:bg-[#FCFEFD] sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#59667D]">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold leading-none tabular-nums text-[#023A51]">{metric.value}</p>
                </div>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#EEF2F0] pt-3">
                <span className="text-[11px] text-[#718087]">{metric.helper}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#8C9A9F] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#21844A]" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
        <section className="overflow-hidden rounded-xl border border-[#E0E8E5] bg-white shadow-[0_1px_2px_rgba(2,58,81,0.03)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E9EFEC] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#023A51]">Appointments to review</h2>
              <p className="mt-1 text-xs text-[#718087]">Recent requests from the website</p>
            </div>
            <Link href="/admin/appointments" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A7D43] hover:text-[#023A51]">All appointments <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>

          {pendingAppointments.length === 0 ? (
            <div className="px-5 py-9 text-center">
              <CircleCheck className="mx-auto h-6 w-6 text-[#55A875]" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-[#33475B]">You’re up to date</p>
              <p className="mt-1 text-xs text-[#718087]">New consultation requests will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#EEF2F0]">
              {pendingAppointments.slice(0, 5).map((appointment) => (
                <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#023A51]">{appointment.client_name}</p>
                    <p className="mt-1 truncate text-xs text-[#718087]">{appointment.service_title || 'Consultation'} · {appointment.time_slot}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#59667D]">
                    <Clock3 className="h-3.5 w-3.5 text-[#87969A]" aria-hidden="true" />
                    <span>{formatDate(appointment.date)}</span>
                    <span className="rounded-full bg-[#FFF5E6] px-2 py-1 text-[10px] font-semibold text-[#96600B]">Pending</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-[#E0E8E5] bg-white shadow-[0_1px_2px_rgba(2,58,81,0.03)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E9EFEC] px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-[#023A51]">Applications to review</h2>
              <p className="mt-1 text-xs text-[#718087]">New submissions for open roles</p>
            </div>
            <Link href="/admin/applications" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A7D43] hover:text-[#023A51]">View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>

          {newApplications.length === 0 ? (
            <div className="px-5 py-9 text-center">
              <UsersRound className="mx-auto h-6 w-6 text-[#8C9A9F]" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-[#33475B]">No new applications</p>
              <p className="mt-1 text-xs text-[#718087]">New applicants will show here when roles are open.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#EEF2F0]">
              {newApplications.slice(0, 4).map((application) => (
                <li key={application.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#023A51]">{application.applicant_name}</p>
                    <p className="mt-1 truncate text-xs text-[#718087]">{application.vacancy_title || 'Job application'}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#EAF2F7] px-2.5 py-1 text-[10px] font-semibold text-[#285E79]">New</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-[#E0E8E5] bg-white shadow-[0_1px_2px_rgba(2,58,81,0.03)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E9EFEC] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#023A51]">Publishing overview</h2>
            <p className="mt-1 text-xs text-[#718087]">Content shown on the public website</p>
          </div>
          <Link href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A7D43] hover:text-[#023A51]">Open public website <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-1 divide-y divide-[#EEF2F0] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Link href="/admin/blog" className="group flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#FAFCFB]">
            <span className="flex items-center gap-3"><BookOpenTextIcon /><span><span className="block text-sm font-semibold text-[#33475B]">Articles</span><span className="mt-1 block text-xs text-[#718087]">{publishedArticles} published · {blogPosts.length - publishedArticles} draft</span></span></span>
            <ArrowRight className="h-4 w-4 text-[#92A0A4] group-hover:text-[#1A7D43]" aria-hidden="true" />
          </Link>
          <Link href="/admin/tax-updates" className="group flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#FAFCFB]">
            <span className="flex items-center gap-3"><ReceiptText className="h-4 w-4 text-[#258E50]" aria-hidden="true" /><span><span className="block text-sm font-semibold text-[#33475B]">Tax updates</span><span className="mt-1 block text-xs text-[#718087]">{publishedTaxUpdates} published · {taxUpdates.length - publishedTaxUpdates} draft</span></span></span>
            <ArrowRight className="h-4 w-4 text-[#92A0A4] group-hover:text-[#1A7D43]" aria-hidden="true" />
          </Link>
          <Link href="/admin/careers" className="group flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#FAFCFB]">
            <span className="flex items-center gap-3"><BriefcaseBusiness className="h-4 w-4 text-[#258E50]" aria-hidden="true" /><span><span className="block text-sm font-semibold text-[#33475B]">Careers</span><span className="mt-1 block text-xs text-[#718087]">{activeVacancies} active {activeVacancies === 1 ? 'role' : 'roles'}</span></span></span>
            <ArrowRight className="h-4 w-4 text-[#92A0A4] group-hover:text-[#1A7D43]" aria-hidden="true" />
          </Link>
        </div>
      </section>

    </div>
  );
}

function BookOpenTextIcon() {
  return <FileText className="h-4 w-4 text-[#258E50]" aria-hidden="true" />;
}
