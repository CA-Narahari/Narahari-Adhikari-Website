'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Clock3, Download, FileText, Search, Users } from 'lucide-react';
import type { JobApplication } from '@/types';

type ApplicationFilter = 'all' | JobApplication['status'];

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const statusTone: Record<JobApplication['status'], string> = {
  new: 'bg-[#EAF3FF] text-[#2868B0]',
  review: 'bg-[#FFF3DF] text-[#986408]',
  shortlisted: 'bg-[#E8F6EF] text-[#177347]',
  rejected: 'bg-[#F1F3F3] text-[#667677]',
};

export default function AdminApplicationsPage() {
  const { applications, updateApplicationStatus } = useApp();
  const [filter, setFilter] = useState<ApplicationFilter>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const counts = {
    all: applications.length,
    new: applications.filter((item) => item.status === 'new').length,
    review: applications.filter((item) => item.status === 'review').length,
    shortlisted: applications.filter((item) => item.status === 'shortlisted').length,
    rejected: applications.filter((item) => item.status === 'rejected').length,
  };
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return applications.filter((item) => {
      const matchesStatus = filter === 'all' || item.status === filter;
      const searchable = [item.applicant_name, item.applicant_email, item.applicant_phone, item.vacancy_title, item.cover_note].join(' ').toLocaleLowerCase();
      return matchesStatus && (!needle || searchable.includes(needle));
    });
  }, [applications, filter, query]);

  const metrics = [
    { title: 'All candidates', value: counts.all, note: 'Applications received', icon: Users, tint: 'bg-[#EAF3FF] text-[#2868B0]' },
    { title: 'New', value: counts.new, note: 'Ready for review', icon: Clock3, tint: 'bg-[#FFF3DF] text-[#986408]' },
    { title: 'In review', value: counts.review, note: 'Currently reviewing', icon: FileText, tint: 'bg-[#F3ECFF] text-[#8552D6]' },
    { title: 'Shortlisted', value: counts.shortlisted, note: 'Progressing candidates', icon: CheckCircle2, tint: 'bg-[#E8F6EF] text-[#177347]' },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 pb-10">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#19854D]">Hiring workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#103F40]">Job applications</h1>
        <p className="mt-1 text-sm text-[#657777]">Review candidate details, open CVs, and track each application through your hiring process.</p>
      </header>

      <section aria-label="Application summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(({ title, value, note, icon: Icon, tint }) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-[#E3ECE7] bg-white px-4 py-4 sm:px-5">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tint}`}><Icon aria-hidden="true" className="size-4" /></span>
          <div><p className="text-[10px] font-medium text-[#718181]">{title}</p><p className="text-xl font-bold leading-6 tabular-nums text-[#143F40]">{value}</p><p className="text-[10px] text-[#80908F]">{note}</p></div>
        </div>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E3ECE7] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E9EFEB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><h2 className="text-sm font-bold text-[#173F40]">Candidate applications</h2><p className="mt-1 text-xs text-[#708180]">Use search and status to find a candidate.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative block sm:w-[260px]"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#829392]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidates..." aria-label="Search job applications" className="h-10 w-full rounded-lg border border-[#E0E8E3] bg-[#FBFCFB] pl-9 pr-3 text-xs text-[#294849] placeholder:text-[#93A09F] focus:border-[#18864D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#18864D]/15" /></label>
            <label className="flex h-10 items-center gap-2 rounded-lg border border-[#E0E8E3] px-3 text-xs text-[#526767]"><span className="sr-only">Filter applications by status</span><select value={filter} onChange={(event) => setFilter(event.target.value as ApplicationFilter)} aria-label="Filter applications by status" className="min-w-28 bg-transparent font-medium outline-none"><option value="all">All statuses</option><option value="new">New</option><option value="review">In review</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option></select></label>
          </div>
        </div>

        {filtered.length === 0 ? <div className="px-5 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EEF5FF] text-[#3476BD]"><Users aria-hidden="true" className="size-5" /></span>
          <h3 className="mt-4 text-sm font-bold text-[#244647]">{applications.length ? 'No matching candidates' : 'No applications yet'}</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#718181]">{applications.length ? 'Try a different name, vacancy, or status.' : 'Applications submitted through the careers page will appear here. Candidate details and CVs will be ready to review.'}</p>
        </div> : <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="bg-[#F6F9F7] text-[10px] font-semibold text-[#6F8180]"><tr><th scope="col" className="px-5 py-3">Candidate</th><th scope="col" className="px-4 py-3">Position</th><th scope="col" className="px-4 py-3">Received</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">CV</th><th scope="col" className="px-4 py-3 text-right">Update status</th></tr></thead>
            <tbody className="divide-y divide-[#EEF2EF]">{filtered.map((app) => <React.Fragment key={app.id}><tr className="hover:bg-[#FCFDFC]">
              <td className="px-5 py-3.5"><p className="text-xs font-semibold text-[#1D4647]">{app.applicant_name}</p><a href={`mailto:${app.applicant_email}`} className="mt-1 block text-[10px] text-[#718181] hover:text-[#177347]">{app.applicant_email}</a><a href={`tel:${app.applicant_phone}`} className="mt-0.5 block text-[10px] text-[#718181] hover:text-[#177347]">{app.applicant_phone}</a></td>
              <td className="px-4 py-3.5"><p className="text-xs text-[#455F60]">{app.vacancy_title}</p>{app.qualification && <p className="mt-1 text-[10px] text-[#7B8988]">{app.qualification}</p>}</td>
              <td className="px-4 py-3.5 text-xs text-[#455F60]">{formatDate(app.submitted_at)}</td>
              <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusTone[app.status]}`}>{app.status === 'review' ? 'In review' : app.status}</span></td>
              <td className="px-4 py-3.5"><a href={app.cv_file_url ? `/api/admin/applications/${encodeURIComponent(app.id)}/cv` : undefined} target={app.cv_file_url ? '_blank' : undefined} rel={app.cv_file_url ? 'noreferrer' : undefined} aria-disabled={!app.cv_file_url} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${app.cv_file_url ? 'bg-[#0B4B4C] text-white hover:bg-[#083D3F]' : 'cursor-not-allowed bg-[#F0F3F1] text-[#85918F]'}`}><Download aria-hidden="true" className="size-3.5" />{app.cv_file_url ? 'Open CV' : 'No CV'}</a></td>
              <td className="px-4 py-3.5"><div className="flex justify-end gap-1.5"><button type="button" onClick={() => setExpanded(expanded === app.id ? null : app.id)} aria-expanded={expanded === app.id} className="rounded-lg border border-[#DDE8E1] px-2 py-1.5 text-[10px] font-semibold text-[#365555] hover:bg-[#F5FAF7]">{expanded === app.id ? 'Hide' : 'Details'}</button><button type="button" onClick={() => updateApplicationStatus(app.id, 'review')} aria-label={`Move ${app.applicant_name} to review`} className="rounded-lg border border-[#E8DDBF] px-2 py-1.5 text-[10px] font-semibold text-[#8F650C] hover:bg-[#FFF7E8]">Review</button><button type="button" onClick={() => updateApplicationStatus(app.id, 'shortlisted')} aria-label={`Shortlist ${app.applicant_name}`} className="rounded-lg border border-[#D7E9DE] px-2 py-1.5 text-[10px] font-semibold text-[#177347] hover:bg-[#EAF7F0]">Shortlist</button><button type="button" onClick={() => updateApplicationStatus(app.id, 'rejected')} aria-label={`Reject ${app.applicant_name}`} className="rounded-lg border border-[#E1E7E3] px-2 py-1.5 text-[10px] font-semibold text-[#667677] hover:bg-[#F1F3F3]">Close</button></div></td>
            </tr>{expanded === app.id && <tr className="bg-[#FBFDFC]"><td colSpan={6} className="px-5 pb-4 pt-1"><div className="grid gap-4 rounded-xl border border-[#E6EEE9] bg-white p-4 sm:grid-cols-2"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82908E]">Qualification</p><p className="mt-1 text-xs text-[#455F60]">{app.qualification || 'Not provided'}</p></div><div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82908E]">Application note</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#455F60]">{app.cover_note || 'No note provided.'}</p></div></div></td></tr>}</React.Fragment>)}</tbody>
          </table>
        </div>}
        {filtered.length > 0 && <div className="border-t border-[#EDF2EE] px-5 py-3 text-[10px] text-[#7C8A88]">Showing {filtered.length} of {applications.length} application{applications.length === 1 ? '' : 's'}</div>}
      </section>
    </div>
  );
}
