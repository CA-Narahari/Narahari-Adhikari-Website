'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Eye,
  CheckCircle2,
  LoaderCircle,
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  FolderOpen,
  Link2,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import type { DownloadResource } from '@/types';

const COMMON_DOWNLOAD_CATEGORIES: DownloadResource['category'][] = [
  'Tax Form',
  'Checklist',
  'Template',
  'Guide',
];

export default function AdminDownloadResourcesPage() {
  const { downloads, addDownload, updateDownload, deleteDownload } = useApp();

  // Mode: list view vs editor view
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadResource | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DownloadResource['category']>('Tax Form');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [downloadUrl, setDownloadUrl] = useState('');

  // UI state
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);
  const [documentLibraryOpen, setDocumentLibraryOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DownloadResource | null>(null);

  const openEditor = (item?: DownloadResource) => {
    setFeedback(null);
    if (item) {
      setEditingDownload(item);
      setTitle(item.title || '');
      setCategory(item.category || 'Tax Form');
      setFileFormat(item.file_format || 'PDF');
      setFileSize(item.file_size || '1.0 MB');
      setDownloadUrl(item.download_url || '');
    } else {
      setEditingDownload(null);
      setTitle('');
      setCategory('Tax Form');
      setFileFormat('PDF');
      setFileSize('1.0 MB');
      setDownloadUrl('');
    }
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeEditor = () => {
    if (isSaving) return;
    setIsEditorOpen(false);
    setEditingDownload(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback({ kind: 'error', message: 'Document title is required.' });
      return;
    }
    if (!downloadUrl.trim()) {
      setFeedback({ kind: 'error', message: 'File URL / download link is required.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const payload = {
      title: title.trim(),
      category: category || 'Tax Form',
      file_format: fileFormat.trim() || 'PDF',
      file_size: fileSize.trim() || '1.0 MB',
      download_url: downloadUrl.trim(),
    };

    let saved = false;
    try {
      if (editingDownload) {
        saved = await updateDownload(editingDownload.id, payload);
      } else {
        saved = await addDownload(payload);
      }
    } catch {
      saved = false;
    }

    setIsSaving(false);

    if (!saved) {
      setFeedback({
        kind: 'error',
        message: 'Could not save the download resource. Check connection and try again.',
      });
      return;
    }

    setFeedback({
      kind: 'success',
      message: editingDownload
        ? `Document "${payload.title}" updated successfully.`
        : `New download document "${payload.title}" published.`,
    });
    setIsEditorOpen(false);
    setEditingDownload(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    let ok = false;
    try {
      ok = await deleteDownload(deleteTarget.id);
    } catch {
      ok = false;
    }
    if (!ok) {
      setFeedback({ kind: 'error', message: 'Could not delete the download resource.' });
    } else {
      setFeedback({ kind: 'success', message: `Resource "${deleteTarget.title}" removed.` });
    }
    setDeleteTarget(null);
  };

  const categoriesList = [
    'All',
    ...Array.from(new Set(downloads.map((d) => d.category || 'General'))),
  ];

  const visibleDownloads = downloads.filter((item) => {
    const matchesCategory =
      selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.file_format && item.file_format.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const previewItem = {
    title: title.trim() || 'Document / Checklist Title',
    category: category || 'Tax Form',
    file_format: fileFormat.trim() || 'PDF',
    file_size: fileSize.trim() || '1.2 MB',
    download_url: downloadUrl.trim(),
  };

  const isSpreadsheet =
    previewItem.file_format.toLowerCase().includes('xls') ||
    previewItem.file_format.toLowerCase().includes('csv');

  // =========================================================================
  // VIEW 1: FULL-PAGE CONTENT EDITOR
  // =========================================================================
  if (isEditorOpen) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-6 pb-20">
        <MediaLibraryModal
          isOpen={documentLibraryOpen}
          mode="insert"
          storageFolder="documents"
          fileType="document"
          initialImageName={downloadUrl.split('/').pop() || ''}
          onClose={() => setDocumentLibraryOpen(false)}
          onSelect={(file) => {
            setDownloadUrl(file.url);
            if (file.imageName) {
              const ext = file.imageName.split('.').pop()?.toUpperCase() || 'PDF';
              setFileFormat(ext);
            }
            if (file.fileSize) {
              const mb = (file.fileSize / (1024 * 1024)).toFixed(1);
              setFileSize(`${mb} MB`);
            }
            setDocumentLibraryOpen(false);
          }}
        />

        {/* Top Control Bar */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2ECE6] bg-white/95 px-5 py-3.5 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditor}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3 py-1.5 text-xs font-semibold text-[#143F40] hover:bg-[#F5FAF7] cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Downloads</span>
            </button>
            <div className="hidden sm:block h-4 w-px bg-slate-200" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51]">
              <Download className="size-3.5 text-[#2CBC63]" />
              {editingDownload ? `Editing: ${editingDownload.title}` : 'Add New Download File'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/resources/downloads"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3 py-1.5 text-xs font-semibold text-[#023A51] hover:bg-[#F5FAF7]"
            >
              <Eye className="size-3 text-[#2CBC63]" />
              <span>View Public Page</span>
            </Link>

            <button
              type="button"
              onClick={closeEditor}
              disabled={isSaving}
              className="rounded-xl border border-[#D8E4DE] px-3.5 py-1.5 text-xs font-medium text-[#64748B] hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="download-editor-form"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#023A51] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? <LoaderCircle className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
              <span>{isSaving ? 'Saving...' : editingDownload ? 'Update Resource' : 'Publish Resource'}</span>
            </button>
          </div>
        </header>

        {feedback && (
          <div
            role="alert"
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${
              feedback.kind === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {feedback.kind === 'error' ? <AlertCircle className="size-4 shrink-0" /> : <CheckCircle2 className="size-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <form
              id="download-editor-form"
              onSubmit={handleSave}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-4"
            >
              <div className="border-b border-[#EDF2EF] pb-3">
                <h2 className="text-sm font-bold text-[#023A51]">
                  Resource File Information
                </h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Attach compliance guides, checklists, or official tax forms for client downloads.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                  Document / Schedule Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. FY 2081/82 Corporate Tax Rate Schedule (Nepal)"
                  className="w-full h-10 rounded-xl border border-[#D6E3DD] px-3.5 text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DownloadResource['category'])}
                  className="w-full h-10 rounded-xl border border-[#D6E3DD] bg-white px-3.5 text-xs text-[#143F40] outline-none focus:border-[#168A4A] cursor-pointer"
                >
                  {COMMON_DOWNLOAD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_DOWNLOAD_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-colors cursor-pointer border ${
                        category === cat
                          ? 'border-[#2CBC63] bg-[#EAF7F0] text-[#14864B]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                    File Format
                  </label>
                  <input
                    type="text"
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    placeholder="PDF, XLSX, DOCX"
                    className="w-full h-10 rounded-xl border border-[#D6E3DD] px-3.5 text-xs font-mono text-[#143F40] outline-none focus:border-[#168A4A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 1.2 MB"
                    className="w-full h-10 rounded-xl border border-[#D6E3DD] px-3.5 text-xs font-mono text-[#143F40] outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>

              {/* File Attachment: Clean Dual Support for Both Upload & URL */}
              <div className="pt-3 border-t border-[#EDF2EF] space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                    File Attachment (Upload or URL) <span className="text-rose-600">*</span>
                  </label>
                  <p className="text-[11px] text-[#64748B] mb-2">
                    Upload directly to Supabase Document Storage, or paste an external file link.
                  </p>
                </div>

                {/* Upload Action Card */}
                <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-[#D6E3DD] bg-[#F8FAFC]">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#143F40] flex items-center gap-1.5">
                      <FolderOpen className="size-4 text-[#168A4A]" />
                      <span>{downloadUrl ? downloadUrl.split('/').pop() : 'No document selected'}</span>
                    </p>
                    <p className="text-[10.5px] text-slate-500 font-mono truncate mt-0.5">
                      {downloadUrl || 'Click upload to store in Supabase or enter link below'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDocumentLibraryOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#023A51] hover:bg-[#14864B] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload className="size-3.5" />
                    <span>Upload to Vault</span>
                  </button>
                </div>

                {/* Direct Link Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#365555] mb-1">
                    Or paste direct file download URL:
                  </label>
                  <div className="relative">
                    <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="https://... direct link to PDF, XLSX, or document"
                      className="w-full h-10 rounded-xl border border-[#D6E3DD] pl-9 pr-3 text-xs font-mono text-[#143F40] outline-none focus:border-[#168A4A]"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Live Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF2EF] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#023A51]">
                  <Eye className="size-3.5 text-[#2CBC63]" />
                  <span>PUBLIC CARD PREVIEW</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#14864B] bg-[#EAF7F0] px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                This is how this download file appears to clients on the public downloads section.
              </p>

              {/* Card representation matching public site */}
              <div className="bg-white rounded-3xl border border-[#E8EBEF] p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E6F7ED] text-[#2CBC63]">
                      {previewItem.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#59667D] bg-[#F4F6F8] px-2 py-0.5 rounded-md border border-[#E8EBEF]">
                      {isSpreadsheet ? (
                        <FileSpreadsheet className="w-3 h-3 text-[#2CBC63]" />
                      ) : (
                        <FileText className="w-3 h-3 text-[#023A51]" />
                      )}
                      <span>
                        {previewItem.file_format} • {previewItem.file_size}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#023A51] leading-snug">
                    {previewItem.title}
                  </h3>

                  <p className="text-xs text-[#59667D] leading-relaxed">
                    Official document schedule verified for corporate and statutory use in Nepal.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8EBEF]">
                  <div className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#F4F6F8] text-[#023A51] font-bold text-xs border border-[#E8EBEF]">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {previewItem.file_format} (Public view)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DOWNLOADS DIRECTORY LIST VIEW (CMS - NO DOWNLOAD BUTTON IN CARD)
  // =========================================================================
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-16">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Download Resource?"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? Visitors will no longer be able to download this file.`}
        confirmText="Delete Resource"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <header className="flex flex-col gap-4 rounded-2xl border border-[#E2ECE6] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#14864B]">
            <FolderOpen className="size-3.5" />
            <span>RESOURCES / COMPLIANCE DOWNLOADS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#023A51] mt-1">
            Downloadable Files &amp; Schedules ({downloads.length})
          </h1>
          <p className="text-xs text-[#59667D] mt-0.5">
            Official tax schedules, checklists, guidelines, and statutory forms available for clients.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/resources/downloads"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-semibold text-[#023A51] hover:bg-[#F5FAF7] transition-colors"
          >
            <Eye className="size-3.5 text-[#2CBC63]" />
            <span>View Public Page</span>
          </Link>

          <button
            type="button"
            onClick={() => openEditor()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#023A51] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Download Resource</span>
          </button>
        </div>
      </header>

      {/* Feedback Toast */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs ${
            feedback.kind === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-[#E2ECE6] bg-white p-3.5 shadow-xs">
        <div className="relative flex-1">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title, format, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#D6E3DD] pl-9 pr-3 text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categoriesList.slice(0, 5).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-[#023A51] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid: Edit and Remove only (download test button removed in CMS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDownloads.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#D9E5DF] bg-white p-12 text-center">
            <Download className="mx-auto size-8 text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-[#023A51]">No download files found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              {search || selectedCategoryFilter !== 'All'
                ? 'Try clearing the search or category filter.'
                : 'Click "Add Download Resource" to publish a form.'}
            </p>
          </div>
        ) : (
          visibleDownloads.map((dl) => {
            const isXls =
              (dl.file_format || '').toLowerCase().includes('xls') ||
              (dl.file_format || '').toLowerCase().includes('csv');

            return (
              <div
                key={dl.id}
                className="bg-white rounded-3xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Category & Format Pill */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E6F7ED] text-[#2CBC63]">
                      {dl.category || 'Statutory Resource'}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#59667D] bg-[#F4F6F8] px-2 py-0.5 rounded-md border border-[#E8EBEF]">
                      {isXls ? (
                        <FileSpreadsheet className="w-3 h-3 text-[#2CBC63]" />
                      ) : (
                        <FileText className="w-3 h-3 text-[#023A51]" />
                      )}
                      <span>
                        {dl.file_format} • {dl.file_size}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#023A51] leading-snug">
                    {dl.title}
                  </h3>

                  <p className="text-xs text-[#59667D] leading-relaxed">
                    Official document schedule verified for corporate and statutory use in Nepal.
                  </p>
                </div>

                {/* Bottom Actions: Edit and Remove only (Download button removed from CMS) */}
                <div className="pt-4 mt-4 border-t border-[#E8EBEF] flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => openEditor(dl)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#023A51] hover:bg-[#F0FAF4] hover:text-[#168A4A] transition-colors cursor-pointer"
                  >
                    <Pencil className="size-3" />
                    <span>Edit Resource</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(dl)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
