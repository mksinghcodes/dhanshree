'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountryCode, CurrencyCode, UserRole } from '@dhanshree/shared';
import { SellerNav } from '../../../components/SellerNav';
import { useResolvedParams } from '@/lib/params';
import { useAuth } from '@/context/AuthContext';

interface PageProps {
  params: any;
}

export default function SellerDashboardPage({ params }: PageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const countryParam = (unwrappedParams.country || 'np').toUpperCase();

  const { currentUser, switchUser } = useAuth();

  const countryCode =
    countryParam === 'IN'
      ? CountryCode.INDIA
      : countryParam === 'AE'
      ? CountryCode.UAE
      : CountryCode.NEPAL;

  const [activeDiscountCampaign, setActiveDiscountCampaign] = useState<string | null>('दशैँ धमाका १५% छुट सक्रिय');
  const [expressPayoutRequested, setExpressPayoutRequested] = useState(false);
  const [goldenBadgeActive, setGoldenBadgeActive] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const config = {
    NP: {
      currency: 'NPR',
      symbol: 'रु',
      countryName: 'नेपाल स्टोर (Nepal Storefront)',
      taxIdentifier: 'PAN 601992819',
      authority: 'Inland Revenue Department (IRD) Nepal',
      revenue: 1845000,
      aov: 11250,
      escrow: 345000,
      availablePayout: 520000,
      courierPartner: 'Nepal CanShip & Express Logistics',
    },
    IN: {
      currency: 'INR',
      symbol: '₹',
      countryName: 'भारत स्टोर (India Storefront)',
      taxIdentifier: 'GSTIN 27AABCS1429B1Z8',
      authority: 'Goods & Services Tax Network (GSTN)',
      revenue: 1153125,
      aov: 7031,
      escrow: 215625,
      availablePayout: 325000,
      courierPartner: 'Delhivery Surface Express',
      tcsWithheld: '₹ 11,531 (1% Section 52 TCS)',
    },
    AE: {
      currency: 'AED',
      symbol: 'AED',
      countryName: 'युएई स्टोर (UAE Storefront)',
      taxIdentifier: 'TRN 100488291000003',
      authority: 'Federal Tax Authority (FTA) UAE',
      revenue: 49815,
      aov: 303,
      escrow: 9315,
      availablePayout: 14040,
      courierPartner: 'Aramex Priority Express Dubai',
    },
  }[countryCode];

  const handleApplyCampaign = (campaignName: string) => {
    setActiveDiscountCampaign(campaignName);
    setFeedbackToast(`सफलतापूर्वक लागू भयो: "${campaignName}" तपाईंको सबै ४८ उत्पादनमा सक्रिय गरियो!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleRequestExpressPayout = () => {
    setExpressPayoutRequested(true);
    setFeedbackToast(
      `२४-घण्टे द्रुत निकासी अनुरोध प्राप्त भयो: ${config.symbol} ${config.availablePayout.toLocaleString()} तपाईंको बैंक खातामा २४ घण्टाभित्र जम्मा हुनेछ। (०% कमिसन कटौति)`
    );
    setTimeout(() => setFeedbackToast(null), 4500);
  };

  const isSellerRole = currentUser.role === UserRole.SELLER;

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans">
      <SellerNav countryCode={countryCode} />

      {/* Floating feedback toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="text-xl">✨</span>
          <span className="text-xs font-bold text-amber-300">{feedbackToast}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Warning & 1-Click Switcher if not currently logged in as a Seller */}
        {!isSellerRole && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>
                तपाईं हाल <strong>{currentUser.nameNepali} ({currentUser.roleLabelNepali})</strong> को रूपमा लगईन हुनुहुन्छ। 
                व्यपारी सुविधाहरू पूर्ण परीक्षण गर्न राजेश श्रेष्ठ (बिक्रेता) खातामा स्विच गर्नुहोस्।
              </span>
            </div>
            <button
              onClick={() => switchUser('usr-seller-01')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl whitespace-nowrap shadow-xs"
            >
              राजेश श्रेष्ठ (Seller) मा स्विच गर्नुहोस् →
            </button>
          </div>
        )}

        {/* FESTIVE MERCHANT GOLDEN PRIVILEGE BANNER (दशैँ-तिहार-छठ बिशेष सुविधा) */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-red-700 rounded-3xl p-6 text-white shadow-xl mb-8 border border-amber-300/40 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                <span>🏮</span> चाडपर्व व्यपारी महा-सुविधा (Festive Merchant Privileges 2083)
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-300 text-slate-950 text-xs font-black">
                दशैँ देखि छठसम्म मान्य
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
              {/* Privilege 1: 0% Commission */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">💰</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                    सक्रिय (Active)
                  </span>
                </div>
                <h2 className="text-xl font-black text-amber-300">०% प्लेटफर्म कमिसन</h2>
                <p className="text-xs text-slate-200 mt-1">
                  सामान्य १०% कमिसन पूर्ण रूपमा मिनाहा। चाडपर्वमा भएको सबै बिक्रीको १००% रकम व्यपारीकै खातामा!
                </p>
              </div>

              {/* Privilege 2: 24h Express Payout */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">⚡</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-400 text-slate-950">
                    २४ घण्टे सुविधा
                  </span>
                </div>
                <h2 className="text-xl font-black text-white">२४ घण्टे द्रुत भुक्तानी</h2>
                <p className="text-xs text-slate-200 mt-1">
                  सामान्य ७-दिनको Escrow होल्डको सट्टा २४ घण्टामै बैंक निकासा। सामान पुनःस्टक गर्न सहज नगद प्रवाह।
                </p>
              </div>

              {/* Privilege 3: Golden Badge */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">🌟</span>
                  <button
                    onClick={() => {
                      setGoldenBadgeActive(!goldenBadgeActive);
                      setFeedbackToast(
                        goldenBadgeActive ? 'गोल्डेन ब्याच बन्द गरियो' : 'गोल्डेन ब्याच सक्रिय गरियो! ३ गुणा बढी भिजिटर'
                      );
                    }}
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                  >
                    {goldenBadgeActive ? 'सक्रिय ✓' : 'सक्रिय गर्नुहोस्'}
                  </button>
                </div>
                <h2 className="text-xl font-black text-amber-300">दशैँ धमाका गोल्डेन ब्याजिङ</h2>
                <p className="text-xs text-slate-200 mt-1">
                  तपाईंका सामानहरू खोज नतिजामा ३ गुणा माथि देखाउन विशेष सुनौलो ब्याच सक्रिय छ।
                </p>
              </div>
            </div>

            {/* Quick 1-Click Festive Campaign Tool */}
            <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-extrabold text-amber-200">१-क्लिक चाडपर्व छुट अभियान:</span>
                <span className="text-slate-200 ml-1.5">
                  आफ्नो सम्पूर्ण पसलका सामानमा एकै क्लिकमा चाडपर्व अफर लागू गर्नुहोस्:
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  onClick={() => handleApplyCampaign('दशैँ धमाका १५% छुट')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    activeDiscountCampaign === 'दशैँ धमाका १५% छुट'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  }`}
                >
                  १५% दशैँ धमाका
                </button>
                <button
                  onClick={() => handleApplyCampaign('तिहार २०% महाबचत')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    activeDiscountCampaign === 'तिहार २०% महाबचत'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  }`}
                >
                  २०% तिहार महाबचत
                </button>
                <button
                  onClick={() => handleApplyCampaign('छठ २५% बिशेष अफर')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    activeDiscountCampaign === 'छठ २५% बिशेष अफर'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  }`}
                >
                  २५% छठ अफर
                </button>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Welcome & Store Health Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                बिक्रेता कार्यसम्पादन ड्यासबोर्ड (Seller Performance Hub)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                पसल सक्रिय र प्रमाणित
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              बिक्रेता: <span className="font-semibold text-slate-800">{currentUser.nameNepali || 'राजेश श्रेष्ठ'}</span> • 
              पसल: <span className="font-semibold text-slate-800">{currentUser.storeName || 'Himalayan Flagship Emporium'}</span> • 
              दर्ता: <span className="font-mono font-semibold text-slate-800">{config.taxIdentifier}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${countryCode.toLowerCase()}/seller/products`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <span>+ नयाँ सामान थप्नुहोस्</span>
            </Link>
            <button
              onClick={handleRequestExpressPayout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl text-xs font-black hover:from-red-500 hover:to-amber-500 shadow-md shadow-red-500/20 transition-all"
            >
              <span>⚡ २४-घण्टे द्रुत निकासी अनुरोध</span>
            </button>
          </div>
        </div>

        {/* Top KPI Cards (4-column grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Gross Sales */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">कुल बिक्री (Gross Sales 30d)</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">+28.4% चाडपर्व वृद्धि</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {config.symbol} {config.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>चाडपर्व अर्डर: <b className="text-slate-700">164</b></span>
              <span>औसत अर्डर: <b className="text-slate-700">{config.symbol} {config.aov.toLocaleString()}</b></span>
            </div>
          </div>

          {/* Card 2: Available Payout */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">निकासीको लागि तयार (Ready Payout)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">
              {config.symbol} {config.availablePayout.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>कमिसन छुट:</span>
              <span className="font-bold text-emerald-600">०% (बचत भयो)</span>
            </div>
          </div>

          {/* Card 3: Pending Shipments */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">प्याक गर्न बाँकी अर्डर</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">प्राथमिकता</span>
            </div>
            <div className="text-2xl font-black text-amber-600 tracking-tight">
              २ अर्डर
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>कुरियर:</span>
              <span className="font-medium text-slate-700 truncate max-w-[150px]">{config.courierPartner}</span>
            </div>
          </div>

          {/* Card 4: Store Quality & Rating */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">ग्राहक सन्तुष्टि तथा रेटिङ</span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>4.88</span>
              <span className="text-xs font-normal text-slate-400">/ 5.0 (382 ग्राहक समीक्षा)</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>RTO फिर्ता दर:</span>
              <span className="font-bold text-emerald-600">१.२% (उत्कृष्ट)</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Orders Pipeline & Tax Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders Action Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">चाडपर्व अर्डर डिस्प्याच पाइपलाइन</h2>
                <p className="text-xs text-slate-500">चाडपर्व अर्डरहरू २४ घण्टाभित्र प्याक गरी कुरियरलाई हस्तान्तरण गर्नुहोस्</p>
              </div>
              <Link
                href={`/${countryCode.toLowerCase()}/seller/orders`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                सबै अर्डरहरू हेर्नुहोस् →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">ORD-2026-NP-89215</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      भुक्तानी सम्पन्न (Escrow Protected)
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    ग्राहक: <b className="text-slate-700">Pooja Shrestha</b> • पोखरा (वार्ड ६, लेकसाइड)
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    १x Sony WH-1000XM5 Wireless Headphones (Platinum Silver)
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-slate-900">
                    {config.symbol} {config.currency === 'INR' ? '29,999' : config.currency === 'AED' ? '1,299' : '44,999'}
                  </div>
                  <Link
                    href={`/${countryCode.toLowerCase()}/seller/orders`}
                    className="inline-block mt-2 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    प्याक तथा शिपिङ लेबल प्रिन्ट
                  </Link>
                </div>
              </div>

              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">ORD-2026-NP-89211</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      डेलिभरीमा छ (In Transit)
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    ग्राहक: <b className="text-slate-700">Manoj Singh</b> • काठमाडौँ (वार्ड ४, बालुवाटार)
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    AWB: <span className="font-mono font-semibold text-slate-800">CAN-NP-99821447</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-slate-900">
                    {config.symbol} {config.currency === 'INR' ? '29,999' : config.currency === 'AED' ? '1,299' : '44,999'}
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                    लेबल डिस्प्याच भइसक्यो
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Tax Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  §
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">कर तथा नियमन स्थिति (Tax Status)</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">१००% पूर्ण प्रमाणित</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 mt-4">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>नियमन निकाय:</span>
                  <span className="font-medium text-slate-900">{config.authority}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>PAN/VAT दर्ता नं:</span>
                  <span className="font-mono font-bold text-slate-900">{config.taxIdentifier}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-semibold">
                  <span>चाडपर्व कमिसन:</span>
                  <span>०% (दशैँ-तिहार महाअफर)</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                सबै अर्डरहरूको आधिकारिक इलेक्ट्रोनिक बिल (VAT Invoice) स्वतः जारी भई कर प्रणालीमा सुरक्षित हुन्छ।
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
