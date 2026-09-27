'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calculator,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  Coins,
  ArrowRight,
  Receipt,
  Percent,
} from 'lucide-react';

export default function ResourcesPage() {
  const { downloads, governmentLinks } = useApp();
  const [activeTab, setActiveTab] = useState<'calculators' | 'downloads' | 'govLinks'>('calculators');

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // VAT Calculator State
  const [vatBaseAmount, setVatBaseAmount] = useState<number>(100000);
  const [vatRate] = useState<number>(13); // Nepal standard VAT rate is 13%
  const [vatCalculationType, setVatCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // EMI Calculation Logic
  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenureYears * 12;
    if (monthlyRate === 0) {
      const emi = loanAmount / months;
      return {
        monthlyEMI: Math.round(emi),
        totalPayment: Math.round(loanAmount),
        totalInterest: 0,
      };
    }
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    return {
      monthlyEMI: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  };

  const emiResults = calculateEMI();

  // VAT Calculation Logic
  const calculateVAT = () => {
    if (vatCalculationType === 'exclusive') {
      const vatAmount = (vatBaseAmount * vatRate) / 100;
      const totalAmount = vatBaseAmount + vatAmount;
      return {
        netAmount: vatBaseAmount,
        vatAmount: Math.round(vatAmount),
        grossAmount: Math.round(totalAmount),
      };
    } else {
      const netAmount = (vatBaseAmount * 100) / (100 + vatRate);
      const vatAmount = vatBaseAmount - netAmount;
      return {
        netAmount: Math.round(netAmount),
        vatAmount: Math.round(vatAmount),
        grossAmount: vatBaseAmount,
      };
    }
  };

  const vatResults = calculateVAT();

  return (
    <div className="space-y-12 py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Financial Calculators & Compliance Resources
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Essential decision-making tools for businesses: loan EMI models, VAT liability calculators, official statutory forms, and verified regulatory directories.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-slate-200 space-x-8">
          <button
            onClick={() => setActiveTab('calculators')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'calculators'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Financial Calculators</span>
          </button>
          <button
            id="downloads"
            onClick={() => setActiveTab('downloads')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'downloads'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Center</span>
          </button>
          <button
            onClick={() => setActiveTab('govLinks')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'govLinks'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Government Directories</span>
          </button>
        </div>
      </section>

      {/* Tab 1: Calculators */}
      {activeTab === 'calculators' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* EMI Calculator */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-600" />
                    <span>Business Loan EMI Calculator</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Calculate monthly repayments and total interest charges.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Loan Amount (NPR)</span>
                    <span className="font-mono text-sm text-slate-900">
                      NRs {loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={20000000}
                    step={100000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Interest Rate (% per annum)</span>
                    <span className="font-mono text-sm text-slate-900">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={20}
                    step={0.25}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Tenure (Years)</span>
                    <span className="font-mono text-sm text-slate-900">{loanTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* EMI Result Cards */}
              <div className="p-4 bg-slate-900 text-white rounded-lg space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-300">Monthly Repayment (EMI):</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    NRs {emiResults.monthlyEMI.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Interest Payable:</span>
                  <span className="font-mono text-slate-200">
                    NRs {emiResults.totalInterest.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Amount Payable:</span>
                  <span className="font-mono text-slate-200">
                    NRs {emiResults.totalPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* VAT (13%) Calculator */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-600" />
                    <span>VAT (13%) Invoice Calculator</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Compute statutory 13% Value Added Tax on sales or invoices.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={vatBaseAmount}
                    onChange={(e) => setVatBaseAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm font-mono focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Calculation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setVatCalculationType('exclusive')}
                      className={`p-2.5 rounded font-semibold text-xs border text-center transition-all ${
                        vatCalculationType === 'exclusive'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      VAT Exclusive (+13%)
                    </button>
                    <button
                      onClick={() => setVatCalculationType('inclusive')}
                      className={`p-2.5 rounded font-semibold text-xs border text-center transition-all ${
                        vatCalculationType === 'inclusive'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      VAT Inclusive (Total includes 13%)
                    </button>
                  </div>
                </div>
              </div>

              {/* VAT Result Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-600">Taxable Net Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    NRs {vatResults.netAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-amber-800 font-semibold">13% VAT Amount:</span>
                  <span className="font-mono font-bold text-amber-700">
                    NRs {vatResults.vatAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-900 font-bold">Total Gross Invoice Amount:</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    NRs {vatResults.grossAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Downloads */}
      {activeTab === 'downloads' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category} • {item.file_format}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      File Size: {item.file_size} • {item.downloads_count} downloads
                    </div>
                  </div>
                </div>

                <a
                  href={item.download_url}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading "${item.title}"`);
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: Government Links */}
      {activeTab === 'govLinks' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governmentLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {link.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
                    {link.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {link.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
