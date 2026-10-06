'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { DhanshreeFooter } from '@/components/DhanshreeFooter';
import { VastuHeroSection } from '@/components/VastuHeroSection';
import { VastuProductCard } from '@/components/VastuProductCard';
import { CountryCode, COUNTRY_CONFIGS } from '@dhanshree/shared';
import { useAuth } from '@/context/AuthContext';

export interface DhanshreeFrontPageProps {
  countryCode?: CountryCode;
}

export function DhanshreeFrontPage({ countryCode = CountryCode.NEPAL }: DhanshreeFrontPageProps) {
  const c = countryCode.toLowerCase();
  const config = COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS[CountryCode.NEPAL];
  const { currentUser, switchUser } = useAuth();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const currencySymbol =
    config.defaultCurrency === 'NPR'
      ? 'रु'
      : config.defaultCurrency === 'INR'
      ? '₹'
      : 'AED';

  // Vastu & Numerological Showcase Products (Roots 5 & 6)
  const vastuShowcaseProducts = [
    {
      id: 'vp-macbook',
      title: 'Apple MacBook Pro M3 Max (16-inch, 36GB RAM, 1TB SSD)',
      slug: 'apple-macbook-pro-m3-max',
      category: 'Electronics',
      originalPrice: 380000,
      discountPercent: 12,
      rating: 4.9,
      reviewCount: 342,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
      badge: 'Mercury Fast Trade #5',
      preferredVibration: 5 as const,
    },
    {
      id: 'vp-kurti',
      title: 'Pure Banarasi Handloom Festive Silk Saree with Zari Weave',
      slug: 'pure-banarasi-festive-silk-saree',
      category: 'Festive Fashion',
      originalPrice: 18000,
      discountPercent: 20,
      rating: 4.8,
      reviewCount: 189,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
      badge: 'Venus Luxury #6',
      preferredVibration: 6 as const,
    },
    {
      id: 'vp-mandir',
      title: 'Pure Brass Asthadhatu Lakshmi-Ganesh Idol Set with Brass Diya',
      slug: 'pure-brass-lakshmi-ganesh-idol',
      category: 'Mandir & Living',
      originalPrice: 6500,
      discountPercent: 15,
      rating: 4.9,
      reviewCount: 512,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
      badge: 'Maha Lakshmi Harmony #5',
      preferredVibration: 5 as const,
    },
    {
      id: 'vp-audio',
      title: 'Spatial Studio Wireless Noise Cancelling Over-Ear Headphones',
      slug: 'spatial-studio-wireless-headphones',
      category: 'Audio & Gadgets',
      originalPrice: 14999,
      discountPercent: 25,
      rating: 4.7,
      reviewCount: 220,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
      badge: 'Venus Delight #6',
      preferredVibration: 6 as const,
    },
  ];

  // 1. Tall Lifestyle Category Cards (Matching exact screenshot top row)
  const lifestyleCards = [
    {
      id: 'c-kitchen',
      title: 'Shop kitchen must-haves',
      titleNepali: 'भान्साका आधुनिक सामग्रीहरू',
      bgClass: 'bg-[#e8e4de]',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop',
      href: `/${c}/products?cat=Kitchen`,
      cta: 'Explore kitchen deals',
    },
    {
      id: 'c-beauty',
      title: 'Shop all things beauty',
      titleNepali: 'सौन्दर्य तथा स्किनकेयर अफर',
      bgClass: 'bg-[#fce4dc]',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop',
      href: `/${c}/products?cat=Beauty`,
      cta: 'See beauty essentials',
    },
    {
      id: 'c-fashion',
      title: 'Start looking sharp',
      titleNepali: 'दशैँ नयाँ लुगा तथा पहिरन',
      bgClass: 'bg-[#eee6df]',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop',
      href: `/${c}/products?cat=Apparel`,
      cta: 'Shop festive fashion',
    },
    {
      id: 'c-toys',
      title: 'Toys for little ones',
      titleNepali: 'बालबालिकाका खेलौना तथा उपहार',
      bgClass: 'bg-[#e2f0ed]',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop',
      href: `/${c}/products?cat=Toys`,
      cta: 'Discover toys',
    },
    {
      id: 'c-pc',
      title: 'Level up your PC here',
      titleNepali: 'कम्प्युटर तथा ग्याजेट्स',
      bgClass: 'bg-[#f6e6f2]',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop',
      href: `/${c}/products?cat=Electronics`,
      cta: 'Browse computers & gear',
    },
    {
      id: 'c-festive',
      title: 'Discover festive gifts',
      titleNepali: 'भाइटिका मसला र पूजा सामग्री',
      bgClass: 'bg-[#fef3e2]',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
      href: `/${c}/products?cat=Festive`,
      cta: 'Shop festival hampers',
    },
  ];

  // 2. Amazon 4-Quadrant Feature Cards (Matching exact screenshot bottom row)
  const quadrantCards = [
    {
      id: 'q-electronics',
      title: 'Plug in with our electronics',
      linkText: 'See more electronics',
      href: `/${c}/products?cat=Electronics`,
      items: [
        { name: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=260&auto=format&fit=crop' },
        { name: 'Tablets', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=260&auto=format&fit=crop' },
        { name: 'Speakers', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=260&auto=format&fit=crop' },
        { name: 'Watches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=260&auto=format&fit=crop' },
      ],
    },
    {
      id: 'q-pcs',
      title: 'Score the top PCs & Accessories',
      linkText: 'See more PCs',
      href: `/${c}/products?cat=Electronics`,
      items: [
        { name: 'Desktops', img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=260&auto=format&fit=crop' },
        { name: 'Laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=260&auto=format&fit=crop' },
        { name: 'Hard drives', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=260&auto=format&fit=crop' },
        { name: 'Accessories', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=260&auto=format&fit=crop' },
      ],
    },
    {
      id: 'q-fitness',
      title: 'Gear up to get fit',
      linkText: 'Explore fitness',
      href: `/${c}/products?cat=Fitness`,
      items: [
        { name: 'Activewear', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=260&auto=format&fit=crop' },
        { name: 'Fitness bands', img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=260&auto=format&fit=crop' },
        { name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=260&auto=format&fit=crop' },
        { name: 'Gym gear', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=260&auto=format&fit=crop' },
      ],
    },
    {
      id: 'q-apparel',
      title: countryCode === 'NP' ? 'चाडपर्व नयाँ पहिरन (Apparel under रु २५००)' : 'Apparel under $25',
      linkText: 'Shop all apparel',
      href: `/${c}/products?cat=Apparel`,
      items: [
        { name: "Women's", img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=260&auto=format&fit=crop' },
        { name: "Men's", img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=260&auto=format&fit=crop' },
        { name: 'Shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=260&auto=format&fit=crop' },
        { name: 'Dhaka Topi', img: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=260&auto=format&fit=crop' },
      ],
    },
  ];

  // 3. Amazon "Today's Deals" Product Highlights
  const todaysDeals = [
    {
      id: 'deal-01',
      title: 'Sony WH-1000XM5 ANC Headphones',
      price: countryCode === 'NP' ? 44999 : countryCode === 'IN' ? 29999 : 1299,
      originalPrice: countryCode === 'NP' ? 54999 : countryCode === 'IN' ? 34999 : 1499,
      discount: '18% off',
      dealBadge: 'Deal of the Day',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    },
    {
      id: 'deal-02',
      title: 'Royal Bhaitika Bhai Masala & Dry Fruits Hamper',
      price: countryCode === 'NP' ? 2450 : countryCode === 'IN' ? 1550 : 75,
      originalPrice: countryCode === 'NP' ? 3500 : countryCode === 'IN' ? 2200 : 110,
      discount: '30% off',
      dealBadge: 'Festive Deal 🪔',
      img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
    },
    {
      id: 'deal-03',
      title: 'Palpali Handloom Dhaka Topi & Silk Khada',
      price: countryCode === 'NP' ? 1200 : countryCode === 'IN' ? 750 : 35,
      originalPrice: countryCode === 'NP' ? 1800 : countryCode === 'IN' ? 1100 : 55,
      discount: '33% off',
      dealBadge: 'Top Pick',
      img: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=300',
    },
    {
      id: 'deal-04',
      title: 'Smart 4K Ultra HD 55" Android Cinema TV',
      price: countryCode === 'NP' ? 52999 : countryCode === 'IN' ? 34999 : 1450,
      originalPrice: countryCode === 'NP' ? 68000 : countryCode === 'IN' ? 45000 : 1899,
      discount: '22% off',
      dealBadge: 'Limited Time',
      img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
    },
    {
      id: 'deal-05',
      title: 'Mithila Chhath Puja Bamboo Soop & Ghee Thekua Mix',
      price: countryCode === 'NP' ? 1650 : countryCode === 'IN' ? 990 : 49,
      originalPrice: countryCode === 'NP' ? 2400 : countryCode === 'IN' ? 1450 : 70,
      discount: '31% off',
      dealBadge: 'Chhath Holy ☀️',
      img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    },
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (title: string, price = 1200, img = '') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('dhanshree:add-to-cart', {
          detail: {
            id: `quick-${Date.now()}`,
            title,
            price,
            image: img || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300',
            quantity: 1,
          },
        })
      );
    }
    setActiveToast(`कार्टमा थपियो: ${title}`);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#0f1111] font-sans flex flex-col">
      <Header currentCountry={countryCode} />

      {/* Floating Action Toast */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d1b2a] text-white px-5 py-3 rounded-lg shadow-2xl border border-emerald-500/40 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span className="text-emerald-400">✓</span>
          <span>{activeToast}</span>
        </div>
      )}

      {/* Main Dhanshree Layout Area */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-2 sm:px-4 py-4 space-y-5">
        {/* Mock Testing Quick Banner for Tester Convenience */}
        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <span className="font-bold text-slate-900">
                मोक परीक्षण मोड (Testing as {currentUser.nameNepali} - {currentUser.roleLabelNepali}):
              </span>
              <span className="text-slate-500 ml-1">
                {currentUser.email} • {currentUser.balanceFormatted}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/${c}/seller`}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md transition-colors"
            >
              🏪 व्यपारी प्यानल (०% कमिसन)
            </Link>
            <Link
              href={`/${c}/admin`}
              className="px-3 py-1 bg-[#0d1b2a] hover:bg-[#162a45] text-white font-bold rounded-md transition-colors"
            >
              🛡️ सुपर एडमिन
            </Link>
          </div>
        </div>

        {/* Brand Tagline Welcome Ribbon (Royal Navy & Warm Gold) */}
        <div className="bg-gradient-to-r from-[#0d1b2a] via-[#162a45] to-[#0d1b2a] text-white rounded-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-xs border border-[#1e3452]">
          <div className="flex items-center gap-2.5">
            <span className="text-[#febd69] font-black text-sm lowercase">dhanshree</span>
            <span className="text-slate-400 hidden sm:inline">&bull;</span>
            <span className="text-amber-300 font-semibold text-xs tracking-wide">
              &ldquo;Shop. Discover. Delight&rdquo;
            </span>
          </div>
          <div className="text-[11px] text-slate-300 hidden md:flex items-center gap-3">
            <span>🇳🇵 नेपाल &bull; 🇮🇳 भारत &bull; 🇦🇪 UAE</span>
            <span className="text-amber-300 font-semibold">दशैँ, तिहार तथा छठ २०८३ महोत्सव</span>
          </div>
        </div>

        {/* VASTU BRAHMASTHAN HERO & EAST WING CAROUSEL */}
        <VastuHeroSection countryCode={countryCode} />

        {/* SECTION 1: AMAZON EXACT TALL LIFESTYLE CATEGORY CARDS (TOP ROW FROM SCREENSHOT) */}
        <section id="amazon-category-strip" className="relative group">
          <div
            ref={carouselRef}
            className="flex items-stretch gap-4 overflow-x-auto scrollbar-none py-1 scroll-smooth snap-x snap-mandatory"
          >
            {lifestyleCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className={`snap-start shrink-0 w-[240px] sm:w-[270px] h-[390px] sm:h-[420px] rounded-3xl ${card.bgClass} shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group/card hover:-translate-y-1 cursor-pointer`}
              >
                {/* Title at top */}
                <div className="p-5 sm:p-6 pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                    {card.title}
                  </h2>
                  <span className="text-xs text-slate-600 mt-1 block font-medium">
                    {card.titleNepali}
                  </span>
                </div>

                {/* Hero Lifestyle Image */}
                <div className="relative w-full h-[250px] sm:h-[280px] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between text-white text-xs font-semibold">
                    <span>{card.cta}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Amazon Slider Arrow Button (matches screenshot right arrow button) */}
          <button
            onClick={() => scrollCarousel('right')}
            aria-label="Scroll right"
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-xl border border-slate-200 flex items-center justify-center font-black text-lg transition-transform active:scale-95 z-20"
          >
            ›
          </button>
          <button
            onClick={() => scrollCarousel('left')}
            aria-label="Scroll left"
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-xl border border-slate-200 flex items-center justify-center font-black text-lg transition-transform active:scale-95 z-20"
          >
            ‹
          </button>
        </section>

        {/* SECTION 2: AMAZON 4-QUADRANT FEATURE CARDS (BOTTOM ROW FROM SCREENSHOT) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {quadrantCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between border border-slate-200/80"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0f1111] leading-tight">
                    {card.title}
                  </h3>
                  <span className="text-slate-400 font-bold text-sm">›</span>
                </div>

                {/* 2x2 Image Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {card.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={card.href}
                      className="group/item flex flex-col"
                    >
                      <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-100 mb-1">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[12px] text-[#0f1111] font-normal leading-tight group-hover/item:text-[#c7511f]">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Link at bottom */}
              <div className="mt-4 pt-2">
                <Link
                  href={card.href}
                  className="text-xs sm:text-[13px] text-[#007185] hover:text-[#c7511f] hover:underline font-medium"
                >
                  {card.linkText}
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2.5: DIGITAL VASTU & NUMEROLOGICAL HARMONIC SHOWCASE              */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                  Vastu Harmonic Collection • Commercial Root #5 &amp; #6
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#F59E0B] text-[10px] font-black uppercase">
                  Prosperity Calibrated
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Prices and discounts harmonized with Mercury (बुध #5 - Fast Trade) and Venus (शुक्र #6 - Customer Delight)
              </p>
            </div>
            <Link
              href={`/${c}/products`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
            >
              <span>Explore All Vastu Products</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {vastuShowcaseProducts.map((product) => (
              <VastuProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                slug={product.slug}
                category={product.category}
                originalPrice={product.originalPrice}
                discountPercent={product.discountPercent}
                rating={product.rating}
                reviewCount={product.reviewCount}
                imageUrl={product.imageUrl}
                badge={product.badge}
                countryCode={countryCode}
                currency={config.defaultCurrency}
                preferredVibration={product.preferredVibration}
                onAddToCart={() => setActiveToast(`Product added to cart with Root #${product.preferredVibration} harmony!`)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: AMAZON "TODAY'S DEALS: DASHAIN, TIHAR & CHHATH 2083" CAROUSEL */}
        <section id="todays-deals" className="bg-white rounded-xl p-5 shadow-xs border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#0f1111]">
                Today&apos;s Deals: दशैँ, तिहार तथा छठ महाबचत अफर
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-black uppercase shadow-xs">
                Up to 60% Off
              </span>
            </div>
            <Link
              href={`/${c}/products`}
              className="text-xs sm:text-[13px] text-emerald-800 hover:text-emerald-900 hover:underline font-semibold"
            >
              See all festive deals &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {todaysDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white p-3 rounded-lg border border-slate-200/70 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square rounded-md overflow-hidden bg-slate-50 mb-2">
                    <img
                      src={deal.img}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                      {deal.discount}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {deal.dealBadge}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-[#0f1111] line-clamp-2 leading-snug group-hover:text-emerald-800">
                    {deal.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#0f1111]">
                      {currencySymbol} {deal.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 line-through block">
                      {currencySymbol} {deal.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(deal.title, deal.price, deal.img)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>+</span> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: MERCHANT FESTIVE HIGHLIGHT BANNER (Royal Navy) */}
        <section className="bg-gradient-to-r from-[#162a45] via-[#0d1b2a] to-[#162a45] rounded-xl p-6 text-white shadow-md border border-[#1e3452] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-3xl">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                  व्यपारी तथा बिक्रेता बिशेष सुविधा
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ०% कमिसन सक्रिय
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                दशैँ, तिहार तथा छठमा आफ्ना उत्पादनहरू धनश्रीमा बेचेर १००% नाफा राख्नुहोस्!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                सामान्य १०% कमिसन मिनाहा • २४-घण्टे द्रुत बैंक भुक्तानी • भारत, नेपाल र युएईमा ग्राहक पहुँच
              </p>
            </div>
          </div>

          <Link
            href={`/${c}/seller`}
            className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs rounded-lg shadow-sm whitespace-nowrap transition-colors"
          >
            व्यपारी प्यानल खोल्नुहोस् (Seller Hub) &rarr;
          </Link>
        </section>
      </main>

      {/* DHANSHREE SIGNATURE FOOTER */}
      <DhanshreeFooter countryCode={config.code} />
    </div>
  );
}

export default DhanshreeFrontPage;
