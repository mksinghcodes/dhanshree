'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AuthModal } from './AuthModal';
import { TaxCalculatorModal } from './TaxCalculatorModal';
import { AddressFormModal } from './AddressFormModal';
import { CartDrawer } from './CartDrawer';
import { AiShoppingAssistant } from './AiShoppingAssistant';
import { CountryCode } from '@dhanshree/shared';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  currentCountry?: string;
}

export function Header({ currentCountry = 'NP' }: HeaderProps) {
  const c = currentCountry.toLowerCase();
  const countryCodeEnum = (currentCountry.toUpperCase() as CountryCode) || CountryCode.NEPAL;

  const { currentUser, availableUsers, switchUser } = useAuth();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = [
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', lang: 'NE/EN' },
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', lang: 'HI/EN' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪', currency: 'AED', lang: 'AR/EN' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPersonaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyCoupon = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2500);
    }
  };

  return (
    <>
      {/* 1. Festive Grand Announcement Marquee (दशैँ, तिहार तथा छठ २०८३) */}
      <div className="bg-gradient-to-r from-red-700 via-rose-600 to-amber-600 text-white text-xs py-2 px-4 shadow-sm border-b border-amber-400/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="text-base animate-bounce">🪔</span>
            <span className="font-semibold tracking-wide">
              <strong>दशैँ, तिहार तथा छठ महाबचत महोत्सव २०८३:</strong> ग्राहकलाई २०% सम्म छुट र व्यपारीहरूलाई{' '}
              <span className="underline decoration-amber-300 font-black text-amber-200">०% प्लेटफर्म कमिसन</span> + २४-घण्टे द्रुत भुक्तानी!
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="text-amber-100 hidden sm:inline">कूपन कोडहरू:</span>
            <button
              onClick={() => handleCopyCoupon('DASHAIN2026')}
              className="bg-black/25 hover:bg-black/40 border border-white/20 px-2 py-0.5 rounded-md text-amber-200 transition-colors"
              title="Copy Dashain 20% discount coupon"
            >
              {copiedCoupon === 'DASHAIN2026' ? '✓ कपि भयो!' : 'DASHAIN2026'}
            </button>
            <button
              onClick={() => handleCopyCoupon('TIHAR500')}
              className="bg-black/25 hover:bg-black/40 border border-white/20 px-2 py-0.5 rounded-md text-amber-200 transition-colors"
              title="Copy Tihar flat 500 off coupon"
            >
              {copiedCoupon === 'TIHAR500' ? '✓ कपि भयो!' : 'TIHAR500'}
            </button>
            <button
              onClick={() => handleCopyCoupon('CHHATH20')}
              className="bg-black/25 hover:bg-black/40 border border-white/20 px-2 py-0.5 rounded-md text-amber-200 transition-colors"
              title="Copy Chhath 20% cashback coupon"
            >
              {copiedCoupon === 'CHHATH20' ? '✓ कपि भयो!' : 'CHHATH20'}
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-600 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                  धन
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      Dhanshree
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-extrabold border border-red-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                      चाडपर्व अफर २०८३
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Nepal • India • UAE Global Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* Country Storefront Switcher */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                बजार (Storefront):
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

            {/* Interactive Toolset + Persona Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              <TaxCalculatorModal />
              <AddressFormModal />
              <CartDrawer countryCode={countryCodeEnum} />

              {/* Persona Switcher Quick Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl text-xs transition-all shadow-xs"
                  title="स्विच युजर / Switch User Persona for Mock Testing"
                >
                  <span className="text-base">{currentUser.avatar}</span>
                  <div className="text-left hidden sm:block">
                    <span className="font-bold text-slate-900 block leading-tight text-[11px]">
                      {currentUser.nameNepali || currentUser.name}
                    </span>
                    <span className="text-[9px] font-semibold text-blue-700 block uppercase">
                      {currentUser.roleLabelNepali}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">▼</span>
                </button>

                {isPersonaMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Active Test Account
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {currentUser.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{currentUser.avatar}</span>
                        <div>
                          <p className="font-bold text-xs text-slate-900">
                            {currentUser.name} ({currentUser.nameNepali})
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{currentUser.email}</p>
                          <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                            {currentUser.balanceFormatted}
                          </p>
                        </div>
                      </div>

                      {/* Quick Jump for Current Role */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex gap-2">
                        {currentUser.role === 'SELLER' && (
                          <Link
                            href={`/${c}/seller`}
                            onClick={() => setIsPersonaMenuOpen(false)}
                            className="w-full text-center py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 shadow-xs"
                          >
                            व्यपारी प्यानल खोल्नुहोस् (Seller Hub) →
                          </Link>
                        )}
                        {currentUser.role === 'ADMIN' && (
                          <Link
                            href={`/${c}/admin`}
                            onClick={() => setIsPersonaMenuOpen(false)}
                            className="w-full text-center py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500 shadow-xs"
                          >
                            सुपर एडमिन प्यानल खोल्नुहोस् (Admin) →
                          </Link>
                        )}
                        {currentUser.role === 'BUYER' && (
                          <Link
                            href={`/${c}`}
                            onClick={() => setIsPersonaMenuOpen(false)}
                            className="w-full text-center py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 shadow-xs"
                          >
                            चाडपर्व बजार हेर्नुहोस् (Shop Deals) →
                          </Link>
                        )}
                        {currentUser.role === 'LOGISTICS' && (
                          <div className="w-full text-center py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold">
                            १२ अर्डर डिस्प्याच सक्रिय (Express Fleet)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                      परीक्षणको लागि युजर स्विच गर्नुहोस् (Switch Persona):
                    </div>

                    <div className="space-y-1">
                      {availableUsers.map((user) => {
                        const isSelected = user.id === currentUser.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              switchUser(user.id);
                              setIsPersonaMenuOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{user.avatar}</span>
                              <div>
                                <div className="leading-tight">
                                  <span>{user.nameNepali}</span>
                                  <span className="text-[10px] text-slate-400 ml-1">({user.roleLabel})</span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono block">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                            {isSelected && <span className="text-blue-600 font-bold">✓ Active</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Auth & OTP Modal Trigger */}
              <AuthModal />
            </div>
          </div>
        </div>

        {/* Secondary Sub-Navbar for Advanced Features & Festive Hub */}
        <div className="bg-slate-900 text-white border-t border-slate-800 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
            <div className="flex items-center gap-4 sm:gap-6 font-semibold whitespace-nowrap">
              <Link href={`/${c}`} className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold transition-colors">
                <span>🏮</span> दशैँ-तिहार-छठ महाबचत
              </Link>
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
              <Link
                href={`/${c}/seller`}
                className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 hover:text-blue-200 border border-blue-400/30 transition-colors flex items-center gap-1"
              >
                <span>🏪</span> व्यपारी प्यानल (०% कमिसन) →
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
