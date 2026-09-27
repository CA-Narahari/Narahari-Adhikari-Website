'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Landmark, Download, ExternalLink, Plus } from 'lucide-react';

export default function AdminResourcesPage() {
  const { governmentLinks, downloads } = useApp();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Official Government Links & PDF Downloads
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage regulatory portal directories and downloadable statutory forms for clients.
        </p>
      </div>

      {/* Downloads Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-600" />
            <span>Downloadable Forms & Templates ({downloads.length})</span>
          </h2>
          <button
            onClick={() => alert('Add form capability ready in database schema.')}
            className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
          >
            + Add PDF Resource
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {downloads.map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{d.title}</span>
                <span className="text-slate-500 ml-2 font-mono">({d.file_format} • {d.file_size})</span>
              </div>
              <span className="text-slate-400 font-mono">{d.downloads_count} downloads</span>
            </div>
          ))}
        </div>
      </div>

      {/* Government Directories Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>Government Authority Links ({governmentLinks.length})</span>
          </h2>
          <button
            onClick={() => alert('Add government portal link ready.')}
            className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
          >
            + Add Official Portal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {governmentLinks.map((g) => (
            <div key={g.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase">{g.category}</span>
              <div className="font-bold text-slate-900">{g.name}</div>
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline flex items-center gap-1 font-mono text-[11px] pt-1"
              >
                <span>{g.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
