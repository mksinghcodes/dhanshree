'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { COUNTRY_CONFIGS, CountryCode } from '@dhanshree/shared';
import { useResolvedParams } from '@/lib/params';
import { useAuth } from '@/context/AuthContext';

interface CountryPageProps {
  params: any;
}

interface ProductItem {
  id: string;
  category: 'ALL' | 'BHAI_TIKA' | 'DASHAIN_CLOTHES' | 'CHHATH_PUJA' | 'ELECTRONICS';
  title: string;
  titleNepali: string;
  priceNP: number;
  originalPriceNP: number;
  priceIN: number;
  originalPriceIN: number;
  priceAE: number;
  originalPriceAE: number;
  rating: number;
  reviews: number;
  store: string;
  tag: string;
  tagNepali: string;
  image: string;
  stockLeft: number;
}

const FESTIVE_PRODUCTS: ProductItem[] = [
  {
    id: 'fp-001',
    category: 'BHAI_TIKA',
    title: 'Supreme Royal Bhaitika Bhai Masala & Dry Fruits Gift Hamper',
    titleNepali: 'प्रिमियम शाही भाइटिका भाइ मसला तथा ड्राइ फ्रुट्स उपहार बाकस',
    priceNP: 2450,
    originalPriceNP: 3500,
    priceIN: 1550,
    originalPriceIN: 2200,
    priceAE: 75,
    originalPriceAE: 110,
    rating: 4.9,
    reviews: 218,
    store: 'Himalayan Organic Essentials',
    tag: 'Bestseller',
    tagNepali: 'तिहार बिशेष 🔥',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500',
    stockLeft: 24,
  },
  {
    id: 'fp-002',
    category: 'DASHAIN_CLOTHES',
    title: 'Authentic Palpali Handloom Dhaka Topi & Pure Silk Khada Set',
    titleNepali: 'मौलिक पाल्पाली हातले बुनेको ढाका टोपी तथा रेशमी खादा सेट',
    priceNP: 1200,
    originalPriceNP: 1800,
    priceIN: 750,
    originalPriceIN: 1100,
    priceAE: 35,
    originalPriceAE: 55,
    rating: 4.8,
    reviews: 142,
    store: 'Palpali Heritage Crafts',
    tag: 'Cultural Pride',
    tagNepali: 'दशैँ नयाँ लुगा 🥻',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=500',
    stockLeft: 45,
  },
  {
    id: 'fp-003',
    category: 'CHHATH_PUJA',
    title: 'Traditional Mithila Chhath Puja Bamboo Soop & Pure Cow Ghee Thekua Mix',
    titleNepali: 'मिथिला परम्परागत बाँसको सूप, दउरा तथा शुद्ध घ्युको ठेकुवा सामग्री',
    priceNP: 1650,
    originalPriceNP: 2400,
    priceIN: 990,
    originalPriceIN: 1450,
    priceAE: 49,
    originalPriceAE: 70,
    rating: 5.0,
    reviews: 96,
    store: 'Janakpurdham Agro Foods',
    tag: 'Holy Arghya',
    tagNepali: 'छठ महापूजा ☀️',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
    stockLeft: 30,
  },
  {
    id: 'fp-004',
    category: 'ELECTRONICS',
    title: 'Sony WH-1000XM5 Premium Noise Cancelling Wireless Headphones',
    titleNepali: 'सोनी WH-1000XM5 फ्ल्यागसिप न्वाइज क्यान्सलिङ हेडफोन',
    priceNP: 44999,
    originalPriceNP: 54999,
    priceIN: 29999,
    originalPriceIN: 34999,
    priceAE: 1299,
    originalPriceAE: 1499,
    rating: 4.9,
    reviews: 384,
    store: 'Sony Flagship Nepal',
    tag: 'Dashain Dhamaka',
    tagNepali: 'दशैँ धमाका अफर 📱',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stockLeft: 8,
  },
  {
    id: 'fp-005',
    category: 'BHAI_TIKA',
    title: 'Handmade Terracotta Clay Diyas & Decorative Warm LED Fairy Lights (Pack of 24)',
    titleNepali: 'माटोको परम्परागत पाला (दियो) तथा सजावटी तिहार बत्ती (२४ पिस सेट)',
    priceNP: 850,
    originalPriceNP: 1300,
    priceIN: 499,
    originalPriceIN: 750,
    priceAE: 25,
    originalPriceAE: 40,
    rating: 4.7,
    reviews: 167,
    store: 'Bhaktapur Pottery Village',
    tag: 'Diwali Lights',
    tagNepali: 'दीपावली उज्यालो 🪔',
    image: 'https://images.unsplash.com/photo-1514517220034-7546a9e18b87?w=500',
    stockLeft: 110,
  },
  {
    id: 'fp-006',
    category: 'ELECTRONICS',
    title: 'Smart 4K Ultra HD 55" Bezel-less Android TV with Dolby Vision',
    titleNepali: '५५ इन्च स्मार्ट ४K अल्ट्रा एचडी एन्ड्रोइड टिभी (चाडपर्व विशेष वारेन्टी)',
    priceNP: 52999,
    originalPriceNP: 68000,
    priceIN: 34999,
    originalPriceIN: 45000,
    priceAE: 1450,
    originalPriceAE: 1899,
    rating: 4.8,
    reviews: 89,
    store: 'VisionTech Electronics',
    tag: 'Family Cinema',
    tagNepali: 'दशैँ मुभी टाइम 📺',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
    stockLeft: 12,
  },
];

export default function CountryStorefront({ params }: CountryPageProps) {
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const code = (unwrappedParams.country || 'np').toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[CountryCode.NEPAL];

  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BHAI_TIKA' | 'DASHAIN_CLOTHES' | 'CHHATH_PUJA' | 'ELECTRONICS'>('ALL');
  const [addedItemToCart, setAddedItemToCart] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Simulated Festive Countdown (दशैँ-तिहार महाबचत काउन्टडाउन)
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (couponCode: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(couponCode);
      setTimeout(() => setCopiedCoupon(null), 2500);
    }
  };

  const handleAddToCart = (id: string, title: string) => {
    setAddedItemToCart(title);
    setTimeout(() => setAddedItemToCart(null), 3000);
  };

  const currencySymbol =
    config.defaultCurrency === 'NPR'
      ? 'रु'
      : config.defaultCurrency === 'INR'
      ? '₹'
      : 'AED';

  const getPrice = (item: ProductItem) => {
    if (code === CountryCode.INDIA) return { current: item.priceIN, original: item.originalPriceIN };
    if (code === CountryCode.UAE) return { current: item.priceAE, original: item.originalPriceAE };
    return { current: item.priceNP, original: item.originalPriceNP };
  };

  const filteredProducts =
    selectedCategory === 'ALL'
      ? FESTIVE_PRODUCTS
      : FESTIVE_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header currentCountry={config.code} />

      {/* Localized Floating Toast on Add to Cart */}
      {addedItemToCart && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="text-xl">🛒</span>
          <div>
            <span className="font-bold text-xs block text-emerald-400">कार्टमा सफलतापूर्वक थपियो!</span>
            <span className="text-xs text-slate-300 truncate max-w-xs block">{addedItemToCart}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Festive Grand Hero Showcase */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-rose-700 to-amber-700 text-white p-6 sm:p-10 shadow-xl mb-8 border border-amber-300/30">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-black border border-amber-300/40 mb-3 backdrop-blur-md">
              <span className="animate-spin text-sm">✨</span>
              दशैँ, तिहार तथा छठ महाबचत महोत्सव २०८३ (विशेष अफर)
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              चाडपर्वको उमङ्ग, <br />
              <span className="text-amber-300">महाबचत</span> र उपहार धनश्रीको सँग!
            </h1>

            <p className="mt-3 text-sm sm:text-base text-red-100 max-w-2xl leading-relaxed">
              दशैँको नयाँ लुगा, तिहारको भाइटिका मसला, छठको शुद्ध पूजा सामग्री तथा ब्राण्डेड इलेक्ट्रोनिक्समा 
              <strong className="text-white font-extrabold"> ६०% सम्मको भारी छुट</strong> र अतिरिक्त कूपन अफर।
            </p>

            {/* Countdown Clock */}
            <div className="mt-5 flex items-center gap-2 sm:gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                अफर सकिन बाँकी:
              </span>
              <div className="flex gap-1.5 sm:gap-2 text-center font-mono">
                <div className="bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
                  <span className="text-sm sm:text-base font-black text-amber-300">{timeLeft.days}</span>
                  <span className="text-[9px] block text-slate-300 uppercase">दिन</span>
                </div>
                <div className="bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
                  <span className="text-sm sm:text-base font-black text-white">{timeLeft.hours}</span>
                  <span className="text-[9px] block text-slate-300 uppercase">घण्टा</span>
                </div>
                <div className="bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
                  <span className="text-sm sm:text-base font-black text-white">{timeLeft.minutes}</span>
                  <span className="text-[9px] block text-slate-300 uppercase">मिनेट</span>
                </div>
                <div className="bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
                  <span className="text-sm sm:text-base font-black text-amber-300">{timeLeft.seconds}</span>
                  <span className="text-[9px] block text-slate-300 uppercase">सेकेन्ड</span>
                </div>
              </div>
            </div>

            {/* Buyer Coupons Row */}
            <div className="mt-6 flex flex-wrap gap-2.5 items-center">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <span>🏷️</span>
                <span className="font-mono font-bold text-amber-300">DASHAIN2026</span>
                <span className="text-slate-200 text-[11px]">(२०% छुट)</span>
                <button
                  onClick={() => handleCopyCode('DASHAIN2026')}
                  className="ml-1 px-2 py-0.5 bg-amber-400 text-slate-950 font-bold rounded-md hover:bg-amber-300 text-[10px]"
                >
                  {copiedCoupon === 'DASHAIN2026' ? 'कपि भयो' : 'कपि'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <span>🪔</span>
                <span className="font-mono font-bold text-amber-300">TIHAR500</span>
                <span className="text-slate-200 text-[11px]">(रु ५०० छुट)</span>
                <button
                  onClick={() => handleCopyCode('TIHAR500')}
                  className="ml-1 px-2 py-0.5 bg-amber-400 text-slate-950 font-bold rounded-md hover:bg-amber-300 text-[10px]"
                >
                  {copiedCoupon === 'TIHAR500' ? 'कपि भयो' : 'कपि'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <span>☀️</span>
                <span className="font-mono font-bold text-amber-300">CHHATH20</span>
                <span className="text-slate-200 text-[11px]">(२०% क्यासब्याक)</span>
                <button
                  onClick={() => handleCopyCode('CHHATH20')}
                  className="ml-1 px-2 py-0.5 bg-amber-400 text-slate-950 font-bold rounded-md hover:bg-amber-300 text-[10px]"
                >
                  {copiedCoupon === 'CHHATH20' ? 'कपि भयो' : 'कपि'}
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 -mb-16 w-72 h-72 bg-red-950/40 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* MERCHANT FESTIVE BENEFIT BANNER (समान बेच्न व्यपारीलाई विशेष सुविधा) */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 mb-8 text-white shadow-md border border-blue-400/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-3xl">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-amber-300 uppercase tracking-wider">
                  व्यपारी तथा बिक्रेता विशेष चाडपर्व अफर
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-400/30">
                  सक्रिय (Active)
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white mt-0.5">
                दशैँ-तिहारमा ०% प्लेटफर्म कमिसन र २४-घण्टे द्रुत बैंक भुक्तानी (Express Payout)!
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                चाडपर्वमा आफ्ना उत्पादनहरू धनश्रीमा बेचेर १००% नाफा सुरक्षित गर्नुहोस्। सामान्य ७-दिनको सट्टा २४ घण्टामै बैंक ट्रान्सफर।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <Link
              href={`/${config.code.toLowerCase()}/seller`}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>व्यपारी ड्यासबोर्ड खोल्नुहोस्</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Festive Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            🔥 सबै चाडपर्व अफरहरू (All Deals)
          </button>
          <button
            onClick={() => setSelectedCategory('BHAI_TIKA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'BHAI_TIKA'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            🪔 भाइटिका मसला तथा दियो (Bhai Masala & Diyas)
          </button>
          <button
            onClick={() => setSelectedCategory('DASHAIN_CLOTHES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'DASHAIN_CLOTHES'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            🥻 दशैँ नयाँ लुगा तथा ढाका टोपी (Festive Clothing)
          </button>
          <button
            onClick={() => setSelectedCategory('CHHATH_PUJA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'CHHATH_PUJA'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            ☀️ छठ पूजा सामग्री तथा सूप (Chhath Puja Special)
          </button>
          <button
            onClick={() => setSelectedCategory('ELECTRONICS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ELECTRONICS'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            📱 दशैँ धमाका इलेक्ट्रोनिक्स (Electronics & Gadgets)
          </button>
        </div>

        {/* Product Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{config.name} बजारका प्रमाणित चाडपर्व उत्पादनहरू</span>
                <span className="text-xs font-normal text-slate-500">
                  ({filteredProducts.length} सामानहरू उपलब्ध)
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                सबै मूल्यमा {config.taxLabel} समावेश छ • Escrow ग्यारेन्टी तथा स्थानीय कुरियर डेलिभरी
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
              {config.codMaxOrderLimit > 0 ? `COD सीमा: ${currencySymbol} ${config.codMaxOrderLimit.toLocaleString()}` : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const { current, original } = getPrice(p);
              const discountPercent = Math.round(((original - current) / original) * 100);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Image & Discount Badge */}
                    <div className="relative overflow-hidden rounded-2xl mb-4 bg-slate-100 aspect-video">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] shadow-sm">
                          {p.tagNepali}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-amber-300 font-bold text-[10px]">
                          -{discountPercent}%
                        </span>
                      </div>

                      {p.stockLeft < 15 && (
                        <div className="absolute bottom-2 right-2 bg-amber-500/90 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                          {p.stockLeft} मात्र बाँकी!
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-medium text-slate-500">{p.store}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span>★</span>
                        <span className="font-bold text-slate-800">{p.rating}</span>
                        <span className="text-slate-400 text-[11px]">({p.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {p.titleNepali}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {p.title}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-rose-600 font-mono">
                          {currencySymbol} {current.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {currencySymbol} {original.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        {config.taxLabel} कर समावेश
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(p.id, p.titleNepali)}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20 active:scale-95"
                    >
                      कार्टमा थप्नुहोस् +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Localized Payment Methods Support Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {config.name} मा स्वीकृत भुक्तानी प्रणालीहरू (100% Escrow Protected)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ग्राहकले समान प्राप्त गरी सन्तुष्ट भएपछि मात्र व्यपारीको खातामा रकम ट्रान्सफर हुन्छ।
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.supportedPaymentMethods.map((pm) => (
                <span
                  key={pm}
                  className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200/80"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2 pb-6">
          <Link
            href="/"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 inline-flex items-center gap-1.5"
          >
            &larr; ग्लोबल मार्केटप्लेस गृहपृष्ठ फर्कनुहोस् (Switch Country Storefront)
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        धनश्री {config.name} स्टोर &bull; दशैँ, तिहार तथा छठ महोत्सव २०८३ &bull; सुरक्षित किनमेल र व्यापार
      </footer>
    </div>
  );
}
