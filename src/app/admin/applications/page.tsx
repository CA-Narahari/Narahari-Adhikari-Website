'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  UserSearch,
  Search,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Download,
  ExternalLink,
  GraduationCap,
  UserRound,
} from 'lucide-react';
import type { JobApplication } from '@/types';

type StatusFilter = 'all' | JobApplication['status'];

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export default function AdminApplicationsPage() {
  const { applications, updateApplicationStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<{ id: string; message: string } | null>(null);

  const counts = useMemo(
    () => ({
      all: applications.length,
      new: applications.filter((item) => item.status === 'new').length,
      review: applications.filter((item) => item.status === 'review').length,
      shortlisted: applications.filter((item) => item.status === 'shortlisted').length,
      rejected: applications.filter((item) => item.status === 'rejected').length,
    }),
    [applications]
  );

  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All candidates', count: counts.all },
    { key: 'new', label: 'New applications', count: counts.new },
    { key: 'review', label: 'Under review', count: counts.review },
    { key: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
  ];

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return applications.filter((item) => {
      const matchesSearch = [
        item.applicant_name,
        item.applicant_email,
        item.applicant_phone,
        item.vacancy_title,
        item.qualification,
        item.cover_note,
      ].some((v) => v?.toLowerCase().includes(normalizedSearch));
      const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [applications, statusFilter, normalizedSearch]);

  const handleStatusChange = async (id: string, status: JobApplication['status']) => {
    const candidate = applications.find((item) => item.id === id);
    if (!candidate || candidate.status === status) return;
    if (status === 'rejected' && !window.confirm(`Record a rejection decision for ${candidate.applicant_name}? This only updates the CMS; it does not contact the candidate.`)) return;
    setUpdatingId(id);
    setDecisionError(null);
    try {
      const saved = await updateApplicationStatus(id, status);
      if (!saved) setDecisionError({ id, message: 'The decision was not saved. Refresh the hiring list and try again.' });
    } catch {
      setDecisionError({ id, message: 'The decision was not saved. Check the CMS connection and try again.' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 pb-10">
      {/* 1. Header (Matching /admin/messages) */}
      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 shadow-xs">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]">
            Hiring workspace
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">
            Job applications
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">
            Candidates who submitted CVs and applications through the public Careers portal. Review qualifications and track applicant statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/careers"
            target="_blank"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-4 text-xs font-semibold text-[#143F40] hover:bg-[#F5FAF7] transition-colors"
          >
            <span>Public Careers Portal</span>
            <ExternalLink className="size-3.5 text-[#168A4A]" />
          </Link>
        </div>
      </header>

      {/* 2. Filter Stats Strip (Matching /admin/messages) */}
      <section aria-label="Application totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setStatusFilter(filter.key)}
            aria-pressed={statusFilter === filter.key}
            className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
              statusFilter === filter.key
                ? 'border-[#A9D7B9] bg-[#F1FAF4]'
                : 'border-[#E2ECE6] bg-white hover:border-[#C6D9CE]'
            }`}
          >
            <span className="block text-[10px] font-bold uppercase tracking-[.11em] text-[#718181]">
              {filter.label}
            </span>
            <span className="mt-1 block text-2xl font-bold tabular-nums text-[#073E43]">
              {filter.count}
            </span>
          </button>
        ))}
      </section>

      {/* 3. Main Card Container (Matching /admin/messages) */}
      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-[#EDF2EF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#EAF8F1] text-[#14864B]">
              <UserSearch className="size-5" />
            </span>
            <div>
              <h2 className="font-bold text-[#123F40]">Candidate Applications</h2>
              <p className="text-xs text-[#718181]">
                {filtered.length} shown · {applications.length} total
              </p>
            </div>
          </div>

          <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[#D5E0DC] px-3 text-sm focus-within:border-[#168A4A] sm:max-w-sm">
            <Search className="size-4 shrink-0 text-[#82918D]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, email, role, or qualification"
              aria-label="Search applications"
              className="min-w-0 flex-1 bg-transparent text-xs text-[#143F40] outline-none placeholder:text-[#91A19C]"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <UserSearch className="mx-auto size-8 text-[#98B8A6]" />
            <h3 className="text-sm font-bold text-[#123F40]">
              {applications.length ? 'No matching candidate applications' : 'No applications received yet'}
            </h3>
            <p className="mx-auto max-w-md text-xs leading-5 text-[#718181]">
              {applications.length
                ? 'Try another search keyword or switch the candidate status filter.'
                : 'When candidates submit CVs for career openings, they will appear here.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EDF2EF]">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_270px] sm:p-6 hover:bg-[#FAFCFB] transition-colors"
              >
                <div className="min-w-0">
                  {/* Top Candidate Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-full bg-[#EAF8F1] text-[#168A4A]">
                      <UserRound className="size-4" />
                    </span>
                    <h3 className="font-bold text-[#123F40] text-sm">{item.applicant_name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.status === 'new'
                          ? 'bg-[#FFF5DE] text-[#98610D]'
                          : item.status === 'review'
                          ? 'bg-[#EAF3FF] text-[#2869A8]'
                          : item.status === 'shortlisted'
                          ? 'bg-[#EAF8F1] text-[#14864B]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status === 'new'
                        ? 'New candidate'
                        : item.status === 'review'
                        ? 'Under review'
                        : item.status === 'shortlisted'
                        ? 'Shortlisted'
                        : 'Archived / Rejected'}
                    </span>
                    <time className="text-xs text-[#82918D]">
                      Applied: {dateLabel(item.submitted_at)}
                    </time>
                  </div>

                  {/* Position and Contact Row */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#52706C]">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#023A51]">
                      <Briefcase className="size-3.5 text-emerald-600" />
                      {item.vacancy_title}
                    </span>
                    <a
                      className="inline-flex items-center gap-1.5 hover:text-[#168A4A]"
                      href={`mailto:${item.applicant_email}`}
                    >
                      <Mail className="size-3.5" />
                      {item.applicant_email}
                    </a>
                    {item.applicant_phone && (
                      <a
                        className="inline-flex items-center gap-1.5 hover:text-[#168A4A]"
                        href={`tel:${item.applicant_phone}`}
                      >
                        <Phone className="size-3.5" />
                        {item.applicant_phone}
                      </a>
                    )}
                    {item.qualification && (
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="size-3.5 text-slate-500" />
                        {item.qualification}
                      </span>
                    )}
                  </div>

                  {/* CV Download / Preview Pill */}
                  {item.cv_file_url && (
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={`/api/admin/applications/${encodeURIComponent(item.id)}/cv`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5EFE1] bg-[#F0FAF4] hover:bg-[#E2F7EB] text-[#147448] text-xs font-semibold transition-colors"
                      >
                        <FileText className="size-3.5" />
                        <span>Download Applicant CV</span>
                        <Download className="size-3 ml-0.5" />
                      </a>
                    </div>
                  )}

                  {/* Candidate cover note */}
                  {item.cover_note && (
                    <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#F7FAF8] p-3.5 text-xs leading-relaxed text-[#405A5B]">
                      {item.cover_note}
                    </p>
                  )}
                </div>

                <aside className="rounded-2xl border border-[#DFE9E3] bg-[#F8FBF9] p-4 sm:self-start">
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Hiring decision</p>
                  <p className="mt-1 text-sm font-bold text-[#123F40]">
                    {item.status === 'new' ? 'Review this application' : item.status === 'review' ? 'Candidate under review' : item.status === 'shortlisted' ? 'Candidate shortlisted' : 'Application rejected'}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#718181]">Check the CV, qualification, and role fit before choosing a next step.</p>
                  <div className="mt-3 grid gap-2">
                    {item.status === 'rejected' ? (
                      <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'review')} className="min-h-9 rounded-xl border border-[#C9DED0] bg-white px-3 text-xs font-semibold text-[#176C43] hover:bg-[#EFF8F2] disabled:opacity-50">Reopen for review</button>
                    ) : <>
                      {item.status === 'new' ? <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'review')} className="min-h-9 rounded-xl bg-[#0B4B4C] px-3 text-xs font-semibold text-white hover:bg-[#083D3F] disabled:opacity-50">Start review</button> : item.status === 'review' ? <span className="rounded-xl border border-[#C7DDF0] bg-[#EDF5FC] px-3 py-2 text-center text-[11px] font-semibold text-[#2869A8]">Under review · current stage</span> : <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'review')} className="min-h-9 rounded-xl border border-[#D5E0DC] bg-white px-3 text-xs font-semibold text-[#365555] hover:bg-white disabled:opacity-50">Return to review</button>}
                      {item.status === 'shortlisted' ? <span className="rounded-xl border border-[#BFE5CB] bg-[#EFF9F2] px-3 py-2 text-center text-[11px] font-semibold text-[#176C43]">Shortlisted · current decision</span> : <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'shortlisted')} className="min-h-9 rounded-xl border border-[#BFE5CB] bg-white px-3 text-xs font-semibold text-[#176C43] hover:bg-[#EFF9F2] disabled:opacity-50">Shortlist candidate</button>}
                      <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'rejected')} className="min-h-9 rounded-xl border border-[#E7C7C7] bg-white px-3 text-xs font-semibold text-[#9D3D3D] hover:bg-rose-50 disabled:opacity-50">Reject application…</button>
                    </>}
                  </div>
                  {updatingId === item.id && <span role="status" className="mt-2 block text-[11px] text-[#82918D]">Saving decision…</span>}
                  {decisionError?.id === item.id && <span role="alert" className="mt-2 block text-[11px] leading-4 text-rose-700">{decisionError.message}</span>}
                </aside>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
