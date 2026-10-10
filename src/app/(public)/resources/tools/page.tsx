'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  TrendingDown,
  Calendar,
  Percent,
  Coins,
  FileSpreadsheet,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type TenureType = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

interface AmortizationRow {
  period: number;
  label: string;
  openingBalance: number;
  installment: number;
  principal: number;
  interest: number;
  closingBalance: number;
}

export default function DedicatedEmiCalculatorPage() {
  // 1. User Input States
  const [principal, setPrincipal] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureValue, setTenureValue] = useState<number>(5);
  const [tenureType, setTenureType] = useState<TenureType>('yearly');
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(0.75);
  const [viewMode, setViewMode] = useState<'yearly' | 'installment'>('yearly');
  const [copied, setCopied] = useState<boolean>(false);

  // Quick preset helpers
  const principalPresets = [
    { label: '10 Lakhs', value: 1000000 },
    { label: '25 Lakhs', value: 2500000 },
    { label: '50 Lakhs', value: 5000000 },
    { label: '1 Crore', value: 10000000 },
    { label: '2.5 Crore', value: 25000000 },
  ];

  const ratePresets = [
    { label: '8.75% Home Loan', value: 8.75 },
    { label: '10.50% Auto/Hire', value: 10.5 },
    { label: '11.75% Business', value: 11.75 },
    { label: '13.25% Working Cap', value: 13.25 },
  ];

  // 2. Calculations
  const calculations = useMemo(() => {
    const P = Math.max(0, principal);
    const annualR = Math.max(0.01, interestRate) / 100;

    // Determine periods per year
    let periodsPerYear = 12;
    let totalPeriods = 0;

    switch (tenureType) {
      case 'monthly':
        periodsPerYear = 12;
        totalPeriods = Math.max(1, Math.round(tenureValue));
        break;
      case 'quarterly':
        periodsPerYear = 4;
        totalPeriods = Math.max(1, Math.round(tenureValue));
        break;
      case 'half_yearly':
        periodsPerYear = 2;
        totalPeriods = Math.max(1, Math.round(tenureValue));
        break;
      case 'yearly':
        periodsPerYear = 12; // Monthly EMI installments over Y years
        totalPeriods = Math.max(1, Math.round(tenureValue * 12));
        break;
    }

    // Rate per period
    const ratePerPeriod = annualR / (tenureType === 'yearly' ? 12 : periodsPerYear);

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi =
      ratePerPeriod > 0
        ? (P * ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) /
          (Math.pow(1 + ratePerPeriod, totalPeriods) - 1)
        : P / totalPeriods;

    // Generate schedule
    let currentBalance = P;
    const schedule: AmortizationRow[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= totalPeriods; i++) {
      const interestForPeriod = currentBalance * ratePerPeriod;
      const principalForPeriod = Math.min(currentBalance, emi - interestForPeriod);
      const closing = Math.max(0, currentBalance - principalForPeriod);

      schedule.push({
        period: i,
        label:
          tenureType === 'yearly' || tenureType === 'monthly'
            ? `Month ${i}`
            : tenureType === 'quarterly'
            ? `Quarter ${i}`
            : `Half-Year ${i}`,
        openingBalance: currentBalance,
        installment: principalForPeriod + interestForPeriod,
        principal: principalForPeriod,
        interest: interestForPeriod,
        closingBalance: closing,
      });

      totalInterest += interestForPeriod;
      currentBalance = closing;
      if (currentBalance <= 0) break;
    }

    const totalPrincipal = P;
    const totalPayment = totalPrincipal + totalInterest;
    const feeAmount = (P * (processingFeePercent || 0)) / 100;
    const grandTotal = totalPayment + feeAmount;

    // Yearly Aggregation for summary view
    const yearlySummary: {
      year: number;
      principal: number;
      interest: number;
      total: number;
      closingBalance: number;
    }[] = [];

    const periodsPerYearGroup = tenureType === 'quarterly' ? 4 : tenureType === 'half_yearly' ? 2 : 12;
    for (let yr = 0; yr < Math.ceil(totalPeriods / periodsPerYearGroup); yr++) {
      const slice = schedule.slice(yr * periodsPerYearGroup, (yr + 1) * periodsPerYearGroup);
      if (slice.length === 0) break;
      const yrPrincipal = slice.reduce((sum, r) => sum + r.principal, 0);
      const yrInterest = slice.reduce((sum, r) => sum + r.interest, 0);
      yearlySummary.push({
        year: yr + 1,
        principal: yrPrincipal,
        interest: yrInterest,
        total: yrPrincipal + yrInterest,
        closingBalance: slice[slice.length - 1].closingBalance,
      });
    }

    return {
      emi: Math.round(emi),
      totalPeriods,
      totalPrincipal: Math.round(totalPrincipal),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      feeAmount: Math.round(feeAmount),
      grandTotal: Math.round(grandTotal),
      principalPercent: totalPayment > 0 ? (totalPrincipal / totalPayment) * 100 : 100,
      interestPercent: totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0,
      schedule,
      yearlySummary,
    };
  }, [principal, interestRate, tenureValue, tenureType, processingFeePercent]);

  const formatNpr = (val: number) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
  };

  const handleCopySummary = async () => {
    const text = `Loan Summary - Narahari Adhikari
Principal: NPR ${formatNpr(calculations.totalPrincipal)}
Interest Rate: ${interestRate}% p.a.
Tenure: ${tenureValue} ${tenureType}
Installment (EMI): NPR ${formatNpr(calculations.emi)} / period
Total Interest: NPR ${formatNpr(calculations.totalInterest)}
Total Repayment: NPR ${formatNpr(calculations.totalPayment)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Section */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Dedicated Loan &amp; EMI Calculator<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Calculate exact loan installments, periodic interest amortizations, and complete repayment schedules for corporate and personal borrowings.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator Main Grid */}
      <div className="max-w-[1240px] mx-auto px-6 pt-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Inputs Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-8 shadow-sm space-y-7">
            <div className="border-b border-[#E8EBEF] pb-4">
              <h2 className="text-xl font-bold text-[#023A51]">Loan Parameters</h2>
              <p className="text-xs text-[#59667D] mt-1">
                Customize loan size, interest rates, and installment payment frequencies.
              </p>
            </div>

            {/* Input 1: Principal Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#023A51] uppercase tracking-wider">
                  Loan Principal (NPR)
                </label>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-[#023A51]">
                    NPR {formatNpr(principal)}
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                  className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {principalPresets.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPrincipal(p.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      principal === p.value
                        ? 'bg-[#023A51] text-white shadow-xs'
                        : 'bg-[#F4F6F8] text-[#59667D] hover:bg-[#E8EBEF] hover:text-[#023A51]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Rate of Interest */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#023A51] uppercase tracking-wider">
                  Annual Interest Rate (%)
                </label>
                <span className="text-base font-extrabold text-[#023A51]">
                  {interestRate}% p.a.
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="35"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63]"
                />
              </div>

              {/* Rate Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {ratePresets.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setInterestRate(r.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      interestRate === r.value
                        ? 'bg-[#023A51] text-white shadow-xs'
                        : 'bg-[#F4F6F8] text-[#59667D] hover:bg-[#E8EBEF] hover:text-[#023A51]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Tenure Value and Type Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#023A51] uppercase tracking-wider block">
                  Tenure Duration
                </label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={tenureValue}
                  onChange={(e) => setTenureValue(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#023A51] uppercase tracking-wider block">
                  Tenure Type / Frequency
                </label>
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as TenureType)}
                  className="w-full h-11 px-4 text-sm font-semibold rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63] cursor-pointer"
                >
                  <option value="yearly">Years (Monthly Repayment)</option>
                  <option value="monthly">Months (Monthly Repayment)</option>
                  <option value="quarterly">Quarters (Quarterly Repayment)</option>
                  <option value="half_yearly">Half-Years (Semi-Annual)</option>
                </select>
              </div>
            </div>

            {/* Input 4: Processing Fee (Optional Corporate Parameter) */}
            <div className="space-y-2 pt-2 border-t border-[#E8EBEF]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#59667D]">
                  Estimated Bank Processing Fee (% of principal)
                </label>
                <span className="text-xs font-bold text-[#023A51]">
                  NPR {formatNpr(calculations.feeAmount)} ({processingFeePercent}%)
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="5"
                step="0.05"
                value={processingFeePercent}
                onChange={(e) => setProcessingFeePercent(Number(e.target.value) || 0)}
                className="w-full h-10 px-4 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63]"
              />
            </div>
          </div>

          {/* RIGHT: Output & Repayment Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Result Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E2ECE6] shadow-sm relative overflow-hidden space-y-6">
              <div className="space-y-2 border-b border-[#EDF2EF] pb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#14864B] bg-[#EAF7F0] px-3 py-1 rounded-full border border-[#D5EFE1] inline-block">
                  {tenureType === 'quarterly'
                    ? 'Quarterly Installment'
                    : tenureType === 'half_yearly'
                    ? 'Semi-Annual Installment'
                    : 'Monthly EMI Installment'}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight pt-1">
                  NPR {formatNpr(calculations.emi)}
                </div>
                <p className="text-xs text-[#56686A]">
                  Fixed periodic installment across {calculations.totalPeriods} payments.
                </p>
              </div>

              {/* Progress Split Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#56686A]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14864B]" />
                    Principal ({calculations.principalPercent.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                    Interest ({calculations.interestPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#F0F4F2] overflow-hidden flex">
                  <div
                    style={{ width: `${calculations.principalPercent}%` }}
                    className="h-full bg-[#14864B] transition-all duration-300"
                  />
                  <div
                    style={{ width: `${calculations.interestPercent}%` }}
                    className="h-full bg-[#D97706] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Breakdown Grid in 2 Clean Metric Cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-2xl bg-[#FAFCFB] border border-[#E5ECE8] p-4">
                  <span className="text-[11px] font-medium text-[#56686A] block">Total Interest</span>
                  <span className="text-base sm:text-lg font-bold text-[#023A51] mt-0.5 block">
                    NPR {formatNpr(calculations.totalInterest)}
                  </span>
                </div>
                <div className="rounded-2xl bg-[#FAFCFB] border border-[#E5ECE8] p-4">
                  <span className="text-[11px] font-medium text-[#56686A] block">Total Repayment</span>
                  <span className="text-base sm:text-lg font-bold text-[#023A51] mt-0.5 block">
                    NPR {formatNpr(calculations.totalPayment)}
                  </span>
                </div>
              </div>

              {/* Copy Summary Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#023A51] hover:bg-[#034B68] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-[#2CBC63]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Summary Copied to Clipboard' : 'Copy Loan Summary'}</span>
                </button>
              </div>
            </div>

            {/* Quick Consultation Callout */}
            <div className="bg-white rounded-3xl border border-[#E8EBEF] p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#023A51]">
                Need Corporate Debt or Working Capital Structuring?
              </h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Connect with Narahari Adhikari for corporate debt restructuring, bank loan proposals, and financial model validations.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#023A51] hover:text-[#14864B] hover:underline pt-1 transition-colors"
              >
                <span>Request Financial Advisory</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#023A51]" />
              </Link>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: FULL AMORTIZATION SCHEDULE TABLE             */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EBEF] pb-5">
            <div>
              <h3 className="text-xl font-bold text-[#023A51]">
                Amortization Repayment Schedule
              </h3>
              <p className="text-xs text-[#59667D] mt-1">
                Period-by-period breakdown of principal repayments, interest expenses, and loan balance.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#F4F6F8] p-1 rounded-xl border border-[#E8EBEF]">
              <button
                type="button"
                onClick={() => setViewMode('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'yearly'
                    ? 'bg-white text-[#023A51] shadow-xs'
                    : 'text-[#59667D] hover:text-[#023A51]'
                }`}
              >
                Annual Summary
              </button>
              <button
                type="button"
                onClick={() => setViewMode('installment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'installment'
                    ? 'bg-white text-[#023A51] shadow-xs'
                    : 'text-[#59667D] hover:text-[#023A51]'
                }`}
              >
                All {calculations.totalPeriods} Payments
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {viewMode === 'yearly' ? (
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-[#E8EBEF] text-[#59667D] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4 text-right">Principal Repaid (NPR)</th>
                    <th className="py-3 px-4 text-right">Interest Paid (NPR)</th>
                    <th className="py-3 px-4 text-right">Total Annual Payment (NPR)</th>
                    <th className="py-3 px-4 text-right">Year-End Balance (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EBEF]/60">
                  {calculations.yearlySummary.map((row) => (
                    <tr key={row.year} className="hover:bg-[#F8FAFC] transition">
                      <td className="py-3 px-4 font-bold text-[#023A51]">Year {row.year}</td>
                      <td className="py-3 px-4 text-right font-medium text-[#168A4A]">
                        {formatNpr(row.principal)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[#B45309]">
                        {formatNpr(row.interest)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#023A51]">
                        {formatNpr(row.total)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#59667D]">
                        {formatNpr(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-[#E8EBEF] text-[#59667D] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4 text-right">Opening Balance (NPR)</th>
                    <th className="py-3 px-4 text-right">EMI Installment (NPR)</th>
                    <th className="py-3 px-4 text-right">Principal (NPR)</th>
                    <th className="py-3 px-4 text-right">Interest (NPR)</th>
                    <th className="py-3 px-4 text-right">Closing Balance (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EBEF]/60">
                  {calculations.schedule.map((row) => (
                    <tr key={row.period} className="hover:bg-[#F8FAFC] transition">
                      <td className="py-2.5 px-4 font-bold text-[#023A51]">{row.label}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#59667D]">
                        {formatNpr(row.openingBalance)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#023A51]">
                        {formatNpr(row.installment)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-medium text-[#168A4A]">
                        {formatNpr(row.principal)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-medium text-[#B45309]">
                        {formatNpr(row.interest)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#59667D]">
                        {formatNpr(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
