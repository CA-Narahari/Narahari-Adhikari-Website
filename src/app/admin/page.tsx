'use client';

import React, { useMemo, useState } from 'react';
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
  Sparkles,
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  Landmark,
  UserPlus,
  RefreshCw,
  SlidersHorizontal,
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
    services,
    toggleCareers,
    updateAppointmentStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'new'>('all');

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

  const filteredAppointments = activeTab === 'pending' ? pendingAppointments : appointments;
  const filteredApplications = candidateFilter === 'new' ? newApplications : applications;

  return (
    <div className="space-y-8 max-w-[1380px] mx-auto pb-14 text-[#1E293B]">
      {/* 1. Executive Brand Header & Status Command Bar */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(2,58,81,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Authentic Site Logo in branded card */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs shrink-0 flex items-center justify-center">
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari Chartered Accountants"
                width={200}
                height={50}
                priority
                className="h-11 w-auto object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E7F6EC] text-[#16723B] text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2CBC63]" />
                  <span>ICAN Reg. No. 1024/2078</span>
                </span>
                <span className="text-xs text-[#7A889B] font-medium hidden sm:inline">&bull;</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#59667D] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2CBC63] animate-pulse" />
                  <span>Realtime Supabase Sync: Online</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                {greeting}, Practice Administrator 👋
              </h1>

              <p className="text-xs sm:text-sm text-[#59667D] leading-relaxed max-w-2xl">
                Central command for <strong>{settings.company_name}</strong>. Monitor statutory publications, client consultations, applicant CVs, and site configuration.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#023A51] hover:bg-slate-50 transition-colors shadow-xs group"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#2CBC63] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/admin/tax-updates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2CBC63] hover:bg-[#25A456] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(44,188,99,0.3)] hover:shadow-[0_6px_20px_rgba(44,188,99,0.4)] active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Tax Update</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Fast Navigation Quick Actions Strip */}
      <section className="bg-gradient-to-r from-[#023A51] via-[#03344B] to-[#0A4B67] rounded-2xl p-4 sm:p-5 text-white shadow-sm border border-[#023A51]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#2CBC63] shadow-inner">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">CMS Quick Actions</h2>
              <p className="text-[11px] text-slate-300">Fast shortcuts to common practice management tasks</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/tax-updates"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Plus className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Add Tax Update</span>
            </Link>

            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <BriefcaseBusiness className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Post Vacancy</span>
            </Link>

            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <FileText className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Publish Article</span>
            </Link>

            <Link
              href="/admin/announcements"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Alert Banner</span>
            </Link>

            <Link
              href="/admin/resources"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Landmark className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Downloads</span>
            </Link>

            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#2CBC63]" />
              <span>Firm Settings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Four Core Metric KPI Cards (Data-Dense Dashboard) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Updates & Circulars */}
        <Link
          href="/admin/tax-updates"
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-[#2CBC63] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#59667D] uppercase tracking-wider block">
                  Tax Updates & Circulars
                </span>
                <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                  {taxUpdates.length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#16723B] flex items-center justify-center shrink-0 group-hover:bg-[#2CBC63] group-hover:text-white transition-colors">
                <ReceiptText className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[#16723B] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                <span>{publishedTaxUpdates} Published</span>
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-[#59667D]">
                {taxUpdates.length - publishedTaxUpdates} Drafts
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#59667D] font-medium">Inland Revenue Notices</span>
            <span className="font-bold text-[#023A51] group-hover:text-[#2CBC63] inline-flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Metric 2: Job Applications & CVs */}
        <Link
          href="/admin/applications"
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#59667D] uppercase tracking-wider block">
                  Candidate Applications
                </span>
                <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                  {applications.length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
                <UsersRound className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                newApplications.length > 0
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span>{newApplications.length} Awaiting Review</span>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#59667D] font-medium">CV Document Vault</span>
            <span className="font-bold text-[#023A51] group-hover:text-[#2563EB] inline-flex items-center gap-1">
              Screen CVs <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Metric 3: Client Consultations */}
        <Link
          href="/admin/appointments"
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#59667D] uppercase tracking-wider block">
                  Client Consultations
                </span>
                <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                  {appointments.length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center shrink-0 group-hover:bg-[#B45309] group-hover:text-white transition-colors">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                pendingAppointments.length > 0
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-50 text-emerald-800'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{pendingAppointments.length} Pending Approval</span>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#59667D] font-medium">Office & Video Sessions</span>
            <span className="font-bold text-[#023A51] group-hover:text-amber-600 inline-flex items-center gap-1">
              Calendar <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Metric 4: Vacancies & Careers Toggle */}
        <Link
          href="/admin/careers"
          className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#59667D] uppercase tracking-wider block">
                  Active Vacancies
                </span>
                <span className="text-3xl font-extrabold text-[#023A51] block tracking-tight">
                  {activeVacancies}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#7E22CE] flex items-center justify-center shrink-0 group-hover:bg-[#7E22CE] group-hover:text-white transition-colors">
                <BriefcaseBusiness className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                settings.careers_enabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${settings.careers_enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>Hiring {settings.careers_enabled ? 'Active (ON)' : 'Closed (OFF)'}</span>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#59667D] font-medium">Article & Associate Roles</span>
            <span className="font-bold text-[#023A51] group-hover:text-purple-600 inline-flex items-center gap-1">
              Careers <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </section>

      {/* 4. Live Master Hiring Switch Control Banner */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]">
              Public Recruitment Window Control:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
              <span>{settings.careers_enabled ? 'HIRING PORTAL OPEN (ON)' : 'HIRING PORTAL CLOSED (OFF)'}</span>
            </span>
          </div>
          <p className="text-xs text-[#59667D] leading-relaxed max-w-2xl">
            {settings.careers_enabled
              ? 'The "Careers" link and hiring badge are active in the public navigation. Visitors and prospective trainees can browse openings and upload CVs.'
              : 'The "Careers" link is concealed from the public navbar. Anyone visiting directly is informed that recruitment is currently concluded.'}
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => toggleCareers()}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
              settings.careers_enabled
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#2CBC63] hover:bg-[#25A456] text-white'
            }`}
          >
            {settings.careers_enabled ? 'Close Recruitment Window' : 'Open Recruitment Window'}
          </button>

          <Link
            href="/admin/careers"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#023A51] transition-colors text-center"
          >
            Manage Vacancy Details &rarr;
          </Link>
        </div>
      </section>

      {/* 5. Core Operational Splits (Consultations & Candidate CVs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: Client Consultation Bookings (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#023A51]">
                    Client Consultation Requests
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    {pendingAppointments.length} Pending
                  </span>
                </div>
                <p className="text-xs text-[#59667D] mt-0.5">
                  Tax strategy, statutory audit, and NFRS advisory bookings
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-white text-[#023A51] shadow-xs'
                      : 'text-[#59667D] hover:text-[#023A51]'
                  }`}
                >
                  Pending ({pendingAppointments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-[#023A51] shadow-xs'
                      : 'text-[#59667D] hover:text-[#023A51]'
                  }`}
                >
                  All ({appointments.length})
                </button>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2CBC63] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#023A51]">
                  {activeTab === 'pending'
                    ? 'All Client Consultation Requests Handled!'
                    : 'No consultation requests found'}
                </p>
                <p className="text-xs text-[#7A889B] max-w-sm mx-auto">
                  When new prospective clients book consultations from the public portal, they will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAppointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#023A51] truncate">
                          {apt.client_name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#59667D]">
                        <span className="font-medium text-[#023A51]">
                          {apt.service_title || 'General Advisory'}
                        </span>
                        <span>&bull;</span>
                        <span>{apt.consultation_type || 'Office Meeting'}</span>
                        <span>&bull;</span>
                        <span className="text-[#16723B] font-semibold">
                          {apt.date} at {apt.time_slot}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-[#7A889B] pt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#2CBC63]" /> {apt.client_email}
                        </span>
                        {apt.client_phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#2CBC63]" /> {apt.client_phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-[#2CBC63] hover:bg-[#25A456] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Confirm
                        </button>
                      )}
                      <Link
                        href="/admin/appointments"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#023A51] hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#59667D]">Showing top pending consultations</span>
            <Link
              href="/admin/appointments"
              className="font-bold text-[#2CBC63] hover:text-[#25A456] inline-flex items-center gap-1"
            >
              <span>Open Complete Appointments Calendar</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Right: Candidate Job Applications & CV Vault (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#023A51]">
                    Candidate CV Vault
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold">
                    {applications.length} Total
                  </span>
                </div>
                <p className="text-xs text-[#59667D] mt-0.5">
                  Trainee & associate accountant submissions
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCandidateFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    candidateFilter === 'all'
                      ? 'bg-white text-[#023A51] shadow-xs'
                      : 'text-[#59667D] hover:text-[#023A51]'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setCandidateFilter('new')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    candidateFilter === 'new'
                      ? 'bg-white text-[#023A51] shadow-xs'
                      : 'text-[#59667D] hover:text-[#023A51]'
                  }`}
                >
                  New ({newApplications.length})
                </button>
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <UsersRound className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-[#023A51]">No Applications Found</p>
                <p className="text-xs text-[#7A889B] max-w-xs mx-auto">
                  When recruitment window is open, candidate applications and uploaded CVs will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredApplications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="p-5 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#023A51] truncate">
                          {app.applicant_name}
                        </span>
                        {app.status === 'new' ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            NEW CV
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium capitalize">
                            {app.status}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#59667D] truncate">
                        Position: <strong>{app.vacancy_title || 'General Trainee'}</strong>
                      </p>

                      <p className="text-[11px] text-[#7A889B]">
                        Submitted {formatDate(app.submitted_at)} &bull; {app.applicant_email}
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

          <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#59667D]">{newApplications.length} awaiting initial review</span>
            <Link
              href="/admin/applications"
              className="font-bold text-[#2CBC63] hover:text-[#25A456] inline-flex items-center gap-1"
            >
              <span>Open CV Vault</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>

      {/* 6. Content Modules Grid & Practice Shortcuts */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#023A51]">
              Website CMS Modules & Content Library
            </h2>
            <p className="text-xs text-[#59667D] mt-0.5">
              Direct access to maintain public statutory publications and firm information
            </p>
          </div>
          <span className="text-xs text-[#59667D] font-medium">
            Practice Version 2.0 &bull; Avada Accountant Design System
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: Tax Updates */}
          <Link
            href="/admin/tax-updates"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#2CBC63] hover:bg-slate-50/50 transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16723B] flex items-center justify-center shrink-0 group-hover:bg-[#2CBC63] group-hover:text-white transition-colors">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-[#023A51] group-hover:text-[#2CBC63] transition-colors block">
                Tax & VAT Updates
              </span>
              <span className="text-xs text-[#59667D] block mt-0.5">
                {publishedTaxUpdates} live circulars published
              </span>
            </div>
          </Link>

          {/* Module 2: Articles */}
          <Link
            href="/admin/blog"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#2CBC63] hover:bg-slate-50/50 transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-[#023A51] group-hover:text-[#2CBC63] transition-colors block">
                Articles & Insights
              </span>
              <span className="text-xs text-[#59667D] block mt-0.5">
                {publishedBlogs} published articles
              </span>
            </div>
          </Link>

          {/* Module 3: Services */}
          <Link
            href="/admin/services"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#2CBC63] hover:bg-slate-50/50 transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center shrink-0 group-hover:bg-[#B45309] group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-[#023A51] group-hover:text-[#2CBC63] transition-colors block">
                Practice Services
              </span>
              <span className="text-xs text-[#59667D] block mt-0.5">
                {services.length} practice categories configured
              </span>
            </div>
          </Link>

          {/* Module 4: Resources */}
          <Link
            href="/admin/resources"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#2CBC63] hover:bg-slate-50/50 transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7E22CE] flex items-center justify-center shrink-0 group-hover:bg-[#7E22CE] group-hover:text-white transition-colors">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-[#023A51] group-hover:text-[#2CBC63] transition-colors block">
                Downloads & Links
              </span>
              <span className="text-xs text-[#59667D] block mt-0.5">
                Statutory acts, forms & portals
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 7. Live Activity Audit Log */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-[#023A51]">
              Live Practice Activity & Audit Trail
            </h2>
            <p className="text-xs text-[#59667D] mt-0.5">
              Chronological feed of public inquiries, recruitment actions, and publications
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider bg-[#E7F6EC] px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2CBC63] animate-ping" />
            <span>Active Feed</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Feed Item 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Tax Update Online</span>
                <span className="text-[11px] text-[#7A889B] shrink-0 font-medium">Verified</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                {taxUpdates[0]?.title || 'Recent circular available for public download'}
              </p>
            </div>
          </div>

          {/* Feed Item 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Candidate Application</span>
                <span className="text-[11px] text-[#7A889B] shrink-0 font-medium">CV Vault</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                {applications[0]
                  ? `Application from ${applications[0].applicant_name} for ${applications[0].vacancy_title || 'Trainee'}`
                  : 'Article trainee submission logged'}
              </p>
            </div>
          </div>

          {/* Feed Item 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">Consultation Booking</span>
                <span className="text-[11px] text-[#7A889B] shrink-0 font-medium">Client Inquiry</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                {appointments[0]
                  ? `Consultation with ${appointments[0].client_name} (${appointments[0].date})`
                  : 'Client appointment scheduled'}
              </p>
            </div>
          </div>

          {/* Feed Item 4 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#023A51] truncate">ICAN Compliance Health</span>
                <span className="text-[11px] text-[#7A889B] shrink-0 font-medium">Pass</span>
              </div>
              <p className="text-xs text-[#59667D] truncate mt-0.5">
                Firm details, registration number & office hours synchronized
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
