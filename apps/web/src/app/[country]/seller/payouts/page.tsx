'use client';

import React, { useState, use } from 'react';
import { CountryCode, CurrencyCode, PayoutStatus, SellerPayoutRecord } from '@dhanshree/shared';
import { SellerNav } from '../../../../components/SellerNav';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function SellerPayoutsPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const countryParam = unwrappedParams.country.toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const config = {
    NP: {
      currency: 'NPR',
      symbol: 'रु',
      available: 520000,
      escrow: 345000,
      lifetime: 2450000,
      defaultBank: 'Nabil Bank Ltd (Kathmandu)',
      accountNo: '•••• •••• •••• 4892',
      taxName: 'Inland Revenue Department (IRD) Nepal Rule 24',
      taxLine: '13% VAT reconciled at source • TDS Certificate available',
    },
    IN: {
      currency: 'INR',
      symbol: '₹',
      available: 325000,
      escrow: 215625,
      lifetime: 1531250,
      defaultBank: 'HDFC Bank Ltd (Bandra Mumbai)',
      accountNo: '•••• •••• •••• 9210',
      taxName: 'GST Section 52 Tax Collected at Source (TCS)',
      taxLine: '1% GST TCS automatically deducted and deposited to GSTN',
      tcsAmount: '₹ 11,531 YTD',
    },
    AE: {
      currency: 'AED',
      symbol: 'AED',
      available: 14040,
      escrow: 9315,
      lifetime: 66150,
      defaultBank: 'Emirates NBD (Dubai Downtown Branch)',
      accountNo: 'AE48 0260 •••• •••• 1092',
      taxName: 'FTA Executive Regulation Art. 59',
      taxLine: '5% Standard VAT accounted for with TRN 100488291000003',
    },
  }[countryCode];

  const [payouts, setPayouts] = useState<SellerPayoutRecord[]>([
    {
      id: 'pay-001',
      payoutReference: `PO-2026-${countryCode}-001`,
      amount: config.available * 0.8,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      bankName: config.defaultBank,
      accountNumberMasked: config.accountNo,
      status: PayoutStatus.COMPLETED,
      periodStart: '2026-09-01T00:00:00Z',
      periodEnd: '2026-09-15T23:59:59Z',
      commissionDeducted: Math.round(config.available * 0.8 * 0.1),
      tcsDeducted: countryCode === 'IN' ? Math.round(config.available * 0.8 * 0.01) : undefined,
      createdAt: '2026-09-17T10:00:00Z',
    },
    {
      id: 'pay-002',
      payoutReference: `PO-2026-${countryCode}-002`,
      amount: config.available * 0.7,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      bankName: config.defaultBank,
      accountNumberMasked: config.accountNo,
      status: PayoutStatus.COMPLETED,
      periodStart: '2026-09-16T00:00:00Z',
      periodEnd: '2026-09-30T23:59:59Z',
      commissionDeducted: Math.round(config.available * 0.7 * 0.1),
      tcsDeducted: countryCode === 'IN' ? Math.round(config.available * 0.7 * 0.01) : undefined,
      createdAt: '2026-10-02T11:30:00Z',
    },
  ]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(String(Math.round(config.available * 0.5)));
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > config.available) {
      alert(`Invalid amount. Must be between 1 and ${config.symbol} ${config.available.toLocaleString()}`);
      return;
    }

    const newRecord: SellerPayoutRecord = {
      id: `pay-${Date.now()}`,
      payoutReference: `PO-2026-${countryCode}-${Math.floor(100 + Math.random() * 900)}`,
      amount: amt,
      currency: countryCode === 'IN' ? CurrencyCode.INR : countryCode === 'AE' ? CurrencyCode.AED : CurrencyCode.NPR,
      bankName: config.defaultBank,
      accountNumberMasked: config.accountNo,
      status: PayoutStatus.PROCESSING,
      periodStart: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      periodEnd: new Date().toISOString(),
      commissionDeducted: Math.round(amt * 0.1),
      tcsDeducted: countryCode === 'IN' ? Math.round(amt * 0.01) : undefined,
      createdAt: new Date().toISOString(),
    };

    setPayouts([newRecord, ...payouts]);
    setWithdrawSuccessMsg(`Payout request for ${config.symbol} ${amt.toLocaleString()} initiated! Depositing to your registered bank account.`);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSuccessMsg(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <SellerNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Seller Payouts, Escrow & Statutory Taxes
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review marketplace settlements, 7-day escrow holds, and local tax compliance certificates.
            </p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <span>Request Bank Withdrawal</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Payout */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Cleared & Available</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">
              {config.symbol} {config.available.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Cleared for immediate withdrawal to your registered bank account ({config.defaultBank}).
            </p>
          </div>

          {/* 7-Day Escrow Locked */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">7-Day Escrow Locked</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">Buyer Protection</span>
            </div>
            <div className="text-3xl font-black text-blue-600 tracking-tight">
              {config.symbol} {config.escrow.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Funds unlocked automatically upon passage of the 7-day customer satisfaction inspection window.
            </p>
          </div>

          {/* Lifetime Disbursed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Disbursed</span>
              <span className="text-xs text-slate-400 font-semibold">All Time</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {config.symbol} {config.lifetime.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Total historical proceeds settled to your enterprise bank account.
            </p>
          </div>
        </div>

        {/* Regulatory Tax Statement Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>§</span> Official Tax Compliance Notice
              </div>
              <h2 className="text-xl font-bold">{config.taxName}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {config.taxLine}. Marketplace charges a flat 10% platform facilitation commission. All deductions are documented on your monthly fiscal reconciliation statement.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center shrink-0">
              <div className="text-xs uppercase text-slate-300">Commission Rate</div>
              <div className="text-2xl font-black text-white mt-1">10.0% Flat</div>
              {config.tcsAmount && (
                <div className="text-[11px] text-amber-300 font-bold mt-1">
                  Section 52 TCS: {config.tcsAmount}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payout History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Settlement History</h3>
            <button
              onClick={() => alert('Downloading official monthly settlement statement (CSV)...')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Export Statement (CSV) ↓
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Payout Ref</th>
                  <th className="py-3 px-4">Net Amount</th>
                  <th className="py-3 px-4">Bank & Account</th>
                  <th className="py-3 px-4">Commission Deducted</th>
                  {countryCode === 'IN' && <th className="py-3 px-4">1% GST TCS</th>}
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Initiated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {row.payoutReference}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                      {config.symbol} {row.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{row.bankName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.accountNumberMasked}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      -{config.symbol} {row.commissionDeducted.toLocaleString()}
                    </td>
                    {countryCode === 'IN' && (
                      <td className="py-3.5 px-4 text-indigo-700 font-mono font-semibold">
                        -{config.symbol} {(row.tcsDeducted || Math.round(row.amount * 0.01)).toLocaleString()}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === PayoutStatus.COMPLETED
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.status === PayoutStatus.COMPLETED ? 'Settled to Bank' : 'Processing'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Request Bank Withdrawal</h3>
                <p className="text-xs text-slate-500">Available: {config.symbol} {config.available.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {withdrawSuccessMsg && (
              <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {withdrawSuccessMsg}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Withdrawal Amount ({config.symbol}) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max={config.available}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-base focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
                <div className="font-bold text-slate-900">Destination Account:</div>
                <div className="text-[11px]">{config.defaultBank}</div>
                <div className="text-[11px] font-mono text-slate-500">{config.accountNo}</div>
              </div>

              <div className="text-[11px] text-slate-500">
                Transfers execute within 2 to 4 business hours via local automated clearinghouse.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
