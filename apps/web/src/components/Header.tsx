'use client';

import React from 'react';
import Link from 'next/link';
import { AuthModal } from './AuthModal';
import { TaxCalculatorModal } from './TaxCalculatorModal';
import { AddressFormModal } from './AddressFormModal';
import { CartDrawer } from './CartDrawer';
import { AiShoppingAssistant } from './AiShoppingAssistant';
import { CountryCode } from '@dhanshree/shared';

interface HeaderProps {
  currentCountry?: string;
}

export function Header({ currentCountry = 'NP' }: HeaderProps) {
  const c = currentCountry.toLowerCase();
  const countryCodeEnum = (currentCountry.toUpperCase() as CountryCode) || CountryCode.NEPAL;

  const countries = [
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', lang: 'NE/EN' },
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', lang: 'HI/EN' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪', currency: 'AED', lang: 'AR/EN' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  Ω
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Dhanshree
                  </span>
                  <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                    Phase 7: Advanced
                  </span>
                </div>
              </Link>
            </div>

            {/* Country Storefront Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden md:inline-block">
                Storefront:
              </span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                {countries.map((item) => {
                  const isActive = currentCountry.toUpperCase() === item.code;
                  return (
                    <Link
                      key={item.code}
                      href={`/${item.code.toLowerCase()}`}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.code}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({item.currency})</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Interactive Toolset */}
            <div className="flex items-center gap-2">
              <TaxCalculatorModal />
              <AddressFormModal />
              <CartDrawer countryCode={countryCodeEnum} />
              <AuthModal />
            </div>
          </div>
        </div>

        {/* Secondary Sub-Navbar for Advanced Features */}
        <div className="bg-slate-900 text-white border-t border-slate-800 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
            <div className="flex items-center gap-4 sm:gap-6 font-semibold whitespace-nowrap">
              <Link href={`/${c}/products`} className="text-slate-300 hover:text-white transition-colors">
                All Products
              </Link>
              <Link href={`/${c}/auctions`} className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
                <span>🔨</span> Auctions & Bids
              </Link>
              <Link href={`/${c}/rfq`} className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
                <span>📦</span> Wholesale RFQ
              </Link>
              <Link href={`/${c}/membership`} className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold transition-colors">
                <span>👑</span> Prime VIP Club
              </Link>
            </div>

            <div className="flex items-center gap-3 font-semibold whitespace-nowrap text-[11px]">
              <Link href={`/${c}/seller`} className="text-blue-300 hover:text-blue-200 transition-colors">
                Merchant Hub →
              </Link>
              <span className="text-slate-600">•</span>
              <Link href={`/${c}/admin`} className="text-rose-300 hover:text-rose-200 transition-colors">
                Super Admin →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Global AI Assistant Floating Concierge */}
      <AiShoppingAssistant countryCode={countryCodeEnum} />
    </>
  );
}
