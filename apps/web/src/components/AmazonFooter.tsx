'use client';

import React from 'react';
import Link from 'next/link';
import { CountryCode, COUNTRY_CONFIGS } from '@dhanshree/shared';

interface AmazonFooterProps {
  countryCode?: string;
}

export function AmazonFooter({ countryCode = 'NP' }: AmazonFooterProps) {
  const code = (countryCode.toUpperCase() as CountryCode) || CountryCode.NEPAL;
  const config = COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[CountryCode.NEPAL];
  const c = countryCode.toLowerCase();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currencyLabel =
    config.defaultCurrency === 'NPR'
      ? 'रु NPR - Nepalese Rupee'
      : config.defaultCurrency === 'INR'
      ? '₹ INR - Indian Rupee'
      : config.defaultCurrency === 'AED'
      ? 'د.إ AED - UAE Dirham'
      : '$ USD - U.S. Dollar';

  const countryFlag =
    code === CountryCode.NEPAL
      ? '🇳🇵 Nepal'
      : code === CountryCode.INDIA
      ? '🇮🇳 India'
      : code === CountryCode.UAE
      ? '🇦🇪 United Arab Emirates'
      : '🇺🇸 United States';

  return (
    <footer className="mt-12 bg-[#232f3e] text-white text-xs select-none font-sans">
      {/* 1. Back to Top Bar (Matching media_1791212768555.png) */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-center text-[13px] font-medium cursor-pointer transition-colors block border-none outline-none"
      >
        Back to top
      </button>

      {/* 2. Four Multi-Column Directory (Exact match of media_1791212768555.png) */}
      <div className="max-w-[1020px] mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1: Get to Know Us */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-[#dddddd] text-xs">
            <li><Link href={`/${c}/legal`} className="hover:underline">Careers</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">Blog</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">About Amazon</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">Investor Relations</Link></li>
            <li><Link href={`/${c}/products?cat=Electronics`} className="hover:underline">Amazon Devices</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">Amazon Science</Link></li>
          </ul>
        </div>

        {/* Column 2: Make Money with Us */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
          <ul className="space-y-2 text-[#dddddd] text-xs">
            <li>
              <Link href={`/${c}/seller`} className="hover:underline text-amber-300 font-semibold">
                Sell products on Amazon (०% कमिसन)
              </Link>
            </li>
            <li><Link href={`/${c}/seller`} className="hover:underline">Sell on Amazon Business</Link></li>
            <li><Link href={`/${c}/seller`} className="hover:underline">Sell apps on Amazon</Link></li>
            <li><Link href={`/${c}/seller`} className="hover:underline">Become an Affiliate</Link></li>
            <li><Link href={`/${c}/seller`} className="hover:underline">Advertise Your Products</Link></li>
            <li><Link href={`/${c}/seller`} className="hover:underline">Self-Publish with Us</Link></li>
            <li><Link href={`/${c}/seller`} className="hover:underline">Host an Amazon Hub</Link></li>
            <li>
              <Link href={`/${c}/seller`} className="hover:underline flex items-center gap-1 font-semibold text-slate-300">
                <span>›</span> See More Make Money with Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Amazon Payment Products */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Amazon Payment Products</h4>
          <ul className="space-y-2 text-[#dddddd] text-xs">
            <li><Link href={`/${c}/membership`} className="hover:underline">Amazon Business Card</Link></li>
            <li><Link href={`/${c}/membership`} className="hover:underline">Shop with Points</Link></li>
            <li><Link href={`/${c}/orders`} className="hover:underline">Reload Your Balance</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">Amazon Currency Converter</Link></li>
          </ul>
        </div>

        {/* Column 4: Let Us Help You */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-[#dddddd] text-xs">
            <li><Link href={`/${c}/orders`} className="hover:underline">Your Account</Link></li>
            <li><Link href={`/${c}/orders`} className="hover:underline font-bold text-amber-200">Your Orders</Link></li>
            <li><Link href={`/${c}/shipping`} className="hover:underline">Shipping Rates &amp; Policies</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">Returns &amp; Replacements</Link></li>
            <li><Link href={`/${c}/orders`} className="hover:underline">Manage Your Content and Devices</Link></li>
            <li><Link href={`/${c}/legal`} className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Brand & Preferences Line Bar (Exact match of media_1791212768555.png) */}
      <div className="border-t border-[#3a4553] bg-[#131921] py-8 text-center text-xs text-[#cccccc]">
        <div className="max-w-[1020px] mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          {/* Amazon logo with curved smile */}
          <Link href={`/${c}`} className="flex flex-col items-center">
            <span className="text-2xl font-black tracking-tighter text-white lowercase">
              amazon
            </span>
            <div className="relative -mt-1 w-16 h-1 flex items-center">
              <div className="w-full h-[2.5px] bg-[#febd69] rounded-full transform -rotate-1" />
              <span className="text-[8px] text-[#febd69] -ml-1 -mt-1 font-bold">▶</span>
            </div>
          </Link>

          {/* 3 Pill Selector Buttons (Matching media_1791212768555.png) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Pill */}
            <div className="flex items-center gap-2 border border-[#848688] rounded px-3 py-1.5 text-xs text-[#cccccc] hover:border-white cursor-pointer transition-colors">
              <span>🌐</span>
              <span>English</span>
              <span className="text-[9px] text-[#848688]">⬍</span>
            </div>

            {/* Currency Pill */}
            <div className="flex items-center gap-2 border border-[#848688] rounded px-3 py-1.5 text-xs text-[#cccccc] hover:border-white cursor-pointer transition-colors">
              <span>{currencyLabel}</span>
            </div>

            {/* Country Pill */}
            <div className="flex items-center gap-2 border border-[#848688] rounded px-3 py-1.5 text-xs text-[#cccccc] hover:border-white cursor-pointer transition-colors">
              <span>{countryFlag}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-4">
          &copy; 1996-2026, Amazon.com, Inc. or its affiliates &bull; Dhanshree Global Multi-Vendor Engine
        </p>
      </div>
    </footer>
  );
}
