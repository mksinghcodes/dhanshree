'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartDrawer } from './CartDrawer';
import { AiShoppingAssistant } from './AiShoppingAssistant';
import { CountryCode } from '@dhanshree/shared';
import { useAuth } from '@/context/AuthContext';
import { AmazonLeftDrawer } from './AmazonLeftDrawer';
import { AmazonCategoryDropdown } from './AmazonCategoryDropdown';
import { AmazonAccountDropdown } from './AmazonAccountDropdown';

interface HeaderProps {
  currentCountry?: string;
}

export function Header({ currentCountry = 'NP' }: HeaderProps) {
  const router = useRouter();
  const c = currentCountry.toLowerCase();
  const countryCodeEnum = (currentCountry.toUpperCase() as CountryCode) || CountryCode.NEPAL;

  const { currentUser } = useAuth();
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const countries = [
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', lang: 'NE/EN', city: 'Nepal' },
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', lang: 'HI/EN', city: 'India' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪', currency: 'AED', lang: 'AR/EN', city: 'UAE' },
  ];

  const currentCountryObj = countries.find((item) => item.code === currentCountry.toUpperCase()) || countries[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const cat = selectedCategory !== 'All' ? selectedCategory : '';
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (cat) params.set('cat', cat);
    router.push(`/${c}/products?${params.toString()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full select-none font-sans">
        {/* 1. Amazon Top Main Navigation Bar (#131921) */}
        <div className="bg-[#131921] text-white px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 sm:gap-4 h-[60px]">
          {/* Amazon-Style Logo */}
          <Link
            href={`/${c}`}
            title="Dhanshree - Shop. Discover. Delight"
            className="flex items-center gap-1 px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all group shrink-0"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-white lowercase">
                  dhanshree
                </span>
                <span className="text-[11px] text-[#febd69] font-bold ml-0.5">
                  .{currentCountry.toLowerCase()}
                </span>
              </div>
              {/* Smile curve */}
              <div className="relative -mt-1 w-full h-1.5 flex items-center">
                <div className="w-full h-[2.5px] bg-[#febd69] rounded-full transform -rotate-1 shadow-xs" />
                <span className="text-[8px] text-[#febd69] -ml-1 -mt-1 font-bold">▶</span>
              </div>
            </div>
          </Link>

          {/* Deliver To Widget (Matches Image 3 & 5: Deliver to Nepal) */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-sm border border-transparent hover:border-white cursor-pointer shrink-0 transition-colors">
            <span className="text-base text-white">📍</span>
            <div className="text-left text-xs leading-none">
              <span className="text-[11px] text-[#cccccc] block leading-tight">
                Deliver to
              </span>
              <span className="text-[13px] text-white font-bold block leading-tight">
                {currentCountryObj.city}
              </span>
            </div>
          </div>

          {/* Search Bar with Authentic Category Dropdown (Matches Image 3) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-3xl flex items-center h-[40px] rounded-md overflow-visible bg-white focus-within:ring-2 focus-within:ring-[#febd69]"
          >
            {/* Category Dropdown (Image 3) */}
            <AmazonCategoryDropdown
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Search Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Dhanshree (e.g. computer, laptop, audio, fashion)..."
              className="flex-1 h-full px-3 text-sm text-[#0f1111] placeholder:text-slate-500 outline-none"
            />

            {/* Amber Magnifying Glass Button */}
            <button
              type="submit"
              aria-label="Search"
              className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-current font-bold"
                viewBox="0 0 24 24"
              >
                <path d="M10 2a8 8 0 015.293 14.004l4.85 4.853a1 1 0 01-1.414 1.414l-4.853-4.85A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </button>
          </form>

          {/* Country / Language Selector */}
          <div className="relative shrink-0" ref={countryDropdownRef}>
            <button
              onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-xs font-bold transition-all"
            >
              <span className="text-base">{currentCountryObj.flag}</span>
              <span className="hidden sm:inline uppercase text-[12px]">{currentCountryObj.code}</span>
              <span className="text-[9px] text-[#cccccc]">▼</span>
            </button>

            {isCountryMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 z-50 p-2 text-xs">
                <span className="font-bold text-[11px] text-slate-400 block px-2 pb-1 border-b border-slate-100 uppercase">
                  Select Storefront Region
                </span>
                <div className="space-y-1 mt-1">
                  {countries.map((item) => (
                    <Link
                      key={item.code}
                      href={`/${item.code.toLowerCase()}`}
                      onClick={() => setIsCountryMenuOpen(false)}
                      className={`flex items-center justify-between p-2 rounded-md hover:bg-slate-100 transition-colors ${
                        item.code === currentCountry.toUpperCase() ? 'bg-amber-50 font-bold text-amber-900' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.name}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">({item.currency})</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account & Lists Dropdown (Exact match of Image 4) */}
          <AmazonAccountDropdown countryCode={currentCountry} />

          {/* Returns & Orders */}
          <Link
            href={`/${c}/orders`}
            className="hidden lg:flex flex-col text-left px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all shrink-0"
          >
            <span className="text-[11px] text-[#cccccc] leading-tight">Returns</span>
            <span className="text-[13px] text-white font-bold leading-tight">&amp; Orders</span>
          </Link>

          {/* Shopping Cart */}
          <div className="shrink-0 flex items-center">
            <CartDrawer countryCode={countryCodeEnum} />
          </div>
        </div>

        {/* 2. Amazon Sub-Navbar (#232f3e) */}
        <div className="bg-[#232f3e] text-white px-2 sm:px-4 text-xs h-[39px] flex items-center justify-between overflow-x-auto scrollbar-none font-medium">
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            {/* Hamburger "☰ All" opens Amazon Left Drawer (Images 1 & 2) */}
            <button
              onClick={() => setIsLeftDrawerOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-transparent hover:border-white font-bold text-white transition-colors cursor-pointer"
            >
              <span className="text-base">☰</span>
              <span>All</span>
            </button>

            {/* Alexa for shopping badge */}
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-900/60 border border-sky-400/40 text-sky-200 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              alexa for shopping
            </span>

            <Link
              href={`/${c}/membership`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors"
            >
              Prime Video
            </Link>

            <Link
              href={`/${c}/orders`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden sm:inline"
            >
              {currentUser.shortName}&apos;s Dhanshree
            </Link>

            <Link
              href={`/${c}#coupons`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors"
            >
              Coupons
            </Link>

            <Link
              href={`/${c}/legal`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden sm:inline"
            >
              Customer Service
            </Link>

            <Link
              href={`/${c}#todays-deals`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-amber-300 font-bold hover:text-amber-200 transition-colors"
            >
              Today&apos;s Deals
            </Link>

            <Link
              href={`/${c}/rfq`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden md:inline"
            >
              Registry
            </Link>

            <Link
              href={`/${c}/orders`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden md:inline"
            >
              Buy Again
            </Link>

            <Link
              href={`/${c}/products`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden md:inline"
            >
              Gift Cards
            </Link>

            <Link
              href={`/${c}/seller`}
              className="px-2.5 py-1 rounded-sm border border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950 font-bold transition-all"
            >
              Sell (०% कमिसन)
            </Link>
          </div>

          {/* Right Sub-nav Highlights */}
          <div className="flex items-center gap-3 whitespace-nowrap text-[11px] font-bold">
            <span className="text-[#febd69] hidden xl:inline font-medium tracking-wide">
              &ldquo;Shop. Discover. Delight&rdquo;
            </span>
            <span className="text-amber-300 hidden lg:inline">
              🏮 दशैँ, तिहार तथा छठ २०८३
            </span>
            <Link
              href={`/${c}/admin`}
              className="px-2 py-1 rounded-sm border border-transparent hover:border-white text-rose-300 hover:text-rose-200"
            >
              Super Admin →
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Amazon Left Slide-in Drawer (Images 1 & 2) */}
      <AmazonLeftDrawer
        isOpen={isLeftDrawerOpen}
        onClose={() => setIsLeftDrawerOpen(false)}
        countryCode={currentCountry}
      />

      {/* Floating AI Shopping Assistant */}
      <AiShoppingAssistant countryCode={countryCodeEnum} />
    </>
  );
}
