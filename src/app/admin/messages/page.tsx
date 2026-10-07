'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone, RefreshCw, Search, Send, UserRound } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
  status: 'new' | 'reviewed' | 'closed';
  created_at: string;
};
type StatusFilter = 'all' | ContactMessage['status'];

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    const client = createSupabaseBrowserClient();
    if (!client) { setError('Database connection is not configured.'); setLoading(false); return; }
    setLoading(true);
    setError('');
    const { data, error: queryError } = await client.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (queryError) {
      setError('Could not load website enquiries. Check your CMS session and database access, then refresh.');
    } else {
      setMessages((data || []) as ContactMessage[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadMessages(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadMessages]);

  const updateStatus = async (id: string, status: ContactMessage['status']) => {
    const client = createSupabaseBrowserClient();
    if (!client) { setError('Database connection is not configured.'); return; }
    setUpdatingId(id);
    setError('');
    const { data, error: updateError } = await client.from('contact_messages').update({ status }).eq('id', id).select('id').maybeSingle();
    if (updateError || !data) {
      setError('The enquiry status could not be saved. Check your CMS access and try again.');
    } else {
      setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
    }
    setUpdatingId(null);
  };

  const counts = useMemo(() => ({
    all: messages.length,
    new: messages.filter((message) => message.status === 'new').length,
    reviewed: messages.filter((message) => message.status === 'reviewed').length,
    closed: messages.filter((message) => message.status === 'closed').length,
  }), [messages]);
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = messages.filter((message) => {
    const matchesSearch = [message.name, message.email, message.organization, message.message].some((value) => value?.toLowerCase().includes(normalizedSearch));
    return matchesSearch && (statusFilter === 'all' || message.status === statusFilter);
  });

  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All enquiries', count: counts.all },
    { key: 'new', label: 'New', count: counts.new },
    { key: 'reviewed', label: 'Reviewed', count: counts.reviewed },
    { key: 'closed', label: 'Closed', count: counts.closed },
  ];

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]">Practice inbox</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Website enquiries</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">These are general messages sent through the public Contact form. Meeting requests submitted through the booking form are listed separately under Appointments.</p>
        </div>
        <button type="button" onClick={() => void loadMessages()} disabled={loading} className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] transition hover:bg-[#F5FAF7] disabled:cursor-wait disabled:opacity-60"><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />Refresh inbox</button>
      </header>

      <section aria-label="Enquiry totals" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {filters.map((filter) => <button key={filter.key} type="button" onClick={() => setStatusFilter(filter.key)} aria-pressed={statusFilter === filter.key} className={`rounded-2xl border p-4 text-left transition ${statusFilter === filter.key ? 'border-[#A9D7B9] bg-[#F1FAF4]' : 'border-[#E2ECE6] bg-white hover:border-[#C6D9CE]'}`}><span className="block text-[10px] font-bold uppercase tracking-[.11em] text-[#718181]">{filter.label}</span><span className="mt-1 block text-2xl font-bold tabular-nums text-[#073E43]">{filter.count}</span></button>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#EDF2EF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#EAF8F1] text-[#14864B]"><Mail className="size-5" /></span><div><h2 className="font-bold text-[#123F40]">Contact form messages</h2><p className="text-xs text-[#718181]">{filtered.length} shown · {messages.length} total</p></div></div>
          <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[#D5E0DC] px-3 text-sm focus-within:border-[#168A4A] sm:max-w-sm"><Search className="size-4 shrink-0 text-[#82918D]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or message" aria-label="Search website enquiries" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#91A19C]" /></label>
        </div>

        {error && <p role="alert" className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {loading ? <div role="status" className="p-12 text-center text-sm text-[#718181]">Loading website enquiries…</div> : filtered.length === 0 ? <div className="p-12 text-center"><Mail className="mx-auto size-8 text-[#98B8A6]" /><h3 className="mt-3 font-bold text-[#123F40]">{messages.length ? 'No matching enquiries' : 'No enquiries yet'}</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#718181]">{messages.length ? 'Try another search or choose a different status.' : 'When someone sends a message through the public Contact form, it will appear here. Appointment bookings are managed on their own page.'}</p>{!messages.length && <Link href="/contact" target="_blank" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#14864B] hover:underline">Open the public contact form <Send className="size-3.5" /></Link>}</div> : <ul className="divide-y divide-[#EDF2EF]">{filtered.map((message) => <li key={message.id} className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_190px] sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><span className="grid size-9 place-items-center rounded-full bg-[#EAF8F1] text-[#168A4A]"><UserRound className="size-4" /></span><h3 className="font-bold text-[#123F40]">{message.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${message.status === 'new' ? 'bg-[#FFF5DE] text-[#98610D]' : message.status === 'reviewed' ? 'bg-[#EAF3FF] text-[#2869A8]' : 'bg-slate-100 text-slate-600'}`}>{message.status}</span><time className="text-xs text-[#82918D]">{dateLabel(message.created_at)}</time></div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#52706C]"><a className="inline-flex items-center gap-1.5 hover:text-[#168A4A]" href={`mailto:${message.email}`}><Mail className="size-3.5" />{message.email}</a>{message.phone && <a className="inline-flex items-center gap-1.5 hover:text-[#168A4A]" href={`tel:${message.phone}`}><Phone className="size-3.5" />{message.phone}</a>}{message.organization && <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5" />{message.organization}</span>}</div>
            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F7FAF8] p-4 text-sm leading-6 text-[#405A5B]">{message.message}</p>
          </div>
          <label className="text-xs font-semibold text-[#66797A] sm:self-start">Enquiry status<select value={message.status} disabled={updatingId === message.id} onChange={(event) => void updateStatus(message.id, event.target.value as ContactMessage['status'])} className="mt-2 block h-10 w-full rounded-xl border border-[#D5E0DC] bg-white px-3 text-sm capitalize text-[#123F40] outline-none focus:border-[#168A4A] disabled:opacity-60"><option value="new">New</option><option value="reviewed">Reviewed</option><option value="closed">Closed</option></select>{updatingId === message.id && <span role="status" className="mt-1 block text-[11px] text-[#82918D]">Saving status…</span>}</label>
        </li>)}</ul>}
      </section>
    </div>
  );
}
