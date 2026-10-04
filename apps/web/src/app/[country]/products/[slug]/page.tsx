'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { COUNTRY_CONFIGS, CountryCode, CurrencyCode } from '@dhanshree/shared';

interface ProductDetailPageProps {
  params: {
    country: string;
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const code = params.country.toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code];

  if (!config) {
    notFound();
  }

  // Active state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedCartFeedback, setAddedCartFeedback] = useState(false);

  const currencySymbol =
    config.defaultCurrency === CurrencyCode.NPR
      ? 'रु'
      : config.defaultCurrency === CurrencyCode.INR
      ? '₹'
      : 'AED';

  // Localized pricing
  const pricing = {
    price: code === 'NP' ? 44999 : code === 'IN' ? 29999 : 1299,
    originalPrice: code === 'NP' ? 49999 : code === 'IN' ? 34999 : 1399,
    discount: code === 'NP' ? '10% OFF' : code === 'IN' ? '14% OFF' : '7% OFF',
  };

  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
  ];

  const handleAddToCart = () => {
    setAddedCartFeedback(true);
    setTimeout(() => setAddedCartFeedback(false), 3000);
  };

  // schema.org JSON-LD structured data for Google SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Sony WH-1000XM5 Premium Wireless Noise Cancelling Headphones',
    image: images,
    description: 'Flagship wireless over-ear headphones with industry-leading dual-chip ANC and 30hr battery',
    sku: 'SONY-WH1000XM5-BLK',
    brand: {
      '@type': 'Brand',
      name: 'Sony',
    },
    offers: {
      '@type': 'Offer',
      url: `https://Dhanshree.com/${params.country}/products/${params.slug}`,
      priceCurrency: config.defaultCurrency,
      price: pricing.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '324',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Schema.org Product Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header currentCountry={config.code} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href={`/${config.code.toLowerCase()}`} className="hover:text-blue-600">
            {config.name}
          </Link>
          <span>/</span>
          <Link href={`/${config.code.toLowerCase()}/products`} className="hover:text-blue-600">
            Electronics
          </Link>
          <span>/</span>
          <Link href={`/${config.code.toLowerCase()}/products?categorySlug=audio-headphones`} className="hover:text-blue-600">
            Headphones & Audio
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate">
            Sony WH-1000XM5 Wireless Headphones
          </span>
        </nav>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        {/* TOP PRODUCT HERO SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* GALLERY (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                <img
                  src={images[selectedImageIndex]}
                  alt="Product view"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-xs font-bold backdrop-blur-md">
                  HD Zoom Active
                </span>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-blue-600 scale-95 shadow-md'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT DETAILS (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Sony Official Store
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-xs text-slate-400">SKU: WH-1000XM5</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  Sony WH-1000XM5 Premium Wireless Noise Cancelling Headphones
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex text-amber-500 font-bold">
                    <span>★★★★★</span>
                  </div>
                  <span className="font-bold text-slate-800">4.8</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-blue-600 font-medium">324 ratings &bull; 88 answered Q&As</span>
                </div>
              </div>

              {/* Price section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    {currencySymbol} {pricing.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    {currencySymbol} {pricing.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                    {pricing.discount}
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold block">
                  {config.taxLabel} compliant &bull; Official Manufacturer Warranty
                </span>
              </div>

              {/* Color variant picker */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Select Color: <span className="font-normal text-slate-900">{selectedColor}</span>
                </span>
                <div className="flex gap-2">
                  {['Midnight Black', 'Platinum Silver'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        selectedColor === col
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs highlights */}
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Industry-leading Dual Processor ANC with 8 Microphones
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Up to 30-hour battery life with 3-minute ultra quick-charging
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Multipoint connection: Seamlessly switch between phone and laptop
                </li>
              </ul>
            </div>

            {/* BUY BOX & LOGISTICS PROMISE (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
                {/* Stock status */}
                <div>
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock (45 units ready to ship)
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Fulfilled via {config.name} Central Logistics Hub
                  </span>
                </div>

                {/* Country Logistics Estimate */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">
                    🚀 {config.name} Delivery Timeline:
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {code === 'NP'
                      ? 'Guaranteed Delivery in Kathmandu Valley within 24h via Pathao Express.'
                      : code === 'IN'
                      ? 'Dispatches within 12h via Delhivery Express (1-2 days across Maharashtra).'
                      : 'Express 3-Hour Delivery across Dubai & Abu Dhabi via Aramex Fleet.'}
                  </p>
                </div>

                {/* Quantity */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} units
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🛒 Add to Cart</span>
                  </button>

                  <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all">
                    ⚡ Buy Now
                  </button>
                </div>

                {/* Added feedback */}
                {addedCartFeedback && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center font-bold text-[11px] animate-in fade-in">
                    Added {quantity} item(s) to Cart!
                  </div>
                )}

                {/* Trust Badges */}
                <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Marketplace Escrow Protected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🔄</span>
                    <span>7-Day Hassle-Free Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>💳</span>
                    <span>COD & Local Gateway Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
            Frequently Bought Together
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={images[0]}
                  alt="Headphones"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Sony WH-1000XM5</span>
                  <span className="text-blue-600 font-bold">
                    {currencySymbol} {pricing.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <span className="text-slate-400 font-bold text-lg">+</span>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120"
                  alt="Case"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Hard Shell Travel Case</span>
                  <span className="text-blue-600 font-bold">
                    {currencySymbol} {(pricing.price * 0.08).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Bundle Price:</span>
                <span className="text-xl font-black text-slate-900">
                  {currencySymbol} {(pricing.price * 1.08).toFixed(0)}
                </span>
              </div>
              <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">
                Add Bundle to Cart
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS & RATING BREAKDOWN */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6">
            Customer Reviews & Verified Feedback
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-100">
            {/* Rating Score */}
            <div className="lg:col-span-4 text-center lg:text-left space-y-1">
              <span className="text-5xl font-black text-slate-900">4.8</span>
              <div className="text-amber-500 text-lg">★★★★★</div>
              <span className="text-xs text-slate-500 block">Based on 324 customer ratings</span>
            </div>

            {/* Rating Bar Breakdown */}
            <div className="lg:col-span-8 space-y-2 text-xs">
              {[
                { stars: 5, pct: '82%' },
                { stars: 4, pct: '12%' },
                { stars: 3, pct: '4%' },
                { stars: 2, pct: '2%' },
                { stars: 1, pct: '0%' },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="w-12 font-medium text-slate-600">{row.stars} Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="w-10 text-right text-slate-400">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews List */}
          <div className="mt-8 space-y-6 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Bibek Sharma</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-100">
                  Verified {config.name} Buyer
                </span>
                <span className="text-slate-400 text-[11px]">&bull; September 2026</span>
              </div>
              <div className="text-amber-500">★★★★★</div>
              <h4 className="font-bold text-slate-900 text-xs">
                Best ANC headphones I have ever owned!
              </h4>
              <p className="text-slate-600 leading-relaxed">
                The noise cancellation completely blocks out Kathmandu traffic and bike noise. Sound
                stage is wide and battery easily lasted 4 full work days without a charge.
              </p>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Tariq Al-Mansoor</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-100">
                  Verified Buyer
                </span>
                <span className="text-slate-400 text-[11px]">&bull; August 2026</span>
              </div>
              <div className="text-amber-500">★★★★★</div>
              <h4 className="font-bold text-slate-900 text-xs">Fast delivery and crystal clear audio</h4>
              <p className="text-slate-600 leading-relaxed">
                Received in Dubai within 3 hours. Packaging was pristine and works smoothly with both my
                iPhone and MacBook.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
