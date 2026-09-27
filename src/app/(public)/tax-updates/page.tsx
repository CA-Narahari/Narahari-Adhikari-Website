'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ReceiptText,
  Search,
  ExternalLink,
  Calendar,
  AlertTriangle,
  FileText,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function TaxUpdatesPage() {
  const { taxUpdates } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(taxUpdates[0]?.id || null);

  const categories = ['All', 'Income Tax', 'VAT', 'Customs', 'Corporate Tax', 'Finance Acts', 'Circulars'];

  const filteredUpdates = taxUpdates.filter((item) => {
    // Only published
    if (item.status !== 'published') return false;
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Official Regulatory Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Tax Updates, Gazette Notices & Directives
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Timely, authoritative analysis of tax policy amendments, Inland Revenue Department (IRD) circulars, customs tariff modifications, and filing deadlines.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </section>

      {/* Updates Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredUpdates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700">No updates matching your criteria</p>
            <p className="text-xs mt-1">Try clearing filters or changing your search terms.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUpdates.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-all overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                  >
                    <div className="space-y-2 max-w-4xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                        {item.is_urgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Important Directive</span>
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          {item.published_at}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                        {isExpanded ? 'Collapse' : 'Read Full Analysis'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Body */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-6">
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans prose prose-slate max-w-none">
                        {item.content}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="font-semibold">Official Source:</span>
                          <span>{item.source_name}</span>
                          {item.source_url && (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 hover:underline flex items-center gap-1 font-semibold ml-1"
                            >
                              <span>Verify at Authority</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(window.location.href);
                              alert('Link copied to clipboard!');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-slate-900 font-medium"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
