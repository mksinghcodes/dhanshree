'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@dhanshree/shared';

interface SellerGuardProps {
  countryCode: string;
  children: React.ReactNode;
}

export function SellerGuard({ countryCode, children }: SellerGuardProps) {
  const { currentUser, switchUser } = useAuth();
  const c = countryCode.toLowerCase();

  const isSeller = currentUser.role === UserRole.SELLER || currentUser.role === UserRole.ADMIN;

  if (!isSeller) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans select-none">
        <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🏪
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              Merchant Verification Required
            </span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight mb-2">
            Verified Seller Account Needed
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            The Dhanshree Merchant Hub is exclusively accessible to verified sellers and store operators. Enjoy ०% festival commission and instant settlements.
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => switchUser('usr-seller-01')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🏪</span>
              <span>Switch to Rajesh Shrestha (Merchant Demo)</span>
            </button>
            <Link
              href={`/${c}/seller`}
              className="block w-full text-center py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Register as New Vendor (KYC in 24h) →
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <Link
              href={`/${c}`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Storefront
            </Link>
            <Link
              href={`/${c}/admin`}
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              Super Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
