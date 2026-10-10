'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, CalendarDays, Check, Clock3, Inbox, Mail, Phone, RefreshCw, Search, X } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useApp } from '@/context/AppContext';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { Appointment } from '@/types';

type Status = Appointment['status'];
type Filter = 'needs_attention' | 'all' | Status;
const statusLabels: Record<Status, string> = { pending: 'Awaiting response', confirmed: 'Confirmed', rescheduled: 'New time needed', cancelled: 'Closed' };
const statusStyles: Record<Status, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  rescheduled: 'bg-blue-50 text-blue-800 ring-blue-200',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
};
const dateLabel = (value: string) => {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const receivedLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function AdminAppointmentsPage() {
  const { updateAppointmentStatus } = useApp();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('needs_attention');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<{ id: string; message: string } | null>(null);
  const [confirmClosing, setConfirmClosing] = useState<Appointment | null>(null);

  const loadAppointments = useCallback(async () => {
    const client = createSupabaseBrowserClient();
    if (!client) { setLoadError('Supabase is not configured for this site.'); setLoading(false); return; }
    setLoading(true); setLoadError('');
    const { data, error } = await client.from('appointments').select('*').order('created_at', { ascending: false });
    if (error) setLoadError('Appointments could not be loaded. Check your staff session and database access, then try again.');
    else {
      const rows = (data ?? []).map((item) => ({
        ...item,
        company_name: item.company_name || item.notes?.match(/^Organization:\s*(.+?)(?:\r?\n\r?\n|$)/)?.[1] || '',
        notes: item.notes?.replace(/^Organization:\s*.+?(?:\r?\n\r?\n|$)/, '') || '',
        date: item.requested_date,
        time_slot: item.requested_time,
      })) as Appointment[];
      setAppointments(rows);
      setSelectedId((current) => current && rows.some((item) => item.id === current) ? current : rows.find((item) => item.status === 'pending' || item.status === 'rescheduled')?.id ?? rows[0]?.id ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadAppointments(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAppointments]);

  const counts = useMemo(() => ({
    all: appointments.length,
    needs_attention: appointments.filter((item) => item.status === 'pending' || item.status === 'rescheduled').length,
    pending: appointments.filter((item) => item.status === 'pending').length,
    confirmed: appointments.filter((item) => item.status === 'confirmed').length,
    rescheduled: appointments.filter((item) => item.status === 'rescheduled').length,
    cancelled: appointments.filter((item) => item.status === 'cancelled').length,
  }), [appointments]);
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'needs_attention', label: 'Needs attention', count: counts.needs_attention },
    { key: 'all', label: 'All requests', count: counts.all },
    { key: 'pending', label: 'Awaiting response', count: counts.pending },
    { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
    { key: 'rescheduled', label: 'New time needed', count: counts.rescheduled },
    { key: 'cancelled', label: 'Closed', count: counts.cancelled },
  ];
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = appointments
    .filter((item) => (filter === 'all' || (filter === 'needs_attention' ? item.status === 'pending' || item.status === 'rescheduled' : item.status === filter))
      && [item.client_name, item.client_email, item.client_phone, item.company_name, item.service_title, item.notes].some((value) => value?.toLowerCase().includes(normalizedSearch)))
    .sort((a, b) => {
      const activeA = a.status === 'pending' || a.status === 'rescheduled';
      const activeB = b.status === 'pending' || b.status === 'rescheduled';
      if (activeA !== activeB) return activeA ? -1 : 1;
      if (activeA) return `${a.date}${a.time_slot}`.localeCompare(`${b.date}${b.time_slot}`);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  const setStatus = async (item: Appointment, status: Status) => {
    if (item.status === status) return;
    setSavingId(item.id); setSaveError(null);
    try {
      const saved = await updateAppointmentStatus(item.id, status);
      if (!saved) throw new Error('save failed');
      setAppointments((current) => current.map((appointment) => appointment.id === item.id ? { ...appointment, status } : appointment));
    } catch {
      setSaveError({ id: item.id, message: 'The appointment status was not saved. Refresh and try again.' });
    } finally { setSavingId(null); }
  };

  return (
    <main className="mx-auto max-w-[1320px] space-y-5 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">Practice schedule</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Appointment requests</h1>
          <p className="mt-1 text-sm text-slate-600">Review the client’s preferred time, check availability, then record the next step.</p>
        </div>
        <Link href="/book-appointment" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open booking form <ArrowUpRight className="size-4" /></Link>
      </header>

      <section aria-label="Appointment status filters" className="flex gap-5 overflow-x-auto border-b border-slate-200">
        {filters.map((item) => <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)} className={`inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 text-sm ${filter === item.key ? 'border-slate-900 font-semibold text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><span>{item.label}</span><span className={`rounded px-1.5 py-0.5 text-xs tabular-nums ${filter === item.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.count}</span></button>)}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3.5 sm:px-5">
          <div><h2 className="text-sm font-semibold text-slate-900">Client requests</h2><p className="mt-0.5 text-xs text-slate-500">{filtered.length} shown · preferred times are requests, not confirmed bookings</p></div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 px-2.5 sm:w-72"><Search className="size-4 shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client or service" aria-label="Search appointments" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
            <button onClick={() => void loadAppointments()} aria-label="Refresh appointments" className="grid size-9 shrink-0 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"><RefreshCw className="size-4" /></button>
          </div>
        </div>

        {loading ? <div role="status" className="p-12 text-center text-sm text-slate-500">Loading appointment requests…</div>
          : loadError ? <div className="p-8 text-center"><p role="alert" className="text-sm text-rose-700">{loadError}</p><button onClick={() => void loadAppointments()} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-800 underline"><RefreshCw className="size-3.5" />Retry</button></div>
            : filtered.length === 0 ? <div className="p-12 text-center"><Inbox className="mx-auto size-7 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-800">{appointments.length ? 'No requests in this view' : 'No appointment requests yet'}</p><p className="mt-1 text-sm text-slate-500">{appointments.length ? 'Choose another status or adjust your search.' : 'Requests from the public booking form will appear here.'}</p></div>
              : <div className="grid min-h-[560px] lg:grid-cols-[340px_minmax(0,1fr)]">
                <aside aria-label="Appointment request list" className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                  <ul className="max-h-[700px] overflow-y-auto">{filtered.map((item) => <li key={item.id}>
                    <button type="button" onClick={() => setSelectedId(item.id)} aria-current={selected?.id === item.id ? 'true' : undefined} className={`w-full border-b border-slate-100 border-l-2 px-4 py-3.5 text-left hover:bg-slate-50 ${selected?.id === item.id ? 'border-l-slate-800 bg-slate-50' : 'border-l-transparent'}`}>
                      <span className="flex items-start justify-between gap-3"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900">{item.client_name}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{item.service_title}</span></span><span className="shrink-0 text-[11px] text-slate-500">{dateLabel(item.date)}</span></span>
                      <span className="mt-2 flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500"><Clock3 className="size-3.5 shrink-0" />{item.time_slot}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusStyles[item.status]}`}>{statusLabels[item.status]}</span></span>
                    </button>
                  </li>)}</ul>
                </aside>

                <article className="min-w-0 p-5 sm:p-7">
                  {!selected ? <div className="flex min-h-[420px] flex-col items-center justify-center text-center"><CalendarDays className="size-8 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-800">Select a request to review</p><p className="mt-1 text-sm text-slate-500">Client details and decision actions will appear here.</p></div> : <>
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                      <div><p className="text-xs text-slate-500">Received {receivedLabel(selected.created_at)}</p><h3 className="mt-1 text-xl font-semibold text-slate-900">{selected.client_name}</h3>{selected.company_name && <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Building2 className="size-4" />{selected.company_name}</p>}</div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[selected.status]}`}>{statusLabels[selected.status]}</span>
                    </div>

                    <div className="my-5 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><CalendarDays className="size-4" />Preferred appointment time</div>
                      <p className="mt-3 text-lg font-semibold text-slate-900">{dateLabel(selected.date)}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600"><Clock3 className="size-4" />{selected.time_slot}</p>
                      <p className="mt-3 text-xs leading-5 text-slate-500">This is the client’s preferred time. Confirm only after checking availability; the client is not notified by changing this status.</p>
                    </div>

                    <div className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-2">
                      <div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Consultation</p><p className="mt-1.5 text-sm font-medium text-slate-800">{selected.service_title}</p><p className="mt-1 text-xs text-slate-500">{selected.consultation_type}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Contact details</p><a href={`mailto:${selected.client_email}`} className="mt-1.5 flex items-center gap-2 text-sm text-slate-700 hover:underline"><Mail className="size-3.5 text-slate-400" />{selected.client_email}</a>{selected.client_phone && <a href={`tel:${selected.client_phone}`} className="mt-1 flex items-center gap-2 text-sm text-slate-700 hover:underline"><Phone className="size-3.5 text-slate-400" />{selected.client_phone}</a>}</div>
                    </div>

                    {selected.notes && <div className="border-b border-slate-200 py-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Client notes</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.notes}</p></div>}

                    <div className="pt-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Record your decision</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Status changes are internal. Contact the client separately to confirm or request another time.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selected.status === 'pending' || selected.status === 'rescheduled') && <>
                          <button type="button" disabled={savingId === selected.id} onClick={() => void setStatus(selected, 'confirmed')} className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"><Check className="size-4" />Confirm requested time</button>
                          {selected.status !== 'rescheduled' && <button type="button" disabled={savingId === selected.id} onClick={() => void setStatus(selected, 'rescheduled')} className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Ask for another time</button>}
                          <button type="button" disabled={savingId === selected.id} onClick={() => setConfirmClosing(selected)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"><X className="size-4" />Close request</button>
                        </>}
                        {selected.status === 'confirmed' && <button type="button" disabled={savingId === selected.id} onClick={() => void setStatus(selected, 'rescheduled')} className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Mark new time needed</button>}
                        {selected.status === 'cancelled' && <button type="button" disabled={savingId === selected.id} onClick={() => void setStatus(selected, 'pending')} className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Reopen request</button>}
                        <a href={`mailto:${selected.client_email}?subject=${encodeURIComponent('Re: Your appointment request')}`} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><Mail className="size-4" />Email client</a>
                      </div>
                      {savingId === selected.id && <p role="status" className="mt-2 text-xs text-slate-500">Saving decision…</p>}
                      {saveError?.id === selected.id && <p role="alert" className="mt-2 text-xs text-rose-700">{saveError.message}</p>}
                    </div>
                  </>}
                </article>
              </div>}
      </section>
      <ConfirmModal isOpen={!!confirmClosing} title="Close this appointment request?" message={confirmClosing ? `This will move ${confirmClosing.client_name}’s request to closed history. It will not notify the client or cancel anything on their calendar.` : ''} confirmLabel="Close request" isDestructive={false} onCancel={() => setConfirmClosing(null)} onConfirm={() => { const item = confirmClosing; setConfirmClosing(null); if (item) void setStatus(item, 'cancelled'); }} />
    </main>
  );
}
