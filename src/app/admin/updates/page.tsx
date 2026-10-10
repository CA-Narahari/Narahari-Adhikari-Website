'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import type { TaxUpdate } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  LoaderCircle,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Bold,
  List,
  ListOrdered,
  Quote,
  Heading2,
  ShieldCheck,
} from 'lucide-react';

type UpdateCategory = TaxUpdate['category'];
type UpdateForm = Omit<TaxUpdate, 'id'>;

const categories: UpdateCategory[] = [
  'Income Tax',
  'VAT',
  'Customs',
  'Corporate Tax',
  'Finance Acts',
  'Circulars',
  'Notices',
];

const today = () => new Date().toISOString().slice(0, 10);

const blankForm = (): UpdateForm => ({
  title: '',
  slug: '',
  category: 'VAT',
  summary: '',
  content: '',
  source_name: '',
  source_url: '',
  is_urgent: false,
  status: 'published',
  published_at: today(),
  effective_date: today(),
  meta_title: '',
  meta_description: '',
  focus_keyword: '',
  topic: 'Taxation',
});

export default function AdminUpdatesPage() {
  const { taxUpdates, taxUpdatesLoaded, addTaxUpdate, updateTaxUpdate, deleteTaxUpdate } = useApp();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | UpdateCategory>('all');

  // Dedicated full-page editor state (matching article edit page)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TaxUpdate | null>(null);
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
      const matchesSearch =
        !normalized ||
        [item.title, item.summary, item.content, item.source_name, item.category].some((value) =>
          value?.toLowerCase().includes(normalized)
        );
      return (
        matchesSearch &&
        (statusFilter === 'all' || item.status === statusFilter) &&
        (categoryFilter === 'all' || item.category === categoryFilter)
      );
    });
  }, [taxUpdates, query, statusFilter, categoryFilter]);

  const openEditor = (item?: TaxUpdate) => {
    setFeedback(null);
    setEditingItem(item || null);
    setForm(
      item
        ? {
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
            effective_date: item.effective_date || today(),
            meta_title: item.meta_title || '',
            meta_description: item.meta_description || '',
            focus_keyword: item.focus_keyword || '',
            topic: item.topic || 'Taxation',
          }
        : blankForm()
    );
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
    setFeedback(null);
  };

  const setField = <K extends keyof UpdateForm>(key: K, value: UpdateForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (newTitle: string) => {
    setField('title', newTitle);
    if (!editingItem) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setField('slug', autoSlug);
    }
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('update-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const selected = current.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextValue = current.substring(0, start) + replacement + current.substring(end);
    setField('content', nextValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  const saveUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const cleanTitle = form.title.trim();
    if (!cleanTitle) {
      setFeedback({ kind: 'error', message: 'Please provide a title for the update.' });
      setSaving(false);
      return;
    }

    const payload: UpdateForm = {
      ...form,
      title: cleanTitle,
      slug: (form.slug || cleanTitle).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      summary: form.summary.trim(),
      content: form.content.trim(),
      source_name: form.source_name.trim(),
      source_url: form.source_url.trim(),
      published_at: form.published_at || today(),
      effective_date: form.effective_date || form.published_at || today(),
    };

    let saved = false;
    try {
      saved = editingItem ? await updateTaxUpdate(editingItem.id, payload) : await addTaxUpdate(payload);
    } catch {
      saved = false;
    }

    setSaving(false);
    if (!saved) {
      setFeedback({
        kind: 'error',
        message: 'The update could not be saved to the database. Check your connection and try again.',
      });
      return;
    }

    setIsEditorOpen(false);
    setEditingItem(null);
    setFeedback({
      kind: 'success',
      message: editingItem ? 'Statutory update updated successfully.' : 'New statutory update published.',
    });
  };

  const toggleStatus = async (item: TaxUpdate) => {
    setFeedback(null);
    let saved = false;
    try {
      saved = await updateTaxUpdate(item.id, {
        status: item.status === 'published' ? 'draft' : 'published',
      });
    } catch {
      saved = false;
    }
    setFeedback(
      saved
        ? {
            kind: 'success',
            message:
              item.status === 'published'
                ? `Update "${item.title}" saved as draft.`
                : `Update "${item.title}" is now published on the public site.`,
          }
        : { kind: 'error', message: 'Could not change update status. Please try again.' }
    );
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    let deleted = false;
    try {
      deleted = await deleteTaxUpdate(deleteTarget.id);
    } catch {
      deleted = false;
    }
    if (!deleted) {
      setFeedback({
        kind: 'error',
        message: 'The update could not be deleted. Check your CMS session and try again.',
      });
      return;
    }
    setDeleteTarget(null);
    setFeedback({ kind: 'success', message: 'Update removed from the database and public site.' });
  };

  // ==========================================
  // DEDICATED FULL-PAGE EDITOR WORKSPACE
  // ==========================================
  if (isEditorOpen) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-6 pb-20">
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Delete statutory update"
          message={`Delete “${deleteTarget?.title}”? It will be removed from the public Updates page.`}
          confirmText="Delete update"
          cancelText="Keep update"
          isDanger
          onConfirm={() => {
            void confirmDelete();
          }}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* Top Control Header */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2ECE6] bg-white/95 px-6 py-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditor}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-bold text-[#143F40] hover:bg-[#F5FAF7] cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Library</span>
            </button>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51]">
              <FileText className="size-4 text-[#2CBC63]" />
              {editingItem ? 'Editing Regulatory Update' : 'New Statutory Notice'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B]">Status:</span>
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value as UpdateForm['status'])}
                className="h-9 rounded-xl border border-[#D8E4DE] bg-white px-3 text-xs font-bold text-[#023A51] outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <Link
              href="/updates"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-bold text-[#023A51] hover:bg-[#F5FAF7]"
            >
              <Eye className="size-3.5 text-[#2CBC63]" />
              <span>Public Page</span>
            </Link>

            <button
              type="button"
              onClick={closeEditor}
              disabled={saving}
              className="rounded-xl border border-[#D8E4DE] px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="statutory-update-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#023A51] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-all disabled:opacity-60 cursor-pointer"
            >
              {saving ? <LoaderCircle className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              <span>{saving ? 'Saving…' : editingItem ? 'Save Changes' : form.status === 'draft' ? 'Save Draft' : 'Publish Notice'}</span>
            </button>
          </div>
        </header>

        {feedback && (
          <div
            role={feedback.kind === 'error' ? 'alert' : 'status'}
            className={`rounded-2xl border p-4 text-sm font-medium flex items-center gap-2 ${
              feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {feedback.kind === 'error' ? <AlertCircle className="size-5 shrink-0" /> : <CheckCircle2 className="size-5 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form id="statutory-update-form" onSubmit={(e) => { void saveUpdate(e); }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title & Slug Box */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#023A51] mb-2">
                    Update Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={200}
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Government revises income tax slabs for the fiscal year 2082/83"
                    className="h-12 w-full rounded-2xl border border-[#D6E3DD] px-4 text-base sm:text-lg font-bold text-[#023A51] placeholder:font-normal placeholder:text-slate-300 outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                      URL Slug
                    </label>
                    <input
                      required
                      type="text"
                      value={form.slug}
                      onChange={(e) => setField('slug', e.target.value)}
                      placeholder="government-revises-income-tax-slabs"
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-[#FAFCFB] px-3 text-xs text-[#023A51] outline-none focus:border-[#2CBC63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                      Practice Topic Tag
                    </label>
                    <input
                      type="text"
                      value={form.topic || ''}
                      onChange={(e) => setField('topic', e.target.value)}
                      placeholder="e.g. Tax Rates, Accounting, Circulars"
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-[#FAFCFB] px-3 text-xs text-[#023A51] outline-none focus:border-[#2CBC63]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                    Executive Summary / Excerpt (Card Preview)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={320}
                    value={form.summary}
                    onChange={(e) => setField('summary', e.target.value)}
                    placeholder="Brief 2-3 sentence overview displayed on the public updates feed…"
                    className="w-full rounded-xl border border-[#D6E3DD] p-3 text-xs sm:text-sm leading-relaxed text-[#023A51] outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20"
                  />
                </div>
              </div>

              {/* Full Content Canvas with Quick Formatting Toolbar */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F4F2] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#023A51]">Full Notice Content</h3>
                    <p className="text-xs text-[#64748B]">Provide the full regulatory explanation, rates breakdown, or circular text.</p>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 rounded-xl bg-slate-50 border border-slate-200 p-1">
                    <button
                      type="button"
                      onClick={() => insertSnippet('**', '**')}
                      title="Bold"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <Bold className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('### ')}
                      title="Heading"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <Heading2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('- ')}
                      title="Bullet point"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <List className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('1. ')}
                      title="Numbered list"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <ListOrdered className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('> ')}
                      title="Quote"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <Quote className="size-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  id="update-content-textarea"
                  required
                  rows={12}
                  value={form.content}
                  onChange={(e) => setField('content', e.target.value)}
                  placeholder="Draft the statutory update details here. Line breaks format as clean paragraphs on the public page…"
                  className="w-full rounded-2xl border border-[#D6E3DD] p-4 font-normal text-sm leading-relaxed text-[#023A51] outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20"
                />
              </div>

              {/* Source Authority & Evidence Link */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#023A51]">Issuing Authority &amp; Official Reference</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                      Issuing Authority Name
                    </label>
                    <input
                      type="text"
                      value={form.source_name}
                      onChange={(e) => setField('source_name', e.target.value)}
                      placeholder="e.g. Inland Revenue Department (IRD)"
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] px-3 text-xs text-[#023A51] outline-none focus:border-[#2CBC63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                      Official Source Link (URL)
                    </label>
                    <input
                      type="url"
                      value={form.source_url}
                      onChange={(e) => setField('source_url', e.target.value)}
                      placeholder="https://ird.gov.np/circular/..."
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] px-3 text-xs text-[#023A51] outline-none focus:border-[#2CBC63]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Settings Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Public Card Preview */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#023A51]">
                  <Eye className="size-4 text-[#2CBC63]" />
                  <span>Live Card Preview</span>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                      {form.category}
                    </span>
                    {form.is_urgent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#023A51] leading-snug line-clamp-2">
                    {form.title || 'Untitled Update Notice'}
                  </h4>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {form.summary || 'Summary preview will appear here…'}
                  </p>
                  <div className="pt-2 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8] flex items-center justify-between">
                    <span>{form.published_at || today()}</span>
                    <span className="font-medium text-[#475569] truncate max-w-[120px]">
                      {form.source_name || 'Authority'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Publication Settings */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#023A51]">
                  Publishing Settings
                </h4>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                    Category Classification <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value as UpdateCategory)}
                    className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-3 text-xs font-bold text-[#023A51] outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={form.published_at || ''}
                      onChange={(e) => setField('published_at', e.target.value)}
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-2.5 text-xs text-[#023A51] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      value={form.effective_date || ''}
                      onChange={(e) => setField('effective_date', e.target.value)}
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-2.5 text-xs text-[#023A51] outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-[#E3ECE7] bg-[#FAFCFB] p-3 text-xs font-bold text-[#023A51] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_urgent}
                    onChange={(e) => setField('is_urgent', e.target.checked)}
                    className="size-4 accent-[#DC2626] rounded cursor-pointer"
                  />
                  <span>Flag as Urgent / High Priority Notice</span>
                </label>
              </div>

              {/* SEO Meta Box */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#023A51]">
                  <Globe className="size-4 text-[#2CBC63]" />
                  <span>Search Engine (SEO) Meta</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.meta_title || ''}
                    onChange={(e) => setField('meta_title', e.target.value)}
                    placeholder="Custom page title for search engines"
                    className="h-9 w-full rounded-xl border border-[#D6E3DD] px-3 text-xs text-[#023A51] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.meta_description || ''}
                    onChange={(e) => setField('meta_description', e.target.value)}
                    placeholder="Search snippet summary…"
                    className="w-full rounded-xl border border-[#D6E3DD] p-2.5 text-xs text-[#023A51] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // UPDATES LIST & LIBRARY DASHBOARD
  // ==========================================
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete statutory update"
        message={`Delete “${deleteTarget?.title}”? It will be removed from the public Updates page.`}
        confirmText="Delete update"
        cancelText="Keep update"
        isDanger
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#16844A]">
            <Megaphone className="size-4" /> Public Website Content
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Statutory Updates</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">
            Publish regulatory tax notices, statutory deadlines, accounting circulars, and official updates.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/updates"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] hover:bg-[#F5FAF7]"
          >
            Preview Live Updates <ExternalLink className="size-4 text-[#168A4A]" />
          </Link>
          <button
            type="button"
            onClick={() => openEditor()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#023A51] px-5 text-sm font-bold text-white transition hover:bg-[#14864B] shadow-xs cursor-pointer"
          >
            <Plus className="size-4" /> Add Notice
          </button>
        </div>
      </header>

      {feedback && (
        <p
          role={feedback.kind === 'error' ? 'alert' : 'status'}
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            feedback.kind === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          {feedback.kind === 'error' ? <AlertCircle className="mr-2 inline size-4" /> : <CheckCircle2 className="mr-2 inline size-4" />}
          {feedback.message}
        </p>
      )}

      {/* Metrics Row */}
      <section aria-label="Update totals" className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">All Updates</p>
          <p className="mt-1 text-2xl font-bold text-[#073E43]">{taxUpdatesLoaded ? taxUpdates.length : '—'}</p>
          <p className="mt-1 text-xs text-[#718181]">Total database notices</p>
        </div>
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Published</p>
          <p className="mt-1 text-2xl font-bold text-[#168A4A]">{taxUpdatesLoaded ? publishedCount : '—'}</p>
          <p className="mt-1 text-xs text-[#718181]">Live on website</p>
        </div>
        <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Drafts · Urgent</p>
          <p className="mt-1 text-2xl font-bold text-[#073E43]">
            {taxUpdatesLoaded ? (
              <>
                {draftCount}
                <span className="mx-2 text-[#B6C5BF]">·</span>
                {urgentCount}
              </>
            ) : (
              '—'
            )}
          </p>
          <p className="mt-1 text-xs text-[#718181]">Unpublished drafts / urgent flags</p>
        </div>
      </section>

      {/* Table / List Workspace */}
      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-xs">
        <div className="flex flex-col gap-4 border-b border-[#EDF2EF] p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#123F40]">Update Notices Library</h2>
              <p className="mt-1 text-xs text-[#718181]">Search, edit in full workspace, toggle status, or archive.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#82918D]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search statutory updates"
                  placeholder="Search title, category, authority…"
                  className="h-10 w-full rounded-xl border border-[#D8E4DE] bg-[#FAFCFB] pl-9 pr-3 text-sm outline-none focus:border-[#168A4A]"
                />
              </label>
              <select
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)}
                className="h-10 rounded-xl border border-[#D8E4DE] bg-white px-3 text-sm text-[#365555] outline-none focus:border-[#168A4A]"
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter updates by status">
            {(['all', 'published', 'draft'] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={statusFilter === item}
                onClick={() => setStatusFilter(item)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === item ? 'bg-[#023A51] text-white' : 'bg-[#F2F7F4] text-[#52706A] hover:bg-[#E7F2EC]'
                }`}
              >
                {item}
                {item === 'all'
                  ? ` (${taxUpdates.length})`
                  : item === 'published'
                  ? ` (${publishedCount})`
                  : ` (${draftCount})`}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {!taxUpdatesLoaded ? (
            <div role="status" className="flex min-h-40 items-center justify-center gap-2 text-sm text-[#718181]">
              <LoaderCircle className="size-4 animate-spin text-[#168A4A]" />
              Loading updates from database…
            </div>
          ) : visibleUpdates.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="mx-auto size-10 text-[#98B8A6] mb-2" />
              <h3 className="font-bold text-[#143F40]">
                {taxUpdates.length ? 'No notices match your filters' : 'No notices added yet'}
              </h3>
              <p className="mt-1 text-sm text-[#718181]">
                {taxUpdates.length
                  ? 'Adjust your search terms or category selector.'
                  : 'Click "+ Add Notice" above to launch the editor.'}
              </p>
            </div>
          ) : (
            visibleUpdates.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between hover:bg-[#FAFDFB] transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#EAF6F0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#177449]">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        item.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {item.is_urgent && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#023A51]">{item.title}</h3>
                  {item.summary && <p className="max-w-3xl text-sm leading-6 text-[#66797A] line-clamp-2">{item.summary}</p>}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#82918D]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5" />
                      {item.published_at || 'No publication date'}
                    </span>
                    {item.source_name && <span>Source: {item.source_name}</span>}
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#168A4A] hover:underline"
                      >
                        Official source <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditor(item)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#023A51]/5 border border-[#D8E4DE] px-3.5 text-xs font-bold text-[#023A51] hover:bg-[#023A51] hover:text-white transition-all cursor-pointer"
                  >
                    <Pencil className="size-3.5" />
                    <span>Open in Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void toggleStatus(item);
                    }}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3 text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7] cursor-pointer"
                  >
                    {item.status === 'published' ? 'Move to draft' : 'Publish'}
                  </button>
                  {item.status === 'published' && (
                    <Link
                      href="/updates"
                      target="_blank"
                      className="grid size-9 place-items-center rounded-xl border border-[#D8E4DE] text-[#023A51] hover:bg-[#F5FAF7]"
                      aria-label={`View ${item.title} on public site`}
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
