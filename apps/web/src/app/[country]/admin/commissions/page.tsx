'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode, AdminCommissionRule } from '@dhanshree/shared';
import { AdminNav } from '../../../../components/AdminNav';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function AdminCommissionsPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [rules, setRules] = useState<AdminCommissionRule[]>([
    {
      id: 'rule-elec-np',
      categoryName: 'Consumer Electronics & Audio',
      countryCode: CountryCode.NEPAL,
      standardRatePercent: 8.5,
      promotionalRatePercent: 6.5,
      minFeeAmount: 150,
      currency: CurrencyCode.NPR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-fash-np',
      categoryName: 'Fashion, Apparel & Footwear',
      countryCode: CountryCode.NEPAL,
      standardRatePercent: 14.0,
      promotionalRatePercent: 10.0,
      minFeeAmount: 100,
      currency: CurrencyCode.NPR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-groc-np',
      categoryName: 'Daily Essentials & Groceries',
      countryCode: CountryCode.NEPAL,
      standardRatePercent: 5.0,
      promotionalRatePercent: 4.0,
      minFeeAmount: 50,
      currency: CurrencyCode.NPR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-elec-in',
      categoryName: 'Consumer Electronics & Audio',
      countryCode: CountryCode.INDIA,
      standardRatePercent: 9.0,
      promotionalRatePercent: 7.0,
      minFeeAmount: 99,
      currency: CurrencyCode.INR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-lux-ae',
      categoryName: 'Luxury Fragrance & Gold Jewelry',
      countryCode: CountryCode.UAE,
      standardRatePercent: 7.5,
      promotionalRatePercent: 5.0,
      minFeeAmount: 20,
      currency: CurrencyCode.AED,
      updatedAt: '2026-10-01T00:00:00Z',
    },
  ]);

  const [selectedRule, setSelectedRule] = useState<AdminCommissionRule | null>(null);
  const [newRate, setNewRate] = useState<string>('');
  const [newPromoRate, setNewPromoRate] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    const rate = parseFloat(newRate);
    const promo = parseFloat(newPromoRate);

    setRules((prev) =>
      prev.map((r) =>
        r.id === selectedRule.id
          ? {
              ...r,
              standardRatePercent: isNaN(rate) ? r.standardRatePercent : rate,
              promotionalRatePercent: isNaN(promo) ? r.promotionalRatePercent : promo,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );

    setSaveSuccessMsg(`Rule for ${selectedRule.categoryName} updated successfully.`);
    setTimeout(() => {
      setSelectedRule(null);
      setSaveSuccessMsg(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <AdminNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Marketplace Commission Rules & Tax Config
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure per-category platform facilitation commissions and statutory withholding parameters.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              Changes apply instantly to newly placed orders
            </span>
          </div>
        </div>

        {/* Statutory Tax Policy Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Nepal Tax Framework 🇳🇵</span>
              <span className="text-xs font-bold text-blue-600">IRD Rule 24</span>
            </div>
            <div className="text-lg font-black text-slate-900">13% Value Added Tax (VAT)</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Standard 13% VAT levied on all taxable supplies with automatic electronic billing filing to the Inland Revenue Department server.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">India Tax Framework 🇮🇳</span>
              <span className="text-xs font-bold text-indigo-600">Section 52 TCS</span>
            </div>
            <div className="text-lg font-black text-slate-900">1% GST TCS Withholding</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Mandatory 1% Tax Collected at Source deducted on net value of taxable supplies made through the platform by registered e-commerce operators.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">UAE Tax Framework 🇦🇪</span>
              <span className="text-xs font-bold text-emerald-600">FTA Executive Reg</span>
            </div>
            <div className="text-lg font-black text-slate-900">5% Standard VAT</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Federal Tax Authority standard 5% VAT applied across mainland & designated zones with bilingual Arabic/English tax invoices.
            </p>
          </div>
        </div>

        {/* Commission Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Category Commission Fee Schedules</h3>
            <span className="text-xs text-slate-400">Total Active Rules: {rules.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Market Region</th>
                  <th className="py-3 px-4 text-center">Standard Fee %</th>
                  <th className="py-3 px-4 text-center">Festival Promo Fee %</th>
                  <th className="py-3 px-4">Min Fixed Fee</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rules.map((rule) => {
                  const flag =
                    rule.countryCode === CountryCode.NEPAL
                      ? '🇳🇵 Nepal'
                      : rule.countryCode === CountryCode.INDIA
                      ? '🇮🇳 India'
                      : '🇦🇪 UAE';

                  const symbol =
                    rule.currency === CurrencyCode.INR
                      ? '₹'
                      : rule.currency === CurrencyCode.AED
                      ? 'AED'
                      : 'रु';

                  return (
                    <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {rule.categoryName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {flag}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono text-sm">
                        {rule.standardRatePercent}%
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 font-mono text-sm">
                        {rule.promotionalRatePercent ? `${rule.promotionalRatePercent}%` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {symbol} {rule.minFeeAmount}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(rule.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRule(rule);
                            setNewRate(String(rule.standardRatePercent));
                            setNewPromoRate(String(rule.promotionalRatePercent || ''));
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Modify Rates
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Rule Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Modify Commission Rule</h3>
                <p className="text-xs text-slate-500">{selectedRule.categoryName} ({selectedRule.countryCode})</p>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Rate (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Festival Promotional Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newPromoRate}
                  onChange={(e) => setNewPromoRate(e.target.value)}
                  placeholder="e.g. 6.5 for Dashain/Diwali"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRule(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xs"
                >
                  Save & Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
