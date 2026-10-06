'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatLocalizedVastuPrice, getVastuPriceBreakdown } from '@/lib/vastuPricing';

export interface VastuProductProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  originalPrice: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  badge?: string;
  countryCode?: string;
  currency?: string;
  preferredVibration?: 5 | 6 | 'auto';
  onAddToCart?: (productId: string) => void;
  onInstantBuy?: (productId: string) => void;
}

export function VastuProductCard({
  id,
  title,
  slug,
  category,
  originalPrice,
  discountPercent = 15,
  rating = 4.8,
  reviewCount = 128,
  imageUrl,
  badge = 'Festive Bestseller',
  countryCode = 'NP',
  currency = 'NPR',
  preferredVibration = 'auto',
  onAddToCart,
  onInstantBuy,
}: VastuProductProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showVastuInfo, setShowVastuInfo] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const c = countryCode.toLowerCase();

  // Calculate discounted base price before Vastu harmonization
  const discountedRaw = Math.round(originalPrice * (1 - discountPercent / 100));

  // Compute Vastu price harmonized to digital root 5 (Mercury) or 6 (Venus)
  const vastuInfo = formatLocalizedVastuPrice(discountedRaw, currency, preferredVibration);
  const breakdown = getVastuPriceBreakdown(discountedRaw, preferredVibration);

  // Original list price formatted
  const listPriceFormatted = formatLocalizedVastuPrice(originalPrice, currency).formatted;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(id);
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onInstantBuy) {
      onInstantBuy(id);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowVastuInfo(false);
      }}
      className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
    >
      {/* ========================================================================= */}
      {/* 1. TOP CARD HEADER: Badges & Wishlist Trigger                            */}
      {/* ========================================================================= */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        {/* Badge: Mercury Growth / Festive Special */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
              <span>⚡</span> {badge}
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          aria-label="Add to Wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Product Image with Zoom on Hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Overlay Bar */}
        {isHovered && (
          <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Link
              href={`/${c}/products/${slug}`}
              className="flex-1 py-1.5 bg-[#0F172A]/90 hover:bg-[#0F172A] text-white text-xs font-semibold rounded-lg text-center backdrop-blur-xs shadow-md transition-colors"
            >
              Quick Details
            </Link>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD CONTENT: Category, Title, Star Rating                            */}
      {/* ========================================================================= */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {category}
          </span>

          {/* Title */}
          <Link
            href={`/${c}/products/${slug}`}
            className="text-sm font-bold text-[#0F172A] hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2"
          >
            {title}
          </Link>

          {/* Star Rating (Venus Gold #F59E0B) */}
          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex text-[#F59E0B]">
              {'★'.repeat(Math.floor(rating))}
              {rating % 1 !== 0 && '½'}
            </div>
            <span className="text-slate-500 font-medium text-[11px]">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. VASTU HARMONIC PRICING & SE (AGNI) CONVERSION ACTION ZONE              */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          {/* Price & Auspicious Root Indicator */}
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#0F172A] tracking-tight">
                  {vastuInfo.formatted}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {listPriceFormatted}
                </span>
              </div>

              {/* Digital Root Energy Tag */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  type="button"
                  onClick={() => setShowVastuInfo(!showVastuInfo)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-amber-50 border border-amber-200 text-[#F59E0B] text-[10px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Click to view Commercial Numerology Details"
                >
                  <span>✨ Root #{vastuInfo.digitalRoot}</span>
                  <span className="text-[9px] text-slate-500">({vastuInfo.planet.split(' ')[0]})</span>
                </button>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Save {discountPercent}%
                </span>
              </div>
            </div>

            {/* Auspicious Voucher Tag */}
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-bold">
              {vastuInfo.digitalRoot === 5 ? 'DHAN5' : 'SHREE6'}
            </span>
          </div>

          {/* Vastu Numerology Breakdown Popover */}
          {showVastuInfo && (
            <div className="p-2.5 mb-3 bg-slate-900 text-white rounded-xl text-[11px] animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                <span>Vastu Digital Root Breakdown</span>
                <span>#{vastuInfo.digitalRoot}</span>
              </div>
              <p className="text-slate-300 leading-tight mb-1.5">
                {breakdown.commercialVibration}
              </p>
              <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-1">
                <span>Harmonized Price:</span>
                <span className="text-emerald-400 font-mono font-bold">{vastuInfo.formatted}</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SOUTH-EAST (AGNI / FIRE) CONVERSION BUTTONS: Prominent Right-Aligned CTAs */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2">
            {/* Secondary Buy Now */}
            <button
              type="button"
              onClick={handleBuy}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:border-[#0F172A] text-[#0F172A] font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Instant Buy
            </button>

            {/* Primary South-East (Agni) Add to Cart Button (Emerald Green #059669) */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className="flex-1 py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-98 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              {isAdding ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
