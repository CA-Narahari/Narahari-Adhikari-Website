'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  PenLine,
  FolderOpen,
  Mail,
  Users,
  Settings,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Plus,
  ChevronRight,
  Clock,
  Briefcase,
  ReceiptText,
  Megaphone,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    settings,
    taxUpdates,
    blogPosts,
    applications,
    appointments,
    vacancies,
    services,
    downloads,
    toggleCareers,
    updateAppointmentStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Real data calculations
  const activeVacancies = vacancies.filter((v) => v.is_active).length;
  const newApplications = applications.filter((a) => a.status === 'new').length;
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const publishedTaxUpdates = taxUpdates.filter((t) => t.status === 'published');
  const publishedBlogs = blogPosts.filter((b) => b.status === 'published');
  const totalContent = publishedTaxUpdates.length + publishedBlogs.length;

  const formatDate = (val?: string) => {
    if (!val) return 'Recently';
    const d = new Date(val.length === 10 ? `${val}T00:00:00` : val);
    if (Number.isNaN(d.getTime())) return val;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  };

  const filteredAppointments = activeTab === 'pending' ? pendingAppointments : appointments;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-14 text-[#1E293B]">
      {/* Welcome Section */}
      <section className="bg-white border border-[#E6EFEA] rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B3E] tracking-tight">
              {greeting}, Admin
            </h1>
            <p className="text-sm text-[#556E70] leading-relaxed max-w-xl">
              Manage your website content, publish updates, and keep your online presence professional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE5E2] bg-white text-xs font-bold text-[#0D3B3E] hover:bg-[#F6FAF8] transition-colors group"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#1A8F4B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/admin/tax-updates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>New Update</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metric Cards - All from real data */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Services/Pages */}
        <Link
          href="/admin/services"
          className="group bg-white rounded-2xl border border-[#E6EFEA] p-5 hover:border-[#1A8F4B] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF6F0] text-[#1A8F4B] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#627A7D] uppercase tracking-wider block">
            Services
          </span>
          <span className="text-2xl font-extrabold text-[#0D3B3E] block mt-0.5">
            {services.length}
          </span>
        </Link>

        {/* Published Content */}
        <Link
          href="/admin/blog"
          className="group bg-white rounded-2xl border border-[#E6EFEA] p-5 hover:border-[#0284C7] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
              <PenLine className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#627A7D] uppercase tracking-wider block">
            Blog Posts
          </span>
          <span className="text-2xl font-extrabold text-[#0D3B3E] block mt-0.5">
            {publishedBlogs.length}
          </span>
        </Link>

        {/* Downloads/Media */}
        <Link
          href="/admin/resources"
          className="group bg-white rounded-2xl border border-[#E6EFEA] p-5 hover:border-[#8B5CF6] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderOpen className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#627A7D] uppercase tracking-wider block">
            Downloads
          </span>
          <span className="text-2xl font-extrabold text-[#0D3B3E] block mt-0.5">
            {downloads.length}
          </span>
        </Link>

        {/* Inquiries */}
        <Link
          href="/admin/appointments"
          className="group bg-white rounded-2xl border border-[#E6EFEA] p-5 hover:border-[#F59E0B] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="w-4.5 h-4.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#627A7D] uppercase tracking-wider block">
            Inquiries
          </span>
          <span className="text-2xl font-extrabold text-[#0D3B3E] block mt-0.5">
            {appointments.length}
          </span>
          {pendingAppointments.length > 0 && (
            <span className="text-[10px] font-bold text-amber-700 mt-1 block">
              {pendingAppointments.length} pending
            </span>
          )}
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#0D3B3E]">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Pages', href: '/admin/services', icon: FileText, color: '#1A8F4B', bg: '#EAF6F0' },
            { label: 'Tax Updates', href: '/admin/tax-updates', icon: ReceiptText, color: '#0284C7', bg: '#E0F2FE' },
            { label: 'Blog', href: '/admin/blog', icon: PenLine, color: '#8B5CF6', bg: '#F3E8FF' },
            { label: 'Media', href: '/admin/resources', icon: FolderOpen, color: '#D97706', bg: '#FEF3C7' },
            { label: 'Careers', href: '/admin/careers', icon: Briefcase, color: '#0D3B3E', bg: '#E4EEE8' },
            { label: 'Settings', href: '/admin/settings', icon: Settings, color: '#627A7D', bg: '#F0F5F2' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 bg-white rounded-xl border border-[#E6EFEA] p-3.5 hover:border-[#1A8F4B]/40 hover:shadow-sm transition-all"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: action.bg, color: action.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#0D3B3E] truncate">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Two Column: Appointments + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Consultation Requests */}
        <div className="lg:col-span-7 space-y-6">
          {/* Appointments Table */}
          <section className="bg-white rounded-2xl border border-[#E6EFEA] overflow-hidden">
            <div className="p-5 border-b border-[#F0F5F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#0D3B3E]">
                  Consultation Requests
                </h3>
                <p className="text-xs text-[#627A7D] mt-0.5">
                  {pendingAppointments.length} pending
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#F4F8F6] p-1 rounded-xl self-start sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-white text-[#0D3B3E] shadow-sm'
                      : 'text-[#627A7D] hover:text-[#0D3B3E]'
                  }`}
                >
                  Pending ({pendingAppointments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-[#0D3B3E] shadow-sm'
                      : 'text-[#627A7D] hover:text-[#0D3B3E]'
                  }`}
                >
                  All ({appointments.length})
                </button>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#EAF6F0] text-[#1A8F4B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-[#0D3B3E]">
                  {activeTab === 'pending' ? 'All caught up' : 'No requests yet'}
                </p>
                <p className="text-xs text-[#7A889B] max-w-xs mx-auto">
                  New consultation requests will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F5F2]">
                {filteredAppointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 hover:bg-[#F9FCFA] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0D3B3E] truncate">
                          {apt.client_name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'confirmed'
                              ? 'bg-[#E7F6EC] text-[#16723B]'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#556E70]">
                        <span>{apt.service_title || 'General Advisory'}</span>
                        <span>&bull;</span>
                        <span className="text-[#1A8F4B] font-semibold">
                          {apt.date} at {apt.time_slot}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-[#1A8F4B] hover:bg-[#15783E] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      <Link
                        href="/admin/appointments"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#0D3B3E] hover:bg-slate-50 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-[#FAFDFB] border-t border-[#F0F5F2] flex items-center justify-end text-xs">
              <Link
                href="/admin/appointments"
                className="font-bold text-[#1A8F4B] hover:text-[#127038] inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Recruitment Control */}
          <section className="bg-white rounded-2xl border border-[#E6EFEA] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0D3B3E]">
                  Recruitment Portal
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    settings.careers_enabled
                      ? 'bg-[#E7F6EC] text-[#16723B]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      settings.careers_enabled ? 'bg-[#2CBC63] animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {settings.careers_enabled ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-xs text-[#556E70]">
                {settings.careers_enabled
                  ? `${activeVacancies} active vacancies, ${newApplications} new applications`
                  : 'Recruitment is currently closed on the public website'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleCareers()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.careers_enabled
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-[#1A8F4B] hover:bg-[#15783E] text-white'
                }`}
              >
                {settings.careers_enabled ? 'Close' : 'Open'}
              </button>
              <Link
                href="/admin/careers"
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#0D3B3E] transition-colors"
              >
                Manage
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column: Recent Content + Applications */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Tax Updates */}
          <section className="bg-white rounded-2xl border border-[#E6EFEA] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1A8F4B]" />
                <h3 className="text-sm font-extrabold text-[#0D3B3E]">Recent Updates</h3>
              </div>
              <Link href="/admin/tax-updates" className="text-xs font-bold text-[#1A8F4B] hover:underline">
                View All
              </Link>
            </div>

            {taxUpdates.length === 0 ? (
              <p className="text-xs text-[#7A8E91] text-center py-4">
                No tax updates published yet.
              </p>
            ) : (
              <div className="space-y-3">
                {taxUpdates.slice(0, 4).map((update) => (
                  <div key={update.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                      <ReceiptText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#0D3B3E] line-clamp-1 block">
                        {update.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            update.status === 'published'
                              ? 'bg-[#E7F6EC] text-[#16723B]'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {update.status}
                        </span>
                        <span className="text-[10px] text-[#7A8E91]">
                          {formatDate(update.published_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Blog Posts */}
          <section className="bg-white rounded-2xl border border-[#E6EFEA] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="text-sm font-extrabold text-[#0D3B3E]">Blog Posts</h3>
              </div>
              <Link href="/admin/blog" className="text-xs font-bold text-[#1A8F4B] hover:underline">
                View All
              </Link>
            </div>

            {blogPosts.length === 0 ? (
              <p className="text-xs text-[#7A8E91] text-center py-4">
                No blog posts yet.
              </p>
            ) : (
              <div className="space-y-3">
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                      <PenLine className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#0D3B3E] line-clamp-1 block">
                        {post.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            post.status === 'published'
                              ? 'bg-[#E7F6EC] text-[#16723B]'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-[10px] text-[#7A8E91]">
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Job Applications */}
          <section className="bg-white rounded-2xl border border-[#E6EFEA] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1A8F4B]" />
                <h3 className="text-sm font-extrabold text-[#0D3B3E]">Applications</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold">
                {applications.length} total
              </span>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-[#7A8E91] text-center py-4">
                No applications received yet.
              </p>
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-[#F9FCFA] border border-[#EBF2EE] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-[#0D3B3E] truncate">
                        {app.applicant_name}
                      </span>
                      <span className="block text-[11px] text-[#627A7D] truncate">
                        {app.vacancy_title || 'General Application'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        app.status === 'new'
                          ? 'bg-blue-50 text-blue-700'
                          : app.status === 'review'
                          ? 'bg-amber-50 text-amber-700'
                          : app.status === 'shortlisted'
                          ? 'bg-[#E7F6EC] text-[#16723B]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-right">
              <Link
                href="/admin/applications"
                className="text-xs font-bold text-[#1A8F4B] hover:underline inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-6 border-t border-[#E6EFEA] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7A8E91]">
        <p>&copy; {new Date().getFullYear()} Narahari Adhikari Chartered Accountants</p>
        <p className="font-medium text-[#0D3B3E]">CMS Portal</p>
      </footer>
    </div>
  );
}
