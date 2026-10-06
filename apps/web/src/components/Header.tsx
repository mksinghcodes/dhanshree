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
import { MobileBottomNav } from './MobileBottomNav';
import { DhanshreeLogo } from './DhanshreeLogo';

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const countries = [
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', lang: 'NE/EN', city: 'Kathmandu, NP' },
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', lang: 'HI/EN', city: 'New Delhi, IN' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪', currency: 'AED', lang: 'AR/EN', city: 'Dubai, UAE' },
  ];

  const currentCountryObj = countries.find((item) => item.code === currentCountry.toUpperCase()) || countries[0];

  const trendingKeywords = [
    'Laptops & MacBooks',
    'Smartphones (5G)',
    'Traditional Kurtis & Sarees',
    'Air Fryer & Blenders',
    'Wireless Earbuds (TWS)',
    'Festive Gold & Silver Coins',
    'Smart Watches',
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchQuery).trim();
    const cat = selectedCategory !== 'All' ? selectedCategory : '';
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (cat) params.set('cat', cat);
    setIsSearchFocused(false);
    router.push(`/${c}/products?${params.toString()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full select-none font-sans">
        {/* ========================================================================= */}
        {/* 1. TOP UTILITY & ANNOUNCEMENT BAR (Amazon / Dhanshree Top Strip)           */}
        {/* ========================================================================= */}
        <div className="bg-[#07111e] text-slate-300 text-[11px] px-2 sm:px-4 py-1 flex items-center justify-between border-b border-[#1e3452]">
          {/* Left: Hotline & WhatsApp Contact */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+9779800000000"
              className="hover:text-[#febd69] flex items-center gap-1 transition-colors"
            >
              <span>📞 +977-9800000000</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a
              href="https://wa.me/9779800000000"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span className="text-emerald-400 font-bold">💬 WhatsApp Support</span>
            </a>
          </div>

          {/* Center: Dynamic Announcement Banner */}
          <div className="hidden md:flex items-center gap-2 text-amber-200/95 font-medium tracking-wide">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>✨ Free Delivery on orders above Rs. 5,000 | 🚚 Cash on Delivery Available</span>
          </div>

          {/* Right: Track Order & Region/Currency */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${c}/orders`}
              className="hover:text-white transition-colors"
            >
              Track Order
            </Link>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-white">
              {currentCountryObj.lang} • {currentCountryObj.currency}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PRIMARY ACTION ROW (Main Header - Royal Navy Blue #0d1b2a)             */}
        {/* ========================================================================= */}
        <div className="bg-[#0d1b2a] text-white px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 sm:gap-4 h-[60px] shadow-sm">
          {/* Professional Vector Brand Logo (Monogram D + Shopping Bag + Growth Arrow) */}
          <Link
            href={`/${c}`}
            title="Dhanshree - Shop. Discover. Delight"
            className="flex items-center px-1.5 py-1 rounded-sm border border-transparent hover:border-white transition-all group shrink-0"
          >
            <DhanshreeLogo
              variant="full"
              theme="dark"
              size="md"
              countryCode={currentCountry}
              subtext="ONLINE"
            />
          </Link>

          {/* Location Selector (Deliver to [City / Region]) */}
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

          {/* Predictive Search Bar with Auto-suggest Preview */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-3xl">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center h-[40px] rounded-md overflow-visible bg-white focus-within:ring-2 focus-within:ring-[#febd69]"
            >
              {/* Category Dropdown */}
              <AmazonCategoryDropdown
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />

              {/* Input Field */}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Dhanshree (e.g. computer, laptop, audio, fashion)..."
                className="flex-1 h-full px-3 text-sm text-[#0f1111] placeholder:text-slate-500 outline-none"
              />

              {/* Amber Search Button */}
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

            {/* Trending & Auto-suggest Popover on Focus */}
            {isSearchFocused && (
              <div className="absolute top-[44px] left-0 right-0 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 z-50 p-3 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    🔥 Trending on Dhanshree
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">Updated live</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trendingKeywords.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        handleSearchSubmit(undefined, item);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 rounded-full text-slate-700 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-slate-400">🔍</span>
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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

          {/* Wishlist Button with Badge Counter */}
          <Link
            href={`/${c}/orders`}
            title="Your Wishlist"
            className="hidden sm:flex flex-col items-center justify-center px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all text-left relative shrink-0 group"
          >
            <div className="relative flex items-center">
              <span className="text-base text-rose-400">❤️</span>
              <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-[#febd69] text-[#131921] font-bold text-[10px] flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <span className="text-[11px] text-slate-300 group-hover:text-white leading-tight">Wishlist</span>
          </Link>

          {/* Account & Lists Dropdown */}
          <AmazonAccountDropdown countryCode={currentCountry} />

          {/* Returns & Orders */}
          <Link
            href={`/${c}/orders`}
            className="hidden lg:flex flex-col text-left px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all shrink-0"
          >
            <span className="text-[11px] text-[#cccccc] leading-tight">Returns</span>
            <span className="text-[13px] text-white font-bold leading-tight">&amp; Orders</span>
          </Link>

          {/* Shopping Cart Drawer Trigger */}
          <div className="shrink-0 flex items-center">
            <CartDrawer countryCode={countryCodeEnum} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SUB-HEADER NAVIGATION ROW (Quick Links & Categories - #162a45)          */}
        {/* ========================================================================= */}
        <div className="bg-[#162a45] text-white px-2 sm:px-4 text-xs h-[39px] flex items-center justify-between overflow-x-auto scrollbar-none font-medium border-t border-[#1e3452]">
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            {/* Hamburger "☰ All" opens Amazon Left Drawer */}
            <button
              onClick={() => setIsLeftDrawerOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-transparent hover:border-white font-bold text-white transition-colors cursor-pointer"
            >
              <span className="text-base">☰</span>
              <span>All Categories</span>
            </button>

            {/* Today's Deals */}
            <Link
              href={`/${c}#todays-deals`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-[#febd69] font-bold hover:text-amber-200 transition-colors"
            >
              Today&apos;s Deals
            </Link>

            {/* Best Sellers */}
            <Link
              href={`/${c}/products?cat=Bestsellers`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors"
            >
              Best Sellers
            </Link>

            {/* New Releases */}
            <Link
              href={`/${c}/products?cat=NewReleases`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden sm:inline"
            >
              New Releases
            </Link>

            {/* Trending Gadgets */}
            <Link
              href={`/${c}/products?cat=Electronics`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden md:inline"
            >
              Trending Gadgets
            </Link>

            {/* Customer Service */}
            <Link
              href={`/${c}/legal`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden sm:inline"
            >
              Customer Service
            </Link>

            {/* Sell on Dhanshree */}
            <Link
              href={`/${c}/seller`}
              className="px-2.5 py-1 rounded-sm border border-emerald-400/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold transition-all"
            >
              Sell (०% कमिसन)
            </Link>
          </div>

          {/* Right Sub-nav Highlights & Trust Badge */}
          <div className="flex items-center gap-3 whitespace-nowrap text-[11px] font-bold">
            <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
              <span>🛡️</span> 100% Genuine Products &amp; Secure Delivery
            </span>
            <span className="text-[#febd69] hidden lg:inline font-medium tracking-wide">
              &ldquo;Shop. Discover. Delight&rdquo;
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

      {/* ========================================================================= */}
      {/* 4. AMAZON-STYLE FLYOUT / MEGA MENU DRAWER                                 */}
      {/* ========================================================================= */}
      <AmazonLeftDrawer
        isOpen={isLeftDrawerOpen}
        onClose={() => setIsLeftDrawerOpen(false)}
        countryCode={currentCountry}
      />

      {/* ========================================================================= */}
      {/* 5. MOBILE-FIRST BOTTOM NAVIGATION BAR (Viewport < 768px)                  */}
      {/* ========================================================================= */}
      <MobileBottomNav
        countryCode={currentCountry}
        onOpenCategories={() => setIsLeftDrawerOpen(true)}
        cartCount={2}
      />

      {/* Floating AI Shopping Assistant */}
      <AiShoppingAssistant countryCode={countryCodeEnum} />
    </>
  );
}
