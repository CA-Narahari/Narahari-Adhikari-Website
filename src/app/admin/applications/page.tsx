'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Download, FileText, RefreshCw, Search, UserRound } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { JobApplication } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useApp } from '@/context/AppContext';

type Status = JobApplication['status'];
type Filter = 'all' | Status;
const stages: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All candidates' }, { key: 'new', label: 'New' }, { key: 'review', label: 'In review' }, { key: 'shortlisted', label: 'Shortlisted' }, { key: 'rejected', label: 'Rejected' },
];
const statusLabel: Record<Status, string> = { new: 'New', review: 'In review', shortlisted: 'Shortlisted', rejected: 'Rejected' };
const dateLabel = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date); };

export default function AdminApplicationsPage() {
  const { updateApplicationStatus } = useApp();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<{ id: string; message: string } | null>(null);
  const [confirmRejecting, setConfirmRejecting] = useState<JobApplication | null>(null);

  const loadApplications = useCallback(async () => {
    const client = createSupabaseBrowserClient();
    if (!client) { setLoadError('Supabase is not configured for this site.'); setLoading(false); return; }
    setLoading(true); setLoadError('');
    const { data, error } = await client.from('applications').select('*').order('submitted_at', { ascending: false });
    if (error) setLoadError('Applications could not be loaded. Check your staff session and database access, then try again.');
    else setApplications((data ?? []).map((item) => ({
      ...item,
      qualification: item.qualification || item.cover_note?.match(/^Qualification:\s*(.+?)(?:\r?\n\r?\n|$)/)?.[1] || '',
      cover_note: item.cover_note?.replace(/^Qualification:\s*.+?(?:\r?\n\r?\n|$)/, '') || '',
    })) as JobApplication[]);
    setLoading(false);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadApplications(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadApplications]);

  const counts = useMemo(() => ({ all: applications.length, new: applications.filter((item) => item.status === 'new').length, review: applications.filter((item) => item.status === 'review').length, shortlisted: applications.filter((item) => item.status === 'shortlisted').length, rejected: applications.filter((item) => item.status === 'rejected').length }), [applications]);
  const query = search.trim().toLowerCase();
  const visible = applications.filter((item) => (filter === 'all' || item.status === filter) && [item.applicant_name, item.applicant_email, item.applicant_phone, item.vacancy_title, item.qualification, item.cover_note].some((value) => value?.toLowerCase().includes(query)));

  const setStatus = async (candidate: JobApplication, status: Status) => {
    if (candidate.status === status) return;
    setSavingId(candidate.id); setSaveError(null);
    try {
      const saved = await updateApplicationStatus(candidate.id, status);
      if (!saved) throw new Error('save failed');
      setApplications((current) => current.map((item) => item.id === candidate.id ? { ...item, status } : item));
    } catch { setSaveError({ id: candidate.id, message: 'The hiring stage was not saved. Refresh the list and try again.' }); }
    finally { setSavingId(null); }
  };

  const requestStatusChange = (candidate: JobApplication, status: Status) => {
    if (candidate.status === status) return;
    if (status === 'rejected') setConfirmRejecting(candidate);
    else void setStatus(candidate, status);
  };

  return (
    <main className="mx-auto max-w-[1320px] space-y-5 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">Hiring</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Job applications</h1><p className="mt-1 text-sm text-slate-600">Review each candidate’s role, experience, and CV before recording a hiring stage.</p></div>
        <Link href="/careers" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open careers page <ArrowUpRight className="size-4" /></Link>
      </header>

      <section aria-label="Hiring stage filters" className="flex flex-wrap gap-2">{stages.map((stage) => <button key={stage.key} type="button" aria-pressed={filter === stage.key} onClick={() => setFilter(stage.key)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${filter === stage.key ? 'border-slate-800 bg-slate-800 font-medium text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500'}`}>{stage.label}<span className={`text-xs tabular-nums ${filter === stage.key ? 'text-slate-300' : 'text-slate-400'}`}>{counts[stage.key]}</span></button>)}</section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3"><div><h2 className="text-sm font-semibold text-slate-900">Candidate register</h2><p className="mt-0.5 text-xs text-slate-500">{visible.length} shown · hiring stage is internal and does not notify applicants</p></div><div className="flex w-full items-center gap-2 sm:w-auto"><label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 px-2.5 sm:w-72"><Search className="size-4 shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate or role" aria-label="Search job applications" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label><button onClick={() => void loadApplications()} aria-label="Refresh applications" className="grid size-9 shrink-0 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"><RefreshCw className="size-4" /></button></div></div>
        <div className="hidden grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(160px,.8fr)_130px_210px] gap-4 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 lg:grid"><span>Candidate</span><span>Position</span><span>Contact</span><span>CV</span><span>Hiring stage</span></div>
        {loading ? <div role="status" className="p-12 text-center text-sm text-slate-500">Loading applications…</div> : loadError ? <div className="p-8 text-center"><p role="alert" className="text-sm text-rose-700">{loadError}</p><button onClick={() => void loadApplications()} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-800 underline"><RefreshCw className="size-3.5" />Retry</button></div> : visible.length === 0 ? <div className="p-12 text-center"><UserRound className="mx-auto size-7 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-800">{applications.length ? 'No candidates match this view' : 'No applications received yet'}</p><p className="mt-1 text-sm text-slate-500">{applications.length ? 'Adjust the search or choose a different hiring stage.' : 'Applications submitted for open roles will appear here.'}</p></div> : <ul className="divide-y divide-slate-200">{visible.map((candidate) => <li key={candidate.id} className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(160px,.8fr)_130px_210px] lg:items-center">
          <div className="min-w-0"><div className="flex items-center gap-2"><span className={`size-2 shrink-0 rounded-full ${candidate.status === 'new' ? 'bg-amber-500' : candidate.status === 'review' ? 'bg-blue-500' : candidate.status === 'shortlisted' ? 'bg-emerald-600' : 'bg-slate-400'}`} /><p className="truncate text-sm font-semibold text-slate-900">{candidate.applicant_name}</p></div><p className="mt-1 text-xs text-slate-500">Applied {dateLabel(candidate.submitted_at)}</p>{candidate.qualification && <p className="mt-1 truncate text-xs text-slate-600">{candidate.qualification}</p>}</div>
          <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{candidate.vacancy_title}</p>{candidate.cover_note && <details className="mt-1 text-xs text-slate-600"><summary className="cursor-pointer font-medium">Read applicant note</summary><p className="mt-1 whitespace-pre-wrap leading-5">{candidate.cover_note}</p></details>}</div>
          <div className="min-w-0"><a href={`mailto:${candidate.applicant_email}`} className="block truncate text-xs text-slate-700 hover:underline">{candidate.applicant_email}</a>{candidate.applicant_phone && <a href={`tel:${candidate.applicant_phone}`} className="mt-1 block text-xs text-slate-600 hover:underline">{candidate.applicant_phone}</a>}</div>
          <div>{candidate.cv_file_url ? <a href={`/api/admin/applications/${encodeURIComponent(candidate.id)}/cv`} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"><FileText className="size-3.5" />{candidate.cv_filename ? 'Open CV' : 'Open file'}<Download className="size-3.5" /></a> : <span className="text-xs text-slate-400">No CV attached</span>}</div>
          <div><label className="sr-only" htmlFor={`application-status-${candidate.id}`}>Hiring stage for {candidate.applicant_name}</label><select id={`application-status-${candidate.id}`} value={candidate.status} disabled={savingId === candidate.id} onChange={(event) => requestStatusChange(candidate, event.target.value as Status)} className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none focus:border-slate-500 disabled:opacity-60">{(Object.keys(statusLabel) as Status[]).map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select>{savingId === candidate.id && <p role="status" className="mt-1 text-xs text-slate-500">Saving…</p>}{saveError?.id === candidate.id && <p role="alert" className="mt-1 text-xs text-rose-700">{saveError.message}</p>}</div>
        </li>)}</ul>}
      </section>
      <ConfirmModal isOpen={!!confirmRejecting} title="Record a rejection?" message={confirmRejecting ? `This will mark ${confirmRejecting.applicant_name} as rejected in the hiring tracker. It will not email or otherwise notify the candidate.` : ''} confirmLabel="Record rejection" onCancel={() => setConfirmRejecting(null)} onConfirm={() => { const candidate = confirmRejecting; setConfirmRejecting(null); if (candidate) void setStatus(candidate, 'rejected'); }} />
    </main>
  );
}
