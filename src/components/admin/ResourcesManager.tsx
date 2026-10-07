'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Landmark,
  Download,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  X,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { GovernmentLink, DownloadResource } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';

type ResourceSection = 'all' | 'links' | 'downloads';

export default function ResourcesManager({ section = 'all' }: { section?: ResourceSection }) {
  const {
    governmentLinks,
    addGovernmentLink,
    updateGovernmentLink,
    deleteGovernmentLink,
    downloads,
    addDownload,
    updateDownload,
    deleteDownload,
  } = useApp();

  // Government Link Modal state
  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [editingGovLink, setEditingGovLink] = useState<GovernmentLink | null>(null);
  const [govForm, setGovForm] = useState({
    name: '',
    short_name: '',
    description: '',
    url: '',
    category: '',
  });

  // Download Resource Modal state
  const [isDlModalOpen, setIsDlModalOpen] = useState(false);
  const [editingDl, setEditingDl] = useState<DownloadResource | null>(null);
  const [dlForm, setDlForm] = useState({
    title: '',
    category: 'Tax Form' as DownloadResource['category'],
    file_format: 'PDF',
    file_size: '1.2 MB',
    download_url: '',
  });

  // File upload state for downloadable resources
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const dlFileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  // Deletion confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'gov' | 'dl';
    id: string;
    title: string;
  } | null>(null);

  // Open Gov Link Modal for Add or Edit
  const openGovModal = (link?: GovernmentLink) => {
    if (link) {
      setEditingGovLink(link);
      setGovForm({
        name: link.name,
        short_name: link.short_name,
        description: link.description,
        url: link.url,
        category: link.category,
      });
    } else {
      setEditingGovLink(null);
      setGovForm({
        name: '',
        short_name: '',
        description: '',
        url: '',
        category: 'Regulatory Authority',
      });
    }
    setIsGovModalOpen(true);
  };

  const handleGovSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govForm.name.trim() || !govForm.url.trim()) return;

    setIsSaving(true);
    let saved = false;
    try {
      if (editingGovLink) saved = await updateGovernmentLink(editingGovLink.id, govForm);
      else saved = await addGovernmentLink(govForm);
    } catch { saved = false; }
    setIsSaving(false);
    if (!saved) { setFeedback({ kind: 'error', message: 'The portal link could not be saved. Check your CMS access and try again.' }); return; }
    setIsGovModalOpen(false);
    setFeedback({ kind: 'success', message: editingGovLink ? 'Portal link updated.' : 'Portal link added.' });
  };

  // Open Download Modal for Add or Edit
  const openDlModal = (res?: DownloadResource) => {
    setUploadFileError(null);
    setUploadSuccess(false);
    if (res) {
      setEditingDl(res);
      setDlForm({
        title: res.title,
        category: res.category,
        file_format: res.file_format,
        file_size: res.file_size,
        download_url: res.download_url,
      });
    } else {
      setEditingDl(null);
      setDlForm({
        title: '',
        category: 'Tax Form',
        file_format: 'PDF',
        file_size: '1.5 MB',
        download_url: '',
      });
    }
    setIsDlModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    setUploadFileError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'download-resources');
      formData.append('folder', 'documents');

      const res = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      // Format file size
      const sizeInMB = file.size / (1024 * 1024);
      const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

      // Extract format extension
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';

      setDlForm((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        download_url: data.publicUrl,
        file_format: ext,
        file_size: sizeStr,
      }));
      setUploadSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadFileError(msg);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlForm.title.trim() || !dlForm.download_url.trim()) {
      setFeedback({ kind: 'error', message: 'Add a title and file URL before saving the resource.' });
      return;
    }

    setIsSaving(true);
    let saved = false;
    try {
      if (editingDl) saved = await updateDownload(editingDl.id, dlForm);
      else saved = await addDownload(dlForm);
    } catch { saved = false; }
    setIsSaving(false);
    if (!saved) { setFeedback({ kind: 'error', message: 'The download could not be saved. Check your CMS access and try again.' }); return; }
    setIsDlModalOpen(false);
    setFeedback({ kind: 'success', message: editingDl ? 'Download details updated.' : 'Download added to the public resources page.' });
  };

  const confirmDeleteTarget = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    let deleted = false;
    try {
      if (deleteTarget.type === 'gov') deleted = await deleteGovernmentLink(deleteTarget.id);
      else deleted = await deleteDownload(deleteTarget.id);
    } catch { deleted = false; }
    setIsSaving(false);
    if (!deleted) { setFeedback({ kind: 'error', message: 'This item could not be removed. Check your CMS access and try again.' }); return; }
    setFeedback({ kind: 'success', message: 'Item removed from the public resources page.' });
    setDeleteTarget(null);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleGovernmentLinks = governmentLinks.filter((item) => [item.name, item.short_name, item.category, item.description].some((value) => value?.toLowerCase().includes(normalizedSearch)));
  const visibleDownloads = downloads.filter((item) => [item.title, item.category, item.file_format].some((value) => value?.toLowerCase().includes(normalizedSearch)));

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
      {/* Reusable Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'gov' ? 'Delete Regulatory Authority' : 'Delete Resource'}
        message={`Are you sure you want to remove "${deleteTarget?.title}"? This item will no longer appear in the public portal.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => { void confirmDeleteTarget(); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]">Public website content</p><h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">{section === 'links' ? 'Reference links' : section === 'downloads' ? 'Download resources' : 'Resources'}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">{section === 'links' ? 'Maintain the trusted government and regulatory portals linked from the public Resources page.' : section === 'downloads' ? 'Upload and manage forms, checklists, and guides available for visitors to download.' : 'Manage trusted regulatory references and downloadable files shown on the public website.'}</p></div>
        <a href={section === 'downloads' ? '/resources/downloads' : '/resources'} target="_blank" rel="noreferrer" className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] transition hover:bg-[#F5FAF7]">Preview public page <ExternalLink className="size-4 text-[#168A4A]" /></a>
      </header>

      <section aria-label="Resource totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {section !== 'downloads' && <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Authority links</p><p className="mt-1 text-2xl font-bold text-[#073E43]">{governmentLinks.length}</p></div>}
        {section !== 'links' && <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Download files</p><p className="mt-1 text-2xl font-bold text-[#073E43]">{downloads.length}</p></div>}
        <label className="col-span-2 flex min-h-16 items-center gap-2 rounded-2xl border border-[#E2ECE6] bg-white px-4 sm:col-span-1"><Search className="size-4 shrink-0 text-[#82918D]" /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label={`Search ${section === 'links' ? 'reference links' : section === 'downloads' ? 'downloads' : 'resources and links'}`} placeholder={`Search ${section === 'links' ? 'reference links' : section === 'downloads' ? 'download files' : 'resources and links'}`} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#91A19C]" /></label>
      </section>
      {feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{feedback.message}</p>}

      {/* 1. Official Government Authority Links */}
      {section !== 'downloads' && <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-[#103F40] flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#168A4A]" />
              <span>Official Government Regulatory Portals ({governmentLinks.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visitors open these official sites in a new browser tab.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openGovModal()}
            className="px-4 py-2 bg-[#0B4B4C] hover:bg-[#083D3F] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Regulatory Portal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleGovernmentLinks.length === 0 ? <p className="col-span-full rounded-xl border border-dashed border-[#D9E5DF] p-8 text-center text-sm text-[#718181]">{governmentLinks.length ? 'No authority links match this search.' : 'No authority links have been added yet.'}</p> : visibleGovernmentLinks.map((g) => (
            <div
              key={g.id}
              className="p-4 bg-[#FAFCFB] border border-[#E5ECE8] rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#B9D8C7] transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#2CBC63] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E8EBEF]">
                    {g.category || 'Regulatory Authority'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${g.name}`}
                      onClick={() => openGovModal(g)}
                      title="Edit Portal"
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${g.name}`}
                      onClick={() =>
                        setDeleteTarget({
                          type: 'gov',
                          id: g.id,
                          title: g.name,
                        })
                      }
                      title="Delete Portal"
                      className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-bold text-[#143F40] text-xs sm:text-[13px] leading-snug">
                  {g.name}
                </div>
                <p className="text-[11.5px] text-[#66797A] leading-relaxed line-clamp-2">
                  {g.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#023A51] hover:text-[#2CBC63] flex items-center gap-1 text-[11px] font-medium transition-colors truncate max-w-[200px]"
                >
                  <span className="truncate">{g.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* 2. Downloadable Statutory Resources & Files */}
      {section !== 'links' && <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-[#103F40] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#168A4A]" />
              <span>Downloadable Forms, Checklists &amp; Guides ({downloads.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a file to Supabase Storage or link a direct file URL. These records appear on the public downloads page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openDlModal()}
            className="px-4 py-2 bg-[#0B4B4C] hover:bg-[#083D3F] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Download File</span>
          </button>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {visibleDownloads.length === 0 ? <p className="rounded-xl border border-dashed border-[#D9E5DF] p-8 text-center text-sm text-[#718181]">{downloads.length ? 'No download files match this search.' : 'No download files have been added yet.'}</p> : visibleDownloads.map((d) => (
            <div
              key={d.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-[#023A51] mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[13px]">{d.title}</div>
                  <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10.5px] font-semibold text-slate-700">
                      {d.category}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{d.file_format}</span>
                    <span>•</span>
                    <span className="text-[11px]">{d.file_size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400 font-mono text-[11px] mr-2">
                  {d.downloads_count} downloads
                </span>
                <button
                  onClick={() => openDlModal(d)}
                  className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() =>
                    setDeleteTarget({
                      type: 'dl',
                      id: d.id,
                      title: d.title,
                    })
                  }
                  className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* Government Link Modal */}
      {isGovModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingGovLink ? 'Edit Regulatory Portal Link' : 'Add Official Regulatory Portal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsGovModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback?.kind === 'error' && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{feedback.message}</p>}

            <form onSubmit={handleGovSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Authority Name *</label>
                <input
                  type="text"
                  required
                  disabled={isSaving}
                  value={govForm.name}
                  onChange={(e) => setGovForm({ ...govForm, name: e.target.value })}
                  placeholder="e.g. Inland Revenue Department (IRD)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Code / Acronym</label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={govForm.short_name}
                  onChange={(e) => setGovForm({ ...govForm, short_name: e.target.value })}
                  placeholder="e.g. IRD Nepal"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={govForm.category}
                  onChange={(e) => setGovForm({ ...govForm, category: e.target.value })}
                  placeholder="e.g. Tax & Revenue Authority"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Portal URL *</label>
                <input
                  type="url"
                  required
                  disabled={isSaving}
                  value={govForm.url}
                  onChange={(e) => setGovForm({ ...govForm, url: e.target.value })}
                  placeholder="https://ird.gov.np"
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  disabled={isSaving}
                  value={govForm.description}
                  onChange={(e) => setGovForm({ ...govForm, description: e.target.value })}
                  placeholder="Official services provided by this authority..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsGovModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? 'Saving…' : editingGovLink ? 'Save Changes' : 'Add Authority'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Download Resource Modal with Integrated File Upload */}
      {isDlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingDl ? 'Edit Downloadable Resource' : 'Add Downloadable Resource'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDlModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback?.kind === 'error' && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{feedback.message}</p>}

            {/* Direct File Attachment Upload Card */}
            <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0D3B3E] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#1A8F4B]" />
                  <span>Attach Document File (PDF, DOCX, XLSX)</span>
                </span>
                {uploadSuccess && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded to Storage</span>
                  </span>
                )}
              </div>

              <input
                ref={dlFileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.zip"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button type="button" onClick={() => dlFileInputRef.current?.click()} disabled={isUploadingFile || isSaving} className="w-full border border-dashed border-emerald-300 hover:border-emerald-500 bg-white rounded-xl p-3 text-center cursor-pointer transition-colors disabled:cursor-wait disabled:opacity-60">
                {isUploadingFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0D3B3E] py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1A8F4B]" />
                    <span>Uploading file to Supabase storage...</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold text-[#1A8F4B]">Click to browse file</span> or drop file here (Auto-sets URL, format &amp; file size)
                  </div>
                )}
              </button>

              {uploadFileError && (
                <div className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadFileError}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleDlSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  disabled={isSaving}
                  value={dlForm.title}
                  onChange={(e) => setDlForm({ ...dlForm, title: e.target.value })}
                  placeholder="e.g. Income Tax Return Schedule 1 to 5 Forms"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={dlForm.category}
                    disabled={isSaving}
                    onChange={(e) =>
                      setDlForm({
                        ...dlForm,
                        category: e.target.value as DownloadResource['category'],
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                  >
                    <option value="Tax Form">Tax Form</option>
                    <option value="Checklist">Checklist</option>
                    <option value="Template">Template</option>
                    <option value="Guide">Guide</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Format</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={dlForm.file_format}
                    onChange={(e) => setDlForm({ ...dlForm, file_format: e.target.value })}
                    placeholder="PDF, DOCX, XLSX"
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Size</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={dlForm.file_size}
                    onChange={(e) => setDlForm({ ...dlForm, file_size: e.target.value })}
                    placeholder="e.g. 1.8 MB"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File URL / Download Link</label>
                  <input
                    type="url"
                    required
                    disabled={isSaving}
                    value={dlForm.download_url}
                    onChange={(e) => setDlForm({ ...dlForm, download_url: e.target.value })}
                    placeholder="https://... or auto-filled on upload"
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsDlModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingFile}
                  className="px-4 py-2 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? 'Saving…' : editingDl ? 'Save Changes' : 'Add File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
