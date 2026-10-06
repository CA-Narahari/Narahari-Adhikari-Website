'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CalendarDays, Check, Clock3, Mail, MoreHorizontal, Phone, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Appointment } from '@/types';

type AppointmentFilter = 'all' | Appointment['status'];

const formatDate = (value: string) => {
  const parsed = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
};

const statusTone: Record<Appointment['status'], string> = {
  pending: 'bg-[#FFF2D9] text-[#925C08]',
  confirmed: 'bg-[#E8F6EF] text-[#177347]',
  rescheduled: 'bg-[#EAF3FF] text-[#2868B0]',
  cancelled: 'bg-[#F1F3F3] text-[#667677]',
};

export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AppointmentFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const pending = appointments.filter((item) => item.status === 'pending').length;
  const scheduled = appointments.filter((item) => item.status === 'confirmed' || item.status === 'rescheduled').length;
  const cancelled = appointments.filter((item) => item.status === 'cancelled').length;
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return appointments.filter((item) => {
      const matchesFilter = filter === 'all' || item.status === filter;
      const searchText = [item.client_name, item.client_email, item.client_phone, item.company_name, item.service_title, item.notes].join(' ').toLocaleLowerCase();
      return matchesFilter && (!needle || searchText.includes(needle));
    });
  }, [appointments, filter, query]);

  const stats = [
    { label: 'Total requests', value: appointments.length, detail: 'All time', icon: CalendarDays, tint: 'bg-[#E8F6EF] text-[#17694B]' },
    { label: 'New', value: pending, detail: 'Needs response', icon: Clock3, tint: 'bg-[#FFF3DF] text-[#986408]' },
    { label: 'Scheduled', value: scheduled, detail: 'Confirmed meetings', icon: Check, tint: 'bg-[#EAF3FF] text-[#2671C6]' },
    { label: 'Cancelled', value: cancelled, detail: 'Closed requests', icon: X, tint: 'bg-[#F1F3F3] text-[#69797A]' },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 pb-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#19854D]">Practice inbox</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#103F40]">Consultation requests</h1>
          <p className="mt-1 text-sm text-[#657777]">Review client details, respond to requests, and keep meeting slots up to date.</p>
        </div>
        <a href="/book-appointment" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#DCE8E1] bg-white px-3.5 text-xs font-semibold text-[#315253] transition-colors hover:bg-[#F5FAF7]">Preview booking page</a>
      </header>

      <section aria-label="Appointment summary" className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#E3ECE7] bg-white sm:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon, tint }, index) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-4 sm:px-5 ${index > 0 ? 'border-l border-[#E9EFEB]' : ''}`}>
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tint}`}><Icon aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0"><p className="truncate text-[10px] font-medium text-[#6C7D7D]">{label}</p><p className="text-xl font-bold leading-6 tabular-nums text-[#143F40]">{value}</p><p className="truncate text-[10px] text-[#80908F]">{detail}</p></div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E3ECE7] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E9EFEB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div><h2 className="text-sm font-bold text-[#173F40]">Recent consultation requests</h2><p className="mt-1 text-xs text-[#708180]">Latest requests submitted through your website.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative block sm:w-[270px]">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#829392]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, company..." aria-label="Search consultation requests" className="h-10 w-full rounded-lg border border-[#E0E8E3] bg-[#FBFCFB] pl-9 pr-3 text-xs text-[#294849] placeholder:text-[#93A09F] focus:border-[#18864D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#18864D]/15" />
            </label>
            <label className="relative flex h-10 items-center gap-2 rounded-lg border border-[#E0E8E3] bg-white px-3 text-xs text-[#526767]">
              <SlidersHorizontal aria-hidden="true" className="size-3.5 text-[#768887]" />
              <span className="sr-only">Filter by status</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value as AppointmentFilter)} aria-label="Filter by status" className="min-w-24 bg-transparent pr-1 font-medium outline-none">
                <option value="all">All statuses</option><option value="pending">New</option><option value="confirmed">Scheduled</option><option value="rescheduled">Rescheduled</option><option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EAF7F0] text-[#168A4A]"><CalendarDays aria-hidden="true" className="size-5" /></span>
            <h3 className="mt-4 text-sm font-bold text-[#244647]">{appointments.length ? 'No matching requests' : 'No consultation requests yet'}</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#718181]">{appointments.length ? 'Try another name, email, company, service, or status.' : 'Requests submitted from the consultation page will appear here.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead className="bg-[#F6F9F7] text-[10px] font-semibold text-[#6F8180]">
                <tr><th scope="col" className="px-5 py-3">Client</th><th scope="col" className="px-4 py-3">Service</th><th scope="col" className="px-4 py-3">Subject</th><th scope="col" className="px-4 py-3">Date &amp; time</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2EF]">
                {filtered.map((item) => {
                  const isExpanded = expanded === item.id;
                  return <React.Fragment key={item.id}>
                    <tr className="align-middle hover:bg-[#FCFDFC]">
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-semibold text-[#1D4647]">{item.client_name}</p>
                        <p className="mt-1 text-[10px] text-[#7B8988]">{item.company_name || item.client_email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#455F60]">{item.service_title}</td>
                      <td className="max-w-[220px] px-4 py-3.5 text-xs text-[#455F60]"><span className="block truncate">{item.notes || 'No message provided'}</span></td>
                      <td className="px-4 py-3.5"><p className="text-xs font-medium text-[#455F60]">{formatDate(item.date)}</p><p className="mt-1 text-[10px] text-[#7B8988]">{item.time_slot}</p></td>
                      <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusTone[item.status]}`}>{item.status === 'pending' ? 'New' : item.status === 'confirmed' ? 'Scheduled' : item.status}</span></td>
                      <td className="px-4 py-3.5"><div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setExpanded(isExpanded ? null : item.id)} aria-expanded={isExpanded} className="h-8 rounded-lg bg-[#0B4B4C] px-3 text-[10px] font-semibold text-white transition-colors hover:bg-[#083D3F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168A4A]">{isExpanded ? 'Hide' : 'View'}</button>
                        {item.status === 'pending' ? <button type="button" onClick={() => updateAppointmentStatus(item.id, 'confirmed')} aria-label={`Confirm ${item.client_name}'s request`} className="flex size-8 items-center justify-center rounded-lg border border-[#DDE9E1] text-[#168A4A] hover:bg-[#EAF7F0]"><Check aria-hidden="true" className="size-4" /></button> : <button type="button" onClick={() => setExpanded(isExpanded ? null : item.id)} aria-label={`More details for ${item.client_name}`} className="flex size-8 items-center justify-center rounded-lg border border-[#E1E9E4] text-[#617575] hover:bg-[#F4F8F5]"><MoreHorizontal aria-hidden="true" className="size-4" /></button>}
                      </div></td>
                    </tr>
                    {isExpanded && <tr className="bg-[#FBFDFC]"><td colSpan={6} className="px-5 pb-4 pt-1">
                      <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#E6EEE9] bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82908E]">Contact</p><a href={`mailto:${item.client_email}`} className="mt-1 flex items-center gap-1.5 text-xs text-[#245C4C] hover:underline"><Mail aria-hidden="true" className="size-3.5" />{item.client_email}</a><a href={`tel:${item.client_phone}`} className="mt-1 flex items-center gap-1.5 text-xs text-[#455F60] hover:underline"><Phone aria-hidden="true" className="size-3.5" />{item.client_phone}</a></div>
                        <div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82908E]">Organization</p><p className="mt-1 text-xs text-[#455F60]">{item.company_name || 'Not provided'}</p></div>
                        <div><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82908E]">Consultation</p><p className="mt-1 text-xs text-[#455F60]">{item.consultation_type}</p></div>
                        <div className="sm:col-span-2 xl:col-span-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82908E]">Client message</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#455F60]">{item.notes || 'No message provided.'}</p></div>
                        <div className="flex items-end gap-2 xl:col-span-1">{item.status === 'pending' && <button type="button" onClick={() => updateAppointmentStatus(item.id, 'confirmed')} className="min-h-9 rounded-lg bg-[#0B4B4C] px-3 text-[10px] font-semibold text-white hover:bg-[#083D3F]">Confirm request</button>}{item.status !== 'cancelled' && <button type="button" onClick={() => updateAppointmentStatus(item.id, 'cancelled')} className="min-h-9 rounded-lg border border-[#E3E8E5] px-3 text-[10px] font-semibold text-[#6A7776] hover:bg-[#F4F6F5]">Cancel</button>}</div>
                      </div>
                    </td></tr>}
                  </React.Fragment>;
                })}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && <div className="border-t border-[#EDF2EE] px-5 py-3 text-[10px] text-[#7C8A88]">Showing {filtered.length} of {appointments.length} request{appointments.length === 1 ? '' : 's'}</div>}
      </section>
    </div>
  );
}
