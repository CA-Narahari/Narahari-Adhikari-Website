'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ReceiptText,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  FileEdit,
} from 'lucide-react';

export default function AdminTaxUpdatesPage() {
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
    setSummary('');
    setContent('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tax Articles & Official Circulars
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish tax law changes, VAT rules, and emergency gazette directives.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Tax Article</span>
        </button>
      </div>

      {/* Tax Updates Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
                  className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                    item.status === 'published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </button>

                <button
                  onClick={() => {
                    if (confirm('Delete this tax article?')) {
                      deleteTaxUpdate(item.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Tax Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">
              Add New Tax Article / Circular
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
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tax Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Income Tax">Income Tax</option>
                    <option value="VAT">VAT</option>
                    <option value="Customs">Customs</option>
                    <option value="Corporate Tax">Corporate Tax</option>
                    <option value="Finance Acts">Finance Acts</option>
                    <option value="Circulars">Circulars</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="published">Published (Live Immediately)</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Summary</label>
                <input
                  type="text"
                  placeholder="One sentence overview for cards..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Content / Directive Details *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Provide technical analysis, key takeaways, and compliance dates..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Source Name</label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Official Portal URL</label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <label htmlFor="urgent" className="text-slate-800 font-semibold cursor-pointer">
                  Mark as Urgent Alert (Show prominent alert badge)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded"
                >
                  Save Tax Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
