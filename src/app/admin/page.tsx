'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ReceiptText,
  Users,
  Calendar,
  Briefcase,
  Plus,
  Megaphone,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { settings, taxUpdates, applications, appointments, vacancies } = useApp();

  const activeVacancies = vacancies.filter((v) => v.is_active).length;
  const newApplications = applications.filter((a) => a.status === 'new').length;
  const upcomingMeetings = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner matching architecture.png */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good Morning, Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here is what is happening across your firm's public web portal and client operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/tax-updates"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Tax Article</span>
          </Link>
          <Link
            href="/admin/careers"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Vacancy</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Matching architecture.png: 12 Tax Articles, 4 New Applications, 3 Upcoming Meetings, 8 Vacancies) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/admin/tax-updates"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Tax Articles
            </span>
            <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">
              {taxUpdates.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Published & Live</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ReceiptText className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/admin/applications"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              New Applications
            </span>
            <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">
              {newApplications || applications.length}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">Candidates Awaiting Review</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/admin/appointments"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Upcoming Meetings
            </span>
            <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">
              {upcomingMeetings}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Consultations Booked</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/admin/careers"
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Total Vacancies
            </span>
            <span className="text-3xl font-bold text-slate-900 font-mono mt-1 block">
              {activeVacancies}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Hiring Page: {settings.careers_enabled ? 'Active (ON)' : 'Hidden (OFF)'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Quick Actions Grid (matching architecture.png) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <Link
            href="/admin/tax-updates"
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center font-medium text-slate-800 transition-colors flex flex-col items-center gap-1.5"
          >
            <ReceiptText className="w-4 h-4 text-amber-600" />
            <span>Add Tax Article</span>
          </Link>

          <Link
            href="/admin/careers"
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center font-medium text-slate-800 transition-colors flex flex-col items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Post Vacancy</span>
          </Link>

          <Link
            href="/admin/services"
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center font-medium text-slate-800 transition-colors flex flex-col items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Service</span>
          </Link>

          <Link
            href="/admin/announcements"
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center font-medium text-slate-800 transition-colors flex flex-col items-center gap-1.5"
          >
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Alert Banner</span>
          </Link>

          <Link
            href="/admin/resources"
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center font-medium text-slate-800 transition-colors flex flex-col items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Govt Links & PDFs</span>
          </Link>

          <Link
            href="/admin/office-hours"
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center font-medium text-slate-800 transition-colors flex flex-col items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-slate-700" />
            <span>Office Hours</span>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Activity & Pending Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity (matching architecture.png) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Recent Website Activity
            </h2>
            <span className="text-[11px] text-slate-400">Live Event Log</span>
          </div>

          <div className="space-y-3 text-xs">
            {applications.slice(0, 2).map((app) => (
              <div key={app.id} className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-3">
                <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    New job application received: {app.applicant_name}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Position: {app.vacancy_title} • CV: {app.cv_filename}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{app.submitted_at}</span>
              </div>
            ))}

            {taxUpdates.slice(0, 2).map((tax) => (
              <div key={tax.id} className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg flex items-start gap-3">
                <ReceiptText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    Tax article published: {tax.title}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Category: {tax.category} • Source: {tax.source_name}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{tax.published_at}</span>
              </div>
            ))}

            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-start gap-3">
              <Megaphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-slate-900">
                  Top notification alert active on homepage
                </div>
                <div className="text-slate-500 text-[11px]">
                  {settings.announcement_text}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Active</span>
            </div>
          </div>
        </div>

        {/* Pending Appointments Review */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Upcoming Consultations
            </h2>
            <Link
              href="/admin/appointments"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Manage All
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-900">{apt.client_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  {apt.service_title}
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-200/60 font-mono">
                  <span>{apt.date} • {apt.time_slot}</span>
                  <span>{apt.consultation_type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
