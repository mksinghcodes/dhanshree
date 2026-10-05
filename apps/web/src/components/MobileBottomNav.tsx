'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface MobileBottomNavProps {
  countryCode: string;
  onOpenCategories: () => void;
  cartCount?: number;
}

export function MobileBottomNav({
  countryCode,
  onOpenCategories,
  cartCount = 2,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const c = countryCode.toLowerCase();
  const { currentUser } = useAuth();

  const isHome = pathname === `/${c}` || pathname === '/';
  const isDeals = pathname.includes('deals') || pathname.includes('#todays-deals');
  const isOrders = pathname.includes('/orders');

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1b2a]/95 backdrop-blur-md border-t border-[#1e3452] text-white shadow-2xl px-2 py-1.5"
    >
      <div className="flex items-center justify-around text-[10px] font-medium">
        {/* 1. Home */}
        <Link
          href={`/${c}`}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors ${
            isHome ? 'text-[#febd69] font-bold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </Link>

        {/* 2. Categories (Triggers All Categories Drawer) */}
        <button
          type="button"
          onClick={onOpenCategories}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
          </svg>
          <span>Categories</span>
        </button>

        {/* 3. Deals (Flame Icon) */}
        <Link
          href={`/${c}/products?cat=Deals`}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors ${
            isDeals ? 'text-[#febd69] font-bold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <div className="relative">
            <span className="text-base leading-none">🔥</span>
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-600 text-[8px] font-black rounded-full text-white">
              HOT
            </span>
          </div>
          <span>Deals</span>
        </Link>

        {/* 4. Cart (Live Count) */}
        <Link
          href={`/${c}/checkout`}
          className="relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <div className="relative">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>

        {/* 5. Account / Orders */}
        <Link
          href={`/${c}/orders`}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors ${
            isOrders ? 'text-[#febd69] font-bold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>{currentUser?.shortName || 'Account'}</span>
        </Link>
      </div>
    </nav>
  );
}
