'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import type { TaxUpdate } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock3, ExternalLink, FileText, LoaderCircle, Megaphone, Pencil, Plus, Search, Trash2, X } from 'lucide-react';

type UpdateCategory = TaxUpdate['category'];
type UpdateForm = Omit<TaxUpdate, 'id'>;
const categories: UpdateCategory[] = ['Income Tax', 'VAT', 'Customs', 'Corporate Tax', 'Finance Acts', 'Circulars'];
const today = () => new Date().toISOString().slice(0, 10);
const blankForm = (): UpdateForm => ({
  title: '', slug: '', category: 'VAT', summary: '', content: '', source_name: '',
  source_url: '', is_urgent: false, status: 'published', published_at: today(),
});

export default function AdminUpdatesPage() {
  const { taxUpdates, taxUpdatesLoaded, addTaxUpdate, updateTaxUpdate, deleteTaxUpdate } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | UpdateCategory>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaxUpdate | null>(null);
  const [form, setForm] = useState<UpdateForm>(blankForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaxUpdate | null>(null);

  const publishedCount = taxUpdates.filter((item) => item.status === 'published').length;
  const draftCount = taxUpdates.filter((item) => item.status === 'draft').length;
  const urgentCount = taxUpdates.filter((item) => item.is_urgent).length;

  const visibleUpdates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return taxUpdates.filter((item) => {
      const matchesSearch = !normalized || [item.title, item.summary, item.content, item.source_name, item.category]
        .some((value) => value?.toLowerCase().includes(normalized));
      return matchesSearch && (statusFilter === 'all' || item.status === statusFilter)
        && (categoryFilter === 'all' || item.category === categoryFilter);
    });
  }, [taxUpdates, query, statusFilter, categoryFilter]);

  const openEditor = (item?: TaxUpdate) => {
    setFeedback(null);
    setEditing(item || null);
    setForm(item ? {
      title: item.title,
      slug: item.slug,
      category: item.category,
      summary: item.summary || '',
      content: item.content || '',
      source_name: item.source_name || '',
      source_url: item.source_url || '',
      is_urgent: item.is_urgent,
      status: item.status,
      published_at: item.published_at || today(),
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      focus_keyword: item.focus_keyword || '',
      image_alt: item.image_alt || '',
    } : blankForm());
    setIsModalOpen(true);
  };

  const setField = <K extends keyof UpdateForm>(key: K, value: UpdateForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    const cleanTitle = form.title.trim();
    const payload: UpdateForm = {
      ...form,
      title: cleanTitle,
      slug: (form.slug || cleanTitle).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      summary: form.summary.trim(),
      content: form.content.trim(),
      source_name: form.source_name.trim(),
      source_url: form.source_url.trim(),
      published_at: form.published_at || today(),
    };
    let saved = false;
    try {
      saved = editing ? await updateTaxUpdate(editing.id, payload) : await addTaxUpdate(payload);
    } catch {
      saved = false;
    }
    setSaving(false);
    if (!saved) {
      setFeedback({ kind: 'error', message: 'The update could not be saved to the database. Check your CMS access and try again.' });
      return;
    }
    setIsModalOpen(false);
    setFeedback({ kind: 'success', message: editing ? 'Update changes saved.' : 'Update added to the database.' });
  };

  const toggleStatus = async (item: TaxUpdate) => {
    setFeedback(null);
    let saved = false;
    try { saved = await updateTaxUpdate(item.id, { status: item.status === 'published' ? 'draft' : 'published' }); } catch { saved = false; }
    setFeedback(saved
      ? { kind: 'success', message: item.status === 'published' ? 'Update saved as a draft and hidden from the public page.' : 'Update is now published on the public page.' }
      : { kind: 'error', message: 'Update status could not be changed. Try again.' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    let deleted = false;
    try { deleted = await deleteTaxUpdate(deleteTarget.id); } catch { deleted = false; }
    if (!deleted) {
      setFeedback({ kind: 'error', message: 'The update could not be deleted. Check your CMS access and try again.' });
      return;
    }
    setDeleteTarget(null);
    setFeedback({ kind: 'success', message: 'Update removed from the database and public page.' });
  };

  const inputClass = 'mt-1.5 h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-3 text-sm text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:cursor-wait disabled:bg-[#F6F9F7]';
  const labelClass = 'block text-xs font-semibold text-[#365555]';

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
      <ConfirmModal isOpen={!!deleteTarget} title="Delete statutory update" message={`Delete “${deleteTarget?.title}”? It will be removed from the public Updates page.`} confirmText="Delete update" cancelText="Keep update" isDanger onConfirm={() => { void confirmDelete(); }} onCancel={() => setDeleteTarget(null)} />

      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]"><Megaphone className="size-4" /> Public website content</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Statutory updates</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Create and maintain regulatory notices with a checked source, clear status, and publication date.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/updates" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] hover:bg-[#F5FAF7]">Preview Updates <ExternalLink className="size-4 text-[#168A4A]" /></Link>
          <button type="button" onClick={() => openEditor()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white transition hover:bg-[#083D3F]"><Plus className="size-4" /> Add update</button>
        </div>
      </header>

      {feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{feedback.kind === 'error' ? <AlertCircle className="mr-2 inline size-4" /> : <CheckCircle2 className="mr-2 inline size-4" />}{feedback.message}</p>}

      <section aria-label="Update totals" className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">All updates</p><p className="mt-1 text-2xl font-bold text-[#073E43]">{taxUpdatesLoaded ? taxUpdates.length : '—'}</p><p className="mt-1 text-xs text-[#718181]">Database records</p></div>
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Published</p><p className="mt-1 text-2xl font-bold text-[#168A4A]">{taxUpdatesLoaded ? publishedCount : '—'}</p><p className="mt-1 text-xs text-[#718181]">Visible to website visitors</p></div>
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Drafts · urgent</p><p className="mt-1 text-2xl font-bold text-[#073E43]">{taxUpdatesLoaded ? <>{draftCount}<span className="mx-2 text-[#B6C5BF]">·</span>{urgentCount}</> : '—'}</p><p className="mt-1 text-xs text-[#718181]">Drafts hidden · urgent flags</p></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#EDF2EF] p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="text-base font-bold text-[#123F40]">Update library</h2><p className="mt-1 text-xs text-[#718181]">Search, edit, publish, or archive notices.</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#82918D]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search statutory updates" placeholder="Search title, category or source" className="h-10 w-full rounded-xl border border-[#D8E4DE] bg-[#FAFCFB] pl-9 pr-3 text-sm outline-none focus:border-[#168A4A]" /></label>
              <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)} className="h-10 rounded-xl border border-[#D8E4DE] bg-white px-3 text-sm text-[#365555] outline-none focus:border-[#168A4A]"><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter updates by status">{(['all', 'published', 'draft'] as const).map((item) => <button key={item} type="button" aria-pressed={statusFilter === item} onClick={() => setStatusFilter(item)} className={`rounded-full px-3.5 py-2 text-xs font-semibold capitalize transition ${statusFilter === item ? 'bg-[#0B4B4C] text-white' : 'bg-[#F2F7F4] text-[#52706A] hover:bg-[#E7F2EC]'}`}>{item}{item === 'all' ? ` (${taxUpdates.length})` : item === 'published' ? ` (${publishedCount})` : ` (${draftCount})`}</button>)}</div>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {!taxUpdatesLoaded ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 text-sm text-[#718181]"><LoaderCircle className="size-4 animate-spin text-[#168A4A]" />Loading updates from the database…</div> : visibleUpdates.length === 0 ? <div className="p-12 text-center"><FileText className="mx-auto size-8 text-[#98B8A6]" /><h3 className="mt-3 font-semibold text-[#143F40]">{taxUpdates.length ? 'No updates match these filters' : 'No updates added yet'}</h3><p className="mt-1 text-sm text-[#718181]">{taxUpdates.length ? 'Change your search or filters to see more results.' : 'Add an update when you have a verified source to share.'}</p></div> : visibleUpdates.map((item) => <article key={item.id} className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#EAF6F0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#177449]">{item.category}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${item.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span>{item.is_urgent && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">Urgent</span>}</div>
              <h3 className="text-base font-bold text-[#123F40]">{item.title}</h3>
              {item.summary && <p className="max-w-3xl text-sm leading-6 text-[#66797A]">{item.summary}</p>}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#82918D]"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{item.published_at || 'No publication date'}</span>{item.source_name && <span>Source: {item.source_name}</span>}{item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-[#168A4A] hover:underline">Official source <ArrowUpRight className="size-3.5" /></a>}</div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button type="button" onClick={() => openEditor(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8E4DE] px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7]"><Pencil className="size-3.5" />Edit</button>
              <button type="button" onClick={() => { void toggleStatus(item); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8E4DE] px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7]">{item.status === 'published' ? 'Move to draft' : 'Publish'}</button>
              {item.status === 'published' && <Link href="/updates" target="_blank" className="grid size-9 place-items-center rounded-lg border border-[#D8E4DE] text-[#168A4A] hover:bg-[#F5FAF7]" aria-label={`View ${item.title} on public site`}><ExternalLink className="size-4" /></Link>}
              <button type="button" onClick={() => setDeleteTarget(item)} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${item.title}`}><Trash2 className="size-4" /></button>
            </div>
          </article>)}
        </div>
      </section>

      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062F35]/45 p-4 backdrop-blur-sm">
        <section role="dialog" aria-modal="true" aria-labelledby="update-dialog-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E2ECE6] bg-white p-5 shadow-2xl sm:p-7">
          <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#EDF2EF] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#168A4A]">Public Updates page</p><h2 id="update-dialog-title" className="mt-1 text-xl font-bold text-[#123F40]">{editing ? 'Edit update' : 'Create update'}</h2><p className="mt-1 text-xs text-[#718181]">Use a clear title and include a link to the issuing authority.</p></div><button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} aria-label="Close editor" className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="size-4" /></button></header>
          {feedback?.kind === 'error' && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="mr-2 inline size-4" />{feedback.message}</p>}
          <form onSubmit={(event) => { void saveUpdate(event); }} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>Update title *<input required maxLength={180} value={form.title} onChange={(event) => { const value = event.target.value; setField('title', value); if (!editing) setField('slug', value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')); }} className={inputClass} placeholder="e.g. New VAT filing requirement" /></label>
              <label className={labelClass}>URL slug *<input required value={form.slug} onChange={(event) => setField('slug', event.target.value)} className={inputClass} placeholder="new-vat-filing-requirement" /></label>
              <label className={labelClass}>Category<select value={form.category} onChange={(event) => setField('category', event.target.value as UpdateCategory)} className={inputClass}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className={labelClass}>Status<select value={form.status} onChange={(event) => setField('status', event.target.value as UpdateForm['status'])} className={inputClass}><option value="published">Published</option><option value="draft">Draft</option></select></label>
              <label className={labelClass}>Publication date<input type="date" value={form.published_at || ''} onChange={(event) => setField('published_at', event.target.value)} className={inputClass} /></label>
              <label className="flex min-h-10 items-center gap-3 self-end rounded-xl border border-[#E3ECE7] bg-[#FAFCFB] px-3 py-2 text-sm font-semibold text-[#365555]"><input type="checkbox" checked={form.is_urgent} onChange={(event) => setField('is_urgent', event.target.checked)} className="size-4 accent-[#168A4A]" />Flag as urgent notice</label>
              <label className={`${labelClass} sm:col-span-2`}>Short summary<textarea rows={2} maxLength={320} value={form.summary} onChange={(event) => setField('summary', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm leading-6 text-[#143F40] outline-none focus:border-[#168A4A]" placeholder="A short, clear summary for the public update card." /></label>
              <label className={`${labelClass} sm:col-span-2`}>Full update content *<textarea required rows={8} value={form.content} onChange={(event) => setField('content', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D6E3DD] px-3 py-3 text-sm leading-7 text-[#143F40] outline-none focus:border-[#168A4A]" placeholder="Write the verified update. Use separate paragraphs for readability." /><span className="mt-1 block text-[11px] font-normal text-[#82918D]">Line breaks display as paragraphs on the public page.</span></label>
              <label className={labelClass}>Issuing authority<input value={form.source_name} onChange={(event) => setField('source_name', event.target.value)} className={inputClass} placeholder="e.g. Inland Revenue Department" /></label>
              <label className={labelClass}>Official source URL<input type="url" value={form.source_url} onChange={(event) => setField('source_url', event.target.value)} className={inputClass} placeholder="https://..." /></label>
            </div>
            <footer className="flex flex-col gap-3 border-t border-[#EDF2EF] pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[#718181]">{form.status === 'published' ? 'This update will appear on the public Updates page after saving.' : 'Drafts are only visible in the CMS.'}</p><div className="flex justify-end gap-2"><button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="min-h-10 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#365555] hover:bg-[#F5FAF7]">Cancel</button><button type="submit" disabled={saving} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white hover:bg-[#083D3F] disabled:cursor-wait disabled:opacity-60">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}{saving ? 'Saving…' : editing ? 'Save changes' : form.status === 'draft' ? 'Save draft' : 'Publish update'}</button></div></footer>
          </form>
        </section>
      </div>}
    </div>
  );
}
