'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { MegaMenu } from '@/components/MegaMenu';
import { SearchBar } from '@/components/SearchBar';
import { COUNTRY_CONFIGS, CountryCode, CurrencyCode } from '@dhanshree/shared';

interface ProductsPageProps {
  params: {
    country: string;
  };
}

export default function ProductsPage({ params }: ProductsPageProps) {
  const code = params.country.toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code];

  if (!config) {
    notFound();
  }

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('categorySlug') || '';
  const initialBrand = searchParams.get('brandSlug') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  const currencySymbol =
    config.defaultCurrency === CurrencyCode.NPR
      ? 'रु'
      : config.defaultCurrency === CurrencyCode.INR
      ? '₹'
      : 'AED';

  // Sample catalog data
  const catalog = useMemo(() => {
    return [
      {
        id: 'prod-001',
        title: 'Sony WH-1000XM5 Premium Wireless Noise Cancelling Headphones',
        slug: 'sony-wh-1000xm5-wireless-anc-headphones',
        category: 'audio-headphones',
        categoryName: 'Headphones & Audio',
        brand: 'sony',
        brandName: 'Sony',
        price: code === 'NP' ? 44999 : code === 'IN' ? 29999 : 1299,
        originalPrice: code === 'NP' ? 49999 : code === 'IN' ? 34999 : 1399,
        rating: 4.8,
        reviews: 324,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        inStock: true,
        tag: 'Best Seller',
      },
      {
        id: 'prod-002',
        title: 'Authentic Handcrafted Nepali Singing Bowl & Wooden Mallet Set',
        slug: 'nepali-handmade-singing-bowl-set',
        category: 'singing-bowls-crafts',
        categoryName: 'Singing Bowls & Thangka Art',
        brand: 'himalayan-tea-co',
        brandName: 'Himalayan Organic Tea Co.',
        price: code === 'NP' ? 7650 : code === 'IN' ? 4999 : 225,
        originalPrice: code === 'NP' ? 8500 : code === 'IN' ? 5500 : 250,
        rating: 4.9,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600',
        inStock: true,
        tag: 'Artisan Heritage',
      },
      {
        id: 'prod-003',
        title: 'Royal Dehn Al Oud Cambodi Pure Concentrated Perfume Oil',
        slug: 'royal-dehn-al-oud-cambodi-oil',
        category: 'oud-bakhoor',
        categoryName: 'Dehn Al Oud & Bakhoor',
        brand: 'al-mansoor-oud',
        brandName: 'Al-Mansoor Arabian Oud',
        price: code === 'NP' ? 22999 : code === 'IN' ? 14999 : 649,
        originalPrice: code === 'NP' ? 24999 : code === 'IN' ? 15999 : 680,
        rating: 5.0,
        reviews: 94,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600',
        inStock: true,
        tag: 'Royal Reserve',
      },
      {
        id: 'prod-004',
        title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
        slug: 'apple-iphone-15-pro-max-256gb',
        category: 'smartphones',
        categoryName: 'Mobiles & Smartphones',
        brand: 'apple',
        brandName: 'Apple',
        price: code === 'NP' ? 179999 : code === 'IN' ? 139900 : 4799,
        originalPrice: code === 'NP' ? 189999 : code === 'IN' ? 149900 : 4999,
        rating: 4.9,
        reviews: 512,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
        inStock: true,
        tag: 'Official Warranty',
      },
      {
        id: 'prod-005',
        title: 'Ilam First Flush Organic Golden Orthodox Black Tea (250g Tin)',
        slug: 'nepali-handmade-singing-bowl-set',
        category: 'himalayan-tea',
        categoryName: 'Ilam Teas & Herbs',
        brand: 'himalayan-tea-co',
        brandName: 'Himalayan Organic Tea Co.',
        price: code === 'NP' ? 1450 : code === 'IN' ? 950 : 45,
        originalPrice: code === 'NP' ? 1650 : code === 'IN' ? 1100 : 55,
        rating: 4.7,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        inStock: true,
        tag: 'Single Origin',
      },
    ];
  }, [code]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return catalog
      .filter((p) => {
        if (initialQuery && !p.title.toLowerCase().includes(initialQuery.toLowerCase())) {
          return false;
        }
        if (selectedCategory && p.category !== selectedCategory) {
          return false;
        }
        if (selectedBrand && p.brand !== selectedBrand) {
          return false;
        }
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }
        if (inStockOnly && !p.inStock) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [catalog, initialQuery, selectedCategory, selectedBrand, minRating, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header currentCountry={config.code} />

      {/* Sub-Header Bar with Mega Menu & Search */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <MegaMenu countryCode={config.code} />
          <SearchBar countryCode={config.code} />
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href={`/${config.code.toLowerCase()}`} className="hover:text-blue-600">
            {config.name} Storefront
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">Products & Catalog</span>
          {initialQuery && (
            <>
              <span>/</span>
              <span className="text-blue-600 font-bold">&ldquo;{initialQuery}&rdquo;</span>
            </>
          )}
        </nav>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Filters
                </span>
                {(selectedCategory || selectedBrand || minRating > 0) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedBrand('');
                      setMinRating(0);
                    }}
                    className="text-blue-600 hover:underline text-[11px] font-bold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <span className="font-bold text-slate-800 block mb-2">Category</span>
                <ul className="space-y-1.5">
                  {[
                    { slug: '', label: 'All Categories' },
                    { slug: 'audio-headphones', label: 'Headphones & Audio' },
                    { slug: 'smartphones', label: 'Smartphones & Mobiles' },
                    { slug: 'singing-bowls-crafts', label: 'Himalayan Singing Bowls' },
                    { slug: 'oud-bakhoor', label: 'Dehn Al Oud & Bakhoor' },
                    { slug: 'himalayan-tea', label: 'Ilam Teas & Herbs' },
                  ].map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left py-1 px-2 rounded-lg transition-all ${
                          selectedCategory === cat.slug
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand Filter */}
              <div className="pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800 block mb-2">Brand</span>
                <div className="space-y-1.5">
                  {[
                    { slug: 'sony', name: 'Sony' },
                    { slug: 'apple', name: 'Apple' },
                    { slug: 'himalayan-tea-co', name: 'Himalayan Organic' },
                    { slug: 'al-mansoor-oud', name: 'Al-Mansoor Oud' },
                  ].map((b) => (
                    <label key={b.slug} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedBrand === b.slug}
                        onChange={() => setSelectedBrand(selectedBrand === b.slug ? '' : b.slug)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800 block mb-2">Customer Rating</span>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                      className={`flex items-center gap-1.5 w-full py-1 px-2 rounded-lg text-left ${
                        minRating === stars ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-amber-500">{'★'.repeat(stars)}</span>
                      <span className="text-slate-400">{'★'.repeat(5 - stars)}</span>
                      <span className="text-[11px] ml-1">& Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Filter */}
              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID & SORT CONTROLS */}
          <section className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm">
                  {filteredProducts.length} Results
                </span>
                <span className="text-slate-500 ml-1">in {config.name} Storefront</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Customer Review</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting your filter parameters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Preview */}
                      <Link href={`/${config.code.toLowerCase()}/products/${p.slug}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur-sm">
                          {p.tag}
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {p.brandName}
                        </span>
                        <Link
                          href={`/${config.code.toLowerCase()}/products/${p.slug}`}
                          className="font-bold text-slate-900 hover:text-blue-600 line-clamp-2 text-xs leading-snug mb-2 block"
                        >
                          {p.title}
                        </Link>

                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-amber-500 font-bold">★ {p.rating}</span>
                          <span className="text-slate-400 text-[11px]">({p.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Footer */}
                    <div className="p-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-900">
                            {currencySymbol} {p.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {currencySymbol} {p.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          {config.taxLabel} included
                        </span>
                      </div>

                      <Link
                        href={`/${config.code.toLowerCase()}/products/${p.slug}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        View Item
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
