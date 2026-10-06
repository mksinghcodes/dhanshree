'use client';

import React from 'react';
import Link from 'next/link';

interface VastuHeroSectionProps {
  countryCode: string;
}

export function VastuHeroSection({ countryCode }: VastuHeroSectionProps) {
  const c = countryCode.toLowerCase();

  return (
    <section className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-white py-10 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* 1. BRAHMASTHAN (CENTER CANVAS): Clutter-Free Breathing Space & Clarity    */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            {/* Auspicious Vibration Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Digital Vastu Harmonized Commerce • Mercury #5 &amp; Venus #6</span>
            </div>

            {/* Headline with Balanced Typography & Breathing Room */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
              Everything You Love,{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-[#F59E0B] to-emerald-600 bg-clip-text text-transparent">
                One Harmonious Place.
              </span>
            </h1>

            {/* Sub-headline: Pure Negative Space */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Experience prosperous e-commerce calibrated for high speed, authentic certified goods, and frictionless checkout across Nepal, India, and UAE.
            </p>

            {/* CTAs: Mercury Growth & Instant Discovery */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/${c}/products?cat=Deals`}
                className="px-6 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Today&apos;s Deals</span>
                <span className="text-base">→</span>
              </Link>
              <Link
                href={`/${c}#coupons`}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-[#0F172A] text-[#0F172A] font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🏷️ Voucher: <b>DHAN5</b></span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 max-w-lg">
              <div>
                <div className="text-base font-black text-[#0F172A]">०% Fee</div>
                <div className="text-xs text-slate-500">Merchant Commission</div>
              </div>
              <div>
                <div className="text-base font-black text-[#0F172A]">100%</div>
                <div className="text-xs text-slate-500">Escrow Protected</div>
              </div>
              <div>
                <div className="text-base font-black text-[#0F172A]">24-Hour</div>
                <div className="text-xs text-slate-500">Express Delivery</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. EAST QUADRANT (SURYA / NEW BEGINNINGS): Trending & New Arrivals        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative">
            {/* Subtle Solar Warmth Aura */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌅</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">East Wing: New Arrivals</h3>
                    <p className="text-[11px] text-slate-500">Surya Energy • Trending Curations</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  HOT TODAY
                </span>
              </div>

              {/* Curated Mini Carousel Cards */}
              <div className="space-y-3">
                <Link
                  href={`/${c}/products?q=laptop`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    💻
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-emerald-700 block truncate">
                      MacBook Air M3 Series (16GB)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      WTO ITA-0 Zero Duty Exemption
                    </span>
                    <span className="text-xs font-black text-emerald-600 block mt-0.5">
                      रु १,६४,९९० (Harmonic #5)
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">›</span>
                </Link>

                <Link
                  href={`/${c}/products?q=kurti`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    👗
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-emerald-700 block truncate">
                      Pure Banarasi Festive Silk Set
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Dashain-Tihar 2083 Handloom
                    </span>
                    <span className="text-xs font-black text-emerald-600 block mt-0.5">
                      रु ८,५२० (Venus Root #6)
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">›</span>
                </Link>

                <Link
                  href={`/${c}/products?q=audio`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    🎧
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-emerald-700 block truncate">
                      Wireless Studio Pro Earbuds (ANC)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      60h Battery • Spatial Audio
                    </span>
                    <span className="text-xs font-black text-emerald-600 block mt-0.5">
                      रु ४,९९१ (Mercury Root #5)
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">›</span>
                </Link>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Live stock synchronized</span>
                <Link
                  href={`/${c}/products`}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View All 4,800+ Products →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
