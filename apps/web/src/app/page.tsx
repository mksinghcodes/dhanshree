'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { CountryCard } from '@/components/CountryCard';
import { useAuth, MOCK_PERSONAS } from '@/context/AuthContext';
import { UserRole } from '@dhanshree/shared';

export default function HomePage() {
  const { currentUser, switchUser } = useAuth();

  const regions = [
    {
      countryCode: 'NP',
      name: 'Nepal',
      nativeName: 'नेपाल स्टोर (दशैँ-तिहार-छठ अफर)',
      flag: '🇳🇵',
      currency: 'NPR (रु)',
      languages: 'Nepali (नेपाली), English',
      tax: 'Nepal VAT (13%), PAN / IRD Certified Invoicing',
      paymentGateways: ['eSewa', 'Khalti', 'Fonepay QR', 'IME Pay', 'ConnectIPS', 'Cash on Delivery'],
      addressStructure: [
        'Province 1-7 (e.g. Bagmati)',
        'District (e.g. Kathmandu, Kaski)',
        'Municipality / Nagarpalika',
        'Ward No. (1-32) & Tole / Street',
      ],
      accentColor: 'bg-red-600',
    },
    {
      countryCode: 'IN',
      name: 'India',
      nativeName: 'भारत स्टोर (दिवाली महाबचत)',
      flag: '🇮🇳',
      currency: 'INR (₹)',
      languages: 'Hindi (हिन्दी), English',
      tax: 'GST (CGST + SGST / IGST), HSN Code, 1% Section 52 TCS',
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
      nativeName: 'الإمارات स्टोर (Dubai Shopping Hub)',
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
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* 1. MOCK TESTING ROLE CONSOLE BAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h2 className="text-base font-extrabold text-slate-900">
                  बहु-प्रयोगकर्ता मोक परीक्षण कन्सोल (Multi-User Mock Testing Console)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold border border-blue-200">
                  Live Testing Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                विभिन्न युजर भूमिकाबाट लगईन गरी प्लेटफर्मका सबै फिचर, समान किन्न र बेच्नका सुविधाहरू तत्काल परीक्षण गर्नुहोस्।
              </p>
            </div>

            {/* Currently Active Mock Identity Callout */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900">{currentUser.nameNepali}</span>
                  <span className="text-[10px] text-slate-400">({currentUser.name})</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 block">
                  भूमिका: {currentUser.roleLabelNepali} • {currentUser.balanceFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* 1-Click Role Switcher Quick Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {MOCK_PERSONAS.map((persona) => {
              const isActive = currentUser.id === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => switchUser(persona.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-600/20 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{persona.avatar}</span>
                    <div className="text-xs">
                      <div className={`font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {persona.nameNepali}
                      </div>
                      <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {persona.roleLabelNepali}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                    {isActive ? '✓ सक्रिय' : 'स्विच'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Context Action for Active Persona */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              सक्रिय युजर अनुसार उपयुक्त पृष्ठ खोल्नुहोस्:
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/np"
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg border border-rose-200 flex items-center gap-1 transition-colors"
              >
                <span>🏮</span> दशैँ-तिहार बजार (समान किन्नुहोस्)
              </Link>
              <Link
                href="/np/seller"
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <span>🏪</span> व्यपारी प्यानल (०% कमिसनमा बेच्नुहोस्)
              </Link>
              <Link
                href="/np/admin"
                className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>🛡️</span> सुपर एडमिन प्यानल
              </Link>
            </div>
          </div>
        </div>

        {/* 2. GRAND FESTIVE HERO BANNER (दशैँ, तिहार तथा छठ २०८३) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 p-8 sm:p-12 text-white shadow-xl mb-12 border border-amber-300/30">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-black border border-amber-300/40 mb-4 backdrop-blur-md">
              <span className="animate-spin text-sm">✨</span>
              दशैँ, तिहार तथा छठ महाबचत महोत्सव २०८३ | विशेष चाडपर्व अफर
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              समान किन्न र बेच्न, <br />
              <span className="text-amber-300">
                दक्षिण एसिया तथा गल्फको
              </span> नम्बर १ डिजिटल बजार!
            </h1>

            <p className="mt-4 text-base sm:text-lg text-red-100 leading-relaxed">
              नेपाल 🇳🇵, भारत 🇮🇳 र युएई (दुबई) 🇦🇪 लाई एउटै डिजिटल कोरिडोरमा जोड्दै: 
              ग्राहकलाई <strong className="text-white">२०% कूपन छुट</strong> र व्यपारीहरूलाई 
              <strong className="text-amber-300"> ०% प्लेटफर्म कमिसन तथा २४-घण्टे द्रुत बैंक भुक्तानी</strong>।
            </p>

            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <Link
                href="/np"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2"
              >
                <span>नेपाल स्टोरमा किनमेल गर्नुहोस्</span>
                <span>🇳🇵 →</span>
              </Link>

              <Link
                href="/np/seller"
                className="px-6 py-3 bg-black/40 hover:bg-black/50 text-white font-extrabold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <span>🏪 व्यपारी बनेर सामान बेच्नुहोस् (०% कमिसन)</span>
              </Link>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 bg-red-950/40 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 3. THREE REGIONAL STOREFRONTS */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                क्षेत्रीय बजार स्टोरफ्रन्टहरू (Localized Country Storefronts)
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                प्रत्येक देशका लागि स्वतन्त्र मुद्रा, स्थानीय कर गणना (VAT/GST), र प्रमाणित स्थानीय भुक्तानी गेटवेहरू।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <CountryCard key={region.countryCode} {...region} />
            ))}
          </div>
        </div>

        {/* 4. FESTIVE SPECIAL MATRIX (समान किन्न र बेच्नका सुविधाहरू) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black text-rose-600 uppercase tracking-wider block mb-1">
                चाडपर्व बिशेष सुविधाहरू २०८३
              </span>
              <h3 className="text-xl font-black text-slate-900">
                ग्राहक र व्यपारी दुवैका लागि अद्वितीय फाइदाहरू
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              ✓ सबै सुविधाहरू प्रणालीमा सक्रिय छन्
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="p-5 bg-gradient-to-b from-red-50/60 to-white rounded-2xl border border-red-100">
              <span className="text-2xl block mb-2">🏷️</span>
              <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider block mb-1">
                १. ग्राहकलाई भारी कूपन छुट
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                दशैँ, तिहार र छठका लागि DASHAIN2026 (२०%), TIHAR500 (रु ५००), र CHHATH20 (२०%) बाट तत्काल छुट तथा निशुल्क डेलिभरी।
              </p>
            </div>

            <div className="p-5 bg-gradient-to-b from-amber-50/60 to-white rounded-2xl border border-amber-100">
              <span className="text-2xl block mb-2">🏪</span>
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
                २. व्यपारीलाई ०% कमिसन
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                चाडपर्व अवधिभर सामान्य १०% प्लेटफर्म शुल्क पूर्ण मिनाहा। व्यपारीले आफ्नो सामानको पूरै १००% मूल्य पाउँछन्।
              </p>
            </div>

            <div className="p-5 bg-gradient-to-b from-blue-50/60 to-white rounded-2xl border border-blue-100">
              <span className="text-2xl block mb-2">⚡</span>
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider block mb-1">
                ३. २४-घण्टे द्रुत भुक्तानी
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                ७-दिनको Escrow होल्डको सट्टा चाडपर्वमा २४ घण्टामै बिक्रेताको बैंक खातामा रकम जम्मा। पुनःस्टक गर्न नगदको सहजता।
              </p>
            </div>

            <div className="p-5 bg-gradient-to-b from-emerald-50/60 to-white rounded-2xl border border-emerald-100">
              <span className="text-2xl block mb-2">🔒</span>
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
                ४. १००% सुरक्षित Escrow & Tax
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                नेपाल (eSewa/Khalti/COD), भारत (UPI/Razorpay), र युएई (Tabby/Stripe) मार्फत खरिददारको रकम सुरक्षित Escrow मा रहने।
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        धनश्री बहु-क्षेत्रीय इ-कमर्स प्लेटफर्म &bull; नेपाल &bull; भारत &bull; युएई &bull; दशैँ, तिहार तथा छठ महोत्सव २०८३
      </footer>
    </div>
  );
}
