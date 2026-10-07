'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertCircle, Bell, CheckCircle2, ExternalLink, Eye, FileImage, LoaderCircle, Megaphone, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Announcement } from '@/types';

type FormState = Omit<Announcement, 'id' | 'created_at'>;
const emptyForm = (): FormState => ({ title: '', message: '', link_url: '', poster_url: '', is_active: false, display_location: 'all_pages', target_path: '', expires_at: null });

export default function AdminAnnouncementsPage() {
  const { announcements, announcementsLoaded, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posterName, setPosterName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const choosePoster = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const suggested = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || file.name.replace(/\.[^.]+$/, '');
    setPosterName(suggested);
    setUploading(true); setFeedback(null);
    try {
      const data = new FormData();
      data.append('file', file); data.append('bucket', 'website-media'); data.append('folder', 'announcements'); data.append('filename', suggested);
      const response = await fetch('/api/admin/storage/upload', { method: 'POST', body: data });
      const result = await response.json() as { publicUrl?: string; error?: string };
      if (!response.ok || !result.publicUrl) throw new Error(result.error || 'Poster upload failed.');
      setField('poster_url', result.publicUrl);
      setFeedback({ kind: 'success', message: 'Poster uploaded to the shared media bucket.' });
    } catch (error) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'Poster upload failed.' });
    } finally { setUploading(false); event.target.value = ''; }
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm()); setPosterName(''); setFeedback(null); };
  const openEdit = (item: Announcement) => {
    setEditingId(item.id);
    setForm({ title: item.title || '', message: item.message || '', link_url: item.link_url || '', poster_url: item.poster_url || '', is_active: item.is_active, display_location: item.display_location || 'all_pages', target_path: item.target_path || '', expires_at: item.expires_at || null });
    setPosterName(item.poster_url?.split('/').pop() || ''); setFeedback(null);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setFeedback(null);
    const payload: FormState = {
      ...form,
      title: form.title.trim(), message: form.message.trim(),
      link_url: null, poster_url: form.poster_url?.trim() || null,
      target_path: form.display_location === 'specific_page' ? form.target_path?.trim() || '/' : null,
      expires_at: form.expires_at || null,
    };
    const ok = editingId ? await updateAnnouncement(editingId, payload) : await addAnnouncement(payload);
    setSaving(false);
    if (!ok) { setFeedback({ kind: 'error', message: 'The notice could not be saved. Confirm that the announcements database migration is applied and your CMS session is active.' }); return; }
    setFeedback({ kind: 'success', message: editingId ? 'Notice saved.' : 'Notice added.' });
    setEditingId(null); setForm(emptyForm()); setPosterName('');
  };

  const remove = async (item: Announcement) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const ok = await deleteAnnouncement(item.id);
    setFeedback(ok ? { kind: 'success', message: 'Notice removed from the database and public site.' } : { kind: 'error', message: 'The notice could not be deleted.' });
    if (editingId === item.id) openNew();
  };

  const inputClass = 'mt-1.5 h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-3 text-sm text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10';
  const labelClass = 'block text-xs font-semibold text-[#365555]';

  return <div className="mx-auto max-w-6xl space-y-6 pb-12">
    <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div><p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]"><Megaphone className="size-4" /> Public notices</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Announcements</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Create several notices, choose where each appears, and optionally upload a poster. Every notice is saved in Supabase.</p></div>
      <Link href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] hover:bg-[#F5FAF7]">View website <ExternalLink className="size-4 text-[#168A4A]" /></Link>
    </header>

    {feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{feedback.kind === 'error' ? <AlertCircle className="mr-2 inline size-4" /> : <CheckCircle2 className="mr-2 inline size-4" />}{feedback.message}</p>}

    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-[#EDF2EF] p-5 sm:px-6"><div><h2 className="font-bold text-[#123F40]">Saved notices</h2><p className="mt-1 text-xs text-[#718181]">{announcements.length} {announcements.length === 1 ? 'notice' : 'notices'} in the database</p></div><button type="button" onClick={openNew} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-[#0B4B4C] px-3.5 text-xs font-semibold text-white hover:bg-[#083D3F]"><Plus className="size-4" />New notice</button></div>
        {!announcementsLoaded ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 text-sm text-[#718181]"><LoaderCircle className="size-4 animate-spin text-[#168A4A]" />Loading notices…</div> : announcements.length === 0 ? <div className="p-12 text-center"><Bell className="mx-auto size-8 text-[#98B8A6]" /><h3 className="mt-3 font-semibold text-[#143F40]">No notices yet</h3><p className="mt-1 text-sm text-[#718181]">Create a text notice or upload a custom poster.</p></div> : <ul className="divide-y divide-[#EDF2EF]">{announcements.map((item) => <li key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${item.is_active ? 'bg-[#EAF8F1] text-[#168A4A]' : 'bg-slate-100 text-slate-500'}`}>{item.poster_url ? <FileImage className="size-4" /> : <Megaphone className="size-4" />}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#123F40]">{item.title}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{item.is_active ? 'Published' : 'Hidden'}</span></div><p className="mt-1 line-clamp-2 text-sm leading-5 text-[#66797A]">{item.message}</p><p className="mt-1 text-[11px] text-[#82918D]">{item.display_location === 'all_pages' ? 'All pages' : item.display_location === 'home_page' ? 'Home page' : item.target_path || 'Specific page'}</p></div></div>
          <div className="flex shrink-0 gap-2"><button type="button" onClick={() => openEdit(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8E4DE] px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7]"><Pencil className="size-3.5" />Edit</button><button type="button" onClick={() => void remove(item)} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${item.title}`}><Trash2 className="size-4" /></button></div>
        </li>)}</ul>}
      </section>

      <form onSubmit={(event) => { void save(event); }} className="space-y-4 rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-[#EDF2EF] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#168A4A]">{editingId ? 'Editing notice' : 'New notice'}</p><h2 className="mt-1 text-base font-bold text-[#123F40]">Notice details</h2></div>{editingId && <button type="button" aria-label="Stop editing" onClick={openNew} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="size-4" /></button>}</div>
        <label className={labelClass}>Notice title *<input required maxLength={140} value={form.title} onChange={(event) => setField('title', event.target.value)} className={inputClass} placeholder="e.g. Office holiday notice" /></label>
        <label className={labelClass}>Banner message *<textarea required maxLength={600} rows={4} value={form.message} onChange={(event) => setField('message', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm leading-6 text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10" placeholder="Write the notice shown to visitors." /></label>
        <fieldset><legend className={labelClass}>Show notice on</legend><div className="mt-2 grid gap-2">{([{ value: 'all_pages', label: 'All public pages' }, { value: 'home_page', label: 'Home page' }, { value: 'specific_page', label: 'One page' }] as const).map((option) => <label key={option.value} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-medium ${form.display_location === option.value ? 'border-[#A8D9BA] bg-[#F0FAF4] text-[#145B38]' : 'border-[#E3ECE7] text-[#516866]'}`}><input type="radio" name="announcement-location" value={option.value} checked={form.display_location === option.value} onChange={() => setField('display_location', option.value)} className="accent-[#168A4A]" />{option.label}</label>)}</div></fieldset>
        {form.display_location === 'specific_page' && <label className={labelClass}>Page path *<input required value={form.target_path || ''} onChange={(event) => setField('target_path', event.target.value)} className={inputClass} placeholder="/updates" /></label>}
        <div className="rounded-xl border border-dashed border-[#CBDDD2] bg-[#F8FBF9] p-3"><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-semibold text-[#365555]">Custom poster (optional)</p><p className="mt-1 text-[11px] text-[#82918D]">Images use the notice title as a clean filename; the extension comes from the file.</p></div><label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#D8E4DE] bg-white px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7]">{uploading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}Upload<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading || saving} onChange={(event) => { void choosePoster(event); }} className="sr-only" /></label></div>
          {form.poster_url && <div className="mt-3 flex items-center gap-3"><img src={form.poster_url} alt={form.title || 'Announcement poster'} className="h-16 w-24 rounded-lg border border-[#E2ECE6] object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs text-[#365555]">{posterName || form.poster_url}</p><button type="button" onClick={() => { setField('poster_url', ''); setPosterName(''); }} className="mt-1 text-[11px] font-semibold text-rose-700 hover:underline">Remove poster</button></div></div>}
        </div>
        <label className="flex items-start gap-2.5 rounded-xl bg-[#F7FAF8] p-3 text-xs text-[#365555]"><input type="checkbox" checked={form.is_active} onChange={(event) => setField('is_active', event.target.checked)} className="mt-0.5 size-4 accent-[#168A4A]" /><span><strong>Publish this notice</strong><span className="mt-0.5 block text-[11px] text-[#718181]">Active notices appear publicly in the chosen location.</span></span></label>
        <div className="flex gap-2 border-t border-[#EDF2EF] pt-4"><button type="submit" disabled={saving || uploading} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white hover:bg-[#083D3F] disabled:opacity-60">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? 'Saving…' : editingId ? 'Save notice' : 'Add notice'}</button>{editingId && <button type="button" onClick={openNew} className="min-h-10 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#365555] hover:bg-[#F5FAF7]">Cancel</button>}</div>
      </form>
    </div>
  </div>;
}
