'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Clock, Save, Check } from 'lucide-react';

export default function AdminOfficeHoursPage() {
  const { officeHours, updateOfficeHours } = useApp();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Official Office Hours Schedule
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust operating hours for each day. Changes immediately reflect in the public footer, contact page, and appointment availability badge.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          {officeHours.map((item) => (
            <div
              key={item.day}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="w-32">
                <span className="font-bold text-sm text-slate-900">{item.day}</span>
              </div>

              <div className="flex-1 flex items-center gap-4">
                <input
                  type="text"
                  value={item.hours}
                  disabled={!item.is_open}
                  onChange={(e) => updateOfficeHours(item.day, e.target.value, item.is_open)}
                  className={`w-full p-2 border rounded text-xs font-mono ${
                    item.is_open ? 'bg-white border-slate-300' : 'bg-slate-200 text-slate-500'
                  }`}
                />

                <label className="flex items-center gap-2 cursor-pointer shrink-0 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={item.is_open}
                    onChange={(e) => updateOfficeHours(item.day, item.hours, e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>Open</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => alert('Office hours successfully saved and updated on public site!')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save Office Hours Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
