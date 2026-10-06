'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DhanshreeLogo } from './DhanshreeLogo';

export interface DhanshreeLeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode: string;
}

export function DhanshreeLeftDrawer({ isOpen, onClose, countryCode }: DhanshreeLeftDrawerProps) {
  const { currentUser, logout } = useAuth();
  const c = countryCode.toLowerCase();

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dhanshree Category Navigation Drawer"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        {/* Top Header: Royal Navy Blue #0d1b2a */}
        <div className="bg-[#0d1b2a] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-lg font-bold">
              👤
            </span>
            <div>
              <span className="text-base font-bold tracking-tight block">
                Hello, {currentUser?.shortName || 'Shopper'}
              </span>
              <span className="text-[11px] text-[#febd69] font-medium tracking-wide block">
                Shop. Discover. Delight
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-[#febd69] text-2xl font-light leading-none p-1 transition-colors cursor-pointer"
            aria-label="Close categories menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Departments with Concise Short Menu Text */}
        <div className="flex-1 overflow-y-auto py-2 text-sm text-[#0f1111] divide-y divide-slate-200">
          
          {/* ========================================================================= */}
          {/* DEPARTMENT 1: Trending                                                    */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>🔥</span> Trending
            </h3>
            <Link
              href={`/${c}#todays-deals`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-800 hover:bg-slate-100 -mx-2.5 px-2.5 rounded font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-amber-500">⚡</span>
                <span>Lightning Deals</span>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                Up to 70%
              </span>
            </Link>
            <Link
              href={`/${c}/products?cat=Bestsellers`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-800 hover:bg-slate-100 -mx-2.5 px-2.5 rounded font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-amber-500">⭐</span>
                <span>Bestsellers</span>
              </span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Festive`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-amber-900 bg-amber-50/80 -mx-2.5 px-2.5 rounded font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>🏮</span>
                <span>Festive Deals</span>
              </span>
              <span className="text-amber-600 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Clearance`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-rose-500">🏷️</span>
                <span>Clearance</span>
              </span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 2: Electronics                                                 */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>💻</span> Electronics
            </h3>
            <Link
              href={`/${c}/products?cat=Electronics&q=smartphone`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Smartphones</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Computers&q=laptop`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Laptops &amp; PCs</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Electronics&q=audio`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Headphones &amp; Audio</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Electronics&q=smartwatch`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Smartwatches</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 3: Fashion                                                     */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>👗</span> Fashion
            </h3>
            <Link
              href={`/${c}/products?cat=Fashion&q=men`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Men&apos;s Fashion</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Fashion&q=women`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Women&apos;s Fashion</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Fashion&q=kids`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Kids &amp; Baby</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Fashion&q=accessories`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Watches &amp; Bags</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 4: Home & Kitchen                                              */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>🍳</span> Home &amp; Kitchen
            </h3>
            <Link
              href={`/${c}/products?cat=Kitchen`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Kitchen &amp; Dining</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=furniture`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Furniture &amp; Decor</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=mandir`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Pooja &amp; Idols</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=storage`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Home Living</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 5: Beauty & Care                                               */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>🌿</span> Beauty &amp; Care
            </h3>
            <Link
              href={`/${c}/products?cat=Beauty`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Skincare</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Beauty&q=perfume`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Fragrances</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Beauty&q=hair`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Hair Care</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Beauty&q=grooming`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Men&apos;s Grooming</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 6: Books & Learning                                            */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <span>📚</span> Books &amp; Learning
            </h3>
            <Link
              href={`/${c}/products?cat=Books&q=fiction`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Fiction &amp; Novels</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Books&q=academic`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Academic &amp; Exam</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Books&q=stationery`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Stationery &amp; Art</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* PROMOTIONAL BANNER: Dhanshree Club                                        */}
          {/* ========================================================================= */}
          <div className="p-4 bg-gradient-to-br from-emerald-950 to-[#0d1b2a] text-white m-3.5 rounded-xl shadow-lg border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                Dhanshree Club
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              ⚡ Free Delivery &amp; 5% Cashback
            </h4>
            <Link
              href={`/${c}/membership`}
              onClick={onClose}
              className="inline-block w-full text-center py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-md mt-2"
            >
              Explore Club →
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* PROGRAMS & SPECIAL FEATURES                                               */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-0.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
              Programs
            </h3>
            <Link
              href={`/${c}/seller`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-emerald-900 bg-emerald-50/80 -mx-2.5 px-2.5 rounded font-bold transition-colors"
            >
              <span>Sell (०% कमिसन)</span>
              <span className="text-emerald-700 font-bold text-xs">›</span>
            </Link>
            <Link
              href={`/${c}/auctions`}
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Live Auctions</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between py-1.5 text-slate-700 hover:bg-slate-100 -mx-2.5 px-2.5 rounded transition-colors"
            >
              <span>Cross-Border Hubs</span>
              <span className="text-slate-400 font-bold text-xs">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* HELP & SETTINGS                                                           */}
          {/* ========================================================================= */}
          <div className="py-2.5 px-5 space-y-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
              Settings
            </h3>
            <Link
              href={`/${c}/orders`}
              onClick={onClose}
              className="block py-1 text-slate-700 hover:text-amber-700 font-medium"
            >
              Your Account
            </Link>
            <div className="flex items-center gap-2 py-0.5 text-slate-700 text-xs">
              <span>🌐</span>
              <span>English / नेपाली</span>
            </div>
            <div className="flex items-center gap-2 py-0.5 text-slate-700 text-xs">
              <span>{countryCode.toUpperCase() === 'NP' ? '🇳🇵 Nepal (NPR)' : countryCode.toUpperCase() === 'IN' ? '🇮🇳 India (INR)' : '🇦🇪 UAE (AED)'}</span>
            </div>
            <Link
              href={`/${c}/legal`}
              onClick={onClose}
              className="block py-1 text-slate-700 hover:text-amber-700 font-medium"
            >
              Customer Service
            </Link>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="block py-1 text-rose-700 font-semibold hover:text-rose-900 text-left w-full cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DhanshreeLeftDrawer;
