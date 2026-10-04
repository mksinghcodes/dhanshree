'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, AdminDashboardMetrics } from '@dhanshree/shared';
import { AdminNav } from '../../../components/AdminNav';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export default function AdminDashboardPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const countryParam = unwrappedParams.country.toUpperCase();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const metrics: AdminDashboardMetrics = {
    totalGmvUsd: 184500,
    totalOrders: 1420,
    totalRegisteredUsers: 9840,
    activeSellersCount: 148,
    pendingSellerKycCount: 2,
    openDisputesCount: 1,
    escrowLockedTotalUsd: 42100,
    netCommissionEarnedUsd: 18450,
    countryBreakdown: [
      {
        country: CountryCode.NEPAL,
        currency: CurrencyCode.NPR,
        gmvLocal: 14500000,
        orderCount: 840,
        activeSellers: 82,
        vatGstCollected: 1885000,
      },
      {
        country: CountryCode.INDIA,
        currency: CurrencyCode.INR,
        gmvLocal: 4800000,
        orderCount: 420,
        activeSellers: 44,
        vatGstCollected: 864000,
      },
      {
        country: CountryCode.UAE,
        currency: CurrencyCode.AED,
        gmvLocal: 125000,
        orderCount: 160,
        activeSellers: 22,
        vatGstCollected: 6250,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <AdminNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Global System Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Super Admin Cockpit
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Live Multi-Region Mesh
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Global marketplace operations across <span className="font-semibold text-slate-700">Nepal, India, and United Arab Emirates</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${countryCode.toLowerCase()}/admin/sellers`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <span>🛡️ Review Pending KYC ({metrics.pendingSellerKycCount})</span>
            </Link>
            <Link
              href={`/${countryCode.toLowerCase()}/admin/disputes`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-500/20"
            >
              <span>⚖️ Open Disputes ({metrics.openDisputesCount})</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* GMV */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Merchandise Value</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">+24.2%</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ${metrics.totalGmvUsd.toLocaleString()} <span className="text-xs text-slate-400 font-normal">USD Eq.</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex justify-between">
              <span>Orders: <b className="text-slate-700">{metrics.totalOrders}</b></span>
              <span>Buyers: <b className="text-slate-700">{metrics.totalRegisteredUsers.toLocaleString()}</b></span>
            </div>
          </div>

          {/* Platform Revenue */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Net Commission Earned</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 tracking-tight">
              ${metrics.netCommissionEarnedUsd.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex justify-between">
              <span>Avg Commission:</span>
              <span className="font-bold text-slate-700">10.0% Flat</span>
            </div>
          </div>

          {/* Escrow Vault */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Escrow Held Vault</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">Secured</span>
            </div>
            <div className="text-2xl font-black text-indigo-600 tracking-tight">
              ${metrics.escrowLockedTotalUsd.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex justify-between">
              <span>7-Day Return Buffer:</span>
              <span className="font-semibold text-slate-700">Auto-Releasing</span>
            </div>
          </div>

          {/* Verified Merchants */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Merchant Network</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">Verified</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {metrics.activeSellersCount} <span className="text-xs text-slate-400 font-normal">Stores</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex justify-between">
              <span>KYC Awaiting:</span>
              <span className="font-bold text-amber-600">{metrics.pendingSellerKycCount} in Queue</span>
            </div>
          </div>
        </div>

        {/* Tri-Country Storefront Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cross-Country Storefront Performance</h2>
              <p className="text-xs text-slate-500">Live operational telemetry across Nepal, India, and UAE clusters</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold font-mono">
              3 Active Regions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Market / Region</th>
                  <th className="py-3 px-4">Local Currency</th>
                  <th className="py-3 px-4">Gross GMV</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-center">Active Stores</th>
                  <th className="py-3 px-4">Statutory Tax Collected</th>
                  <th className="py-3 px-4 text-right">Quick Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.countryBreakdown.map((row) => {
                  const countryName =
                    row.country === CountryCode.NEPAL
                      ? 'Nepal Storefront 🇳🇵'
                      : row.country === CountryCode.INDIA
                      ? 'India Storefront 🇮🇳'
                      : 'UAE Dubai Storefront 🇦🇪';

                  const symbol =
                    row.country === CountryCode.NEPAL
                      ? 'रु'
                      : row.country === CountryCode.INDIA
                      ? '₹'
                      : 'AED';

                  const taxLabel =
                    row.country === CountryCode.NEPAL
                      ? '13% IRD VAT'
                      : row.country === CountryCode.INDIA
                      ? 'GST (incl. 1% TCS)'
                      : '5% FTA VAT';

                  return (
                    <tr key={row.country} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{countryName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Region: {row.country}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {row.currency}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                        {symbol} {row.gmvLocal.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        {row.orderCount}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                          {row.activeSellers} Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-slate-800">
                          {symbol} {row.vatGstCollected.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">{taxLabel}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/${row.country.toLowerCase()}/admin/commissions`}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold inline-block"
                        >
                          Configure Fees →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Action Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>🛡️</span> Merchant KYC Verification Required (2)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold">
                Action Required
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              New applications from <b>Himalayan Organic Tea & Spices (Nepal)</b> and <b>Mumbai Silk & Textile Crafts (India)</b> are waiting for statutory tax registration check and document review.
            </p>
            <Link
              href={`/${countryCode.toLowerCase()}/admin/sellers`}
              className="mt-3 inline-block text-xs font-bold text-amber-900 hover:text-amber-950 underline"
            >
              Open Seller KYC Verification Queue →
            </Link>
          </div>

          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <span>⚖️</span> Escrow Dispute Arbitration (1)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 font-bold">
                High Priority
              </span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Order <b>ORD-2026-NP-88190</b> has a claim: buyer reports damaged packaging with broken glass containers. Escrow funds of <b>NPR 4,800</b> currently frozen pending arbitration.
            </p>
            <Link
              href={`/${countryCode.toLowerCase()}/admin/disputes`}
              className="mt-3 inline-block text-xs font-bold text-rose-900 hover:text-rose-950 underline"
            >
              Open Dispute Resolution Desk →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
