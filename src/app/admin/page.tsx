'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  ReceiptText,
  UsersRound,
  CalendarDays,
  BriefcaseBusiness,
  Plus,
  Megaphone,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
  Settings2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const {
    settings,
    taxUpdates,
    blogPosts,
    applications,
    appointments,
    vacancies,
    toggleCareers,
  } = useApp();

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const activeVacancies = vacancies.filter((v) => v.is_active).length;
  const newApplications = applications.filter((a) => a.status === 'new');
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const publishedTaxUpdates = taxUpdates.filter((t) => t.status === 'published').length;
  const publishedBlogs = blogPosts.filter((b) => b.status === 'published').length;

  const formatDate = (val?: string) => {
    if (!val) return 'Recently';
    const d = new Date(val.length === 10 ? `${val}T00:00:00` : val);
    if (Number.isNaN(d.getTime())) return val;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  };

  return (
    <div className="space-y-8 max-w-[1360px] mx-auto pb-12">
      {/* 1. Brand Welcome Banner with Site Logo */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Authentic Site Logo in branded card */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm shrink-0 flex items-center justify-center">
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari Chartered Accountants"
                width={220}
                height={55}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E7F6EC] text-[#16723B] text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2CBC63]" />
                  <span>Licensed CA Firm Portal</span>
                </span>
                <span className="text-xs text-[#7A889B] font-medium hidden sm:inline">•</span>
                <span className="text-xs text-[#59667D] font-medium hidden sm:inline">Kathmandu, Nepal</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                {greeting}, Admin 👋
              </h1>

              <p className="text-xs sm:text-sm text-[#59667D] leading-relaxed max-w-2xl">
                Welcome to the central management portal for <strong>{settings.company_name}</strong>. Manage statutory publications, client consultations, applicant CVs, and site configuration.
              </p>
            </div>
          </div>

          {/* Quick Actions Header CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#023A51] hover:bg-slate-50 transition-colors shadow-xs"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#2CBC63]" />
            </Link>

            <Link
              href="/admin/tax-updates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2CBC63] hover:bg-[#25A456] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Tax Article</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Actions Strip matching architecture.png */}
      <section className="bg-gradient-to-r from-[#023A51] to-[#0A4B67] rounded-2xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#2CBC63]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Quick Actions</h2>
              <p className="text-[11px] text-slate-300">Jump directly into firm operations</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/tax-updates"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Plus className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Add Tax Article</span>
            </Link>

            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <BriefcaseBusiness className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Post Vacancy</span>
            </Link>

            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <FileText className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Publish Blog</span>
            </Link>

            <Link
              href="/admin/announcements"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Alert Banner</span>
            </Link>

            <Link
              href="/admin/office-hours"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Clock className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Office Hours</span>
            </Link>

            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Site Settings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Four Core Metric Cards (Matching agent.md / architecture.png) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Tax Articles */}
        <Link
          href="/admin/tax-updates"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#2CBC63] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#59667D] uppercase tracking-wider block">
                Tax Articles & Circulars
              </span>
              <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                {taxUpdates.length}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#16723B] flex items-center justify-center shrink-0 group-hover:bg-[#2CBC63] group-hover:text-white transition-colors">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#16723B] font-semibold">{publishedTaxUpdates} Published & Live</span>
            <span className="font-bold text-[#023A51] group-hover:text-[#2CBC63] inline-flex items-center gap-1">
              Manage &rarr;
            </span>
          </div>
        </Link>

        {/* Metric 2: Job Applications */}
        <Link
          href="/admin/applications"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#2CBC63] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#59667D] uppercase tracking-wider block">
                Job Applications & CVs
              </span>
              <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                {applications.length}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <UsersRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold">{newApplications.length} Awaiting Review</span>
            <span className="font-bold text-[#023A51] group-hover:text-[#2CBC63] inline-flex items-center gap-1">
              CV Vault &rarr;
            </span>
          </div>
        </Link>

        {/* Metric 3: Client Appointments */}
        <Link
          href="/admin/appointments"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#2CBC63] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#59667D] uppercase tracking-wider block">
                Client Appointments
              </span>
              <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                {appointments.length}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center shrink-0 group-hover:bg-[#B45309] group-hover:text-white transition-colors">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold">{pendingAppointments.length} Pending Review</span>
            <span className="font-bold text-[#023A51] group-hover:text-[#2CBC63] inline-flex items-center gap-1">
              Calendar &rarr;
            </span>
          </div>
        </Link>

        {/* Metric 4: Vacancies & Careers Toggle */}
        <Link
          href="/admin/careers"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#2CBC63] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#59667D] uppercase tracking-wider block">
                Careers & Vacancies
              </span>
              <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                {activeVacancies}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#7E22CE] flex items-center justify-center shrink-0 group-hover:bg-[#7E22CE] group-hover:text-white transition-colors">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className={`font-semibold ${settings.careers_enabled ? 'text-[#16723B]' : 'text-slate-500'}`}>
              Hiring: {settings.careers_enabled ? 'Active (ON)' : 'Closed (OFF)'}
            </span>
            <span className="font-bold text-[#023A51] group-hover:text-[#2CBC63] inline-flex items-center gap-1">
              Manage &rarr;
            </span>
          </div>
        </Link>
      </section>

      {/* 4. Live Master Hiring Switch Control Card */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]">
              Public Website Recruitment Window:
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                settings.careers_enabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.careers_enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{settings.careers_enabled ? 'HIRING OPEN (ON)' : 'HIRING CLOSED (OFF)'}</span>
            </span>
          </div>
          <p className="text-xs text-[#59667D] leading-relaxed max-w-2xl">
            {settings.careers_enabled
              ? 'The "Careers" link is visible in the public navbar. Prospective trainees and accountants can view vacancies and submit CVs.'
              : 'The "Careers" link is hidden from the public navbar. Visitors accessing the route directly will see a closed window notice.'}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleCareers()}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
              settings.careers_enabled
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#2CBC63] hover:bg-[#25A456] text-white'
            }`}
          >
            {settings.careers_enabled ? 'Close Hiring Window' : 'Open Hiring Window'}
          </button>

          <Link
            href="/admin/careers"
            className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#023A51] transition-colors"
          >
            Manage Openings &rarr;
          </Link>
        </div>
      </section>

      {/* 5. Core Operational Splits (Appointments & Job Applications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Consultations */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#023A51]">
                  Recent Consultation Requests
                </h2>
                <p className="text-xs text-[#59667D] mt-0.5">
                  Clients requesting statutory audit, tax advice, or office meetings
                </p>
              </div>

              <Link
                href="/admin/appointments"
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] inline-flex items-center gap-1"
              >
                <span>View All ({appointments.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingAppointments.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#2CBC63] mx-auto" />
                <p className="text-sm font-bold text-[#023A51]">All Consultation Requests Handled</p>
                <p className="text-xs text-[#7A889B]">New client bookings from the public site will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingAppointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="p-5 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#023A51] truncate">{apt.client_name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-[#59667D] truncate">
                        {apt.service_title || 'General Advisory'} • {apt.consultation_type || 'Office Meeting'}
                      </p>
                      <p className="text-[11px] text-[#7A889B]">
                        Requested for: <strong className="text-[#023A51]">{apt.date} ({apt.time_slot})</strong>
                      </p>
                    </div>

                    <Link
                      href="/admin/appointments"
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#023A51] hover:bg-white hover:border-[#2CBC63] hover:text-[#2CBC63] transition-all shrink-0 shadow-2xs"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center">
            <Link
              href="/admin/appointments"
              className="text-xs font-semibold text-[#59667D] hover:text-[#023A51]"
            >
              Open Appointment Calendar &rarr;
            </Link>
          </div>
        </section>

        {/* Right: Candidate Applications */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#023A51]">
                  Recent Job Applications
                </h2>
                <p className="text-xs text-[#59667D] mt-0.5">
                  Submissions with uploaded candidate CVs
                </p>
              </div>

              <Link
                href="/admin/applications"
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] inline-flex items-center gap-1"
              >
                <span>CV Vault ({applications.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <UsersRound className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-[#023A51]">No Applications Yet</p>
                <p className="text-xs text-[#7A889B]">When recruitment is open, candidate submissions show here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="p-5 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#023A51] truncate">{app.applicant_name}</span>
                        {app.status === 'new' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#59667D] truncate">
                        Position: <strong>{app.vacancy_title || 'General Trainee'}</strong>
                      </p>
                      <p className="text-[11px] text-[#7A889B]">
                        Submitted {formatDate(app.submitted_at)}
                      </p>
                    </div>

                    <Link
                      href="/admin/applications"
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#023A51] hover:bg-white hover:border-[#2CBC63] hover:text-[#2CBC63] transition-all shrink-0 shadow-2xs"
                    >
                      View CV
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center">
            <Link
              href="/admin/applications"
              className="text-xs font-semibold text-[#59667D] hover:text-[#023A51]"
            >
              Open Complete CV Vault &rarr;
            </Link>
          </div>
        </section>
      </div>

      {/* 6. Recent Practice Activity Feed matching Ideas/architecture.png */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-[#023A51]">
              Live Practice Activity Feed
            </h2>
            <p className="text-xs text-[#59667D] mt-0.5">
              Chronological log of website actions, publications, and client submissions
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider bg-[#E7F6EC] px-3 py-1 rounded-full">
            Realtime System
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Tax Notice Published</span>
                <span className="text-[11px] text-[#7A889B] shrink-0">Today</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                {taxUpdates[0]?.title || 'New VAT Rules circular published to public portal'}
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Candidate Application</span>
                <span className="text-[11px] text-[#7A889B] shrink-0">Recent</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                {applications[0]
                  ? `New application received from ${applications[0].applicant_name}`
                  : 'Article trainee CV uploaded to CV Vault'}
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Client Consultation</span>
                <span className="text-[11px] text-[#7A889B] shrink-0">Pending</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                {appointments[0]
                  ? `Consultation requested by ${appointments[0].client_name} for ${appointments[0].date}`
                  : 'In-person meeting booked at Kathmandu office'}
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Hiring Switch Status</span>
                <span className="text-[11px] text-[#7A889B] shrink-0">Active</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                Careers portal status: {settings.careers_enabled ? 'Active on public navbar' : 'Hidden from public'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
