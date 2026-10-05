'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AmazonLeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode: string;
}

export function AmazonLeftDrawer({ isOpen, onClose, countryCode }: AmazonLeftDrawerProps) {
  const { currentUser, logout } = useAuth();
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const c = countryCode.toLowerCase();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-[365px] bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        {/* Top Header: "👤 Hello, Manoj" (Royal Navy Blue) */}
        <div className="bg-[#0d1b2a] text-white px-7 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              👤
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight block">
                Hello, {currentUser.shortName || 'Manoj'}
              </span>
              <span className="text-[10px] text-[#febd69] font-medium tracking-wide block">
                Shop. Discover. Delight
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-white hover:text-amber-400 text-2xl font-light leading-none p-1"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-2 text-sm text-[#0f1111] divide-y divide-slate-200">
          {/* Section 1: Digital Content & Devices */}
          <div className="py-3 px-7 space-y-1">
            <h3 className="font-bold text-base text-[#0f1111] mb-2">
              Digital Content &amp; Devices
            </h3>
            <Link
              href={`/${c}/membership`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Prime Video</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Digital+Music`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Dhanshree Music</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Books`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Kindle E-readers &amp; Books</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Software`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Dhanshree Appstore</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
          </div>

          {/* Section 2: Shop by Department */}
          <div className="py-3 px-7 space-y-1">
            <h3 className="font-bold text-base text-[#0f1111] mb-2">
              Shop by Department
            </h3>
            <Link
              href={`/${c}/products?cat=Electronics`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Electronics</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/products?q=computer`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-900 bg-slate-100 -mx-3 px-3 rounded font-semibold transition-colors"
            >
              <span>Computers</span>
              <span className="text-slate-600 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Smart+Home`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Smart Home</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Arts+%26+Crafts`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Arts &amp; Crafts</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>

            {/* Expandable Departments */}
            {showAllDepartments && (
              <div className="space-y-1 pt-1 animate-in fade-in">
                <Link
                  href={`/${c}/products?cat=Home+%26+Kitchen`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
                >
                  <span>Home &amp; Kitchen</span>
                  <span className="text-slate-400 font-bold text-base">›</span>
                </Link>
                <Link
                  href={`/${c}/products?cat=Beauty+%26+Personal+Care`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
                >
                  <span>Beauty &amp; Personal Care</span>
                  <span className="text-slate-400 font-bold text-base">›</span>
                </Link>
                <Link
                  href={`/${c}/products?cat=Baby`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
                >
                  <span>Baby &amp; Toys</span>
                  <span className="text-slate-400 font-bold text-base">›</span>
                </Link>
                <Link
                  href={`/${c}/products?cat=Apparel`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
                >
                  <span>Men&apos;s &amp; Women&apos;s Fashion</span>
                  <span className="text-slate-400 font-bold text-base">›</span>
                </Link>
                <Link
                  href={`/${c}/products?cat=Deals`}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-amber-700 font-bold hover:bg-amber-50 -mx-3 px-3 rounded transition-colors"
                >
                  <span>दशैँ, तिहार तथा छठ २०८३ अफर</span>
                  <span className="text-amber-600 font-bold text-base">›</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setShowAllDepartments(!showAllDepartments)}
              className="flex items-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mt-1 cursor-pointer"
            >
              <span>{showAllDepartments ? 'See less ∧' : 'See all ∨'}</span>
            </button>
          </div>

          {/* Section 3: Programs & Features */}
          <div className="py-3 px-7 space-y-1">
            <h3 className="font-bold text-base text-[#0f1111] mb-2">
              Programs &amp; Features
            </h3>
            <Link
              href={`/${c}/products?cat=Deals`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Gift Cards</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/auctions`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Dhanshree Live &amp; Auctions</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>International Shopping (Nepal • India • UAE)</span>
              <span className="text-slate-400 font-bold text-base">›</span>
            </Link>
            <Link
              href={`/${c}/seller`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-amber-800 bg-amber-50/80 -mx-3 px-3 rounded font-bold transition-colors"
            >
              <span>Sell on Dhanshree (०% कमिसन)</span>
              <span className="text-amber-700 font-bold text-base">›</span>
            </Link>
          </div>

          {/* Section 4: Help & Settings (Matching Image 2) */}
          <div className="py-3 px-7 space-y-2">
            <h3 className="font-bold text-base text-[#0f1111] mb-2">
              Help &amp; Settings
            </h3>
            <Link
              href={`/${c}/orders`}
              onClick={onClose}
              className="block py-1.5 text-slate-700 hover:text-amber-700 font-medium"
            >
              Your Account
            </Link>
            <div className="flex items-center gap-2 py-1 text-slate-700">
              <span>🌐</span>
              <span>English / नेपाली</span>
            </div>
            <div className="flex items-center gap-2 py-1 text-slate-700">
              <span>{countryCode.toUpperCase() === 'NP' ? '🇳🇵 Nepal' : countryCode.toUpperCase() === 'IN' ? '🇮🇳 India' : '🇦🇪 United Arab Emirates'}</span>
            </div>
            <Link
              href={`/${c}/legal`}
              onClick={onClose}
              className="block py-1.5 text-slate-700 hover:text-amber-700 font-medium"
            >
              Customer Service
            </Link>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="block py-1.5 text-rose-700 font-semibold hover:text-rose-900 text-left w-full cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
