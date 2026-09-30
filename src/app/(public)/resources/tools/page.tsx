'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Receipt,
  PiggyBank,
  Coins,
  Clock,
  Building,
  TrendingUp,
  Percent,
  Layers,
  AlertCircle,
  HelpCircle,
  X,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResourcesToolsPage() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  // 1. VAT Calculator
  const [vatAmount, setVatAmount] = useState<number>(50000);
  const [vatMode, setVatMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // 2. Individual Tax Calculator
  const [annualSalary, setAnnualSalary] = useState<number>(1200000);
  const [taxMaritalStatus, setTaxMaritalStatus] = useState<'unmarried' | 'married'>('unmarried');

  // 3. TDS Calculator
  const [tdsBaseAmount, setTdsBaseAmount] = useState<number>(100000);
  const [tdsRate, setTdsRate] = useState<number>(15);

  // 4. Advance Corporate Tax Estimator
  const [estimatedAnnualTax, setEstimatedAnnualTax] = useState<number>(600000);

  // 5. Corporate Tax Estimator
  const [taxableProfit, setTaxableProfit] = useState<number>(2500000);
  const [corpTaxRate, setCorpTaxRate] = useState<number>(25);

  // 6. Capital Gains Tax Calculator
  const [cgtGain, setCgtGain] = useState<number>(400000);
  const [cgtType, setCgtType] = useState<'equity_short' | 'equity_long' | 'property_short' | 'property_long'>('equity_short');

  // 7. SSF Calculator
  const [ssfBasic, setSsfBasic] = useState<number>(40000);

  // 8. Loan EMI Calculator
  const [loanPrincipal, setLoanPrincipal] = useState<number>(2500000);
  const [loanRate, setLoanRate] = useState<number>(11.5);
  const [loanYears, setLoanYears] = useState<number>(5);

  // Computations
  const calcVat = () => {
    if (vatMode === 'exclusive') {
      const vat = vatAmount * 0.13;
      return { base: vatAmount, vat: Math.round(vat), total: Math.round(vatAmount + vat) };
    } else {
      const base = vatAmount / 1.13;
      const vat = vatAmount - base;
      return { base: Math.round(base), vat: Math.round(vat), total: vatAmount };
    }
  };

  const calcIndividualTax = () => {
    let tax = 0;
    const slab1 = taxMaritalStatus === 'unmarried' ? 500000 : 600000;
    const slab2 = taxMaritalStatus === 'unmarried' ? 700000 : 800000;
    const slab3 = taxMaritalStatus === 'unmarried' ? 1000000 : 1100000;
    const slab4 = 2000000;

    let rem = annualSalary;
    if (rem <= slab1) {
      tax += rem * 0.01;
    } else {
      tax += slab1 * 0.01;
      rem -= slab1;
      const band2 = slab2 - slab1;
      if (rem <= band2) {
        tax += rem * 0.10;
      } else {
        tax += band2 * 0.10;
        rem -= band2;
        const band3 = slab3 - slab2;
        if (rem <= band3) {
          tax += rem * 0.20;
        } else {
          tax += band3 * 0.20;
          rem -= band3;
          const band4 = slab4 - slab3;
          if (rem <= band4) {
            tax += rem * 0.30;
          } else {
            tax += band4 * 0.30;
            rem -= band4;
            tax += rem * 0.39;
          }
        }
      }
    }
    const effectiveRate = annualSalary > 0 ? (tax / annualSalary) * 100 : 0;
    return { tax: Math.round(tax), monthlyTax: Math.round(tax / 12), effectiveRate: effectiveRate.toFixed(1) };
  };

  const calcTds = () => {
    const tds = (tdsBaseAmount * tdsRate) / 100;
    return { base: tdsBaseAmount, tds: Math.round(tds), payable: Math.round(tdsBaseAmount - tds) };
  };

  const calcAdvanceTax = () => {
    const poush = Math.round(estimatedAnnualTax * 0.40);
    const chaitra = Math.round(estimatedAnnualTax * 0.30);
    const ashadh = Math.round(estimatedAnnualTax * 0.30);
    return { poush, chaitra, ashadh, total: estimatedAnnualTax };
  };

  const calcCorpTax = () => {
    const tax = (taxableProfit * corpTaxRate) / 100;
    return { profit: taxableProfit, tax: Math.round(tax), net: Math.round(taxableProfit - tax) };
  };

  const calcCgt = () => {
    let rate = 7.5;
    if (cgtType === 'equity_short') rate = 7.5;
    if (cgtType === 'equity_long') rate = 5.0;
    if (cgtType === 'property_short') rate = 7.5;
    if (cgtType === 'property_long') rate = 5.0;
    const tax = (cgtGain * rate) / 100;
    return { gain: cgtGain, rate, tax: Math.round(tax), net: Math.round(cgtGain - tax) };
  };

  const calcSsf = () => {
    const employee = Math.round(ssfBasic * 0.11);
    const employer = Math.round(ssfBasic * 0.20);
    const total = employee + employer;
    return { basic: ssfBasic, employee, employer, total };
  };

  const calcEmi = () => {
    const r = loanRate / 12 / 100;
    const n = loanYears * 12;
    if (r === 0) return { emi: Math.round(loanPrincipal / n), totalInterest: 0, totalPayment: loanPrincipal };
    const emi = (loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanPrincipal;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) };
  };

  const toolsList = [
    {
      id: 'vat',
      name: 'Nepal VAT Calculator',
      category: 'VAT & Indirect Tax',
      icon: Receipt,
      description: 'Compute 13% VAT for forward (exclusive) and reverse (inclusive) invoice calculations in Nepal.',
    },
    {
      id: 'individual-tax',
      name: 'Individual Salary Tax Estimate (FY 2081/82)',
      category: 'Income Tax',
      icon: Calculator,
      description: 'Estimate progressive tax and monthly withholding using the FY 2081/82 assumptions shown in the calculator.',
    },
    {
      id: 'tds',
      name: 'Withholding Tax (TDS) Calculator',
      category: 'Compliance',
      icon: Coins,
      description: 'Estimate withholding from an amount and a rate you select. Check the applicable rate before making a deduction.',
    },
    {
      id: 'advance-tax',
      name: 'Advance Corporate Tax Schedule',
      category: 'Corporate Tax',
      icon: Clock,
      description: 'Split an estimated annual payment into three editable planning amounts.',
    },
    {
      id: 'corp-tax',
      name: 'Corporate Income Tax Estimator',
      category: 'Corporate Tax',
      icon: Building,
      description: 'Estimate company tax using the rate option you select. Confirm the rate for the entity and fiscal year.',
    },
    {
      id: 'cgt',
      name: 'Capital Gains Tax (CGT)',
      category: 'Investments',
      icon: Layers,
      description: 'Calculate gains tax on listed securities (5% vs 7.5%) and real estate properties in Nepal.',
    },
    {
      id: 'ssf',
      name: 'Social Security Fund (SSF) Split',
      category: 'Payroll & HR',
      icon: PiggyBank,
      description: 'Mandatory 31% split breakdown: 11% employee contribution and 20% employer contribution.',
    },
    {
      id: 'emi',
      name: 'Business Loan EMI Calculator',
      category: 'Financial Advisory',
      icon: TrendingUp,
      description: 'Calculate monthly loan installments, total repayment amount, and cumulative interest burden.',
    },
  ];

  const categories = ['All', 'Income Tax', 'Corporate Tax', 'VAT & Indirect Tax', 'Payroll & HR', 'Investments'];

  const filteredTools = toolsList.filter((tool) => {
    if (selectedCategory === 'All') return true;
    return tool.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const activeTool = toolsList.find((t) => t.id === selectedToolId);

  const handleCopySummary = (text: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Hero Header */}
      <section
        id="hero-section"
        className="relative bg-white border-b border-[#E8EBEF] pt-10 pb-12 sm:pt-14 sm:pb-16"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#2CBC63]">
              Self-Service Practice Tools
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Accounting & Tax Calculators<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Use these calculators to work through an estimate. Tax rates can change by fiscal year and taxpayer, so confirm the applicable figures before filing or paying.
            </p>
            <a href="https://ird.gov.np/category/taxrateincentives/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#023A51] underline decoration-[#2CBC63] underline-offset-4 hover:text-[#2CBC63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#023A51]">
              Check current IRD tax rates <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#023A51] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#023A51] hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Grid of Calculators */}
      <div className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className="bg-white rounded-3xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-xl hover:border-[#2CBC63]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#E8F4F8] text-[#023A51] group-hover:bg-[#2CBC63] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors leading-snug">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#59667D] leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#023A51] group-hover:text-[#2CBC63]">
                  <span>Launch calculator</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CENTER MORPH MODAL FOR ACTIVE CALCULATOR */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-[#CCD7DC] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-[#E8EBEF] flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider">
                  {activeTool.category}
                </span>
                <h2 className="text-2xl font-extrabold text-[#023A51]">
                  {activeTool.name}
                </h2>
                <p className="text-xs text-[#59667D]">
                  {activeTool.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedToolId(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#023A51] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Active Calculator Forms */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* VAT CALCULATOR */}
              {selectedToolId === 'vat' && (
                <div className="space-y-5">
                  <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setVatMode('exclusive')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        vatMode === 'exclusive' ? 'bg-white text-[#023A51] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Exclusive (Add 13% VAT)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVatMode('inclusive')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        vatMode === 'inclusive' ? 'bg-white text-[#023A51] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Inclusive (Extract 13% VAT)
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      {vatMode === 'exclusive' ? 'Net Amount (NPR)' : 'Gross Inclusive Amount (NPR)'}
                    </label>
                    <Input
                      type="number"
                      value={vatAmount}
                      onChange={(e) => setVatAmount(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {/* Results Card */}
                  {(() => {
                    const res = calcVat();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Taxable Base:</span>
                          <span className="font-mono font-bold text-[#023A51]">NPR {res.base.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#2CBC63] font-bold">
                          <span>13% VAT Amount:</span>
                          <span className="font-mono">NPR {res.vat.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Total Invoiced Amount:</span>
                          <span className="font-mono">NPR {res.total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* INDIVIDUAL TAX CALCULATOR */}
              {selectedToolId === 'individual-tax' && (
                <div className="space-y-5">
                  <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setTaxMaritalStatus('unmarried')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        taxMaritalStatus === 'unmarried' ? 'bg-white text-[#023A51] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Unmarried (First 5 Lakhs @ 1%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxMaritalStatus('married')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        taxMaritalStatus === 'married' ? 'bg-white text-[#023A51] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Married (First 6 Lakhs @ 1%)
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Gross Annual Taxable Salary (NPR)
                    </label>
                    <Input
                      type="number"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {(() => {
                    const res = calcIndividualTax();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Effective Tax Rate:</span>
                          <span className="font-mono font-bold text-[#023A51]">{res.effectiveRate}%</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Monthly Payroll Withholding:</span>
                          <span className="font-mono font-bold text-[#023A51]">NPR {res.monthlyTax.toLocaleString()} / mo</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Total Annual Tax Liability:</span>
                          <span className="font-mono text-[#2CBC63]">NPR {res.tax.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TDS CALCULATOR */}
              {selectedToolId === 'tds' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Rent (10%)', rate: 10 },
                      { label: 'Contract (1.5%)', rate: 1.5 },
                      { label: 'Consultancy (15%)', rate: 15 },
                      { label: 'Dividend (5%)', rate: 5 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setTdsRate(item.rate)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                          tdsRate === item.rate
                            ? 'bg-[#023A51] text-white border-[#023A51]'
                            : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Base Transaction Amount (NPR)
                    </label>
                    <Input
                      type="number"
                      value={tdsBaseAmount}
                      onChange={(e) => setTdsBaseAmount(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {(() => {
                    const res = calcTds();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Withholding Rate Applied:</span>
                          <span className="font-mono font-bold text-[#023A51]">{tdsRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#2CBC63] font-bold">
                          <span>TDS Deductible (Deposit to IRD):</span>
                          <span className="font-mono">NPR {res.tds.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Net Payable to Vendor:</span>
                          <span className="font-mono">NPR {res.payable.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ADVANCE CORPORATE TAX SCHEDULE */}
              {selectedToolId === 'advance-tax' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Estimated Annual Corporate Income Tax (NPR)
                    </label>
                    <Input
                      type="number"
                      value={estimatedAnnualTax}
                      onChange={(e) => setEstimatedAnnualTax(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {(() => {
                    const res = calcAdvanceTax();
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-white border border-[#CCD7DC] space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">1st Installment (40%)</span>
                          <div className="text-lg font-extrabold text-[#023A51]">NPR {res.poush.toLocaleString()}</div>
                          <div className="text-xs text-[#2CBC63] font-semibold">End of Poush</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-[#CCD7DC] space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">2nd Installment (30%)</span>
                          <div className="text-lg font-extrabold text-[#023A51]">NPR {res.chaitra.toLocaleString()}</div>
                          <div className="text-xs text-[#2CBC63] font-semibold">End of Chaitra</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-[#CCD7DC] space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">3rd Installment (30%)</span>
                          <div className="text-lg font-extrabold text-[#023A51]">NPR {res.ashadh.toLocaleString()}</div>
                          <div className="text-xs text-[#2CBC63] font-semibold">End of Ashadh</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CORPORATE TAX ESTIMATOR */}
              {selectedToolId === 'corp-tax' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'General (25%)', rate: 25 },
                      { label: 'Manufacturing (20%)', rate: 20 },
                      { label: 'Banking/Telecom (30%)', rate: 30 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setCorpTaxRate(item.rate)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          corpTaxRate === item.rate
                            ? 'bg-[#023A51] text-white border-[#023A51]'
                            : 'bg-[#F8FAFC] text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Estimated Taxable Profit (NPR)
                    </label>
                    <Input
                      type="number"
                      value={taxableProfit}
                      onChange={(e) => setTaxableProfit(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {(() => {
                    const res = calcCorpTax();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Corporate Rate Applied:</span>
                          <span className="font-mono font-bold text-[#023A51]">{corpTaxRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#2CBC63] font-bold">
                          <span>Estimated Corporate Tax:</span>
                          <span className="font-mono">NPR {res.tax.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Net Profit After Tax:</span>
                          <span className="font-mono">NPR {res.net.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CAPITAL GAINS TAX */}
              {selectedToolId === 'cgt' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'equity_short', label: 'Shares (< 365 Days) @ 7.5%' },
                      { id: 'equity_long', label: 'Shares (>= 365 Days) @ 5.0%' },
                      { id: 'property_short', label: 'Property (< 5 Years) @ 7.5%' },
                      { id: 'property_long', label: 'Property (>= 5 Years) @ 5.0%' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCgtType(item.id as typeof cgtType)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          cgtType === item.id
                            ? 'bg-[#023A51] text-white border-[#023A51]'
                            : 'bg-[#F8FAFC] text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Net Capital Gain (NPR)
                    </label>
                    <Input
                      type="number"
                      value={cgtGain}
                      onChange={(e) => setCgtGain(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {(() => {
                    const res = calcCgt();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>CGT Rate Applied:</span>
                          <span className="font-mono font-bold text-[#023A51]">{res.rate}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#2CBC63] font-bold">
                          <span>Capital Gains Tax:</span>
                          <span className="font-mono">NPR {res.tax.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Net Take-Home Proceeds:</span>
                          <span className="font-mono">NPR {res.net.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SSF CALCULATOR */}
              {selectedToolId === 'ssf' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Monthly Basic Salary (NPR)
                    </label>
                    <Input
                      type="number"
                      value={ssfBasic}
                      onChange={(e) => setSsfBasic(Number(e.target.value) || 0)}
                      className="h-12 text-lg font-mono font-bold rounded-xl"
                    />
                  </div>

                  {(() => {
                    const res = calcSsf();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Employee Deduction (11%):</span>
                          <span className="font-mono font-bold text-[#023A51]">NPR {res.employee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Employer Contribution (20%):</span>
                          <span className="font-mono font-bold text-[#023A51]">NPR {res.employer.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Total Monthly SSF Deposit (31%):</span>
                          <span className="font-mono text-[#2CBC63]">NPR {res.total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* LOAN EMI CALCULATOR */}
              {selectedToolId === 'emi' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1">
                        Principal (NPR)
                      </label>
                      <Input
                        type="number"
                        value={loanPrincipal}
                        onChange={(e) => setLoanPrincipal(Number(e.target.value) || 0)}
                        className="h-10 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1">
                        Annual Rate (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={loanRate}
                        onChange={(e) => setLoanRate(Number(e.target.value) || 0)}
                        className="h-10 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1">
                        Tenure (Years)
                      </label>
                      <Input
                        type="number"
                        value={loanYears}
                        onChange={(e) => setLoanYears(Number(e.target.value) || 0)}
                        className="h-10 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {(() => {
                    const res = calcEmi();
                    return (
                      <div className="p-6 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] space-y-3">
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Total Interest Burden:</span>
                          <span className="font-mono font-bold text-[#023A51]">NPR {res.totalInterest.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#59667D]">
                          <span>Total Cumulative Repayment:</span>
                          <span className="font-mono font-bold text-[#023A51]">NPR {res.totalPayment.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#CCD7DC] flex justify-between text-base font-extrabold text-[#023A51]">
                          <span>Monthly EMI:</span>
                          <span className="font-mono text-[#2CBC63]">NPR {res.emi.toLocaleString()} / mo</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 sm:p-8 bg-[#F8FAFC] border-t border-[#E8EBEF] rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white text-xs font-bold transition-all text-center"
              >
                Discuss this calculation in a consultation &rarr;
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedToolId(null)}
                className="w-full sm:w-auto rounded-full text-xs font-semibold"
              >
                Close Calculator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
