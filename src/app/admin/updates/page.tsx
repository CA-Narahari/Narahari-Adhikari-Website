'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  FileEdit,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function AdminUpdatesPage() {
  const { taxUpdates, addTaxUpdate, updateTaxUpdate, deleteTaxUpdate } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Income Tax' | 'VAT' | 'Customs' | 'Corporate Tax' | 'Finance Acts' | 'Circulars'>('VAT');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [sourceName, setSourceName] = useState('Inland Revenue Department (IRD)');
  const [sourceUrl, setSourceUrl] = useState('https://ird.gov.np');
  const [isUrgent, setIsUrgent] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  // Deletion modal state
  const [updateToDelete, setUpdateToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please provide title and content.');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const today = new Date().toISOString().split('T')[0];

    addTaxUpdate({
      title,
      slug,
      category,
      summary: summary || title,
      content,
      source_name: sourceName,
      source_url: sourceUrl,
      is_urgent: isUrgent,
      status,
      published_at: today,
    });

    setShowModal(false);
    setTitle('');
    setContent('');
    setSummary('');
  };

  const confirmDelete = () => {
    if (!updateToDelete) return;
    deleteTaxUpdate(updateToDelete.id);
    setUpdateToDelete(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={!!updateToDelete}
        title="Delete Update"
        message={`Are you sure you want to delete "${updateToDelete?.title}"? This item will no longer appear on the public portal.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setUpdateToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Statutory Updates &amp; Official Circulars
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish regulatory notices, statutory circulars, and compliance updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/updates"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public Updates Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C4A4E] hover:bg-[#083639] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Update</span>
          </button>
        </div>
      </div>

      {/* Updates Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            All Articles ({taxUpdates.length})
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {taxUpdates.map((item) => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  {item.is_urgent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Urgent Alert
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {item.published_at}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Source: {item.source_name} ({item.source_url})
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => updateTaxUpdate(item.id, { status: item.status === 'published' ? 'draft' : 'published' })}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border cursor-pointer ${
                    item.status === 'published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </button>

                <button
                  onClick={() => setUpdateToDelete({ id: item.id, title: item.title })}
                  className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">
              Add New Update / Circular
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory VAT E-Invoicing Threshold Directives"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold mb-1">Tax / Regulatory Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof category)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                  >
                    <option value="Income Tax">Income Tax</option>
                    <option value="VAT">VAT</option>
                    <option value="Customs">Customs</option>
                    <option value="Corporate Tax">Corporate Tax</option>
                    <option value="Finance Acts">Finance Acts</option>
                    <option value="Circulars">Circulars</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded text-[#1A8F4B] focus:ring-[#1A8F4B]"
                  />
                  <label htmlFor="urgent" className="font-semibold text-rose-700 cursor-pointer">
                    Flag as Urgent Statutory Alert
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Summary Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the update..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Update Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Enter the full article or circular contents..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold mb-1">Authority Source Name</label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Source URL</label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0C4A4E] hover:bg-[#083639] text-white font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
