'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CountryCode } from '@dhanshree/shared';

interface SellerNavProps {
  countryCode: CountryCode;
}

export function SellerNav({ countryCode }: SellerNavProps) {
  const pathname = usePathname();
  const c = countryCode.toLowerCase();

  const links = [
    { label: 'Overview', href: `/${c}/seller`, icon: '📊' },
    { label: 'Products & Inventory', href: `/${c}/seller/products`, icon: '📦' },
    { label: 'Orders & Fulfillment', href: `/${c}/seller/orders`, icon: '🚚' },
    { label: 'Payouts & Taxes', href: `/${c}/seller/payouts`, icon: '💰' },
  ];

  const countries = [
    { code: 'NP', name: 'Nepal Store', flag: '🇳🇵' },
    { code: 'IN', name: 'India Store', flag: '🇮🇳' },
    { code: 'AE', name: 'Dubai Store', flag: '🇦🇪' },
  ];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <Link href={`/${c}/seller`} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                Ω
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-white">
                    SellerCentral
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                    Merchant Hub
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Sony Flagship Store • Verified Gold Seller</div>
              </div>
            </Link>
          </div>

          {/* Storefront Country Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Active Market:</span>
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              {countries.map((item) => {
                const isActive = countryCode === item.code;
                return (
                  <Link
                    key={item.code}
                    href={`/${item.code.toLowerCase()}/seller`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.code}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User & Storefront Link */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${c}`}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <span>View Public Storefront</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs text-blue-300">
              SN
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto py-1 scrollbar-none">
          {links.map((link) => {
            const isCurrent = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'text-blue-400 bg-slate-800/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
