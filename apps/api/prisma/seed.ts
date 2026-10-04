import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dhanshree Database Seeding (Nepal, India, UAE)...');

  // 1. Seed Countries
  const countries = [
    {
      code: 'NP',
      name: 'Nepal',
      nativeName: 'नेपाल',
      defaultCurrency: 'NPR',
      defaultLanguage: 'ne',
      phonePrefix: '+977',
      isRtlDefault: false,
    },
    {
      code: 'IN',
      name: 'India',
      nativeName: 'भारत',
      defaultCurrency: 'INR',
      defaultLanguage: 'hi',
      phonePrefix: '+91',
      isRtlDefault: false,
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      nativeName: 'الإمارات العربية المتحدة',
      defaultCurrency: 'AED',
      defaultLanguage: 'ar',
      phonePrefix: '+971',
      isRtlDefault: true,
    },
  ];

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log('✅ Countries seeded: NP, IN, AE');

  // 2. Seed Currencies
  const currencies = [
    { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रु', exchangeRateToBase: 133.5, decimalDigits: 2 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRateToBase: 83.4, decimalDigits: 2 },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', exchangeRateToBase: 3.6725, decimalDigits: 2 },
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRateToBase: 1.0, decimalDigits: 2 },
  ];

  for (const curr of currencies) {
    await prisma.currency.upsert({
      where: { code: curr.code },
      update: curr,
      create: curr,
    });
  }
  console.log('✅ Currencies seeded: NPR, INR, AED, USD');

  // 3. Seed Tax Rules
  const taxRules = [
    {
      countryCode: 'NP',
      taxType: 'NEPAL_VAT',
      name: 'Nepal Standard VAT (13%)',
      ratePercent: 13.0,
      tcsPercent: 0.0,
    },
    {
      countryCode: 'IN',
      taxType: 'INDIA_GST_INTRA',
      name: 'India GST Intrastate (CGST 9% + SGST 9%)',
      ratePercent: 18.0,
      hsnSacCode: '8517',
      tcsPercent: 1.0,
    },
    {
      countryCode: 'IN',
      taxType: 'INDIA_GST_INTER',
      name: 'India GST Interstate (IGST 18%)',
      ratePercent: 18.0,
      hsnSacCode: '8517',
      tcsPercent: 1.0,
    },
    {
      countryCode: 'AE',
      taxType: 'UAE_VAT',
      name: 'UAE Standard VAT (5%)',
      ratePercent: 5.0,
      tcsPercent: 0.0,
    },
  ];

  for (const tr of taxRules) {
    const existing = await prisma.taxRule.findFirst({
      where: { countryCode: tr.countryCode, taxType: tr.taxType },
    });
    if (!existing) {
      await prisma.taxRule.create({ data: tr });
    }
  }
  console.log('✅ Tax rules seeded: Nepal VAT, India GST/TCS, UAE VAT');

  // 4. Seed Demo Users & Roles
  const seedPassword =
    process.env.SEED_DEFAULT_PASSWORD ||
    (process.env.NODE_ENV === 'production'
      ? (() => {
          throw new Error('SEED_DEFAULT_PASSWORD environment variable must be specified for seeding in production');
        })()
      : 'MarketplaceSecret2026!');
  const defaultPassword = await bcrypt.hash(seedPassword, 10);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@dhanshree.com' },
    update: {},
    create: {
      email: 'superadmin@dhanshree.com',
      passwordHash: defaultPassword,
      fullName: 'Dhanshree Super Administrator',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      preferredCountry: 'AE',
      preferredCurrency: 'AED',
    },
  });

  // Nepal Seller
  const nepalSellerUser = await prisma.user.upsert({
    where: { email: 'seller.nepal@dhanshree.com' },
    update: {},
    create: {
      email: 'seller.nepal@dhanshree.com',
      passwordHash: defaultPassword,
      fullName: 'Pasang Sherpa',
      phoneNumber: '+9779841112233',
      role: 'SELLER',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      preferredCountry: 'NP',
      preferredCurrency: 'NPR',
    },
  });

  const nepalSellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: nepalSellerUser.id },
    update: {},
    create: {
      userId: nepalSellerUser.id,
      companyName: 'Himalayan Organic Crafts Pvt. Ltd.',
      businessType: 'PVT_LTD',
      operationalCountry: 'NP',
      kycStatus: 'APPROVED',
      nepalPanVatNumber: '601234567',
      bankName: 'Nabil Bank Ltd.',
      bankAccountNumber: '01201017500123',
      bankBranchOrIfsc: 'Teendhara Branch, Kathmandu',
      commissionRate: 8.5,
      isFeaturedSeller: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.store.upsert({
    where: { slug: 'himalayan-organics' },
    update: {},
    create: {
      sellerId: nepalSellerProfile.id,
      name: 'Himalayan Organics Store',
      slug: 'himalayan-organics',
      description: 'Finest organic teas, spices, and artisanal crafts from Nepal',
      ratingAverage: 4.9,
      ratingCount: 128,
    },
  });

  // India Seller
  const indiaSellerUser = await prisma.user.upsert({
    where: { email: 'seller.india@dhanshree.com' },
    update: {},
    create: {
      email: 'seller.india@dhanshree.com',
      passwordHash: defaultPassword,
      fullName: 'Vikram Mehta',
      phoneNumber: '+919820011223',
      role: 'SELLER',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      preferredCountry: 'IN',
      preferredCurrency: 'INR',
    },
  });

  const indiaSellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: indiaSellerUser.id },
    update: {},
    create: {
      userId: indiaSellerUser.id,
      companyName: 'Bharat Electronics & Tech Solutions LLP',
      businessType: 'LLC',
      operationalCountry: 'IN',
      kycStatus: 'APPROVED',
      indiaPanNumber: 'AABCB1234D',
      indiaGstinNumber: '27AABCB1234D1Z5',
      bankName: 'HDFC Bank',
      bankAccountNumber: '50100234567890',
      bankBranchOrIfsc: 'HDFC0000060',
      commissionRate: 10.0,
      isFeaturedSeller: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.store.upsert({
    where: { slug: 'bharat-gadgets' },
    update: {},
    create: {
      sellerId: indiaSellerProfile.id,
      name: 'Bharat Gadgets Direct',
      slug: 'bharat-gadgets',
      description: 'Official electronics, smart wearables, and mobile accessories with pan-India warranty',
      ratingAverage: 4.8,
      ratingCount: 310,
    },
  });

  // UAE Seller
  const uaeSellerUser = await prisma.user.upsert({
    where: { email: 'seller.uae@dhanshree.com' },
    update: {},
    create: {
      email: 'seller.uae@dhanshree.com',
      passwordHash: defaultPassword,
      fullName: 'Tariq Al-Mansoor',
      phoneNumber: '+971501234567',
      role: 'SELLER',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      preferredCountry: 'AE',
      preferredCurrency: 'AED',
    },
  });

  const uaeSellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: uaeSellerUser.id },
    update: {},
    create: {
      userId: uaeSellerUser.id,
      companyName: 'Gulf Luxury Goods Trading LLC',
      businessType: 'LLC',
      operationalCountry: 'AE',
      kycStatus: 'APPROVED',
      uaeTradeLicenseNo: 'TL-DXB-2024-88412',
      uaeVatTrnNumber: '100234567800003',
      bankName: 'Emirates NBD',
      bankIbanOrSwift: 'AE070331234567890123456',
      commissionRate: 12.0,
      isFeaturedSeller: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.store.upsert({
    where: { slug: 'gulf-luxury-boutique' },
    update: {},
    create: {
      sellerId: uaeSellerProfile.id,
      name: 'Gulf Luxury Boutique Dubai',
      slug: 'gulf-luxury-boutique',
      description: 'Luxury perfumes, watches, and Arabian fashion with express same-day Dubai delivery',
      ratingAverage: 5.0,
      ratingCount: 89,
    },
  });

  // Kathmandu Buyer with localized Nepal address
  const nepalBuyer = await prisma.user.upsert({
    where: { email: 'buyer.nepal@dhanshree.com' },
    update: {},
    create: {
      email: 'buyer.nepal@dhanshree.com',
      passwordHash: defaultPassword,
      fullName: 'Aayush Adhikari',
      phoneNumber: '+9779851098765',
      role: 'BUYER',
      status: 'ACTIVE',
      preferredCountry: 'NP',
      preferredCurrency: 'NPR',
    },
  });

  await prisma.address.create({
    data: {
      userId: nepalBuyer.id,
      countryCode: 'NP',
      fullName: 'Aayush Adhikari',
      phone: '+9779851098765',
      isDefaultShipping: true,
      isDefaultBilling: true,
      province: 'Bagmati Province',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      wardNumber: 10,
      toleStreet: 'New Baneshwor, Devkota Marg, House #42',
      landmark: 'Opposite to Parliament Building',
    },
  });

  // 5. Seed Product Categories
  const catElectronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      description: 'Laptops, smartphones, audio devices, and smart accessories',
      displayOrder: 1,
      level: 0,
      hierarchyPath: '/electronics',
      isActive: true,
    },
  });

  const catLaptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops & Computers',
      slug: 'laptops',
      parentId: catElectronics.id,
      description: 'High-performance ultrabooks, MacBooks, and gaming rigs',
      displayOrder: 1,
      level: 1,
      hierarchyPath: `/electronics/laptops`,
      isActive: true,
    },
  });

  const catPhones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones & Accessories',
      slug: 'smartphones',
      parentId: catElectronics.id,
      description: 'Flagship 5G phones, foldable devices, and accessories',
      displayOrder: 2,
      level: 1,
      hierarchyPath: `/electronics/smartphones`,
      isActive: true,
    },
  });

  const catFashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion & Apparel',
      slug: 'fashion',
      description: 'Authentic South Asian ethnic wear, shoes, and modern apparel',
      displayOrder: 2,
      level: 0,
      hierarchyPath: '/fashion',
      isActive: true,
    },
  });

  const catFootwear = await prisma.category.upsert({
    where: { slug: 'footwear' },
    update: {},
    create: {
      name: 'Footwear & Hiking Shoes',
      slug: 'footwear',
      parentId: catFashion.id,
      description: 'Iconic trekking boots, sneakers, and casual shoes',
      displayOrder: 1,
      level: 1,
      hierarchyPath: `/fashion/footwear`,
      isActive: true,
    },
  });

  const catFragrances = await prisma.category.upsert({
    where: { slug: 'fragrances' },
    update: {},
    create: {
      name: 'Luxury Fragrances & Oudh',
      slug: 'fragrances',
      description: 'Authentic Middle Eastern perfumes, attars, and luxury scents',
      displayOrder: 3,
      level: 0,
      hierarchyPath: '/fragrances',
      isActive: true,
    },
  });

  console.log('✅ Categories seeded: Electronics, Laptops, Phones, Fashion, Footwear, Fragrances');

  // 6. Seed Brands
  const brandApple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
      description: 'Think Different - Global premium technology brand',
      isFeatured: true,
    },
  });

  const brandGoldstar = await prisma.brand.upsert({
    where: { slug: 'goldstar' },
    update: {},
    create: {
      name: 'Goldstar Shoes Nepal',
      slug: 'goldstar',
      description: 'Pride of Nepal - World-renowned durable footwear made in Kathmandu',
      isFeatured: true,
    },
  });

  const brandOnePlus = await prisma.brand.upsert({
    where: { slug: 'oneplus' },
    update: {},
    create: {
      name: 'OnePlus',
      slug: 'oneplus',
      description: 'Never Settle - Flagship killer smartphones and tech gear',
      isFeatured: true,
    },
  });

  const brandRasasi = await prisma.brand.upsert({
    where: { slug: 'rasasi' },
    update: {},
    create: {
      name: 'Rasasi Perfumes Dubai',
      slug: 'rasasi',
      description: 'Finest oriental perfumes handcrafted in Dubai since 1979',
      isFeatured: true,
    },
  });

  console.log('✅ Brands seeded: Apple, Goldstar, OnePlus, Rasasi');

  // 7. Seed Products with Variants & Multi-Country Pricing

  // Product 1: Apple MacBook Pro 16 M3 Max
  const pMacbook = await prisma.product.upsert({
    where: { slug: 'apple-macbook-pro-16-m3' },
    update: {},
    create: {
      sellerId: nepalSellerProfile.id,
      storeId: (await prisma.store.findUnique({ where: { slug: 'himalayan-organics' } }))!.id,
      categoryId: catLaptops.id,
      brandId: brandApple.id,
      title: 'Apple MacBook Pro 16" (M3 Max, Liquid Retina XDR)',
      slug: 'apple-macbook-pro-16-m3',
      sku: 'APL-MBP16-M3-001',
      description: 'Unprecedented power with the M3 Max chip, up to 128GB unified memory, and 22-hour battery life.',
      shortDescription: '16.2-inch Liquid Retina XDR display, 36GB Unified RAM, 512GB SSD',
      listingType: 'STANDARD',
      status: 'ACTIVE',
      basePrice: 345000.0,
      baseCurrency: 'NPR',
      ratingAverage: 4.95,
      reviewCount: 42,
      isFeatured: true,
      seoTitle: 'Buy Apple MacBook Pro 16 M3 Max - Best Price in Nepal, India, UAE',
      seoDescription: 'Official Apple authorized warranty with fast doorstep delivery.',
    },
  });

  // Country Prices for MacBook Pro
  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pMacbook.id, countryCode: 'NP' } },
    update: {},
    create: {
      productId: pMacbook.id,
      countryCode: 'NP',
      currency: 'NPR',
      originalPrice: 365000.0,
      salePrice: 345000.0,
      isAvailableInCountry: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pMacbook.id, countryCode: 'IN' } },
    update: {},
    create: {
      productId: pMacbook.id,
      countryCode: 'IN',
      currency: 'INR',
      originalPrice: 269900.0,
      salePrice: 249900.0,
      isAvailableInCountry: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pMacbook.id, countryCode: 'AE' } },
    update: {},
    create: {
      productId: pMacbook.id,
      countryCode: 'AE',
      currency: 'AED',
      originalPrice: 10499.0,
      salePrice: 9999.0,
      isAvailableInCountry: true,
    },
  });

  // Variants for MacBook Pro
  await prisma.productVariant.upsert({
    where: { sku: 'APL-MBP16-M3-BLK' },
    update: {},
    create: {
      productId: pMacbook.id,
      sku: 'APL-MBP16-M3-BLK',
      title: 'Space Black / 36GB / 512GB SSD',
      attributes: { color: 'Space Black', memory: '36GB', storage: '512GB' },
      weightGrams: 2160,
    },
  });

  // Product 2: Goldstar G10 Trekking Shoes
  const pGoldstar = await prisma.product.upsert({
    where: { slug: 'goldstar-g10-trekking-shoes' },
    update: {},
    create: {
      sellerId: nepalSellerProfile.id,
      storeId: (await prisma.store.findUnique({ where: { slug: 'himalayan-organics' } }))!.id,
      categoryId: catFootwear.id,
      brandId: brandGoldstar.id,
      title: 'Goldstar G10 Himalayan Trekker Waterproof Shoes',
      slug: 'goldstar-g10-trekking-shoes',
      sku: 'GLD-G10-TREK-001',
      description: 'The legendary shoe made in Nepal for Himalayan expeditions, tough trails, and everyday comfort.',
      shortDescription: 'Water-resistant mesh, high-grip rubber sole, lightweight design',
      listingType: 'STANDARD',
      status: 'ACTIVE',
      basePrice: 2850.0,
      baseCurrency: 'NPR',
      ratingAverage: 4.88,
      reviewCount: 214,
      isFeatured: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pGoldstar.id, countryCode: 'NP' } },
    update: {},
    create: {
      productId: pGoldstar.id,
      countryCode: 'NP',
      currency: 'NPR',
      originalPrice: 3200.0,
      salePrice: 2850.0,
      isAvailableInCountry: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pGoldstar.id, countryCode: 'IN' } },
    update: {},
    create: {
      productId: pGoldstar.id,
      countryCode: 'IN',
      currency: 'INR',
      originalPrice: 2100.0,
      salePrice: 1799.0,
      isAvailableInCountry: true,
    },
  });

  // Product 3: OnePlus 12 5G (Flowy Emerald)
  const pOneplus = await prisma.product.upsert({
    where: { slug: 'oneplus-12-5g-emerald' },
    update: {},
    create: {
      sellerId: indiaSellerProfile.id,
      storeId: (await prisma.store.findUnique({ where: { slug: 'bharat-gadgets' } }))!.id,
      categoryId: catPhones.id,
      brandId: brandOnePlus.id,
      title: 'OnePlus 12 5G (16GB RAM, 512GB, Flowy Emerald)',
      slug: 'oneplus-12-5g-emerald',
      sku: '1PL-12-5G-GRN',
      description: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera with Periscope Telephoto, 5400mAh battery with 100W SUPERVOOC charging.',
      shortDescription: '6.82" 2K 120Hz ProXDR Display, 50MP Sony LYT-808 sensor',
      listingType: 'STANDARD',
      status: 'ACTIVE',
      basePrice: 64999.0,
      baseCurrency: 'INR',
      ratingAverage: 4.8,
      reviewCount: 95,
      isFeatured: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pOneplus.id, countryCode: 'IN' } },
    update: {},
    create: {
      productId: pOneplus.id,
      countryCode: 'IN',
      currency: 'INR',
      originalPrice: 69999.0,
      salePrice: 64999.0,
      isAvailableInCountry: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pOneplus.id, countryCode: 'AE' } },
    update: {},
    create: {
      productId: pOneplus.id,
      countryCode: 'AE',
      currency: 'AED',
      originalPrice: 2899.0,
      salePrice: 2599.0,
      isAvailableInCountry: true,
    },
  });

  // Product 4: Rasasi Hawas for Men EDP
  const pRasasi = await prisma.product.upsert({
    where: { slug: 'rasasi-hawas-for-men' },
    update: {},
    create: {
      sellerId: uaeSellerProfile.id,
      storeId: (await prisma.store.findUnique({ where: { slug: 'gulf-luxury-boutique' } }))!.id,
      categoryId: catFragrances.id,
      brandId: brandRasasi.id,
      title: 'Rasasi Hawas for Men Eau De Parfum (100ml)',
      slug: 'rasasi-hawas-for-men',
      sku: 'RSS-HWS-EDP-100',
      description: 'Iconic Dubai aquatic-fresh masculine fragrance blending cinnamon, bergamot, orange blossom, and grey ambergris.',
      shortDescription: 'Long-lasting projection, 100ml spray bottle with python metal cap',
      listingType: 'STANDARD',
      status: 'ACTIVE',
      basePrice: 195.0,
      baseCurrency: 'AED',
      ratingAverage: 4.96,
      reviewCount: 168,
      isFeatured: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pRasasi.id, countryCode: 'AE' } },
    update: {},
    create: {
      productId: pRasasi.id,
      countryCode: 'AE',
      currency: 'AED',
      originalPrice: 240.0,
      salePrice: 195.0,
      isAvailableInCountry: true,
    },
  });

  await prisma.productCountryPrice.upsert({
    where: { productId_countryCode: { productId: pRasasi.id, countryCode: 'IN' } },
    update: {},
    create: {
      productId: pRasasi.id,
      countryCode: 'IN',
      currency: 'INR',
      originalPrice: 5200.0,
      salePrice: 4500.0,
      isAvailableInCountry: true,
    },
  });

  console.log('✅ Products seeded: MacBook Pro 16, Goldstar G10, OnePlus 12 5G, Rasasi Hawas');

  // 8. Seed Live Auction (eBay-Style)
  const pAuction = await prisma.product.upsert({
    where: { slug: 'rare-antique-bhaktapur-singing-bowl' },
    update: {},
    create: {
      sellerId: nepalSellerProfile.id,
      storeId: (await prisma.store.findUnique({ where: { slug: 'himalayan-organics' } }))!.id,
      categoryId: catFashion.id,
      title: 'Rare Antique 7-Metal Hand-Hammered Bhaktapur Singing Bowl (circa 1920)',
      slug: 'rare-antique-bhaktapur-singing-bowl',
      sku: 'AUC-BHK-BOWL-01',
      description: 'Handcrafted master meditation bowl from Bhaktapur with acoustic sustain exceeding 45 seconds.',
      listingType: 'AUCTION',
      status: 'ACTIVE',
      basePrice: 5000.0,
      baseCurrency: 'NPR',
    },
  });

  const now = new Date();
  const auctionEnds = new Date(now.getTime() + 48 * 3600 * 1000); // 48 hours later
  const auctionStarts = new Date(now.getTime() - 24 * 3600 * 1000); // 24 hours ago

  await prisma.auction.upsert({
    where: { productId: pAuction.id },
    update: {},
    create: {
      productId: pAuction.id,
      startingBidPrice: 5000.0,
      reservePrice: 10000.0,
      bidIncrement: 500.0,
      currentHighestBid: 12500.0,
      currency: 'NPR',
      status: 'ACTIVE',
      startsAt: auctionStarts,
      endsAt: auctionEnds,
      totalBids: 8,
    },
  });
  console.log('✅ Live Auction seeded: Rare Bhaktapur Singing Bowl (Highest bid: रू 12,500)');

  // 9. Seed Alibaba-Style Wholesale RFQ
  const pRfq = await prisma.product.upsert({
    where: { slug: 'organic-orthodox-himalayan-black-tea-bulk' },
    update: {},
    create: {
      sellerId: nepalSellerProfile.id,
      storeId: (await prisma.store.findUnique({ where: { slug: 'himalayan-organics' } }))!.id,
      categoryId: catFashion.id,
      title: 'Organic Orthodox Himalayan First-Flush Black Tea (Bulk Wholesale)',
      slug: 'organic-orthodox-himalayan-black-tea-bulk',
      sku: 'RFQ-TEA-BLK-500',
      description: 'Single-estate loose leaf orthodox black tea from Ilam, Nepal. High altitude 6,500ft organic certified.',
      listingType: 'RFQ_BULK',
      status: 'ACTIVE',
      basePrice: 2400.0,
      baseCurrency: 'NPR',
    },
  });

  await prisma.rfqInquiry.create({
    data: {
      buyerId: nepalBuyer.id,
      productId: pRfq.id,
      targetQuantity: 1000,
      targetPricePerUnit: 18.0,
      currency: 'USD',
      destinationCountry: 'AE',
      notes: 'Quote requested for air freight CIF Dubai Port with organic phyto-sanitary certificate.',
      status: 'OPEN',
    },
  });
  console.log('✅ Wholesale RFQ inquiry seeded: 1,000 kg Himalayan Tea to Dubai');

  // 10. Seed Verified Product Reviews
  await prisma.review.create({
    data: {
      productId: pGoldstar.id,
      userId: nepalBuyer.id,
      rating: 5,
      title: 'Trek-tested on the Annapurna Circuit!',
      comment: 'Bought these Goldstars right before my trek to Thorong La pass. Absolutely indestructible grip, no blisters, and amazing price.',
      isVerifiedPurchase: true,
      helpfulVotes: 34,
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      productId: pMacbook.id,
      userId: nepalBuyer.id,
      rating: 5,
      title: 'Blazing performance for 8K video & AI workflows',
      comment: 'Arrived in 24 hours in Kathmandu with official VAT invoice for corporate tax deduction. Outstanding machine.',
      isVerifiedPurchase: true,
      helpfulVotes: 18,
      isApproved: true,
    },
  });

  console.log('✅ Customer reviews seeded with verified purchases');
  console.log('================================================================');
  console.log('🎉 Dhanshree Seeding Finished with Complete Multi-Country Data!');
  console.log('================================================================');
}

main()
  .catch((e) => {
    console.error('Seed execution note:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

