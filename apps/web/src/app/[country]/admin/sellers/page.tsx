'use client';

import React, { useState } from 'react';
import { CountryCode, AdminSellerKycItem } from '@dhanshree/shared';
import { AdminNav } from '../../../../components/AdminNav';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function AdminSellersKycPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [sellers, setSellers] = useState<AdminSellerKycItem[]>([
    {
      id: 'kyc-him-002',
      sellerId: 'usr-seller-him',
      storeName: 'Himalayan Organic Tea & Spices',
      ownerName: 'Sunita Basnet',
      email: 'export@himalayanpure.com',
      phone: '+977 9841009988',
      country: CountryCode.NEPAL,
      registrationNumber: 'PAN 609812445',
      taxNumber: 'VAT-NP-609812445',
      documentUrls: [
        'https://docs.marketplace.global/kyc/cottage-industry-license.pdf',
        'https://docs.marketplace.global/kyc/pan-vat-cert.pdf',
      ],
      status: 'PENDING_REVIEW',
      commissionRatePercent: 10.0,
      submittedAt: '2026-10-03T18:30:00Z',
      notes: 'Submitted cottage industry cert and PAN/VAT card',
    },
    {
      id: 'kyc-mum-003',
      sellerId: 'usr-seller-mum',
      storeName: 'Mumbai Silk & Textile Crafts',
      ownerName: 'Rajesh Patel',
      email: 'rajesh@mumbaisilks.in',
      phone: '+91 9820019283',
      country: CountryCode.INDIA,
      registrationNumber: 'GSTIN 27AABCS1429B1Z8',
      taxNumber: 'PAN ABCDE1234F',
      documentUrls: [
        'https://docs.marketplace.global/kyc/gstn-cert.pdf',
      ],
      status: 'PENDING_REVIEW',
      commissionRatePercent: 12.0,
      submittedAt: '2026-10-04T06:15:00Z',
      notes: 'Maharashtra GST registration verified via GSTN API',
    },
    {
      id: 'kyc-sny-001',
      sellerId: 'usr-seller-sny',
      storeName: 'Sony Official Flagship Store',
      ownerName: 'Manoj Shrestha',
      email: 'authorized.dealer@sony.np',
      phone: '+977 9801992819',
      country: CountryCode.NEPAL,
      registrationNumber: 'PAN 601992819',
      taxNumber: 'VAT-NP-601992819',
      documentUrls: [
        'https://docs.marketplace.global/kyc/np-pan-cert.pdf',
        'https://docs.marketplace.global/kyc/np-company-reg.pdf',
      ],
      status: 'VERIFIED',
      commissionRatePercent: 8.5,
      submittedAt: '2026-09-15T10:00:00Z',
      reviewedBy: 'superadmin@marketplace.global',
      reviewedAt: '2026-09-16T11:00:00Z',
      notes: 'Brand authorization verified directly with regional distributor',
    },
    {
      id: 'kyc-dxb-004',
      sellerId: 'usr-seller-dxb',
      storeName: 'Dubai Gold & Fragrance Trading FZE',
      ownerName: 'Rashid Al Nuaimi',
      email: 'rashid@goldfze.ae',
      phone: '+971 501239988',
      country: CountryCode.UAE,
      registrationNumber: 'DED Trade License #992144',
      taxNumber: 'TRN 100488291000003',
      documentUrls: [
        'https://docs.marketplace.global/kyc/ded-commercial-license.pdf',
        'https://docs.marketplace.global/kyc/emirates-id-passport.pdf',
      ],
      status: 'VERIFIED',
      commissionRatePercent: 7.5,
      submittedAt: '2026-09-20T12:00:00Z',
      reviewedBy: 'superadmin@marketplace.global',
      reviewedAt: '2026-09-21T09:00:00Z',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [selectedSeller, setSelectedSeller] = useState<AdminSellerKycItem | null>(null);
  const [overrideCommission, setOverrideCommission] = useState<string>('10.0');
  const [adminNotes, setAdminNotes] = useState<string>('');

  const filtered = sellers.filter((s) => {
    if (activeFilter !== 'ALL' && s.status !== activeFilter) return false;
    return true;
  });

  const handleReviewDecision = (decision: 'VERIFY' | 'REJECT') => {
    if (!selectedSeller) return;

    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedSeller.id
          ? {
              ...s,
              status: decision === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
              commissionRatePercent: parseFloat(overrideCommission) || s.commissionRatePercent,
              reviewedBy: 'superadmin@marketplace.global',
              reviewedAt: new Date().toISOString(),
              notes: adminNotes || s.notes,
            }
          : s,
      ),
    );

    setSelectedSeller(null);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <AdminNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Seller KYC Onboarding & Moderation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify statutory business licenses: Nepal PAN/VAT, India GSTIN, and UAE DED Trade Licenses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              Automatic validation connected to IRD Nepal & GSTN India APIs
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3">
          {(
            [
              { id: 'ALL', label: 'All Applications', count: sellers.length },
              {
                id: 'PENDING_REVIEW',
                label: 'Pending Review',
                count: sellers.filter((s) => s.status === 'PENDING_REVIEW').length,
              },
              {
                id: 'VERIFIED',
                label: 'Verified & Active',
                count: sellers.filter((s) => s.status === 'VERIFIED').length,
              },
              {
                id: 'REJECTED',
                label: 'Rejected',
                count: sellers.filter((s) => s.status === 'REJECTED').length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Store & Merchant</th>
                  <th className="py-3 px-4">Market</th>
                  <th className="py-3 px-4">Statutory Tax & License</th>
                  <th className="py-3 px-4 text-center">Commission Rate</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isPending = item.status === 'PENDING_REVIEW';
                  const flag =
                    item.country === CountryCode.NEPAL
                      ? '🇳🇵 NP'
                      : item.country === CountryCode.INDIA
                      ? '🇮🇳 IN'
                      : '🇦🇪 AE';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.storeName}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Owner: <b className="text-slate-700">{item.ownerName}</b> • {item.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {flag}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{item.registrationNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.taxNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono">
                        {item.commissionRatePercent}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : item.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPending ? 'Pending Audit' : item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSeller(item);
                            setOverrideCommission(String(item.commissionRatePercent));
                            setAdminNotes(item.notes || '');
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                            isPending
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isPending ? 'Audit & Verify' : 'View Details'}
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

      {/* Audit & Verification Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Seller KYC Verification Desk
                </h3>
                <p className="text-xs text-slate-500">{selectedSeller.storeName} ({selectedSeller.country})</p>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tax Registration / PAN</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{selectedSeller.registrationNumber}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Store Owner Contact</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedSeller.ownerName} ({selectedSeller.phone})</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attached Government Documents (2)</label>
                <div className="space-y-1.5">
                  {selectedSeller.documentUrls.map((url, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">📄</span>
                        <span className="font-mono text-slate-700 truncate max-w-xs">{url.split('/').pop()}</span>
                      </div>
                      <span className="text-blue-600 font-bold hover:underline cursor-pointer">Preview PDF</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Platform Commission Rate (%) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={overrideCommission}
                  onChange={(e) => setOverrideCommission(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default standard fee is 10.0%. Special negotiated rate for flagship brand stores.</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Reviewer Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record verification details, tax portal check reference, or rejection reason..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleReviewDecision('REJECT')}
                  className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl font-bold hover:bg-rose-100 border border-rose-200"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewDecision('VERIFY')}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                >
                  Approve & Verify Merchant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
