'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CountryCode, CurrencyCode } from '@dhanshree/shared';

interface SearchBarProps {
  countryCode?: CountryCode;
}

export function SearchBar({ countryCode = CountryCode.NEPAL }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    queries: string[];
    categories: Array<{ id: string; name: string; slug: string }>;
    products: Array<{
      id: string;
      title: string;
      slug: string;
      thumbnailUrl?: string;
      price: { currency: CurrencyCode; salePrice?: number | null; originalPrice: number };
    }>;
  }>({
    queries: [],
    categories: [],
    products: [],
  });

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock instant autocomplete client-side
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ queries: [], categories: [], products: [] });
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();

    const sampleProducts = [
      {
        id: 'prod-001',
        title: 'Sony WH-1000XM5 Premium ANC Headphones',
        slug: 'sony-wh-1000xm5-wireless-anc-headphones',
        thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120',
        price: {
          currency: countryCode === 'NP' ? CurrencyCode.NPR : countryCode === 'IN' ? CurrencyCode.INR : CurrencyCode.AED,
          salePrice: countryCode === 'NP' ? 44999 : countryCode === 'IN' ? 29999 : 1299,
          originalPrice: countryCode === 'NP' ? 49999 : countryCode === 'IN' ? 34999 : 1399,
        },
      },
      {
        id: 'prod-002',
        title: 'Authentic Handcrafted Nepali Singing Bowl Set',
        slug: 'nepali-handmade-singing-bowl-set',
        thumbnailUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=120',
        price: {
          currency: countryCode === 'NP' ? CurrencyCode.NPR : countryCode === 'IN' ? CurrencyCode.INR : CurrencyCode.AED,
          salePrice: countryCode === 'NP' ? 7650 : countryCode === 'IN' ? 4999 : 225,
          originalPrice: countryCode === 'NP' ? 8500 : countryCode === 'IN' ? 5500 : 250,
        },
      },
      {
        id: 'prod-003',
        title: 'Royal Dehn Al Oud Cambodi Concentrated Perfume Oil',
        slug: 'royal-dehn-al-oud-cambodi-oil',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=120',
        price: {
          currency: countryCode === 'NP' ? CurrencyCode.NPR : countryCode === 'IN' ? CurrencyCode.INR : CurrencyCode.AED,
          salePrice: countryCode === 'NP' ? 22999 : countryCode === 'IN' ? 14999 : 649,
          originalPrice: countryCode === 'NP' ? 24999 : countryCode === 'IN' ? 15999 : 680,
        },
      },
      {
        id: 'prod-004',
        title: 'Apple iPhone 15 Pro Max 256GB Titanium',
        slug: 'apple-iphone-15-pro-max-256gb',
        thumbnailUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120',
        price: {
          currency: countryCode === 'NP' ? CurrencyCode.NPR : countryCode === 'IN' ? CurrencyCode.INR : CurrencyCode.AED,
          salePrice: countryCode === 'NP' ? 179999 : countryCode === 'IN' ? 139900 : 4799,
          originalPrice: countryCode === 'NP' ? 189999 : countryCode === 'IN' ? 149900 : 4999,
        },
      },
    ];

    const matchedProducts = sampleProducts.filter((p) => p.title.toLowerCase().includes(q));

    const sampleCategories = [
      { id: '1', name: 'Consumer Electronics & Headphones', slug: 'electronics' },
      { id: '2', name: 'Nepal & Himalayan Specialties', slug: 'himalayan-specialties' },
      { id: '3', name: 'Arabian Luxury & Pure Oud', slug: 'arabian-luxury' },
    ].filter((c) => c.name.toLowerCase().includes(q));

    const queries = [
      q,
      `${q} deals`,
      `${q} best price in ${countryCode === 'NP' ? 'Nepal' : countryCode === 'IN' ? 'India' : 'Dubai'}`,
    ];

    setSuggestions({
      queries,
      categories: sampleCategories,
      products: matchedProducts,
    });
    setIsOpen(true);
  }, [query, countryCode]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/${countryCode.toLowerCase()}/products?q=${encodeURIComponent(query.trim())}`);
  };

  const currencySymbol =
    countryCode === 'NP' ? 'रु' : countryCode === 'IN' ? '₹' : 'AED';

  return (
    <div ref={containerRef} className="relative flex-1 max-w-lg">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={`Search products, brands, or categories in ${
            countryCode === 'NP' ? 'Nepal (रु)' : countryCode === 'IN' ? 'India (₹)' : 'UAE (AED)'
          }...`}
          className="w-full pl-10 pr-10 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
        />

        {/* Search Icon */}
        <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 text-xs overflow-hidden">
          {/* Query Suggestions */}
          {suggestions.queries.length > 0 && (
            <div className="px-3 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Suggested Searches
              </span>
              <div className="space-y-1">
                {suggestions.queries.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      setIsOpen(false);
                      router.push(`/${countryCode.toLowerCase()}/products?q=${encodeURIComponent(s)}`);
                    }}
                    className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <span className="text-slate-400">🔍</span>
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories.length > 0 && (
            <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/${countryCode.toLowerCase()}/products?categorySlug=${c.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 text-[11px] font-medium transition-colors"
                  >
                    📁 {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Results Preview */}
          {suggestions.products.length > 0 && (
            <div className="px-3 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Matching Products
              </span>
              <div className="space-y-1.5">
                {suggestions.products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${countryCode.toLowerCase()}/products/${p.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {p.thumbnailUrl && (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-slate-800 line-clamp-1 block">
                        {p.title}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-blue-600">
                          {currencySymbol} {(p.price.salePrice ?? p.price.originalPrice).toLocaleString()}
                        </span>
                        {p.price.salePrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {currencySymbol} {p.price.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer View All */}
          <div className="px-3 pt-2 mt-2 border-t border-slate-100 text-center">
            <Link
              href={`/${countryCode.toLowerCase()}/products?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-500"
            >
              View all results for &ldquo;{query}&rdquo; &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
