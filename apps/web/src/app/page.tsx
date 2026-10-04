import React from 'react';
import { Header } from '@/components/Header';
import { CountryCard } from '@/components/CountryCard';

export default function HomePage() {
  const regions = [
    {
      countryCode: 'NP',
      name: 'Nepal',
      nativeName: 'नेपाल Storefront',
      flag: '🇳🇵',
      currency: 'NPR (रु)',
      languages: 'Nepali (नेपाली), English',
      tax: 'Nepal VAT (13%), PAN / VAT Invoicing',
      paymentGateways: ['eSewa', 'Khalti', 'Fonepay QR', 'IME Pay', 'ConnectIPS', 'COD'],
      addressStructure: [
        'Province 1-7 (e.g. Bagmati)',
        'District (e.g. Kathmandu)',
        'Municipality / Nagarpalika',
        'Ward No. (1-32) & Tole / Street',
      ],
      accentColor: 'bg-red-600',
    },
    {
      countryCode: 'IN',
      name: 'India',
      nativeName: 'भारत Storefront',
      flag: '🇮🇳',
      currency: 'INR (₹)',
      languages: 'Hindi (हिन्दी), English',
      tax: 'GST (CGST + SGST / IGST), HSN Code, 1% TCS',
      paymentGateways: ['UPI (GPay/PhonePe)', 'Razorpay', 'Cashfree', 'PayU', 'NetBanking', 'COD'],
      addressStructure: [
        'State / Union Territory',
        'District / City',
        '6-digit PIN code validation',
        'Street, Flat / House / Landmark',
      ],
      accentColor: 'bg-amber-500',
    },
    {
      countryCode: 'AE',
      name: 'UAE (Dubai)',
      nativeName: 'الإمارات Storefront',
      flag: '🇦🇪',
      currency: 'AED (د.إ)',
      languages: 'Arabic (العربية - RTL), English',
      tax: 'UAE 5% VAT with TRN, Bilingual Invoicing',
      paymentGateways: ['Stripe Cards', 'Apple Pay', 'Google Pay', 'Tabby (BNPL)', 'Tamara', 'COD'],
      addressStructure: [
        'Emirate (Dubai, Abu Dhabi, etc.)',
        'Area / Neighborhood (Downtown, Marina)',
        'Building / Villa & Flat Number',
        '10-digit Makani Number & PO Box',
      ],
      accentColor: 'bg-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl mb-12">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Phase 2: Auth, RBAC & Multi-Country Config (Currency, Language, Tax) Active
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              One Unified Core Engine. <br />
              <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Three Localized Marketplaces.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Engineered to rival Amazon, Flipkart, and Alibaba with full support for
              multi-vendor stores, eBay-style auctions, RFQ wholesale, and escrow split payments
              tailored specifically for Nepal, India, and the UAE.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href="http://localhost:4000/health"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Verify Backend Health Check</span>
                <span className="text-xs bg-blue-700 px-2 py-0.5 rounded-md font-mono">:4000</span>
              </a>
              <a
                href="http://localhost:4000/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
              >
                Explore Swagger API Docs
              </a>
            </div>
          </div>

          {/* Decorative Background Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 3 Country Storefronts */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Localized Country Storefronts
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Independent domains/subpaths, currency calculations, localized tax rules, and local courier integrations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <CountryCard key={region.countryCode} {...region} />
            ))}
          </div>
        </div>

        {/* Global Architecture Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Marketplace Multi-Region Architectural Foundations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                01. Pluggable Payments
              </span>
              <p className="text-xs text-slate-600 mt-1">
                Seamless routing across Nepal (eSewa, Khalti, Fonepay), India (UPI, Razorpay, NetBanking), and UAE (Stripe, Tabby BNPL, Apple Pay).
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                02. Multi-Country Tax Engine
              </span>
              <p className="text-xs text-slate-600 mt-1">
                Automated calculation of Nepal 13% VAT, India intra/interstate GST (CGST/SGST/IGST + 1% TCS), and UAE 5% VAT with TRN.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
                03. Escrow & Split Payouts
              </span>
              <p className="text-xs text-slate-600 mt-1">
                Marketplace escrow hold on orders with automated deduction of platform commission, local tax withholdings, and release to seller bank accounts.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                04. High-Risk COD Engine
              </span>
              <p className="text-xs text-slate-600 mt-1">
                Fraud risk scoring for Cash on Delivery orders, OTP confirmation before dispatch, and order-value threshold controls per country.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        Dhanshree World-Class Multi-Vendor Architecture &bull; Nepal &bull; India &bull; UAE &bull; Phase 1 Foundation
      </footer>
    </div>
  );
}
