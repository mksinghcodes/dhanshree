'use client';

import React from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode } from '@dhanshree/shared';
import { SellerNav } from '../../../components/SellerNav';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function SellerDashboardPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

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
      countryName: 'Nepal Storefront',
      taxIdentifier: 'PAN 601992819',
      authority: 'Inland Revenue Department (IRD) Nepal',
      revenue: 1845000,
      aov: 11250,
      escrow: 345000,
      availablePayout: 520000,
      courierPartner: 'Nepal CanShip & Express Logistics',
    },
    IN: {
      currency: 'INR',
      symbol: '₹',
      countryName: 'India Storefront',
      taxIdentifier: 'GSTIN 27AABCS1429B1Z8',
      authority: 'Goods & Services Tax Network (GSTN)',
      revenue: 1153125,
      aov: 7031,
      escrow: 215625,
      availablePayout: 325000,
      courierPartner: 'Delhivery Surface Express',
      tcsWithheld: '₹ 11,531 (1% Section 52 TCS)',
    },
    AE: {
      currency: 'AED',
      symbol: 'AED',
      countryName: 'UAE Storefront',
      taxIdentifier: 'TRN 100488291000003',
      authority: 'Federal Tax Authority (FTA) UAE',
      revenue: 49815,
      aov: 303,
      escrow: 9315,
      availablePayout: 14040,
      courierPartner: 'Aramex Priority Express Dubai',
    },
  }[countryCode];

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <SellerNav countryCode={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Store Health Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Seller Performance Overview
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Store Healthy & Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live telemetry for <span className="font-semibold text-slate-700">{config.countryName}</span> • Tax Reg: <span className="font-mono font-semibold text-slate-800">{config.taxIdentifier}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${countryCode.toLowerCase()}/seller/products`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <span>+ Add Product</span>
            </Link>
            <Link
              href={`/${countryCode.toLowerCase()}/seller/payouts`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              <span>Request Withdrawal</span>
            </Link>
          </div>
        </div>

        {/* Top KPI Cards (4-column grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Gross Sales */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales (30 Days)</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">+18.4%</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {config.symbol} {config.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Total Orders: <b className="text-slate-700">164</b></span>
              <span>AOV: <b className="text-slate-700">{config.symbol} {config.aov.toLocaleString()}</b></span>
            </div>
          </div>

          {/* Card 2: Available Payout */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Ready for Payout</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 tracking-tight">
              {config.symbol} {config.availablePayout.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Escrow Locked (7-day):</span>
              <span className="font-semibold text-slate-700">{config.symbol} {config.escrow.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 3: Pending Shipments */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Fulfillment</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">Action Needed</span>
            </div>
            <div className="text-2xl font-black text-amber-600 tracking-tight">
              2 Orders
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Carrier:</span>
              <span className="font-medium text-slate-700 truncate max-w-[150px]">{config.courierPartner}</span>
            </div>
          </div>

          {/* Card 4: Store Quality & RTO */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Rating & Reliability</span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>4.86</span>
              <span className="text-xs font-normal text-slate-400">/ 5.0 (382 reviews)</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>RTO Failure Rate:</span>
              <span className="font-bold text-emerald-600">1.8% (Ultra Low)</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Left Fulfillment Pipeline; Right Regulatory Tax & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders Action Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Orders Requiring Dispatch</h2>
                <p className="text-xs text-slate-500">Pack and print carrier shipping labels within SLA</p>
              </div>
              <Link
                href={`/${countryCode.toLowerCase()}/seller/orders`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View All Orders →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">ORD-2026-NP-89215</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      Payment Confirmed
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Buyer: <b className="text-slate-700">Pooja Shrestha</b> • Pokhara (Ward 6, Lakeside)
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    1x Sony WH-1000XM5 Wireless Headphones (Platinum Silver)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-slate-900">
                    {config.symbol} {config.currency === 'INR' ? '29,999' : config.currency === 'AED' ? '1,299' : '44,999'}
                  </div>
                  <Link
                    href={`/${countryCode.toLowerCase()}/seller/orders`}
                    className="inline-block mt-2 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    Pack & Print Label
                  </Link>
                </div>
              </div>

              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">ORD-2026-NP-89211</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Packed / In Transit
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Buyer: <b className="text-slate-700">Manoj Singh</b> • Kathmandu (Ward 4, Baluwatar)
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    AWB: <span className="font-mono font-semibold text-slate-800">CAN-NP-99821447</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-slate-900">
                    {config.symbol} {config.currency === 'INR' ? '29,999' : config.currency === 'AED' ? '1,299' : '44,999'}
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                    Label Dispatched
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Tax Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  §
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tax Compliance Status</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">100% Fully Compliant</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 mt-4">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Reg Authority:</span>
                  <span className="font-medium text-slate-900">{config.authority}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Registration ID:</span>
                  <span className="font-mono font-bold text-slate-900">{config.taxIdentifier}</span>
                </div>
                {config.tcsWithheld && (
                  <div className="flex justify-between py-1 border-b border-slate-100 text-indigo-700 font-semibold">
                    <span>GST TCS (Sec 52):</span>
                    <span>{config.tcsWithheld}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span>Marketplace Commission:</span>
                  <span className="font-semibold text-slate-900">10% Flat Rate</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                All buyer orders include verified electronic tax invoices automatically deposited to the tax registry.
              </div>
            </div>

            {/* Low Inventory Alert */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span>⚠️</span> Low Stock Notification
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold">
                  Action Recommended
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                <b>Sony WH-1000XM5 (Platinum Silver)</b> has only <b>8 units left</b> in Kathmandu Central Hub (WH-KT-01). Expected stock-out in 48 hours.
              </p>
              <Link
                href={`/${countryCode.toLowerCase()}/seller/products`}
                className="mt-3 inline-block text-xs font-bold text-amber-900 hover:text-amber-950 underline"
              >
                Restock Warehouse Inventory →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
