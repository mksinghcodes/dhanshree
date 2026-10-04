'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CountryCode } from '@dhanshree/shared';

interface MegaMenuProps {
  countryCode?: CountryCode;
}

export function MegaMenu({ countryCode = CountryCode.NEPAL }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      title: 'Consumer Electronics',
      slug: 'electronics',
      icon: '⚡',
      subcategories: [
        { name: 'Mobiles & Smartphones', slug: 'smartphones' },
        { name: 'Headphones & ANC Audio', slug: 'audio-headphones' },
        { name: 'Smartwatches & Fitness', slug: 'wearables' },
      ],
    },
    {
      title: 'Himalayan Specialties (Nepal)',
      slug: 'himalayan-specialties',
      icon: '🏔️',
      subcategories: [
        { name: 'Ilam Orthodox Teas & Herbs', slug: 'himalayan-tea' },
        { name: 'Chyangra Pashmina Shawls', slug: 'pashmina-cashmere' },
        { name: 'Handcrafted Singing Bowls', slug: 'singing-bowls-crafts' },
      ],
    },
    {
      title: 'Arabian Luxury & Oud (UAE)',
      slug: 'arabian-luxury',
      icon: '🕌',
      subcategories: [
        { name: 'Dehn Al Oud & Bakhoor', slug: 'oud-bakhoor' },
        { name: 'Gourmet Stuffed Dates', slug: 'gourmet-dates' },
        { name: 'Designer Abayas & Kaftans', slug: 'abayas-kaftans' },
      ],
    },
    {
      title: 'Indian Ethnic & Lifestyle',
      slug: 'indian-fashion',
      icon: '🥻',
      subcategories: [
        { name: 'Banarasi Sarees & Lehengas', slug: 'sarees-lehengas' },
        { name: 'Men Kurtas & Sherwanis', slug: 'mens-ethnic' },
      ],
    },
  ];

  const featuredBrands = [
    { name: 'Sony', slug: 'sony' },
    { name: 'Apple', slug: 'apple' },
    { name: 'Himalayan Tea Co.', slug: 'himalayan-tea-co' },
    { name: 'Al-Mansoor Oud', slug: 'al-mansoor-oud' },
    { name: 'boAt Lifestyle', slug: 'boat' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
      >
        <span>☰ All Categories</span>
        <span className="text-[10px] text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-[720px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Explore Department Taxonomy
            </span>
            <Link
              href={`/${countryCode.toLowerCase()}/products`}
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-blue-600 hover:text-blue-500"
            >
              Browse Complete Catalog &rarr;
            </Link>
          </div>

          {/* 4 Column Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.slug} className="space-y-2">
                <Link
                  href={`/${countryCode.toLowerCase()}/products?categorySlug=${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-slate-900 text-xs hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                >
                  <span>{cat.icon}</span>
                  <span className="line-clamp-1">{cat.title}</span>
                </Link>

                <ul className="space-y-1.5 text-xs text-slate-600">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/${countryCode.toLowerCase()}/products?categorySlug=${sub.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="hover:text-blue-600 hover:underline block text-[11px] text-slate-500"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Brands Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Featured Brands:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {featuredBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${countryCode.toLowerCase()}/products?brandSlug=${b.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200 transition-colors"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
