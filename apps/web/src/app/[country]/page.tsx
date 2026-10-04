import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { COUNTRY_CONFIGS, CountryCode } from '@dhanshree/shared';

interface CountryPageProps {
  params: {
    country: string;
  };
}

export default function CountryStorefront({ params }: CountryPageProps) {
  const code = params.country.toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code];

  if (!config) {
    notFound();
  }

  const sampleProducts = [
    {
      id: 'prod-001',
      title: 'Ultra-thin Noise Cancelling Wireless Headphones',
      price: code === CountryCode.NEPAL ? 14999 : code === CountryCode.INDIA ? 9999 : 449,
      originalPrice: code === CountryCode.NEPAL ? 19999 : code === CountryCode.INDIA ? 13999 : 599,
      rating: 4.8,
      reviews: 142,
      store: 'TechElite Store',
      tag: 'Best Seller',
    },
    {
      id: 'prod-002',
      title: 'Premium Organic Himalayan Green Tea & Spice Set',
      price: code === CountryCode.NEPAL ? 1250 : code === CountryCode.INDIA ? 799 : 45,
      originalPrice: code === CountryCode.NEPAL ? 1600 : code === CountryCode.INDIA ? 999 : 60,
      rating: 4.9,
      reviews: 88,
      store: 'Himalayan Organics',
      tag: 'Festive Deal',
    },
    {
      id: 'prod-003',
      title: 'Smart Fitness Tracker with AMOLED Display & GPS',
      price: code === CountryCode.NEPAL ? 5499 : code === CountryCode.INDIA ? 3499 : 159,
      originalPrice: code === CountryCode.NEPAL ? 7500 : code === CountryCode.INDIA ? 4999 : 220,
      rating: 4.6,
      reviews: 310,
      store: 'WearableHub Official',
      tag: 'Top Rated',
    },
  ];

  const currencySymbol =
    config.defaultCurrency === 'NPR'
      ? 'रु'
      : config.defaultCurrency === 'INR'
      ? '₹'
      : 'AED';

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentCountry={config.code} />

      {/* Localized Notification Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center">
        <span>
          Welcome to the <strong>{config.name}</strong> ({config.nativeName}) storefront &bull; Prices in{' '}
          <strong>{config.defaultCurrency}</strong> &bull; {config.taxLabel} compliant
        </span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Country Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">
                {config.code === 'NP' ? '🇳🇵' : config.code === 'IN' ? '🇮🇳' : '🇦🇪'}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">{config.name} Marketplace</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  Subpath: /{params.country} &bull; Native: {config.nativeName} &bull; Currency: {config.defaultCurrency}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 border border-white/10 font-medium">
              Tax: {config.taxRegistrationName}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              COD Cap: {currencySymbol} {config.codMaxOrderLimit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Localized Payment Gateways Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Accepted Local Payment Adapters:
            </span>
            <div className="flex flex-wrap gap-2">
              {config.supportedPaymentMethods.map((pm) => (
                <span
                  key={pm}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Localized Catalog Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Featured Deals in {config.name}</h2>
            <span className="text-xs text-slate-500">Live multi-currency & tax calculated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {p.tag}
                    </span>
                    <span className="text-xs text-slate-400">{p.store}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <span className="text-amber-500">★</span>
                    <span className="font-bold text-slate-800">{p.rating}</span>
                    <span className="text-slate-400">({p.reviews} reviews)</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        {currencySymbol} {p.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {currencySymbol} {p.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Includes {config.taxLabel}
                    </span>
                  </div>

                  <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 inline-flex items-center gap-1.5"
          >
            &larr; Return to Global Hub & Switch Storefront
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        Dhanshree {config.name} Regional Storefront &bull; Connected to PostgreSQL & Redis
      </footer>
    </div>
  );
}
