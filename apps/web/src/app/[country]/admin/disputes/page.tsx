'use client';

import React, { useState } from 'react';
import { CountryCode, CurrencyCode, AdminDisputeItem } from '@dhanshree/shared';
import { AdminNav } from '../../../../components/AdminNav';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function AdminDisputesPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [disputes, setDisputes] = useState<AdminDisputeItem[]>([
    {
      id: 'disp-001',
      orderNumber: 'ORD-2026-NP-88190',
      buyerName: 'Amit Gurung',
      sellerStoreName: 'Himalayan Organic Tea & Spices',
      disputeReason: 'Carton arrived heavily torn; glass organic honey jar smashed in transit by carrier.',
      claimAmount: 4800,
      currency: CurrencyCode.NPR,
      status: 'OPEN',
      escrowHoldId: 'escrow-np-88190',
      evidenceBuyer: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
      ],
      evidenceSeller: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400',
      ],
      createdAt: '2026-10-03T16:00:00Z',
    },
    {
      id: 'disp-002',
      orderNumber: 'ORD-2026-IN-44102',
      buyerName: 'Sneha Sen',
      sellerStoreName: 'Mumbai Silk & Textile Crafts',
      disputeReason: 'Color variation: received saffron saree instead of royal maroon shown on product page.',
      claimAmount: 6500,
      currency: CurrencyCode.INR,
      status: 'UNDER_REVIEW',
      escrowHoldId: 'escrow-in-44102',
      evidenceBuyer: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
      ],
      evidenceSeller: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
      ],
      createdAt: '2026-10-04T05:30:00Z',
    },
  ]);

  const [selectedDispute, setSelectedDispute] = useState<AdminDisputeItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const handleArbitrate = (decision: 'REFUND_BUYER' | 'RELEASE_SELLER') => {
    if (!selectedDispute) return;

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: decision === 'REFUND_BUYER' ? 'REFUNDED_TO_BUYER' : 'RELEASED_TO_SELLER',
            }
          : d,
      ),
    );

    alert(`Dispute on ${selectedDispute.orderNumber} resolved: ${decision === 'REFUND_BUYER' ? 'Buyer Refunded' : 'Seller Released'}`);
    setSelectedDispute(null);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <AdminNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Escrow Dispute & Refund Arbitration
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Arbitrate buyer return claims and control 7-day marketplace escrow disbursements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
              Buyer Protection Policy: 100% Escrow Guarantee
            </span>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order / Escrow ID</th>
                  <th className="py-3 px-4">Buyer vs Seller</th>
                  <th className="py-3 px-4">Claim Reason</th>
                  <th className="py-3 px-4">Claimed Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Arbitration Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {disputes.map((d) => {
                  const isOpen = d.status === 'OPEN' || d.status === 'UNDER_REVIEW';

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 text-sm">{d.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{d.escrowHoldId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>Buyer: <b className="text-slate-900">{d.buyerName}</b></div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Seller: <b className="text-slate-700">{d.sellerStoreName}</b>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 truncate">{d.disputeReason}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                        {d.currency} {d.claimAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isOpen
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : d.status === 'REFUNDED_TO_BUYER'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isOpen ? 'Awaiting Verdict' : d.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedDispute(d);
                            setResolutionNotes('');
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                            isOpen
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isOpen ? 'Arbitrate Claim' : 'Review Decision'}
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

      {/* Arbitration Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Escrow Arbitration Desk • #{selectedDispute.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">Claim Amount: {selectedDispute.currency} {selectedDispute.claimAmount.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed text-slate-700">
                <b>Buyer Claim Statement:</b> {selectedDispute.disputeReason}
              </div>

              {/* Side-by-Side Evidence Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-slate-700 mb-1">Buyer Photo Evidence</div>
                  <img
                    src={selectedDispute.evidenceBuyer[0]}
                    alt="Buyer Evidence"
                    className="w-full h-40 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Uploaded upon delivery inspection</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700 mb-1">Seller Packing Evidence</div>
                  <img
                    src={selectedDispute.evidenceSeller[0]}
                    alt="Seller Evidence"
                    className="w-full h-40 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Logged before carrier handover</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Arbitration Notes & Justification *</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record formal verdict rationale: carrier transit damage liability, packaging fault, or claim dismissal..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleArbitrate('RELEASE_SELLER')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                  >
                    Release Escrow to Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArbitrate('REFUND_BUYER')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs"
                  >
                    Refund Buyer from Escrow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
