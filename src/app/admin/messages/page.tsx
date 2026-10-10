'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, Inbox, Mail, Phone, RefreshCw, Search, Send } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useApp } from '@/context/AppContext';

type Status = 'new' | 'in_progress' | 'closed';
type Message = { id: string; name: string; email: string; phone: string; organization: string; message: string; status: Status; created_at: string };
const formatDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date); };
const statusLabel: Record<Status, string> = { new: 'New', in_progress: 'Follow-up', closed: 'Closed' };

export default function ContactMessagesPage() {
  const { updateContactMessageStatus } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [confirmClosing, setConfirmClosing] = useState<Message | null>(null);

  const loadMessages = useCallback(async () => {
    const client = createSupabaseBrowserClient();
    if (!client) { setError('Supabase is not configured for this site.'); setLoading(false); return; }
    setLoading(true); setError('');
    const { data, error: queryError } = await client.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (queryError) setError('Website enquiries could not be loaded. Check your staff session and database access, then try again.');
    else {
      const rows = (data ?? []) as Message[];
      setMessages(rows);
      setSelectedId((current) => current && rows.some((item) => item.id === current) ? current : rows[0]?.id ?? null);
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadMessages(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadMessages]);

  const counts = useMemo(() => ({ all: messages.length, new: messages.filter((item) => item.status === 'new').length, in_progress: messages.filter((item) => item.status === 'in_progress').length, closed: messages.filter((item) => item.status === 'closed').length }), [messages]);
  const query = search.trim().toLowerCase();
  const visible = messages.filter((item) => (filter === 'all' || item.status === filter) && [item.name, item.email, item.organization, item.message].some((value) => value?.toLowerCase().includes(query)));
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  const setStatus = async (message: Message, status: Status) => {
    if (message.status === status) return;
    setSaving(true); setSaveError('');
    try {
      const saved = await updateContactMessageStatus(message.id, status);
      if (!saved) throw new Error('save failed');
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status } : item));
    } catch { setSaveError('The enquiry status was not saved. Refresh the inbox and try again.'); }
    finally { setSaving(false); }
  };

  const requestStatusChange = (message: Message, status: Status) => {
    if (message.status === status) return;
    if (status === 'closed') setConfirmClosing(message);
    else void setStatus(message, status);
  };

  return (
    <main className="mx-auto max-w-[1320px] space-y-5 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-500">General contact</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Website enquiries</h1><p className="mt-1 text-sm text-slate-600">Read what visitors sent and follow up from your email. Inbox status does not send a reply.</p></div>
        <Link href="/contact" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open contact page <Send className="size-4" /></Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([{ key: 'all', label: 'All messages', value: counts.all }, { key: 'new', label: 'New', value: counts.new }, { key: 'in_progress', label: 'Follow-up', value: counts.in_progress }, { key: 'closed', label: 'Closed', value: counts.closed }] as const).map((item) => <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)} className={`rounded-md border px-3 py-2.5 text-left ${filter === item.key ? 'border-slate-500 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}><span className="block text-xs text-slate-500">{item.label}</span><span className="mt-1 block text-lg font-semibold tabular-nums text-slate-900">{item.value}</span></button>)}
      </div>

      <section className="grid min-h-[560px] overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-3"><label className="flex h-9 items-center gap-2 rounded-md border border-slate-300 px-2.5"><Search className="size-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search enquiries" aria-label="Search website enquiries" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label><p className="mt-2 px-0.5 text-xs text-slate-500">{visible.length} of {messages.length} messages</p></div>
          {loading ? <p role="status" className="p-8 text-center text-sm text-slate-500">Loading inbox…</p> : error ? <div className="p-5 text-center"><p role="alert" className="text-sm text-rose-700">{error}</p><button onClick={() => void loadMessages()} className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline"><RefreshCw className="size-3.5" />Retry</button></div> : visible.length === 0 ? <div className="p-8 text-center"><Inbox className="mx-auto size-6 text-slate-300" /><p className="mt-2 text-sm font-medium text-slate-800">{messages.length ? 'No matching messages' : 'Inbox is empty'}</p><p className="mt-1 text-xs leading-5 text-slate-500">{messages.length ? 'Adjust the search or status filter.' : 'New website contact messages will appear here.'}</p></div> : <ul className="max-h-[680px] overflow-y-auto">{visible.map((item) => <li key={item.id}><button type="button" onClick={() => setSelectedId(item.id)} aria-current={selected?.id === item.id ? 'true' : undefined} className={`w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${selected?.id === item.id ? 'border-l-2 border-l-slate-800 bg-slate-50' : 'border-l-2 border-l-transparent'}`}><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-slate-900">{item.name}</span><time className="shrink-0 text-[11px] text-slate-500">{formatDate(item.created_at)}</time></span><span className="mt-1 flex items-center gap-2"><span className={`size-1.5 rounded-full ${item.status === 'new' ? 'bg-amber-500' : item.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'}`} /><span className="text-xs text-slate-500">{statusLabel[item.status]}</span>{item.organization && <span className="truncate text-xs text-slate-400">· {item.organization}</span>}</span><span className="mt-1 block truncate text-xs text-slate-500">{item.message}</span></button></li>)}</ul>}
        </aside>

        <article className="min-w-0 p-5 sm:p-7">
          {!selected ? <div className="flex min-h-[400px] flex-col items-center justify-center text-center"><Inbox className="size-8 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-800">Select an enquiry to read it</p><p className="mt-1 text-sm text-slate-500">Choose a message from the inbox list.</p></div> : <>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-xs text-slate-500">Received {formatDate(selected.created_at)}</p><h2 className="mt-1 text-xl font-semibold text-slate-900">{selected.name}</h2>{selected.organization && <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Building2 className="size-4" />{selected.organization}</p>}</div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selected.status === 'new' ? 'bg-amber-50 text-amber-800' : selected.status === 'in_progress' ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>{statusLabel[selected.status]}</span></div>
            <div className="grid gap-2 border-b border-slate-200 py-4 text-sm sm:grid-cols-2"><a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-950"><Mail className="size-4 text-slate-400" />{selected.email}</a>{selected.phone && <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-950"><Phone className="size-4 text-slate-400" />{selected.phone}</a>}</div>
            <div className="min-h-48 py-5"><p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.message}</p></div>
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4"><a href={`mailto:${selected.email}?subject=${encodeURIComponent('Re: Your enquiry to Narahari Adhikari')}`} className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700"><Mail className="size-4" />Reply by email</a>{selected.phone && <a href={`tel:${selected.phone}`} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><Phone className="size-4" />Call</a>}{selected.status === 'new' && <button disabled={saving} onClick={() => void setStatus(selected, 'in_progress')} className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Mark follow-up</button>}{selected.status !== 'closed' ? <button disabled={saving} onClick={() => requestStatusChange(selected, 'closed')} className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Close enquiry</button> : <button disabled={saving} onClick={() => void setStatus(selected, 'in_progress')} className="h-9 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Reopen</button>}<button onClick={() => void loadMessages()} aria-label="Refresh enquiries" className="ml-auto grid size-9 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"><RefreshCw className="size-4" /></button></div>
            {saving && <p role="status" className="mt-2 text-xs text-slate-500">Saving inbox status…</p>}{saveError && <p role="alert" className="mt-2 text-xs text-rose-700">{saveError}</p>}<p className="mt-3 text-xs text-slate-500">Changing status is an internal tracking action. Use Reply by email to contact the visitor.</p>
          </>}
        </article>
      </section>
      <ConfirmModal isOpen={!!confirmClosing} title="Close this enquiry?" message={confirmClosing ? `This will mark the message from ${confirmClosing.name} as closed in the CMS. It will not send a reply.` : ''} confirmLabel="Close enquiry" isDestructive={false} onCancel={() => setConfirmClosing(null)} onConfirm={() => { const message = confirmClosing; setConfirmClosing(null); if (message) void setStatus(message, 'closed'); }} />
    </main>
  );
}
