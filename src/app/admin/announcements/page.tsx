'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Megaphone, ToggleLeft, ToggleRight, Check } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { settings, updateSettings, toggleAnnouncement } = useApp();
  const [text, setText] = useState(settings.announcement_text);
  const [link, setLink] = useState(settings.announcement_link);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcement_text: text,
      announcement_link: link,
    });
    alert('Announcement banner updated successfully!');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Emergency Notice & Announcement Bar
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Control the prominent top alert strip that appears across all public website pages.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Toggle Card */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <div className="font-bold text-sm text-slate-900">Banner Visibility</div>
            <div className="text-xs text-slate-500">
              {settings.announcement_active ? 'Currently active and visible on the public header.' : 'Currently hidden.'}
            </div>
          </div>
          <button
            onClick={() => toggleAnnouncement()}
            className="p-1 focus:outline-none"
          >
            {settings.announcement_active ? (
              <ToggleRight className="w-8 h-8 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-400" />
            )}
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Banner Message Text *
            </label>
            <input
              type="text"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Notice: Income Tax Return filing deadline extended by IRD."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target Link (Optional)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. /tax-updates or external URL"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>Update Banner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
