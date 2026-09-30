'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Receipt,
  PiggyBank,
  Coins,
  Clock,
  Building,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResourcesToolsPage() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  // 1. VAT Calculator
  const [vatAmount, setVatAmount] = useState<number>(50000);
  const [vatMode, setVatMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // 2. Individual Tax Calculator
  const [annualSalary, setAnnualSalary] = useState<number>(1000000);
  const [taxMaritalStatus, setTaxMaritalStatus] = useState<'unmarried' | 'married'>('unmarried');

  // 3. TDS Calculator
  const [tdsBaseAmount, setTdsBaseAmount] = useState<number>(100000);
  const [tdsRate, setTdsRate] = useState<number>(15);

  // 4. Loan EMI Calculator
  const [loanPrincipal, setLoanPrincipal] = useState<number>(2500000);
  const [loanRate, setLoanRate] = useState<number>(10.5);
  const [loanYears, setLoanYears] = useState<number>(5);

  // 5. SSF Calculator
  const [ssfBasic, setSsfBasic] = useState<number>(35000);

  // 6. Gratuity Calculator
  const [gratuityBasic, setGratuityBasic] = useState<number>(45000);
  const [gratuityYears, setGratuityYears] = useState<number>(4);

  // 7. Net Take-Home Salary Calculator
  const [grossMonthly, setGrossMonthly] = useState<number>(75000);

  // 8. Advance Corporate Tax Estimator
  const [estimatedAnnualTax, setEstimatedAnnualTax] = useState<number>(500000);

  // 9. Corporate Tax Estimator
  const [taxableProfit, setTaxableProfit] = useState<number>(2000000);
  const [corpTaxRate, setCorpTaxRate] = useState<number>(25);

  // 10. Capital Gains Tax Calculator
  const [cgtGain, setCgtGain] = useState<number>(300000);
  const [cgtType, setCgtType] = useState<'equity_short' | 'equity_long' | 'property_short' | 'property_long'>('equity_short');

  // 11. Depreciation Pool Calculator
  const [deprOpeningValue, setDeprOpeningValue] = useState<number>(400000);
  const [deprPool, setDeprPool] = useState<'A' | 'B' | 'C' | 'D'>('B');

  // 12. Late Filing Penalty & Interest Estimator
  const [overdueTax, setOverdueTax] = useState<number>(100000);
  const [overdueMonths, setOverdueMonths] = useState<number>(3);

  // Calculations
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
            tax += rem * 0.36;
          }
        }
      }
    }
    return Math.round(tax);
  };

  const calcEmi = () => {
    const r = loanRate / 12 / 100;
    const n = loanYears * 12;
    if (r === 0) return { emi: Math.round(loanPrincipal / n), totalInterest: 0, totalPayable: loanPrincipal };
    const emi = (loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanPrincipal;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  };

  const selectTool = (toolId: string) => {
    setActiveToolId(toolId);
    window.requestAnimationFrame(() => {
      document.getElementById('tool-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toolsList = [
    {
      id: 'vat',
      name: 'VAT 13% Calculator',
      category: 'Indirect Taxation',
      icon: Receipt,
      description: 'Compute statutory 13% VAT with instant inclusive/exclusive reverse breakdown.',
    },
    {
      id: 'income-tax',
      name: 'Personal Income Tax',
      category: 'Direct Taxation',
      icon: Calculator,
      description: 'Calculate progressive tax slabs (1%, 10%, 20%, 30%, 36%) for married and unmarried.',
    },
    {
      id: 'tds',
      name: 'TDS Rate Calculator',
      category: 'Withholding Tax',
      icon: Percent,
      description: 'Standard withholding tax lookup for rent (10%), consultancy (15%), contract (1.5%).',
    },
    {
      id: 'emi',
      name: 'Loan EMI & Interest',
      category: 'Corporate Finance',
      icon: Coins,
      description: 'Determine monthly EMI, amortization, and total financing interest charges.',
    },
    {
      id: 'ssf',
      name: 'SSF Contribution (31%)',
      category: 'Labor Compliance',
      icon: PiggyBank,
      description: 'Mandatory 11% employee and 20% employer Social Security Fund contributions.',
    },
    {
      id: 'gratuity',
      name: 'Gratuity & Severance',
      category: 'Labor Act 2074',
      icon: Clock,
      description: 'Statutory 8.33% monthly gratuity provisions and total severance accruals.',
    },
    {
      id: 'take-home',
      name: 'Net Salary Take-Home',
      category: 'Payroll & HR',
      icon: TrendingUp,
      description: 'Estimated net monthly paycheck after statutory SSF deductions and progressive TDS.',
    },
    {
      id: 'advance-tax',
      name: 'Advance Corporate Tax',
      category: 'Filing Deadlines',
      icon: Calendar,
      description: 'Statutory installment schedule: Poush (40%), Chaitra (70%), Ashad (100%).',
    },
    {
      id: 'corp-tax',
      name: 'Corporate Tax Estimator',
      category: 'Corporate Law',
      icon: Building,
      description: 'Standard 25% corporate rate, 30% financial/telecom, 20% manufacturing concessions.',
    },
    {
      id: 'cgt',
      name: 'Capital Gains Tax (CGT)',
      category: 'Investments',
      icon: Layers,
      description: 'Securities (5% vs 7.5%) and real estate capital gains tax computations.',
    },
    {
      id: 'depreciation',
      name: 'Tax Depreciation Pools',
      category: 'Income Tax Act',
      icon: HelpCircle,
      description: 'Statutory rates: Pool A (5%), Pool B (25%), Pool C (20%), Pool D (15%).',
    },
    {
      id: 'penalty',
      name: 'Late Filing Penalty & Interest',
      category: 'IRD Compliance',
      icon: AlertCircle,
      description: 'Estimate statutory fees (Sec 117) and 15% annual interest (Sec 118) for delayed returns.',
    },
  ];

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* Header */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Accounting & Tax Calculators<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Choose a calculator, enter your figures, and review the estimate immediately. These tools are for planning and should be checked against your records and the latest official guidance.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#CCD7DC] bg-[#E8F4F8] p-5 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#023A51]">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#023A51]">Start with one question</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#33475B]">Select a tool below. The selected calculator will open underneath the list, where you can change inputs and see the result update as you type.</p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => selectTool(tool.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') selectTool(tool.id);
                }}
                role="button"
                tabIndex={0}
                aria-pressed={activeToolId === tool.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group ${activeToolId === tool.id ? 'border-[#023A51] shadow-md' : 'border-[#E8EBEF] hover:border-[#2CBC63]/60'}`}
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F4F8] text-[#023A51] group-hover:bg-[#2CBC63] group-hover:text-white transition-colors flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {tool.category}
                  </span>
                  <h3 className="text-base font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors leading-snug">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#59667D] leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#023A51] group-hover:text-[#2CBC63]">
                  <span>{activeToolId === tool.id ? 'Selected below' : 'Open calculator'} &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected tool workspace */}
      {activeToolId && (
        <section id="tool-workspace" className="max-w-3xl mx-auto px-6 pt-12">
          <div className="bg-white rounded-2xl w-full p-6 sm:p-8 space-y-5 border border-[#E8EBEF] shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#023A51]">
                    {toolsList.find((t) => t.id === activeToolId)?.name}
                  </h3>
                  <span className="text-xs text-[#59667D]">
                    {toolsList.find((t) => t.id === activeToolId)?.category}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveToolId(null)}
              >
                <span>Close tool</span>
              </Button>
            </div>

            {/* Tool 1: VAT Calculator */}
            {activeToolId === 'vat' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transaction Amount (NPR)</label>
                  <input
                    type="number"
                    value={vatAmount}
                    onChange={(e) => setVatAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-semibold text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setVatMode('exclusive')}
                    className={`flex-1 rounded-lg font-bold text-xs ${
                      vatMode === 'exclusive' ? 'bg-[#023A51] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    VAT Exclusive (+13%)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setVatMode('inclusive')}
                    className={`flex-1 rounded-lg font-bold text-xs ${
                      vatMode === 'inclusive' ? 'bg-[#023A51] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    VAT Inclusive (Reverse)
                  </Button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxable Base Amount:</span>
                    <span className="font-bold text-slate-800">NPR {calcVat().base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">VAT (13%):</span>
                    <span className="font-bold text-[#2CBC63]">NPR {calcVat().vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-sm text-[#023A51]">
                    <span>Total Invoice Amount:</span>
                    <span>NPR {calcVat().total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 2: Income Tax */}
            {activeToolId === 'income-tax' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Annual Taxable Income (NPR)</label>
                  <input
                    type="number"
                    value={annualSalary}
                    onChange={(e) => setAnnualSalary(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-semibold text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTaxMaritalStatus('unmarried')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs ${
                      taxMaritalStatus === 'unmarried' ? 'bg-[#023A51] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Individual (Unmarried)
                  </button>
                  <button
                    onClick={() => setTaxMaritalStatus('married')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs ${
                      taxMaritalStatus === 'married' ? 'bg-[#023A51] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Couple (Married)
                  </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Threshold 1% SST:</span>
                    <span className="font-bold text-slate-800">
                      {taxMaritalStatus === 'unmarried' ? 'Up to 5 Lakhs' : 'Up to 6 Lakhs'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-sm text-[#023A51]">
                    <span>Annual Tax Liability:</span>
                    <span className="text-[#2CBC63]">NPR {calcIndividualTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Monthly TDS Deduction:</span>
                    <span className="font-semibold text-slate-700">
                      NPR {Math.round(calcIndividualTax() / 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 3: TDS */}
            {activeToolId === 'tds' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Base Amount (NPR)</label>
                  <input
                    type="number"
                    value={tdsBaseAmount}
                    onChange={(e) => setTdsBaseAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Withholding Nature</label>
                  <select
                    value={tdsRate}
                    onChange={(e) => setTdsRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={15}>Technical / Consultancy Service (15%)</option>
                    <option value={10}>House / Space Rent (10%)</option>
                    <option value={10}>Vehicle / Fleet Hire (10%)</option>
                    <option value={1.5}>Works Contract over 50 Lakhs (1.5%)</option>
                    <option value={5}>Dividend Distribution (5%)</option>
                    <option value={5}>Bank Interest / Deposits (5%)</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">TDS Deduction ({tdsRate}%):</span>
                    <span className="font-bold text-amber-600">
                      NPR {Math.round((tdsBaseAmount * tdsRate) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-sm text-[#023A51]">
                    <span>Net Payable to Vendor:</span>
                    <span>NPR {Math.round(tdsBaseAmount - (tdsBaseAmount * tdsRate) / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 4: Loan EMI */}
            {activeToolId === 'emi' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Principal (NPR)</label>
                    <input
                      type="number"
                      value={loanPrincipal}
                      onChange={(e) => setLoanPrincipal(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between font-bold text-sm text-[#023A51]">
                    <span>Monthly EMI:</span>
                    <span className="text-[#2CBC63]">NPR {calcEmi().emi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Total Interest:</span>
                    <span>NPR {calcEmi().totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Total Payment:</span>
                    <span>NPR {calcEmi().totalPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 5: SSF */}
            {activeToolId === 'ssf' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Basic Monthly Salary (NPR)</label>
                  <input
                    type="number"
                    value={ssfBasic}
                    onChange={(e) => setSsfBasic(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employee Contribution (11%):</span>
                    <span className="font-bold text-slate-800">
                      NPR {Math.round(ssfBasic * 0.11).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employer Contribution (20%):</span>
                    <span className="font-bold text-slate-800">
                      NPR {Math.round(ssfBasic * 0.20).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-sm text-[#023A51]">
                    <span>Total SSF Deposit (31%):</span>
                    <span className="text-[#2CBC63]">
                      NPR {Math.round(ssfBasic * 0.31).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Other tools follow standard template */}
            {activeToolId === 'gratuity' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Basic Salary (NPR)</label>
                    <input
                      type="number"
                      value={gratuityBasic}
                      onChange={(e) => setGratuityBasic(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Service Years</label>
                    <input
                      type="number"
                      value={gratuityYears}
                      onChange={(e) => setGratuityYears(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between pt-1 font-bold text-sm text-[#023A51]">
                    <span>Total Accrued Gratuity:</span>
                    <span className="text-[#2CBC63]">
                      NPR {Math.round(gratuityBasic * gratuityYears).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeToolId === 'take-home' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gross Monthly Package (NPR)</label>
                  <input
                    type="number"
                    value={grossMonthly}
                    onChange={(e) => setGrossMonthly(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-semibold"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between pt-1 font-bold text-sm text-[#023A51]">
                    <span>Estimated Net In-Hand:</span>
                    <span className="text-[#2CBC63]">
                      NPR {Math.round(grossMonthly - grossMonthly * 0.11 * 0.6 - (grossMonthly * 12 * 0.05) / 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeToolId === 'advance-tax' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Est. Annual Tax (NPR)</label>
                  <input
                    type="number"
                    value={estimatedAnnualTax}
                    onChange={(e) => setEstimatedAnnualTax(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">1st (Poush - 40%):</span>
                    <span className="font-bold">NPR {Math.round(estimatedAnnualTax * 0.4).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">2nd (Chaitra - 70%):</span>
                    <span className="font-bold">NPR {Math.round(estimatedAnnualTax * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">3rd (Ashad - 100%):</span>
                    <span className="font-bold">NPR {estimatedAnnualTax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {activeToolId === 'corp-tax' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taxable Profit (NPR)</label>
                  <input
                    type="number"
                    value={taxableProfit}
                    onChange={(e) => setTaxableProfit(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Entity Type</label>
                  <select
                    value={corpTaxRate}
                    onChange={(e) => setCorpTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={25}>General Entity (25%)</option>
                    <option value={30}>Banking & Financial (30%)</option>
                    <option value={20}>Manufacturing Unit (20%)</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between font-bold text-sm text-[#023A51]">
                    <span>Corporate Income Tax:</span>
                    <span className="text-[#2CBC63]">NPR {Math.round((taxableProfit * corpTaxRate) / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {activeToolId === 'cgt' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Net Capital Gain (NPR)</label>
                  <input
                    type="number"
                    value={cgtGain}
                    onChange={(e) => setCgtGain(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Holding Period</label>
                  <select
                    value={cgtType}
                    onChange={(e) => setCgtType(e.target.value as 'equity_short' | 'equity_long' | 'property_short' | 'property_long')}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="equity_short">Equities &lt; 365 days (7.5%)</option>
                    <option value="equity_long">Equities &ge; 365 days (5.0%)</option>
                    <option value="property_short">Real estate &lt; 5 yrs (7.5%)</option>
                    <option value="property_long">Real estate &ge; 5 yrs (5.0%)</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between font-bold text-sm text-[#023A51]">
                    <span>CGT Payable:</span>
                    <span className="text-[#2CBC63]">
                      NPR {Math.round(cgtGain * (cgtType.includes('short') ? 0.075 : 0.05)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeToolId === 'depreciation' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Opening WDV (NPR)</label>
                  <input
                    type="number"
                    value={deprOpeningValue}
                    onChange={(e) => setDeprOpeningValue(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pool</label>
                  <select
                    value={deprPool}
                    onChange={(e) => setDeprPool(e.target.value as 'A' | 'B' | 'C' | 'D')}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="A">Block A: Buildings (5%)</option>
                    <option value="B">Block B: Office Equipment (25%)</option>
                    <option value="C">Block C: Vehicles (20%)</option>
                    <option value="D">Block D: Heavy Machinery (15%)</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  {(() => {
                    const rate = deprPool === 'A' ? 0.05 : deprPool === 'B' ? 0.25 : deprPool === 'C' ? 0.20 : 0.15;
                    const dep = deprOpeningValue * rate;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Depreciation:</span>
                          <span className="font-bold text-[#2CBC63]">NPR {Math.round(dep).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t font-bold text-sm text-[#023A51]">
                          <span>Closing WDV:</span>
                          <span>NPR {Math.round(deprOpeningValue - dep).toLocaleString()}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeToolId === 'penalty' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Overdue Tax (NPR)</label>
                    <input
                      type="number"
                      value={overdueTax}
                      onChange={(e) => setOverdueTax(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Months Delayed</label>
                    <input
                      type="number"
                      value={overdueMonths}
                      onChange={(e) => setOverdueMonths(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border">
                  <div className="flex justify-between font-bold text-sm text-[#023A51]">
                    <span>Est. Settlement with 15% Interest:</span>
                    <span className="text-[#2CBC63]">
                      NPR {Math.round(overdueTax + (overdueTax * 0.15 * overdueMonths) / 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setActiveToolId(null)}
                className="px-5 py-2 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
