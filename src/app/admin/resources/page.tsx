'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Landmark, Download, ExternalLink, Plus, Edit2, Trash2, X, Check, FileText } from 'lucide-react';
import { GovernmentLink, DownloadResource } from '@/types';

export default function AdminResourcesPage() {
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
    download_url: '#',
  });

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

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govForm.name || !govForm.url) return;

    if (editingGovLink) {
      updateGovernmentLink(editingGovLink.id, govForm);
    } else {
      addGovernmentLink(govForm);
    }
    setIsGovModalOpen(false);
  };

  // Open Download Modal for Add or Edit
  const openDlModal = (res?: DownloadResource) => {
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
        download_url: '#',
      });
    }
    setIsDlModalOpen(true);
  };

  const handleDlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlForm.title) return;

    if (editingDl) {
      updateDownload(editingDl.id, dlForm);
    } else {
      addDownload(dlForm);
    }
    setIsDlModalOpen(false);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Resources & Regulatory Directories CMS
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage official government portal redirection links and downloadable client resources in real-time.
        </p>
      </div>

      {/* 1. Official Government Authority Links */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#023A51]" />
              <span>Official Government Regulatory Portals ({governmentLinks.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These external authority links are displayed directly on the public Resources page without redirection barriers.
            </p>
          </div>
          <button
            onClick={() => openGovModal()}
            className="px-4 py-2 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Regulatory Portal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {governmentLinks.map((g) => (
            <div
              key={g.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#2CBC63] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E8EBEF]">
                    {g.category || 'Regulatory Authority'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openGovModal(g)}
                      title="Edit Portal"
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${g.name}" from public resources?`)) {
                          deleteGovernmentLink(g.id);
                        }
                      }}
                      title="Delete Portal"
                      className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                  {g.name}
                </div>
                <p className="text-[11.5px] text-slate-500 leading-relaxed line-clamp-2">
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
      </div>

      {/* 2. Downloadable Statutory Resources & Files */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-[#023A51]" />
              <span>Downloadable Forms, Checklists & Guides ({downloads.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory PDF checklists and Excel financial templates for clients and business officials.
            </p>
          </div>
          <button
            onClick={() => openDlModal()}
            className="px-4 py-2 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Download File</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {downloads.map((d) => (
            <div
              key={d.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
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
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete file "${d.title}"?`)) {
                      deleteDownload(d.id);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Government Link Modal */}
      {isGovModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingGovLink ? 'Edit Regulatory Portal Link' : 'Add Official Regulatory Portal'}
              </h3>
              <button
                onClick={() => setIsGovModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGovSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Authority Name *</label>
                <input
                  type="text"
                  required
                  value={govForm.name}
                  onChange={(e) => setGovForm({ ...govForm, name: e.target.value })}
                  placeholder="e.g. Inland Revenue Department (IRD)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Label / Acronym</label>
                <input
                  type="text"
                  value={govForm.short_name}
                  onChange={(e) => setGovForm({ ...govForm, short_name: e.target.value })}
                  placeholder="e.g. IRD Nepal"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category / Domain</label>
                <input
                  type="text"
                  value={govForm.category}
                  onChange={(e) => setGovForm({ ...govForm, category: e.target.value })}
                  placeholder="e.g. Taxation & Revenue Administration"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Redirection URL *</label>
                <input
                  type="url"
                  required
                  value={govForm.url}
                  onChange={(e) => setGovForm({ ...govForm, url: e.target.value })}
                  placeholder="https://ird.gov.np/"
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={govForm.description}
                  onChange={(e) => setGovForm({ ...govForm, description: e.target.value })}
                  placeholder="Brief note on what services this government agency handles."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGovModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {editingGovLink ? 'Save Changes' : 'Add Authority'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Download Resource Modal */}
      {isDlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingDl ? 'Edit Downloadable Resource' : 'Add Downloadable Resource'}
              </h3>
              <button
                onClick={() => setIsDlModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDlSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={dlForm.title}
                  onChange={(e) => setDlForm({ ...dlForm, title: e.target.value })}
                  placeholder="e.g. Income Tax Return Schedule 1 to 5 Forms"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={dlForm.category}
                    onChange={(e) =>
                      setDlForm({
                        ...dlForm,
                        category: e.target.value as DownloadResource['category'],
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
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
                    value={dlForm.file_format}
                    onChange={(e) => setDlForm({ ...dlForm, file_format: e.target.value })}
                    placeholder="PDF, DOCX, XLSX"
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Size</label>
                  <input
                    type="text"
                    value={dlForm.file_size}
                    onChange={(e) => setDlForm({ ...dlForm, file_size: e.target.value })}
                    placeholder="e.g. 1.8 MB"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File URL / Source</label>
                  <input
                    type="text"
                    value={dlForm.download_url}
                    onChange={(e) => setDlForm({ ...dlForm, download_url: e.target.value })}
                    placeholder="#"
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDlModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {editingDl ? 'Save Changes' : 'Add File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
