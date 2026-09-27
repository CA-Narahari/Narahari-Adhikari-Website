'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, Plus, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AdminServicesPage() {
  const { services, updateService } = useApp();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Practice Areas & Services Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Edit service descriptions, deliverables, and practice specializations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">{srv.title}</h2>
              <span className="text-[11px] font-mono text-slate-400">/{srv.slug}</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Short Overview
              </label>
              <textarea
                rows={2}
                value={srv.short_description}
                onChange={(e) => updateService(srv.id, { short_description: e.target.value })}
                className="w-full p-2 border rounded text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Target Client Segment
              </label>
              <input
                type="text"
                value={srv.target_audience}
                onChange={(e) => updateService(srv.id, { target_audience: e.target.value })}
                className="w-full p-2 border rounded text-xs bg-slate-50"
              />
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                {srv.deliverables.length} Key Deliverables
              </span>
              <button
                onClick={() => alert(`Service "${srv.title}" saved successfully!`)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded font-semibold text-xs hover:bg-slate-800"
              >
                Save Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
