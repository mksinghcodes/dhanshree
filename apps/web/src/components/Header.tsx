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
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const countries = [
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', lang: 'NE/EN', city: 'Kathmandu 44600' },
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', lang: 'HI/EN', city: 'New Delhi 110001' },
    { code: 'AE', name: 'UAE (Dubai)', flag: '🇦🇪', currency: 'AED', lang: 'AR/EN', city: 'Dubai Downtown' },
  ];

  const currentCountryObj = countries.find((item) => item.code === currentCountry.toUpperCase()) || countries[0];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${c}/products?q=${encodeURIComponent(searchQuery)}&cat=${encodeURIComponent(searchCategory)}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full select-none font-sans">
        {/* Amazon-style Top Main Navigation Bar (#131921) */}
        <div className="bg-[#131921] text-white px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 sm:gap-4 h-[60px]">
          {/* 1. Dhanshree Amazon-Style Logo */}
          <Link
            href={`/${c}`}
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
              {/* Curved smile arrow underneath */}
              <div className="relative -mt-1 w-full h-1.5 flex items-center">
                <div className="w-full h-[2.5px] bg-[#febd69] rounded-full transform -rotate-1 shadow-xs" />
                <span className="text-[8px] text-[#febd69] -ml-1 -mt-1 font-bold">▶</span>
              </div>
            </div>
          </Link>

          {/* 2. Amazon "Deliver To" Address Widget */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-sm border border-transparent hover:border-white cursor-pointer shrink-0 transition-colors">
            <span className="text-base text-white">📍</span>
            <div className="text-left text-xs leading-none">
              <span className="text-[11px] text-[#cccccc] block leading-tight">
                Deliver to {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[13px] text-white font-bold block leading-tight">
                {currentCountryObj.city}
              </span>
            </div>
          </div>

          {/* 3. Amazon Signature Search Bar (Rounded with #febd69 search button) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-3xl flex items-center h-[40px] rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#febd69]"
          >
            {/* Category Select on Left */}
            <div className="relative bg-[#e6e6e6] hover:bg-[#d4d4d4] text-[#0f1111] text-xs h-full flex items-center px-3 font-medium border-r border-[#cdcdcd] cursor-pointer">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                aria-label="Search Category"
                className="bg-transparent text-xs text-[#0f1111] font-medium outline-none cursor-pointer pr-1"
              >
                <option value="All">All Categories</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Beauty">Beauty & Personal Care</option>
                <option value="Apparel">Fashion & Apparel</option>
                <option value="Electronics">Electronics & PCs</option>
                <option value="Toys">Toys & Baby</option>
                <option value="Festive">Festive Deals 🪔</option>
              </select>
            </div>

            {/* Input Search Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon style Dhanshree..."
              className="flex-1 h-full px-3 text-sm text-[#0f1111] placeholder:text-slate-500 outline-none"
            />

            {/* Orange Magnifying Glass Search Button */}
            <button
              type="submit"
              aria-label="Search"
              className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] flex items-center justify-center transition-colors cursor-pointer"
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

          {/* 4. Country / Language Selector */}
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

          {/* 5. Account & Lists (Mock Persona Switcher & Auth) */}
          <div className="relative shrink-0" ref={accountDropdownRef}>
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex flex-col text-left px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all"
            >
              <span className="text-[11px] text-[#cccccc] leading-tight flex items-center gap-1">
                <span>Hello, {currentUser.name.split(' ')[0]}</span>
                <span className="text-xs">{currentUser.avatar}</span>
              </span>
              <span className="text-[13px] text-white font-bold leading-tight flex items-center gap-1">
                Account &amp; Lists
                <span className="text-[9px] text-[#cccccc]">▼</span>
              </span>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 z-50 p-3.5 text-xs animate-in fade-in">
                {/* Active Persona Badge */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Current Mock User</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {currentUser.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentUser.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {currentUser.nameNepali} ({currentUser.name})
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                      <div className="text-[11px] font-semibold text-blue-700 mt-0.5">{currentUser.balanceFormatted}</div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  1-Click Switch Persona for Testing:
                </div>

                <div className="space-y-1 mb-3">
                  {availableUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsAccountMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{u.avatar}</span>
                          <div>
                            <span className="block font-medium">{u.nameNepali} ({u.roleLabel})</span>
                            <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                          </div>
                        </div>
                        {isSelected && <span className="text-amber-800 font-bold text-[11px]">✓ Active</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <AuthModal />
                  <Link
                    href={`/${c}/orders`}
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-orange-600"
                  >
                    Your Orders →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 6. Returns & Orders */}
          <Link
            href={`/${c}/orders`}
            className="hidden lg:flex flex-col text-left px-2 py-1 rounded-sm border border-transparent hover:border-white transition-all shrink-0"
          >
            <span className="text-[11px] text-[#cccccc] leading-tight">Returns</span>
            <span className="text-[13px] text-white font-bold leading-tight">&amp; Orders</span>
          </Link>

          {/* 7. Amazon Shopping Cart with Count Badge */}
          <div className="shrink-0 flex items-center">
            <CartDrawer countryCode={countryCodeEnum} />
          </div>
        </div>

        {/* Amazon Sub-Navbar (#232f3e) */}
        <div className="bg-[#232f3e] text-white px-2 sm:px-4 text-xs h-[39px] flex items-center justify-between overflow-x-auto scrollbar-none font-medium">
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            {/* Hamburger "All" */}
            <button
              onClick={() => {
                const el = document.getElementById('amazon-category-strip');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-transparent hover:border-white font-bold text-white transition-colors"
            >
              <span className="text-base">☰</span>
              <span>All</span>
            </button>

            <Link
              href={`/${c}/membership`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Prime Video</span>
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
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-amber-300 font-bold hover:text-amber-200 flex items-center gap-1 transition-colors"
            >
              <span>🔥</span>
              <span>Today&apos;s Deals</span>
            </Link>

            <Link
              href={`/${c}/rfq`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden md:inline"
            >
              Registry
            </Link>

            <Link
              href={`/${c}/products`}
              className="px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-slate-200 hover:text-white transition-colors hidden md:inline"
            >
              Gift Cards
            </Link>

            <Link
              href={`/${c}/seller`}
              className="px-2.5 py-1 rounded-sm border border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950 font-bold transition-all flex items-center gap-1"
            >
              <span>🏪 Sell (०% कमिसन)</span>
            </Link>
          </div>

          {/* Right Sub-nav Highlights */}
          <div className="flex items-center gap-3 whitespace-nowrap text-[11px] font-bold">
            <span className="text-amber-300 hidden lg:inline">
              🏮 दशैँ, तिहार तथा छठ महोत्सव २०८३
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

      {/* Floating AI Shopping Assistant */}
      <AiShoppingAssistant countryCode={countryCodeEnum} />
    </>
  );
}
