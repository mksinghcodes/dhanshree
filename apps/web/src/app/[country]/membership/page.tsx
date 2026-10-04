'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, LoyaltyWalletBalance } from '@dhanshree/shared';
import { Header } from '../../../components/Header';
import { useResolvedParams } from '@/lib/params';

interface PageProps {
  params: any;
}

export default function MembershipPage({ params }: PageProps) {
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
      annualPrice: 2499,
      pointsValue: 485,
      carrier: 'Nepal CanShip & Express Logistics',
      festivalName: 'Dashain & Tihar',
    },
    IN: {
      currency: 'INR',
      symbol: '₹',
      annualPrice: 1499,
      pointsValue: 303,
      carrier: 'Delhivery Surface Express',
      festivalName: 'Diwali Dhamaka',
    },
    AE: {
      currency: 'AED',
      symbol: 'AED',
      annualPrice: 199,
      pointsValue: 13,
      carrier: 'Aramex Priority UAE',
      festivalName: 'Ramadan & Eid Al Fitr',
    },
  }[countryCode];

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(2000);
  const maxPoints = 4850;

  const pointsCashValue = Math.round(
    (pointsToRedeem / maxPoints) * config.pointsValue,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header currentCountry={countryCode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Prime Hero Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl mb-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 uppercase tracking-wider mb-3">
                <span>👑</span> Dhanshree Prime VIP Club
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Unlock Free Express Shipping, Early Festival Sales & 2x Rewards
              </h1>
              <p className="text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed">
                Enjoy world-class privileges across {countryCode}. Guaranteed next-day dispatch via {config.carrier}, 24-hour early access to the {config.festivalName} mega sales, and continuous loyalty cashback.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => alert(`Subscribed to Dhanshree Prime for ${config.symbol} ${config.annualPrice}/year!`)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-2xl font-black text-sm shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Join Prime for {config.symbol} {config.annualPrice} / Year
                </button>
                <span className="text-xs text-slate-400">Cancel anytime • 30-day money-back guarantee</span>
              </div>
            </div>

            {/* Active Membership Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 text-center min-w-[240px]">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto shadow-md">
                ★
              </div>
              <div className="text-base font-black text-white mt-3">VIP Prime Status</div>
              <div className="text-xs text-emerald-300 font-semibold mt-0.5">Active until Oct 2027</div>
              <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-300">
                Total Saved This Year: <b className="text-white">{config.symbol} {(config.annualPrice * 3.4).toLocaleString()}</b>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0">
              🚀
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Free Express Delivery</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Zero delivery fee on all Prime-eligible orders with priority sorting by {config.carrier}.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Early Festival Sale Access</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Shop 24 hours before public launch on {config.festivalName} deals and lightning flash sales.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
              💰
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">2x Loyalty Points Cashback</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Earn double reward points on every verified transaction, redeemable instantly at checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Loyalty Wallet & Instant Redemption Simulator */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Reward Balance</div>
              <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
                <span>{maxPoints.toLocaleString()}</span>
                <span className="text-sm font-semibold text-slate-500">Reward Points</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Equivalent cash redemption value: <b className="text-emerald-600">{config.symbol} {config.pointsValue.toLocaleString()}</b>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-sm">
              Points never expire as long as your account remains active. Earned points credit 7 days after delivery confirmation.
            </div>
          </div>

          {/* Interactive Redemption Calculator */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Redeem Points on Next Order:</span>
              <span className="text-sm font-black text-blue-600 font-mono">
                {pointsToRedeem.toLocaleString()} Points = -{config.symbol} {pointsCashValue.toLocaleString()} Discount
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={maxPoints}
              step="100"
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0 Points</span>
              <span>2,400 Points</span>
              <span>{maxPoints.toLocaleString()} Points</span>
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                href={`/${countryCode.toLowerCase()}/products`}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Apply Points & Start Shopping →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
