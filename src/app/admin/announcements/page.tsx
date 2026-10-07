'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, Bell, CheckCircle2, ExternalLink, FileImage, LoaderCircle, Megaphone, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import type { Announcement } from '@/types';

type FormState = Omit<Announcement, 'id' | 'created_at'>;
const emptyForm = (): FormState => ({ title: '', message: '', link_url: null, poster_url: null, is_active: false, display_location: 'all_pages', target_path: null, expires_at: null });

export default function AdminAnnouncementsPage() {
  const { announcements, announcementsLoaded, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posterName, setPosterName] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const openNew = () => { setEditingId(null); setForm(emptyForm()); setPosterName(''); setFeedback(null); };
  const openEdit = (item: Announcement) => {
    setEditingId(item.id);
    setForm({ title: item.title || '', message: item.message || '', link_url: null, poster_url: item.poster_url || null, is_active: item.is_active, display_location: 'all_pages', target_path: null, expires_at: item.expires_at || null });
    setPosterName(item.poster_url?.split('/').pop() || ''); setFeedback(null);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.poster_url) { setFeedback({ kind: 'error', message: 'Choose the announcement artwork from the media library before saving.' }); return; }
    setSaving(true); setFeedback(null);
    const payload: FormState = { ...form, title: form.title.trim(), message: form.message.trim(), link_url: null, poster_url: form.poster_url.trim(), display_location: 'all_pages', target_path: null, expires_at: form.expires_at || null };
    const ok = editingId ? await updateAnnouncement(editingId, payload) : await addAnnouncement(payload);
    setSaving(false);
    if (!ok) { setFeedback({ kind: 'error', message: 'The notice could not be saved. Confirm your CMS access and database connection, then try again.' }); return; }
    setFeedback({ kind: 'success', message: editingId ? 'Notice saved.' : 'Notice added.' });
    setEditingId(null); setForm(emptyForm()); setPosterName('');
  };

  const remove = async (item: Announcement) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const ok = await deleteAnnouncement(item.id);
    setFeedback(ok ? { kind: 'success', message: 'Notice removed from the database and public site.' } : { kind: 'error', message: 'The notice could not be deleted.' });
    if (editingId === item.id) openNew();
  };

  const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-[#D6E3DD] bg-white px-3.5 text-sm text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:bg-[#F6F9F7]';
  const labelClass = 'block text-xs font-semibold text-[#365555]';

  return <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
    <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div><p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]"><Megaphone className="size-4" /> Public notices</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Announcements</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Create poster notices that open in a fixed, centered banner on the public site.</p></div>
      <div className="flex flex-wrap gap-2"><Link href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] hover:bg-[#F5FAF7]">View website <ExternalLink className="size-4 text-[#168A4A]" /></Link><button type="button" onClick={openNew} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white hover:bg-[#083D3F]"><Plus className="size-4" />New notice</button></div>
    </header>

    {feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{feedback.kind === 'error' ? <AlertCircle className="mr-2 inline size-4" /> : <CheckCircle2 className="mr-2 inline size-4" />}{feedback.message}</p>}

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-[#EDF2EF] p-5 sm:px-6"><div><h2 className="font-bold text-[#123F40]">Saved notices</h2><p className="mt-1 text-xs text-[#718181]">{announcements.length} {announcements.length === 1 ? 'notice' : 'notices'} saved in the database</p></div><Bell className="size-5 text-[#168A4A]" /></div>
        {!announcementsLoaded ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 text-sm text-[#718181]"><LoaderCircle className="size-4 animate-spin text-[#168A4A]" />Loading notices…</div> : announcements.length === 0 ? <div className="p-12 text-center"><Bell className="mx-auto size-8 text-[#98B8A6]" /><h3 className="mt-3 font-semibold text-[#143F40]">No notices yet</h3><p className="mt-1 text-sm text-[#718181]">Select a poster from the media library to create the first one.</p></div> : <ul className="divide-y divide-[#EDF2EF]">{announcements.map((item) => <li key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${item.is_active ? 'bg-[#EAF8F1] text-[#168A4A]' : 'bg-slate-100 text-slate-500'}`}><FileImage className="size-4" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#123F40]">{item.title}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{item.is_active ? 'Visible on site' : 'Draft'}</span></div>{item.message && <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#66797A]">{item.message}</p>}<p className="mt-1 text-[11px] text-[#82918D]">Centered banner · all public pages</p></div></div>
          <div className="flex shrink-0 gap-2"><button type="button" onClick={() => openEdit(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8E4DE] px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7]"><Pencil className="size-3.5" />Edit</button><button type="button" onClick={() => void remove(item)} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${item.title}`}><Trash2 className="size-4" /></button></div>
        </li>)}</ul>}
      </section>

      <form onSubmit={(event) => { void save(event); }} className="space-y-5 rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3 border-b border-[#EDF2EF] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#168A4A]">{editingId ? 'Editing notice' : 'Notice editor'}</p><h2 className="mt-1 text-xl font-bold text-[#123F40]">{editingId ? 'Edit announcement' : 'Create announcement'}</h2><p className="mt-1 text-sm text-[#718181]">Every published announcement opens centered on the public page.</p></div>{editingId && <button type="button" aria-label="Stop editing" onClick={openNew} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="size-4" /></button>}</div>

        <label className={labelClass}>Notice title *<input required maxLength={140} value={form.title} onChange={(event) => setField('title', event.target.value)} className={inputClass} placeholder="e.g. Important notice" /></label>
        <div className="space-y-2"><div className="flex items-center justify-between gap-3"><div><p className={labelClass}>Announcement artwork *</p><p className="mt-1 text-xs font-normal text-[#82918D]">Choose an image from the media library or upload it there.</p></div><button type="button" onClick={() => setLibraryOpen(true)} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-xs font-semibold text-white hover:bg-[#083D3F]"><FileImage className="size-4" />{form.poster_url ? 'Replace image' : 'Choose image'}</button></div>
          {form.poster_url ? <div className="flex items-center gap-4 rounded-xl border border-[#E2ECE6] bg-[#F8FBF9] p-3"><Image src={form.poster_url} alt={form.title || 'Announcement artwork'} width={180} height={110} unoptimized className="h-20 w-32 rounded-lg border border-[#DDE8E2] bg-white object-contain" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#365555]">{posterName || 'Selected image'}</p><p className="mt-1 break-all text-[11px] text-[#82918D]">{form.poster_url}</p><button type="button" onClick={() => { setField('poster_url', null); setPosterName(''); }} className="mt-1 text-xs font-semibold text-rose-700 hover:underline">Remove image</button></div></div> : <button type="button" onClick={() => setLibraryOpen(true)} className="grid min-h-40 w-full place-items-center rounded-2xl border-2 border-dashed border-[#C7DCD0] bg-[#F8FBF9] text-center transition hover:border-[#168A4A] hover:bg-[#F0FAF4]"><span><FileImage className="mx-auto size-8 text-[#168A4A]" /><span className="mt-2 block text-sm font-semibold text-[#365555]">Select announcement image</span><span className="mt-1 block text-xs text-[#82918D]">Media Library → Upload New</span></span></button>}</div>

        <label className={labelClass}>Message <span className="font-normal text-[#82918D]">(optional)</span><textarea maxLength={600} rows={3} value={form.message} onChange={(event) => setField('message', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D6E3DD] px-3.5 py-3 text-sm leading-6 text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10" placeholder="Add a short message to appear with the poster, if needed." /></label>

        <fieldset className="rounded-xl border border-[#E3ECE7] bg-[#FAFCFB] p-4"><legend className={labelClass}>Visibility</legend><div className="mt-2 grid gap-2 sm:grid-cols-2"><label className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm ${!form.is_active ? 'border-[#A8D9BA] bg-[#F0FAF4]' : 'border-[#E3ECE7] bg-white'}`}><input type="radio" name="announcement-visibility" checked={!form.is_active} onChange={() => setField('is_active', false)} className="mt-0.5 accent-[#168A4A]" /><span><strong className="block text-[#365555]">Draft</strong><span className="mt-0.5 block text-xs font-normal text-[#718181]">Saved in CMS; visitors cannot see it.</span></span></label><label className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm ${form.is_active ? 'border-[#A8D9BA] bg-[#F0FAF4]' : 'border-[#E3ECE7] bg-white'}`}><input type="radio" name="announcement-visibility" checked={form.is_active} onChange={() => setField('is_active', true)} className="mt-0.5 accent-[#168A4A]" /><span><strong className="block text-[#365555]">Visible on website</strong><span className="mt-0.5 block text-xs font-normal text-[#718181]">Visitors see it in the centered notice banner.</span></span></label></div></fieldset>

        <div className="flex gap-2 border-t border-[#EDF2EF] pt-4"><button type="submit" disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white hover:bg-[#083D3F] disabled:opacity-60">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : form.is_active ? 'Publish notice' : 'Save draft'}</button>{editingId && <button type="button" onClick={openNew} className="min-h-11 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#365555] hover:bg-[#F5FAF7]">Cancel</button>}</div>
      </form>
    </div>

    <MediaLibraryModal isOpen={libraryOpen} mode="featured" storageFolder="announcements" initialAltText={form.title} initialImageName={posterName} onClose={() => setLibraryOpen(false)} onSelect={(image) => { setField('poster_url', image.url); setPosterName(image.imageName || image.url.split('/').pop() || ''); setLibraryOpen(false); }} />
  </div>;
}
