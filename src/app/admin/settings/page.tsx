'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, Save, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useApp();

  const [companyName, setCompanyName] = useState(settings.company_name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [regNo, setRegNo] = useState(settings.ca_reg_number);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp_number);
  const [address, setAddress] = useState(settings.address);
  const [hoursSummary, setHoursSummary] = useState(settings.office_hours_summary);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      company_name: companyName,
      tagline,
      ca_reg_number: regNo,
      email,
      phone,
      whatsapp_number: whatsapp,
      address,
      office_hours_summary: hoursSummary,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Site Settings & Multi-Client Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure firm identification, official contact numbers, WhatsApp redirect channel, and licensing credentials without code changes.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-2 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully synchronized with live website!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Firm / Company Legal Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ICAN Registration / License Number *
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Firm Tagline / Positioning
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Primary Inquiry Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Telephone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Direct Number *
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+977XXXXXXXXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Include country code (e.g. +9779851000000)
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Physical Office Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Footer Office Hours Summary Text
            </label>
            <input
              type="text"
              value={hoursSummary}
              onChange={(e) => setHoursSummary(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors shadow"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
