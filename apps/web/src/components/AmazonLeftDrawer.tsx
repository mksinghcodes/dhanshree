'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AmazonLeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode: string;
}

export function AmazonLeftDrawer({ isOpen, onClose, countryCode }: AmazonLeftDrawerProps) {
  const { currentUser, logout } = useAuth();
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
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

  const toggleDept = (deptName: string) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

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
      <div className="relative w-full max-w-[375px] sm:max-w-[400px] bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        {/* Top Header: "👤 Hello, [User]" (Royal Navy Blue #0d1b2a) */}
        <div className="bg-[#0d1b2a] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-lg font-bold">
              👤
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight block">
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

        {/* Scrollable Departments & Navigation List */}
        <div className="flex-1 overflow-y-auto py-2 text-sm text-[#0f1111] divide-y divide-slate-200">
          
          {/* ========================================================================= */}
          {/* DEPARTMENT 1: Trending & Offers                                          */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span>🔥</span> Trending &amp; Offers
            </h3>
            <Link
              href={`/${c}#todays-deals`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-800 hover:bg-slate-100 -mx-3 px-3 rounded font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-amber-500">⚡</span>
                <span>Today&apos;s Lightning Deals</span>
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                Up to 70% Off
              </span>
            </Link>
            <Link
              href={`/${c}/products?cat=Bestsellers`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-800 hover:bg-slate-100 -mx-3 px-3 rounded font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-amber-500">⭐</span>
                <span>Bestsellers Across Store</span>
              </span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Deals`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-amber-900 bg-amber-50/80 -mx-3 px-3 rounded font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>🏮</span>
                <span>दशैँ, तिहार तथा छठ २०८३ महोत्सव</span>
              </span>
              <span className="text-amber-600 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Clearance`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-rose-500">🏷️</span>
                <span>Clearance &amp; Daily Steals</span>
              </span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 2: Electronics & Accessories                                  */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span>💻</span> Electronics &amp; Accessories
            </h3>
            <Link
              href={`/${c}/products?cat=Electronics&q=smartphone`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Smartphones &amp; 5G Mobiles</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Electronics&q=laptop`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Laptops, Desktops &amp; MacBooks</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Electronics&q=audio`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Audio, Headphones &amp; True Wireless (TWS)</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Electronics&q=smartwatch`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Smartwatches &amp; Fitness Wearables</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 3: Fashion & Apparel                                          */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span>👗</span> Fashion &amp; Apparel
            </h3>
            <Link
              href={`/${c}/products?cat=Fashion&q=men`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Men&apos;s Clothing &amp; Footwear</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Fashion&q=women`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Women&apos;s Ethnic &amp; Western Wear</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Fashion&q=kids`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Kids&apos; Fashion &amp; Baby Essentials</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Fashion&q=accessories`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Watches, Bags &amp; Sunglasses</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 4: Home & Kitchen Living                                      */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span>🍳</span> Home &amp; Kitchen Living
            </h3>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=cookware`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Cookware &amp; Kitchen Appliances</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=furniture`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Furniture, Mattresses &amp; Decor</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=mandir`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Mandir Essentials &amp; Brass Idols</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Home+%26+Kitchen&q=storage`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Smart Home &amp; Living Essentials</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 5: Beauty & Personal Care                                     */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span>🌿</span> Beauty &amp; Personal Care
            </h3>
            <Link
              href={`/${c}/products?cat=Beauty+%26+Personal+Care&q=skincare`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Ayurvedic &amp; Natural Skincare</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Beauty+%26+Personal+Care&q=perfume`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Luxury Fragrances &amp; Deodorants</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Beauty+%26+Personal+Care&q=hair`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Hair Care &amp; Styling Kits</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Beauty+%26+Personal+Care&q=grooming`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Men&apos;s Grooming &amp; Beard Care</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* DEPARTMENT 6: Books, Learning & Stationery                               */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span>📚</span> Books, Learning &amp; Stationery
            </h3>
            <Link
              href={`/${c}/products?cat=Books&q=fiction`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Bestselling Novels &amp; Fiction</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Books&q=academic`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Academic, School &amp; Exam Prep</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Books&q=kindle`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Kindle E-readers &amp; E-books</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/products?cat=Books&q=stationery`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Premium Stationery &amp; Art Supplies</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* PROMOTIONAL BANNER / PRIME CARD                                           */}
          {/* ========================================================================= */}
          <div className="p-5 bg-gradient-to-br from-emerald-950 to-[#0d1b2a] text-white m-4 rounded-xl shadow-lg border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                Dhanshree Shrestha Club
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              ⚡ Free Next-Day Delivery &amp; 5% Cashback
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              Join millions of happy members enjoying premium perks and early deal access.
            </p>
            <Link
              href={`/${c}/membership`}
              onClick={onClose}
              className="inline-block w-full text-center py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-md"
            >
              Explore Club Membership →
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* PROGRAMS & SPECIAL FEATURES                                               */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2">
              Programs &amp; Features
            </h3>
            <Link
              href={`/${c}/auctions`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>Dhanshree Live &amp; Auctions</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-slate-700 hover:bg-slate-100 -mx-3 px-3 rounded transition-colors"
            >
              <span>International Shopping (Nepal • India • UAE)</span>
              <span className="text-slate-400 font-bold">›</span>
            </Link>
            <Link
              href={`/${c}/seller`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-emerald-900 bg-emerald-50/80 -mx-3 px-3 rounded font-bold transition-colors"
            >
              <span>Sell on Dhanshree (०% कमिसन)</span>
              <span className="text-emerald-700 font-bold">›</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* HELP & SETTINGS                                                           */}
          {/* ========================================================================= */}
          <div className="py-3 px-6 space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-2">
              Help &amp; Settings
            </h3>
            <Link
              href={`/${c}/orders`}
              onClick={onClose}
              className="block py-1.5 text-slate-700 hover:text-amber-700 font-medium"
            >
              Your Account &amp; Order History
            </Link>
            <div className="flex items-center gap-2 py-1 text-slate-700 text-xs">
              <span>🌐</span>
              <span>English / नेपाली / العربية</span>
            </div>
            <div className="flex items-center gap-2 py-1 text-slate-700 text-xs">
              <span>{countryCode.toUpperCase() === 'NP' ? '🇳🇵 Nepal (NPR)' : countryCode.toUpperCase() === 'IN' ? '🇮🇳 India (INR)' : '🇦🇪 UAE (AED)'}</span>
            </div>
            <Link
              href={`/${c}/legal`}
              onClick={onClose}
              className="block py-1.5 text-slate-700 hover:text-amber-700 font-medium"
            >
              Customer Service &amp; Help Desk
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
