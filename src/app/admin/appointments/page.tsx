'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Clock3, RefreshCw, Search } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { Appointment } from '@/types';

type Status = Appointment['status'];
type Filter = 'all' | Status;
const statusLabels: Record<Status, string> = { pending: 'Awaiting response', confirmed: 'Confirmed', rescheduled: 'New time needed', cancelled: 'Closed' };
const dateLabel = (value: string) => {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<{ id: string; message: string } | null>(null);
  const [confirmClosing, setConfirmClosing] = useState<Appointment | null>(null);

  const loadAppointments = useCallback(async () => {
    const client = createSupabaseBrowserClient();
    if (!client) { setLoadError('Supabase is not configured for this site.'); setLoading(false); return; }
    setLoading(true); setLoadError('');
    const { data, error } = await client.from('appointments').select('*').order('requested_date', { ascending: true }).order('created_at', { ascending: false });
    if (error) setLoadError('Appointments could not be loaded. Check your staff session and database access, then try again.');
    else setAppointments((data ?? []).map((item) => ({ ...item, date: item.requested_date, time_slot: item.requested_time })) as Appointment[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadAppointments(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAppointments]);

  const counts = useMemo(() => ({ all: appointments.length, pending: appointments.filter((item) => item.status === 'pending').length, confirmed: appointments.filter((item) => item.status === 'confirmed').length, rescheduled: appointments.filter((item) => item.status === 'rescheduled').length, cancelled: appointments.filter((item) => item.status === 'cancelled').length }), [appointments]);
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All requests', count: counts.all }, { key: 'pending', label: 'Awaiting response', count: counts.pending },
    { key: 'confirmed', label: 'Confirmed', count: counts.confirmed }, { key: 'rescheduled', label: 'New time needed', count: counts.rescheduled }, { key: 'cancelled', label: 'Closed', count: counts.cancelled },
  ];
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = appointments.filter((item) => [item.client_name, item.client_email, item.client_phone, item.company_name, item.service_title, item.notes].some((value) => value?.toLowerCase().includes(normalizedSearch)) && (filter === 'all' || item.status === filter));

  const setStatus = async (item: Appointment, status: Status) => {
    if (item.status === status) return;
    setSavingId(item.id); setSaveError(null);
    try {
      const response = await fetch('/api/admin/records/status', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recordType: 'appointments', id: item.id, status }) });
      if (!response.ok) throw new Error('save failed');
      setAppointments((current) => current.map((appointment) => appointment.id === item.id ? { ...appointment, status } : appointment));
    } catch {
      setSaveError({ id: item.id, message: 'The status was not saved. Refresh the list and try again.' });
    } finally { setSavingId(null); }
  };

  const requestStatusChange = (item: Appointment, status: Status) => {
    if (item.status === status) return;
    if (status === 'cancelled') setConfirmClosing(item);
    else void setStatus(item, status);
  };

  return (
    <main className="mx-auto max-w-[1320px] space-y-6 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">Practice schedule</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Appointments</h1>
          <p className="mt-1 text-sm text-slate-600">Review requested meeting times, then confirm or arrange a change with the client.</p>
        </div>
        <Link href="/book-appointment" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open booking form <ArrowUpRight className="size-4" /></Link>
      </header>

      <section aria-label="Appointment status filters" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-200 pb-3">
        {filters.map((item) => <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)} className={`inline-flex items-center gap-2 border-b-2 pb-2 text-sm ${filter === item.key ? 'border-slate-900 font-semibold text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><span>{item.label}</span><span className={`rounded px-1.5 py-0.5 text-xs tabular-nums ${filter === item.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.count}</span></button>)}
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div><h2 className="text-sm font-semibold text-slate-900">Consultation requests</h2><p className="mt-0.5 text-xs text-slate-500">{filtered.length} shown · requested times remain unconfirmed until you check the calendar</p></div>
          <label className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-300 px-2.5 sm:max-w-xs"><Search className="size-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client or service" aria-label="Search appointments" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
        </div>
        <div className="hidden grid-cols-[minmax(180px,1.1fr)_minmax(180px,1fr)_minmax(190px,1fr)_160px] gap-4 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 lg:grid"><span>Client</span><span>Requested time</span><span>Consultation</span><span>Response status</span></div>
        {loading ? <div role="status" className="p-12 text-center text-sm text-slate-500">Loading appointments…</div> : loadError ? <div className="p-8 text-center"><p role="alert" className="text-sm text-rose-700">{loadError}</p><button onClick={() => void loadAppointments()} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-800 underline"><RefreshCw className="size-3.5" />Retry</button></div> : filtered.length === 0 ? <div className="p-12 text-center"><CalendarDays className="mx-auto size-7 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-800">{appointments.length ? 'No requests match this view' : 'No appointment requests yet'}</p><p className="mt-1 text-sm text-slate-500">{appointments.length ? 'Change the search or status filter.' : 'Online meeting requests will appear here.'}</p></div> : <ul className="divide-y divide-slate-200">{filtered.map((item) => <li key={item.id} className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(180px,1.1fr)_minmax(180px,1fr)_minmax(190px,1fr)_160px] lg:items-center">
          <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{item.client_name}</p>{item.company_name && <p className="mt-0.5 truncate text-xs text-slate-500">{item.company_name}</p>}<a href={`mailto:${item.client_email}`} className="mt-1 block truncate text-xs text-slate-600 hover:underline">{item.client_email}</a>{item.client_phone && <a href={`tel:${item.client_phone}`} className="mt-0.5 block text-xs text-slate-600 hover:underline">{item.client_phone}</a>}</div>
          <div className="flex items-start gap-2 text-sm text-slate-700"><CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" /><div><p className="font-medium">{dateLabel(item.date)}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="size-3.5" />{item.time_slot}</p></div></div>
          <div><p className="text-sm font-medium text-slate-800">{item.service_title}</p><p className="mt-0.5 text-xs text-slate-500">{item.consultation_type} · received {dateLabel(item.created_at)}</p>{item.notes && <details className="mt-2 text-xs text-slate-600"><summary className="cursor-pointer font-medium">Read client notes</summary><p className="mt-1 whitespace-pre-wrap leading-5">{item.notes}</p></details>}</div>
          <div><label className="sr-only" htmlFor={`appointment-status-${item.id}`}>Status for {item.client_name}</label><select id={`appointment-status-${item.id}`} value={item.status} disabled={savingId === item.id} onChange={(event) => requestStatusChange(item, event.target.value as Status)} className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none focus:border-slate-500 disabled:opacity-60">{(Object.keys(statusLabels) as Status[]).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select>{savingId === item.id && <p role="status" className="mt-1 text-xs text-slate-500">Saving…</p>}{saveError?.id === item.id && <p role="alert" className="mt-1 text-xs text-rose-700">{saveError.message}</p>}<p className="mt-1 text-[11px] leading-4 text-slate-500">Status is internal; contact the client separately.</p></div>
        </li>)}</ul>}
      </section>
      <ConfirmModal isOpen={!!confirmClosing} title="Close this appointment request?" message={confirmClosing ? `This will mark ${confirmClosing.client_name}’s request as closed in the CMS. It will not notify the client or cancel anything on their calendar.` : ''} confirmLabel="Close request" isDestructive={false} onCancel={() => setConfirmClosing(null)} onConfirm={() => { const item = confirmClosing; setConfirmClosing(null); if (item) void setStatus(item, 'cancelled'); }} />
    </main>
  );
}
