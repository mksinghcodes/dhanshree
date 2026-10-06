'use client';

import React from 'react';
import Link from 'next/link';
import { CountryCode, COUNTRY_CONFIGS } from '@dhanshree/shared';
import { DhanshreeLogo } from './DhanshreeLogo';

export interface DhanshreeFooterProps {
  countryCode?: string;
}

export function DhanshreeFooter({ countryCode = 'NP' }: DhanshreeFooterProps) {
  const code = (countryCode.toUpperCase() as CountryCode) || CountryCode.NEPAL;
  const config = COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[CountryCode.NEPAL];
  const c = countryCode.toLowerCase();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currencyLabel =
    config.defaultCurrency === 'NPR'
      ? 'रु NPR (Nepalese Rupee)'
      : config.defaultCurrency === 'INR'
      ? '₹ INR (Indian Rupee)'
      : config.defaultCurrency === 'AED'
      ? 'د.إ AED (UAE Dirham)'
      : '$ USD (U.S. Dollar)';

  const countryFlag =
    code === CountryCode.NEPAL
      ? '🇳🇵 Nepal'
      : code === CountryCode.INDIA
      ? '🇮🇳 India'
      : code === CountryCode.UAE
      ? '🇦🇪 UAE'
      : '🌍 Global';

  return (
    <footer
      role="contentinfo"
      aria-label="Dhanshree Footer"
      className="mt-14 bg-[#0d1b2a] text-white text-xs select-none font-sans"
    >
      {/* ========================================================================= */}
      {/* 1. BACK TO TOP BUTTON (Smooth Navigation)                                */}
      {/* ========================================================================= */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#162a45] hover:bg-[#1f375b] text-white py-3.5 text-center text-[13px] font-semibold cursor-pointer transition-colors block border-none outline-none tracking-wide"
        aria-label="Scroll back to top of page"
      >
        Back to top ↑
      </button>

      {/* ========================================================================= */}
      {/* 2. FOUR MULTI-COLUMN DIRECTORY (Amazon-Style Navigation Hierarchy)       */}
      {/* ========================================================================= */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Column 1: Get to Know Us */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3.5 tracking-tight flex items-center gap-1.5">
            <span>🏛️</span> Get to Know Us
          </h4>
          <ul className="space-y-2 text-[#cccccc] text-xs">
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                About Dhanshree
              </Link>
            </li>
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                Careers &amp; Culture
              </Link>
            </li>
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                Press &amp; Announcements
              </Link>
            </li>
            <li>
              <Link href={`/${c}/products?cat=Electronics`} className="hover:text-white hover:underline transition-colors">
                Dhanshree Devices &amp; Tech
              </Link>
            </li>
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                Digital Vastu &amp; Numerology Design
              </Link>
            </li>
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                Green Logistics &amp; Sustainability
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Make Money with Us */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3.5 tracking-tight flex items-center gap-1.5">
            <span>📈</span> Make Money with Us
          </h4>
          <ul className="space-y-2 text-[#cccccc] text-xs">
            <li>
              <Link
                href={`/${c}/seller`}
                className="hover:underline text-[#10B981] font-bold flex items-center gap-1 transition-colors"
              >
                <span>🚀</span> Sell on Dhanshree (०% कमिसन)
              </Link>
            </li>
            <li>
              <Link href={`/${c}/seller`} className="hover:text-white hover:underline transition-colors">
                Dhanshree Seller Central Hub
              </Link>
            </li>
            <li>
              <Link href={`/${c}/seller`} className="hover:text-white hover:underline transition-colors">
                Cross-Border Export (NP • IN • AE)
              </Link>
            </li>
            <li>
              <Link href={`/${c}/seller`} className="hover:text-white hover:underline transition-colors">
                Fulfilment by Dhanshree (FBD)
              </Link>
            </li>
            <li>
              <Link href={`/${c}/seller`} className="hover:text-white hover:underline transition-colors">
                Become an Affiliate Partner
              </Link>
            </li>
            <li>
              <Link href={`/${c}/seller`} className="hover:text-white hover:underline transition-colors">
                Advertise Your Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Dhanshree Payment & Protection */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3.5 tracking-tight flex items-center gap-1.5">
            <span>🛡️</span> Payments &amp; Security
          </h4>
          <ul className="space-y-2 text-[#cccccc] text-xs">
            <li>
              <Link
                href={`/${c}/checkout`}
                className="hover:underline text-amber-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>🔒</span> 100% Escrow Buyer Protection
              </Link>
            </li>
            <li>
              <Link href={`/${c}/orders`} className="hover:text-white hover:underline transition-colors">
                eSewa &amp; Khalti Instant Checkout
              </Link>
            </li>
            <li>
              <Link href={`/${c}/orders`} className="hover:text-white hover:underline transition-colors">
                Razorpay, UPI &amp; UAE Cards
              </Link>
            </li>
            <li>
              <Link href={`/${c}/orders`} className="hover:text-white hover:underline transition-colors">
                Cash on Delivery (COD) Verified
              </Link>
            </li>
            <li>
              <Link href={`/${c}/membership`} className="hover:text-white hover:underline transition-colors">
                Dhanshree Rewards &amp; Points
              </Link>
            </li>
            <li>
              <Link href={`/${c}#coupons`} className="hover:text-white hover:underline transition-colors">
                Auspicious Vouchers (DHAN5, SHREE6)
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Customer Care & Legal Grounding */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3.5 tracking-tight flex items-center gap-1.5">
            <span>🤝</span> Let Us Help You
          </h4>
          <ul className="space-y-2 text-[#cccccc] text-xs">
            <li>
              <Link
                href={`/${c}/orders`}
                className="hover:underline font-bold text-amber-200 flex items-center gap-1 transition-colors"
              >
                <span>📦</span> Your Orders &amp; Tracking
              </Link>
            </li>
            <li>
              <Link href={`/${c}/orders`} className="hover:text-white hover:underline transition-colors">
                Your Account &amp; Lists
              </Link>
            </li>
            <li>
              <Link href={`/${c}/shipping`} className="hover:text-white hover:underline transition-colors">
                Shipping Rates &amp; Policies
              </Link>
            </li>
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                Returns, Replacements &amp; Refunds
              </Link>
            </li>
            <li>
              <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
                Tax Invoicing &amp; Compliance (VAT / GST)
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/9779800000000"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-bold flex items-center gap-1 transition-colors"
              >
                <span>💬</span> 24/7 WhatsApp Hotline
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BRAND PREFERENCES & LOCALIZATION STRIP (Royal Navy Deep Base)           */}
      {/* ========================================================================= */}
      <div className="border-t border-[#1e3452] bg-[#07111e] py-8 text-center text-xs text-[#cccccc]">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-wrap items-center justify-between gap-6">
          {/* Professional Vector Brand Logo */}
          <Link
            href={`/${c}`}
            title="Dhanshree - Shop. Discover. Delight"
            className="flex items-center group transition-transform hover:scale-102"
          >
            <DhanshreeLogo
              variant="full"
              theme="dark"
              size="md"
              countryCode={countryCode}
              subtext="ONLINE"
            />
          </Link>

          {/* Localization Pills (Language, Currency, Region) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2 border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-[#cccccc] hover:border-white cursor-pointer transition-colors bg-[#0f172a]/70">
              <span>🌐</span>
              <span className="font-medium">English / नेपाली</span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2 border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-[#cccccc] hover:border-white cursor-pointer transition-colors bg-[#0f172a]/70">
              <span className="text-amber-400 font-bold">💰</span>
              <span className="font-medium">{currencyLabel}</span>
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-2 border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-[#cccccc] hover:border-white cursor-pointer transition-colors bg-[#0f172a]/70">
              <span className="font-semibold">{countryFlag}</span>
            </div>
          </div>
        </div>

        {/* Global Multi-Country Reach */}
        <div className="max-w-[1240px] mx-auto px-4 mt-6 pt-5 border-t border-[#1e3452]/60 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Cross-Border Hubs:</span>
          <Link href="/np" className="hover:text-white hover:underline transition-colors">
            🇳🇵 Nepal (dhanshree.np)
          </Link>
          <span>•</span>
          <Link href="/in" className="hover:text-white hover:underline transition-colors">
            🇮🇳 India (dhanshree.in)
          </Link>
          <span>•</span>
          <Link href="/ae" className="hover:text-white hover:underline transition-colors">
            🇦🇪 UAE (dhanshree.ae)
          </Link>
          <span>•</span>
          <span className="text-slate-500">🌍 Worldwide Shipping</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DIGITAL VASTU SOUTH-WEST GROUNDING & ESCROW TRUST SEALS                */}
      {/* ========================================================================= */}
      <div className="bg-[#050c15] py-7 text-[11px] text-slate-400 border-t border-[#142336]">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col items-center justify-center space-y-4 text-center">
          {/* Verified Payment & Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-emerald-400 font-bold">
              ✓ eSewa Verified
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-purple-400 font-bold">
              ✓ Khalti Verified
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-blue-400 font-bold">
              ✓ ConnectIPS
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-sky-400 font-bold">
              ✓ Razorpay 256-bit HMAC
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-amber-300 font-bold">
              ✓ Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md font-mono text-teal-400 font-bold">
              ✓ IRD / GSTN Compliant
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
            <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
              Conditions of Use &amp; Sale
            </Link>
            <span>•</span>
            <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
              Privacy Notice
            </Link>
            <span>•</span>
            <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
              Consumer Health Data Privacy Disclosure
            </Link>
            <span>•</span>
            <Link href={`/${c}/legal`} className="hover:text-white hover:underline transition-colors">
              Your Ads Privacy Choices
            </Link>
          </div>

          {/* Official Copyright & Auspicious Tagline */}
          <div className="pt-2 text-slate-500 text-[11px]">
            <p>
              © 2026 Dhanshree Marketplace Inc. or its affiliates. •{' '}
              <span className="text-[#10B981] font-semibold">“Shop. Discover. Delight”</span> • All rights reserved.
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              Digital Vastu Nairutya (South-West) Grounded Security Architecture • Commercial Numerology Resonance #5 &amp; #6
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default DhanshreeFooter;
