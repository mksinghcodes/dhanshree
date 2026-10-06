'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { DhanshreeFooter } from '@/components/DhanshreeFooter';
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
  subType?: string;
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

const DHANSHREE_CATALOG: ProductItem[] = [
  // 1. COMPUTERS & LAPTOPS
  {
    id: 'comp-001',
    title: 'Lenovo Business 15.6" FHD Laptop, Intel Processor, 8GB DDR5, 128GB Storage',
    subSpec: 'Office 365, Copilot AI, WiFi 6, Bluetooth 5.2, USB-C, Anti-Glare Screen, Long Battery Life, Windows 11',
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
    badges: ['15.6" FHD Display', 'Copilot AI', 'Windows 11'],
  },
  {
    id: 'comp-002',
    title: 'MSI Codex Z2 Gaming Desktop, AMD R7-8700F, RTX 5070, 32GB DDR5, 2TB SSD',
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
    priceNP: 44999,
    originalPriceNP: 52000,
    priceIN: 28999,
    originalPriceIN: 34000,
    priceAE: 1199,
    originalPriceAE: 1399,
    rating: 4.4,
    reviews: 320,
    boughtCount: '100+ bought in past month',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Google AI Included', 'DTS Audio', 'Military Grade'],
  },

  // 2. ELECTRONICS & GADGETS
  {
    id: 'elec-001',
    title: 'Apple MacBook Pro M3 Max (16-inch, 36GB Unified RAM, 1TB SSD, Space Black)',
    subSpec: 'Liquid Retina XDR Display, 16-core CPU, 40-core GPU, 22-Hour Battery, MagSafe 3, macOS Sonoma',
    category: 'Electronics',
    subType: 'Laptops',
    brand: 'Apple',
    priceNP: 334400,
    originalPriceNP: 380000,
    priceIN: 219900,
    originalPriceIN: 249900,
    priceAE: 9899,
    originalPriceAE: 10999,
    rating: 4.9,
    reviews: 342,
    boughtCount: '450+ bought in past month',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['M3 Max Silicon', 'Liquid Retina XDR', 'Mercury Root #5'],
  },
  {
    id: 'elec-002',
    title: 'Spatial Studio Wireless Noise Cancelling Over-Ear Headphones (ANC Pro)',
    subSpec: 'Custom 40mm Titanium Drivers, Transparency Mode, 60h Playtime, Multi-Point Bluetooth 5.4, Fast USB-C',
    category: 'Electronics',
    subType: 'Audio',
    brand: 'StudioAudio',
    priceNP: 4991,
    originalPriceNP: 7500,
    priceIN: 3290,
    originalPriceIN: 4800,
    priceAE: 149,
    originalPriceAE: 220,
    rating: 4.7,
    reviews: 220,
    boughtCount: '800+ bought in past month',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Active Noise Cancel', '60H Battery', 'Harmonic #5'],
  },
  {
    id: 'elec-003',
    title: 'Ultra-Thin Smart 5G Smartphone (12GB RAM, 256GB, 108MP OIS Triple Camera)',
    subSpec: '6.78" 144Hz AMOLED 1.5K Display, Snapdragon 8 Gen 3, 5500mAh 100W HyperCharge, IP68 Waterproof',
    category: 'Electronics',
    subType: 'Mobiles',
    brand: 'NextGen',
    priceNP: 64999,
    originalPriceNP: 74999,
    priceIN: 41999,
    originalPriceIN: 48999,
    priceAE: 1899,
    originalPriceAE: 2199,
    rating: 4.8,
    reviews: 890,
    boughtCount: '1000+ bought in past month',
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['108MP Camera', '100W HyperCharge', 'Bestseller'],
  },

  // 3. HOME & KITCHEN
  {
    id: 'kitch-001',
    title: 'Smart Multi-Cooker Stainless Steel Instant Pot (6L, 12-in-1 Automatic Programs)',
    subSpec: 'Pressure Cook, Slow Cook, Sauté, Rice Cooker, Steamer, Yogurt Maker, Food Warmer, Dishwasher-Safe',
    category: 'Kitchen',
    subType: 'Kitchen & Dining',
    brand: 'ChefMaster',
    priceNP: 9890,
    originalPriceNP: 12500,
    priceIN: 6200,
    originalPriceIN: 7900,
    priceAE: 275,
    originalPriceAE: 350,
    rating: 4.8,
    reviews: 640,
    boughtCount: '600+ bought in past month',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['12-in-1 Programs', '100% Stainless Steel', 'Top Rated'],
  },
  {
    id: 'kitch-002',
    title: 'Hand-Forged Pure Cast Iron Tawa & Skillet Set (Pre-Seasoned 12-Inch)',
    subSpec: 'Chemical-Free 100% Natural Flaxseed Seasoning, Induction & Gas Compatible, Retains Heat Evenly',
    category: 'Kitchen',
    subType: 'Kitchen & Dining',
    brand: 'IronCraft',
    priceNP: 3499,
    originalPriceNP: 4500,
    priceIN: 2199,
    originalPriceIN: 2899,
    priceAE: 99,
    originalPriceAE: 130,
    rating: 4.9,
    reviews: 430,
    boughtCount: '350+ bought in past month',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Natural Pre-Seasoned', 'Toxin Free', 'Lifetime Guarantee'],
  },

  // 4. BEAUTY & PERSONAL CARE
  {
    id: 'beauty-001',
    title: 'Himalayan Organic Vitamin C Radiance Face Glow Serum (30ml Anti-Aging)',
    subSpec: 'Pure Kakadu Plum, Hyaluronic Acid 2%, Ferulic Acid, Paraben & Sulfate Free, Dermatologist Tested',
    category: 'Beauty',
    subType: 'Skincare',
    brand: 'HimalayaPure',
    priceNP: 1450,
    originalPriceNP: 1950,
    priceIN: 899,
    originalPriceIN: 1299,
    priceAE: 42,
    originalPriceAE: 58,
    rating: 4.7,
    reviews: 820,
    boughtCount: '1200+ bought in past month',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Organic Botanicals', 'Glowing Skin', 'Cruelty Free'],
  },
  {
    id: 'beauty-002',
    title: 'Kumkumadi Ayurvedic Miracle Night Face Oil (25ml Pure Saffron Elixir)',
    subSpec: '24 Authentic Ayurvedic Herbs, Kashmiri Saffron, Sandalwood, Lotus Extracts, Restores Natural Glow',
    category: 'Beauty',
    subType: 'Skincare',
    brand: 'VedaShree',
    priceNP: 2890,
    originalPriceNP: 3600,
    priceIN: 1799,
    originalPriceIN: 2299,
    priceAE: 85,
    originalPriceAE: 110,
    rating: 4.9,
    reviews: 940,
    boughtCount: '900+ bought in past month',
    image: 'https://images.unsplash.com/photo-1608248597359-5489f666f772?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Kashmiri Saffron', 'Ayurveda Certified', 'Bestseller'],
  },

  // 5. FASHION & APPAREL
  {
    id: 'fash-001',
    title: 'Pure Banarasi Handloom Festive Silk Saree with Rich Zari Weave & Blouse',
    subSpec: '100% Pure Mulberry Silk, Traditional Floral Buta Motifs, Silk Mark Certified, Festive Red-Gold',
    category: 'Apparel',
    subType: "Women's",
    brand: 'KashiCraft',
    priceNP: 8520,
    originalPriceNP: 10500,
    priceIN: 5400,
    originalPriceIN: 6800,
    priceAE: 245,
    originalPriceAE: 310,
    rating: 4.8,
    reviews: 310,
    boughtCount: '400+ bought in past month',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Silk Mark Certified', 'Handloom Woven', 'Venus Root #6'],
  },
  {
    id: 'fash-002',
    title: 'Palpali Authentic Handloom Dhaka Topi & Classic Khada Ceremonial Set',
    subSpec: 'Traditional Nepali Hand-loomed Cotton, Intricate Heritage Geometric Patterns, Classic Maroon',
    category: 'Apparel',
    subType: "Men's",
    brand: 'PalpaliHeritage',
    priceNP: 1200,
    originalPriceNP: 1600,
    priceIN: 750,
    originalPriceIN: 990,
    priceAE: 35,
    originalPriceAE: 48,
    rating: 4.9,
    reviews: 620,
    boughtCount: '750+ bought in past month',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Nepal Handloom', 'National Pride', 'Festive Edition'],
  },

  // 6. TOYS & GAMES
  {
    id: 'toy-001',
    title: 'Smart STEM Educational Robotics & Coding Kit for Kids (14-in-1 Solar & Battery)',
    subSpec: 'Interactive Mechanical Gears, Graphical Programming Guide, Enhances Logic & Science Thinking',
    category: 'Toys',
    subType: 'Kids',
    brand: 'STEMLab',
    priceNP: 3450,
    originalPriceNP: 4500,
    priceIN: 2150,
    originalPriceIN: 2800,
    priceAE: 98,
    originalPriceAE: 130,
    rating: 4.6,
    reviews: 450,
    boughtCount: '500+ bought in past month',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['STEM Certified', 'Ages 8-14', 'Skill Builder'],
  },

  // 7. FITNESS & SPORTS
  {
    id: 'fit-001',
    title: 'Professional Home Gym Resistance Band Set with Handles & Ankle Straps (150 LBS)',
    subSpec: '5 Color-Coded Natural Latex Tubes, Heavy-Duty Steel Carabiners, Waterproof Carry Pouch, Door Anchor',
    category: 'Fitness',
    subType: 'Home office',
    brand: 'ProFit',
    priceNP: 2490,
    originalPriceNP: 3200,
    priceIN: 1590,
    originalPriceIN: 2100,
    priceAE: 72,
    originalPriceAE: 95,
    rating: 4.7,
    reviews: 730,
    boughtCount: '600+ bought in past month',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['150 LBS Max', 'Heavy Duty', 'Travel Bag Included'],
  },

  // 8. FESTIVE & PUJA
  {
    id: 'fest-001',
    title: 'Bhai Tika Royal Festive Dry Fruits & Nuts Hamper (1KG Deluxe Gift Box)',
    subSpec: 'Jumbo Kashmiri Almonds, Roasted Cashews, Baitadi Organic Walnuts, Turkish Pistachios, Afghani Anjeer',
    category: 'Festive',
    subType: 'Festive',
    brand: 'RoyalDryFruits',
    priceNP: 2450,
    originalPriceNP: 3100,
    priceIN: 1550,
    originalPriceIN: 1990,
    priceAE: 75,
    originalPriceAE: 98,
    rating: 4.9,
    reviews: 1250,
    boughtCount: '2000+ bought in past month',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Festive Special', 'Vacuum Sealed', '100% Natural'],
  },
  {
    id: 'fest-002',
    title: 'Pure Brass Asthadhatu Lakshmi-Ganesh Idol Set with Brass Akhand Diya',
    subSpec: 'Handcrafted Heritage Brass, Traditional Temple Carving, Ideal for Home Pooja, Wealth & Blessings',
    category: 'Festive',
    subType: 'Pooja',
    brand: 'MahaLakshmiBrass',
    priceNP: 5500,
    originalPriceNP: 6500,
    priceIN: 3450,
    originalPriceIN: 4200,
    priceAE: 160,
    originalPriceAE: 195,
    rating: 4.9,
    reviews: 512,
    boughtCount: '700+ bought in past month',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['Pure Brass', 'Lakshmi-Ganesh', 'Prosperity #5'],
  },

  // 9. BOOKS & LEARNING
  {
    id: 'book-001',
    title: 'The Psychology of Prosperity: Commercial Numerology & Mindset for Wealth',
    subSpec: 'Hardcover Collector Edition, Timeless Laws of Wealth Creation, Trade Agility, Financial Freedom',
    category: 'Books',
    subType: 'Students',
    brand: 'DhanshreePublishing',
    priceNP: 990,
    originalPriceNP: 1350,
    priceIN: 620,
    originalPriceIN: 850,
    priceAE: 29,
    originalPriceAE: 40,
    rating: 4.9,
    reviews: 410,
    boughtCount: '500+ bought in past month',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop',
    prime: true,
    badges: ['#1 Bestseller', 'Hardcover Edition', 'Author Signed'],
  },
];

const COMPUTER_CATALOG = DHANSHREE_CATALOG;

export default function ProductsPage({ params }: ProductsPageProps) {
  const router = useRouter();
  const unwrappedParams = useResolvedParams<{ country: string }>(params);
  const code = (unwrappedParams.country || 'np').toUpperCase() as CountryCode;
  const config = COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[CountryCode.NEPAL];

  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
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

  // Subtype pills
  const narrowPills = [
    { label: 'All', icon: '🔍' },
    { label: 'Laptops', icon: '💻' },
    { label: 'Gaming', icon: '🎮' },
    { label: 'Audio', icon: '🎧' },
    { label: 'Mobiles', icon: '📱' },
    { label: 'Skincare', icon: '🌿' },
    { label: "Women's", icon: '👗' },
    { label: "Men's", icon: '👔' },
    { label: 'Festive', icon: '🏮' },
  ];

  const getPrice = (item: ProductItem) => {
    if (code === CountryCode.INDIA) return { current: item.priceIN, original: item.originalPriceIN };
    if (code === CountryCode.UAE) return { current: item.priceAE, original: item.originalPriceAE };
    return { current: item.priceNP, original: item.originalPriceNP };
  };

  const filteredCatalog = useMemo(() => {
    return DHANSHREE_CATALOG.filter((item) => {
      // 1. Category Filter (?cat=Kitchen, ?cat=Computers, ?cat=Home & Kitchen, etc.)
      if (categoryParam && categoryParam !== 'All' && categoryParam !== 'All Departments') {
        const catLower = categoryParam.toLowerCase().trim();
        const itemCatLower = item.category.toLowerCase().trim();
        const itemSubLower = (item.subType || '').toLowerCase().trim();
        const itemTitleLower = item.title.toLowerCase().trim();

        const matchesCategory =
          itemCatLower === catLower ||
          itemCatLower.includes(catLower) ||
          catLower.includes(itemCatLower) ||
          // Computers & Laptops
          ((catLower.includes('computer') || catLower.includes('laptop') || catLower.includes('pc')) && itemCatLower === 'computers') ||
          // Electronics & Gadgets
          ((catLower.includes('electronic') || catLower.includes('gadget')) && itemCatLower === 'electronics') ||
          // Mobile & Tablets
          ((catLower.includes('mobile') || catLower.includes('tablet') || catLower.includes('phone')) &&
            (itemCatLower === 'electronics' && (itemSubLower.includes('mobile') || itemTitleLower.includes('iphone')))) ||
          // Audio & Headphones
          ((catLower.includes('audio') || catLower.includes('headphone') || catLower.includes('earbud')) &&
            (itemCatLower === 'electronics' && (itemSubLower.includes('audio') || itemTitleLower.includes('sony') || itemTitleLower.includes('headphone')))) ||
          // Smart TVs & Video
          (catLower.includes('tv') &&
            (itemCatLower === 'electronics' && (itemSubLower.includes('tv') || itemTitleLower.includes('tv')))) ||
          // Home & Kitchen / Kitchen & Dining
          ((catLower.includes('kitchen') || catLower.includes('dining') || catLower.includes('home')) && itemCatLower === 'kitchen') ||
          // Pooja & Mandir
          ((catLower.includes('pooja') || catLower.includes('puja') || catLower.includes('mandir') || catLower.includes('idol')) &&
            (itemCatLower === 'festive' || itemTitleLower.includes('murti') || itemTitleLower.includes('brass'))) ||
          // Beauty & Personal Care
          ((catLower.includes('beauty') || catLower.includes('care') || catLower.includes('skincare')) && itemCatLower === 'beauty') ||
          // Fashion & Apparel
          ((catLower.includes('apparel') || catLower.includes('fashion') || catLower.includes('cloth')) && itemCatLower === 'apparel') ||
          // Men's Fashion
          (catLower.includes('men') && !catLower.includes('women') &&
            (itemCatLower === 'apparel' && (itemSubLower.includes('men') || itemTitleLower.includes('topi')))) ||
          // Women's Fashion
          (catLower.includes('women') &&
            (itemCatLower === 'apparel' && (itemSubLower.includes('women') || itemTitleLower.includes('saree')))) ||
          // Kids & Baby / Toys & Games
          ((catLower.includes('toy') || catLower.includes('game') || catLower.includes('kid') || catLower.includes('baby') || catLower.includes('stem')) &&
            itemCatLower === 'toys') ||
          // Fitness & Sports
          ((catLower.includes('fit') || catLower.includes('sport') || catLower.includes('gym')) && itemCatLower === 'fitness') ||
          // Festive Deals & Hampers
          ((catLower.includes('festiv') || catLower.includes('hamper') || catLower.includes('tika') || catLower.includes('dry fruit')) &&
            itemCatLower === 'festive') ||
          // Books & Learning
          ((catLower.includes('book') || catLower.includes('learn') || catLower.includes('study')) && itemCatLower === 'books') ||
          // Bestsellers
          (catLower.includes('bestseller') &&
            (item.rating >= 4.7 || item.badges.some((b) => b.toLowerCase().includes('bestseller')))) ||
          // Deals & Offers
          (catLower.includes('deal') &&
            (item.badges.some((b) => b.toLowerCase().includes('deal')) || item.originalPriceNP > item.priceNP * 1.15));

        if (!matchesCategory) return false;
      }

      // 2. Text Query Filter (?q=laptop, ?q=kurti, etc.)
      if (query && query !== 'all' && query.trim() !== '') {
        const qLower = query.toLowerCase().trim();
        const matchesQuery =
          item.title.toLowerCase().includes(qLower) ||
          item.subSpec.toLowerCase().includes(qLower) ||
          item.category.toLowerCase().includes(qLower) ||
          (item.subType && item.subType.toLowerCase().includes(qLower)) ||
          item.brand.toLowerCase().includes(qLower) ||
          item.badges.some((b) => b.toLowerCase().includes(qLower));

        if (!matchesQuery) return false;
      }

      // 3. Subtype pill filter
      if (selectedPill !== 'All' && item.subType !== selectedPill) {
        return false;
      }

      // 4. Rating filter
      if (minRating > 0 && item.rating < minRating) {
        return false;
      }

      // 5. Price Tier filter
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
        if (code === 'AE' && price > 3000) return false;
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
  }, [categoryParam, query, selectedPill, minRating, selectedTier, sortBy, code]);

  // If filter is too restrictive and yields 0 items, fallback to all catalog
  const displayCatalog = filteredCatalog.length > 0 ? filteredCatalog : DHANSHREE_CATALOG;

  const handleAddToCart = (product: ProductItem) => {
    const price = getPrice(product).current;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('dhanshree:add-to-cart', {
          detail: {
            id: product.id,
            title: product.title,
            price,
            image: product.image,
            variant: product.subSpec || product.brand,
          },
        })
      );
    }
    setToastMessage(`कार्टमा थपियो: ${product.title}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInstantBuy = (product: ProductItem) => {
    handleAddToCart(product);
    router.push(`/${code.toLowerCase()}/checkout`);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header currentCountry={config.code} />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-5">
          <span className="text-emerald-400 font-bold text-sm">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Results Summary Header */}
      <div className="bg-[#f8fafc] border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Link href={`/${code.toLowerCase()}`} className="hover:text-emerald-700 font-medium">
              Home
            </Link>
            <span>›</span>
            <span className="font-semibold text-slate-900">
              {categoryParam && query
                ? `“${query}” in ${categoryParam}`
                : categoryParam
                ? `Category: ${categoryParam}`
                : query
                ? `Search: “${query}”`
                : 'All Categories'}
            </span>
            <span className="text-slate-400 font-mono">
              ({displayCatalog.length} products available for trial)
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Subtype Filter Pills */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-[1500px] mx-auto flex items-center gap-2 whitespace-nowrap">
          {narrowPills.map((pill) => {
            const isSelected = selectedPill === pill.label;
            return (
              <button
                key={pill.label}
                type="button"
                onClick={() => setSelectedPill(pill.label)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f172a] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Left Filter Sidebar */}
        <aside className="w-full md:w-60 shrink-0 space-y-6 text-xs text-slate-700">
          {/* Price Range Filter */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Price Filter</h4>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under35k', label: `Under ${currencySymbol} 35,000` },
                { id: '35kto80k', label: `${currencySymbol} 35,000 - ${currencySymbol} 80,000` },
                { id: 'above80k', label: `Above ${currencySymbol} 80,000` },
              ].map((tier) => (
                <label key={tier.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceTier"
                    checked={selectedTier === tier.id}
                    onChange={() => setSelectedTier(tier.id)}
                    className="accent-emerald-600"
                  />
                  <span>{tier.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Customer Reviews</h4>
            <div className="space-y-1.5">
              {[
                { min: 4, label: '4 Stars & Up ★★★★☆' },
                { min: 3, label: '3 Stars & Up ★★★☆☆' },
                { min: 0, label: 'All Ratings' },
              ].map((r) => (
                <button
                  key={r.min}
                  type="button"
                  onClick={() => setMinRating(r.min)}
                  className={`block text-left py-0.5 hover:text-amber-700 cursor-pointer ${
                    minRating === r.min ? 'font-bold text-amber-900' : ''
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => {
              setSelectedPill('All');
              setSelectedTier('all');
              setMinRating(0);
              setSortBy('featured');
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Right Products Grid / List */}
        <section className="flex-1">
          {filteredCatalog.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-6 text-xs flex items-center justify-between">
              <span>
                💡 No direct products matched this narrow filter. Showing all available trial items below:
              </span>
              <button
                type="button"
                onClick={() => setSelectedPill('All')}
                className="font-bold underline cursor-pointer"
              >
                Clear Subtype Filter
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayCatalog.map((product) => {
              const price = getPrice(product);
              const discountPercent = Math.round(
                ((price.original - price.current) / price.original) * 100
              );

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Product Image */}
                    <div className="aspect-square w-full rounded-xl bg-slate-50 overflow-hidden mb-3 relative flex items-center justify-center p-3">
                      {product.prime && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-md shadow-xs">
                          PRIME
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Category & Title */}
                    <div className="space-y-1 mb-2">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        {product.category} • {product.brand}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {product.subSpec}
                      </p>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-2">
                      <span>{'★'.repeat(Math.floor(product.rating))}</span>
                      <span className="text-slate-500 text-[11px] font-medium">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.badges.map((b) => (
                        <span
                          key={b}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 mt-2 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          {currencySymbol} {price.current.toLocaleString()}
                        </span>
                        {price.original > price.current && (
                          <span className="text-xs text-slate-400 line-through">
                            {currencySymbol} {price.original.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-600">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Interactive Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>🛒</span>
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInstantBuy(product)}
                        className="py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>⚡</span>
                        <span>Instant Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Dhanshree Signature Footer */}
      <DhanshreeFooter countryCode={config.code} />
    </div>
  );
}
