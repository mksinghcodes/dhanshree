'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { AmazonFooter } from '@/components/AmazonFooter';
import { COUNTRY_CONFIGS, CountryCode, CurrencyCode } from '@dhanshree/shared';
import { useResolvedParams } from '@/lib/params';

interface ProductsPageProps {
  params: any;
}

interface ProductItem {
  id: string;
  title: string;
  subSpec: string;
  category: string;
  subType: 'Desktop' | 'Laptops' | 'All in 1' | 'Mini' | 'Chromebook' | 'Gaming' | 'Business' | 'Students' | 'Home office' | 'Audio';
  brand: string;
  priceNP: number;
  originalPriceNP: number;
  priceIN: number;
  originalPriceIN: number;
  priceAE: number;
  originalPriceAE: number;
  rating: number;
  reviews: number;
  boughtCount: string;
  image: string;
  prime: boolean;
  badges: string[];
}

const COMPUTER_CATALOG: ProductItem[] = [
  {
    id: 'comp-001',
    title: 'Lenovo Business 15.6" FHD Laptop, Intel Processor, 8GB DDR5, 128GB Storage',
    subSpec: 'Office 365, Copilot AI, WiFi 6, Bluetooth 5.2, USB-C, Anti-Glare Screen, Long Battery Life, Windows 11, Type-HUB',
    category: 'Computers',
    subType: 'Laptops',
    brand: 'Lenovo',
    priceNP: 54999,
    originalPriceNP: 65000,
    priceIN: 34999,
    originalPriceIN: 42000,
    priceAE: 1450,
    originalPriceAE: 1750,
    rating: 4.5,
    reviews: 1100,
    boughtCount: '500+ bought in past month',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['15.6" FHD Anti-Glare Display', 'Copilot AI', 'Windows 11'],
  },
  {
    id: 'comp-002',
    title: 'msi Codex Z2 Gaming Desktop, AMD R7-8700F, RTX 5070, 32GB DDR5, 2TB SSD',
    subSpec: 'NVIDIA GeForce RTX 5070, USB Type-C, VR-Ready, Windows 11 Home, Model A8NVP-436US',
    category: 'Computers',
    subType: 'Gaming',
    brand: 'MSI',
    priceNP: 214999,
    originalPriceNP: 245000,
    priceIN: 135000,
    originalPriceIN: 155000,
    priceAE: 5899,
    originalPriceAE: 6500,
    rating: 4.3,
    reviews: 267,
    boughtCount: '300+ bought in past month',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['RTX 5070', 'VR-Ready', 'RGB Cooling'],
  },
  {
    id: 'comp-003',
    title: 'HP 27" All-in-One Touchscreen Desktop, AMD Ryzen 7, 16GB RAM, 1TB SSD',
    subSpec: '27-inch FHD IPS Micro-edge Touch, Wireless Keyboard & Mouse, Pop-up 5MP Privacy Camera, Windows 11',
    category: 'Computers',
    subType: 'All in 1',
    brand: 'HP',
    priceNP: 112000,
    originalPriceNP: 129000,
    priceIN: 72000,
    originalPriceIN: 82000,
    priceAE: 3100,
    originalPriceAE: 3500,
    rating: 4.6,
    reviews: 512,
    boughtCount: '200+ bought in past month',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['27" Touch IPS', 'Privacy Cam', 'Ryzen 7'],
  },
  {
    id: 'comp-004',
    title: 'Acer Chromebook Plus 515, Intel Core i3, 8GB LPDDR5X, 256GB UFS',
    subSpec: '15.6" Full HD IPS, 10-Hour Battery, Google AI Magic Eraser, Fast Charging, DTS Audio',
    category: 'Computers',
    subType: 'Chromebook',
    brand: 'Acer',
    priceNP: 42500,
    originalPriceNP: 49999,
    priceIN: 27999,
    originalPriceIN: 32000,
    priceAE: 1199,
    originalPriceAE: 1399,
    rating: 4.7,
    reviews: 890,
    boughtCount: '1K+ bought in past month',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Chromebook Plus', '10hr Battery', 'Google AI'],
  },
  {
    id: 'comp-005',
    title: 'Apple MacBook Air 13.6" Liquid Retina, Apple M3 Chip, 16GB Unified Memory, 512GB SSD',
    subSpec: 'Up to 18 Hours Battery Life, 1080p FaceTime HD Camera, Touch ID, Backlit Magic Keyboard - Midnight',
    category: 'Computers',
    subType: 'Laptops',
    brand: 'Apple',
    priceNP: 162000,
    originalPriceNP: 179900,
    priceIN: 104900,
    originalPriceIN: 119900,
    priceAE: 4499,
    originalPriceAE: 4899,
    rating: 4.9,
    reviews: 3410,
    boughtCount: '2K+ bought in past month',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Apple M3 Chip', 'Liquid Retina', '18hr Battery'],
  },
  {
    id: 'comp-006',
    title: 'Intel NUC 13 Pro Mini Desktop PC, Core i7-1360P, 32GB RAM, 1TB NVMe SSD',
    subSpec: 'Ultra Compact Form Factor, Dual Thunderbolt 4, Intel Iris Xe Graphics, 4K Quad Display Support',
    category: 'Computers',
    subType: 'Mini',
    brand: 'Intel',
    priceNP: 88000,
    originalPriceNP: 99000,
    priceIN: 55000,
    originalPriceIN: 62000,
    priceAE: 2399,
    originalPriceAE: 2699,
    rating: 4.4,
    reviews: 198,
    boughtCount: '100+ bought in past month',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Ultra Mini PC', 'Thunderbolt 4', 'Quad 4K'],
  },
  {
    id: 'comp-007',
    title: 'ASUS ROG Strix 32" QHD Curved Fast IPS Gaming Monitor, 240Hz, 1ms',
    subSpec: '2560x1440, DisplayHDR 600, G-SYNC Compatible, Aura Sync RGB Lighting, Height Adjustable Stand',
    category: 'Computers',
    subType: 'Gaming',
    brand: 'ASUS',
    priceNP: 68999,
    originalPriceNP: 79999,
    priceIN: 43999,
    originalPriceIN: 49999,
    priceAE: 1899,
    originalPriceAE: 2199,
    rating: 4.8,
    reviews: 430,
    boughtCount: '150+ bought in past month',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['240Hz 1ms', 'Curved QHD', 'G-SYNC'],
  },
];

export default function ProductsPage({ params }: ProductsPageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const code = (unwrappedParams.country || 'np').toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[CountryCode.NEPAL];

  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'computer';
  const categoryParam = searchParams.get('cat') || '';

  const [selectedPill, setSelectedPill] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currencySymbol =
    config.defaultCurrency === CurrencyCode.NPR
      ? 'रु'
      : config.defaultCurrency === CurrencyCode.INR
      ? '₹'
      : 'AED';

  // Subtype pills matching Image 5
  const narrowPills = [
    { label: 'All', icon: '🔍' },
    { label: 'Desktop', icon: '🖥️' },
    { label: 'Laptops', icon: '💻' },
    { label: 'All in 1', icon: '🖥️' },
    { label: 'Mini', icon: '📦' },
    { label: 'Chromebook', icon: '💻' },
    { label: 'Gaming', icon: '🎮' },
    { label: 'Business', icon: '🏢' },
    { label: 'Students', icon: '🎓' },
    { label: 'Home office', icon: '🏠' },
  ];

  const getPrice = (item: ProductItem) => {
    if (code === CountryCode.INDIA) return { current: item.priceIN, original: item.originalPriceIN };
    if (code === CountryCode.UAE) return { current: item.priceAE, original: item.originalPriceAE };
    return { current: item.priceNP, original: item.originalPriceNP };
  };

  const filteredCatalog = useMemo(() => {
    return COMPUTER_CATALOG.filter((item) => {
      // Subtype pill filter
      if (selectedPill !== 'All' && item.subType !== selectedPill) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && item.rating < minRating) {
        return false;
      }
      // Price Tier filter
      const price = getPrice(item).current;
      if (selectedTier === 'under35k') {
        if (code === 'NP' && price > 50000) return false;
        if (code === 'IN' && price > 35000) return false;
        if (code === 'AE' && price > 1500) return false;
      } else if (selectedTier === '35kto80k') {
        if (code === 'NP' && (price < 50000 || price > 100000)) return false;
        if (code === 'IN' && (price < 35000 || price > 70000)) return false;
        if (code === 'AE' && (price < 1500 || price > 3000)) return false;
      } else if (selectedTier === 'above80k') {
        if (code === 'NP' && price < 100000) return false;
        if (code === 'IN' && price < 70000) return false;
        if (code === 'AE' && price < 3000) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = getPrice(a).current;
      const priceB = getPrice(b).current;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedPill, minRating, selectedTier, sortBy, code]);

  const handleAddToCart = (title: string) => {
    setToastMessage(`कार्टमा थपियो: ${title}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header currentCountry={config.code} />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131921] text-white px-5 py-3 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Results Query Banner (Matches Image 5) */}
      <div className="border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-800">
              1-16 of over 80,000 results for{' '}
              <strong className="text-[#c45500] font-bold">&quot;{query}&quot;</strong>
              {categoryParam && <span className="text-slate-500"> in {categoryParam}</span>}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium outline-none cursor-pointer hover:bg-slate-200"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Search Layout */}
      <div className="flex-1 max-w-[1500px] mx-auto w-full px-4 py-4 flex gap-6">
        {/* Left Filters Sidebar (Matches Image 5) */}
        <aside className="w-56 shrink-0 hidden md:block text-xs space-y-6 select-none">
          {/* Popular Shopping Ideas */}
          <div>
            <h3 className="font-bold text-sm text-[#0f1111] mb-2">
              Popular Shopping Ideas
            </h3>
            <ul className="space-y-1.5 text-slate-700 font-medium">
              <li
                onClick={() => setSelectedPill('Desktop')}
                className="hover:text-[#c45500] cursor-pointer"
              >
                Desk &amp; PC Towers
              </li>
              <li
                onClick={() => setSelectedPill('Gaming')}
                className="hover:text-[#c45500] cursor-pointer"
              >
                32-inch Gaming Monitor
              </li>
              <li
                onClick={() => setSelectedPill('Laptops')}
                className="hover:text-[#c45500] cursor-pointer"
              >
                Windows 11 Laptops
              </li>
              <li
                onClick={() => setSelectedPill('Mini')}
                className="hover:text-[#c45500] cursor-pointer"
              >
                16GB / 32GB RAM Mini PC
              </li>
            </ul>
          </div>

          {/* Price Range Filter & Interactive Slider (Matches Image 5) */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-bold text-sm text-[#0f1111] mb-2">Price</h3>
            <div className="text-xs font-bold text-slate-900 mb-2">
              {currencySymbol} 400 - {currencySymbol} 2,50,000+
            </div>

            {/* Slider track visualization */}
            <div className="relative w-full h-1.5 bg-slate-200 rounded-full mb-3">
              <div className="absolute left-1/4 right-1/4 h-full bg-[#007185] rounded-full" />
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#007185] shadow-xs cursor-pointer" />
              <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#007185] shadow-xs cursor-pointer" />
            </div>

            <ul className="space-y-1 text-slate-700">
              <li
                onClick={() => setSelectedTier('all')}
                className={`cursor-pointer hover:text-[#c45500] ${selectedTier === 'all' ? 'font-bold text-[#c45500]' : ''}`}
              >
                All Prices
              </li>
              <li
                onClick={() => setSelectedTier('under35k')}
                className={`cursor-pointer hover:text-[#c45500] ${selectedTier === 'under35k' ? 'font-bold text-[#c45500]' : ''}`}
              >
                Up to {currencySymbol} {code === 'NP' ? '50,000' : code === 'IN' ? '35,000' : '1,500'}
              </li>
              <li
                onClick={() => setSelectedTier('35kto80k')}
                className={`cursor-pointer hover:text-[#c45500] ${selectedTier === '35kto80k' ? 'font-bold text-[#c45500]' : ''}`}
              >
                {currencySymbol} {code === 'NP' ? '50,000 to 1,00,000' : code === 'IN' ? '35,000 to 70,000' : '1,500 to 3,000'}
              </li>
              <li
                onClick={() => setSelectedTier('above80k')}
                className={`cursor-pointer hover:text-[#c45500] ${selectedTier === 'above80k' ? 'font-bold text-[#c45500]' : ''}`}
              >
                {currencySymbol} {code === 'NP' ? '1,00,000 & above' : code === 'IN' ? '70,000 & above' : '3,000 & above'}
              </li>
            </ul>
          </div>

          {/* Deals & Discounts (Matches Image 5) */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-bold text-sm text-[#0f1111] mb-2">
              Deals &amp; Discounts
            </h3>
            <ul className="space-y-1 text-slate-700">
              <li className="hover:text-[#c45500] cursor-pointer">All Discounts</li>
              <li className="hover:text-[#c45500] cursor-pointer">Buy More, Save More</li>
              <li className="hover:text-[#c45500] cursor-pointer text-amber-700 font-semibold">
                Coupons (DASHAIN2026, TIHAR500)
              </li>
              <li className="hover:text-[#c45500] cursor-pointer font-bold text-red-600">
                Today&apos;s Deals (दशैँ-तिहार महाअफर)
              </li>
            </ul>
          </div>

          {/* Customer Reviews (Matches Image 5) */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-bold text-sm text-[#0f1111] mb-2">
              Customer Reviews
            </h3>
            <ul className="space-y-1.5">
              <li
                onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                className={`flex items-center gap-1 cursor-pointer hover:text-[#c45500] ${minRating === 4 ? 'font-bold text-[#c45500]' : ''}`}
              >
                <span className="text-[#de7921] text-sm">★★★★☆</span>
                <span>&amp; Up</span>
              </li>
              <li
                onClick={() => setMinRating(minRating === 3 ? 0 : 3)}
                className={`flex items-center gap-1 cursor-pointer hover:text-[#c45500] ${minRating === 3 ? 'font-bold text-[#c45500]' : ''}`}
              >
                <span className="text-[#de7921] text-sm">★★★☆☆</span>
                <span>&amp; Up</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Main Results Section (Matches Image 5) */}
        <section className="flex-1 min-w-0">
          {/* "Narrow your search" Horizontal Tag Pills Strip (Matches Image 5) */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-[#0f1111] mb-3">
              Narrow your search
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {narrowPills.map((pill) => {
                const isActive = selectedPill === pill.label;
                return (
                  <button
                    key={pill.label}
                    onClick={() => setSelectedPill(pill.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results List Heading */}
          <div className="mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0f1111]">Results</h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredCatalog.length} products
            </span>
          </div>

          {/* Product Items List (Exact visual match of Image 5) */}
          <div className="space-y-6">
            {filteredCatalog.map((product) => {
              const { current, original } = getPrice(product);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5"
                >
                  {/* Product Image on Left (with badges) */}
                  <div className="relative w-full sm:w-60 h-48 sm:h-52 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge Chips matching Image 5 */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badges.slice(0, 2).map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Product Details on Right (Matches Image 5) */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h4 className="text-base font-medium text-[#0f1111] hover:text-[#c45500] cursor-pointer line-clamp-2 leading-snug">
                        {product.title}
                      </h4>

                      {/* Sub-spec description */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.subSpec}
                      </p>

                      {/* Star Rating & Reviews */}
                      <div className="flex items-center gap-1.5 mt-2 text-xs">
                        <span className="font-bold text-slate-800">{product.rating}</span>
                        <div className="text-[#de7921]">
                          ★★★★☆
                        </div>
                        <span className="text-[#007185] hover:underline cursor-pointer">
                          ({product.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Social proof: 500+ bought in past month */}
                      <div className="text-[11px] text-slate-500 mt-1">
                        {product.boughtCount}
                      </div>
                    </div>

                    {/* Price & Actions Bottom Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#0f1111]">
                            {currencySymbol} {current.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {currencySymbol} {original.toLocaleString()}
                          </span>
                          {product.prime && (
                            <span className="text-xs font-bold text-[#007185] italic">
                              prime
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Delivery by <b className="text-slate-700">Tomorrow</b> &bull; FREE Delivery
                        </span>
                      </div>

                      {/* See options & Add to cart buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${code.toLowerCase()}/products/${product.id}`}
                          className="px-4 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          See options
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product.title)}
                          className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Amazon Footer */}
      <AmazonFooter countryCode={config.code} />
    </div>
  );
}
