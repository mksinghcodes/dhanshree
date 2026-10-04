import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  CountryCode,
  CurrencyCode,
  ListingType,
  ProductDetail,
  ProductSummary,
  SearchProductsResponse,
  convertCurrency,
  COUNTRY_CONFIGS,
} from '@dhanshree/shared';
import { PrismaService } from '../../database/prisma.service';
import { SearchProductsDto } from './dto/search-products.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly mockCatalog: Array<{
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    sku: string;
    categorySlug: string;
    categoryName: string;
    brandName: string;
    brandSlug: string;
    basePriceUsd: number;
    ratingAverage: number;
    reviewCount: number;
    isInStock: boolean;
    isFeatured: boolean;
    listingType: ListingType;
    images: string[];
    variants: Array<{
      id: string;
      sku: string;
      title: string;
      attributes: Record<string, string>;
      quantityAvailable: number;
      warehouse: string;
    }>;
    specifications: Record<string, string>;
    reviews: Array<{
      id: string;
      authorName: string;
      rating: number;
      title: string;
      comment: string;
      isVerifiedPurchase: boolean;
      helpfulVotes: number;
      createdAt: string;
    }>;
  }> = [
    {
      id: 'prod-001',
      title: 'Sony WH-1000XM5 Premium Wireless Noise Cancelling Headphones',
      slug: 'sony-wh-1000xm5-wireless-anc-headphones',
      shortDescription: 'Flagship wireless over-ear headphones with industry-leading dual-chip ANC and 30hr battery',
      description: `The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE Extreme support, and High-Resolution Audio wireless, you'll experience breathtaking sound. Engineered for extreme comfort with soft-fit leather.`,
      sku: 'SONY-WH1000XM5-BLK',
      categorySlug: 'audio-headphones',
      categoryName: 'Headphones & Audio',
      brandName: 'Sony',
      brandSlug: 'sony',
      basePriceUsd: 399.99,
      ratingAverage: 4.8,
      reviewCount: 324,
      isInStock: true,
      isFeatured: true,
      listingType: ListingType.STANDARD,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      ],
      variants: [
        {
          id: 'v-001-blk',
          sku: 'WH5-BLK',
          title: 'Midnight Black',
          attributes: { color: 'Black', edition: 'Standard' },
          quantityAvailable: 45,
          warehouse: 'Primary Regional Hub',
        },
        {
          id: 'v-001-slv',
          sku: 'WH5-SLV',
          title: 'Platinum Silver',
          attributes: { color: 'Silver', edition: 'Standard' },
          quantityAvailable: 28,
          warehouse: 'Primary Regional Hub',
        },
      ],
      specifications: {
        'Battery Life': 'Up to 30 hours (ANC On), 40 hours (ANC Off)',
        'Bluetooth Version': '5.2 with LDAC, AAC, SBC',
        'Weight': '250 grams',
        'Driver Unit': '30mm Carbon Fiber Composite',
        'Charging': 'USB-C Fast Charge (3 min charge = 3 hours playback)',
        'Warranty': '1 Year Brand Manufacturer Warranty',
      },
      reviews: [
        {
          id: 'rev-001',
          authorName: 'Bibek Sharma',
          rating: 5,
          title: 'Best ANC headphones in Kathmandu!',
          comment: 'Noise cancellation completely shuts out traffic noise. Battery lasts nearly the whole week. Premium feel.',
          isVerifiedPurchase: true,
          helpfulVotes: 42,
          createdAt: '2026-09-15',
        },
        {
          id: 'rev-002',
          authorName: 'Rohan Gupta',
          rating: 5,
          title: 'Unbelievable call clarity in Mumbai commute',
          comment: 'Mic picks up voice crystal clear even on local trains. Worth every rupee.',
          isVerifiedPurchase: true,
          helpfulVotes: 18,
          createdAt: '2026-09-22',
        },
      ],
    },
    {
      id: 'prod-002',
      title: 'Authentic Handcrafted Nepali Singing Bowl & Wooden Mallet Set',
      slug: 'nepali-handmade-singing-bowl-set',
      shortDescription: '7-Metal hand-hammered Tibetan meditation singing bowl from Patan, Kathmandu',
      description: `Traditional 7-metal singing bowl handcrafted by master artisans in Patan, Nepal. Produces deep, resonant acoustic harmonics ideal for meditation, chakra balance, yoga studios, and stress reduction. Complete with suede-wrapped rosewood striker and silk ring cushion.`,
      sku: 'NPL-SNG-BWL-07',
      categorySlug: 'singing-bowls-crafts',
      categoryName: 'Singing Bowls & Thangka Art',
      brandName: 'Himalayan Organic Tea Co.',
      brandSlug: 'himalayan-tea-co',
      basePriceUsd: 65.0,
      ratingAverage: 4.9,
      reviewCount: 156,
      isInStock: true,
      isFeatured: true,
      listingType: ListingType.STANDARD,
      images: [
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      ],
      variants: [
        {
          id: 'v-002-med',
          sku: 'BWL-MED-15CM',
          title: 'Medium (15cm Diameter)',
          attributes: { size: '15cm', keyNote: 'F Heart Chakra' },
          quantityAvailable: 60,
          warehouse: 'Kathmandu Craft Warehouse',
        },
        {
          id: 'v-002-lrg',
          sku: 'BWL-LRG-20CM',
          title: 'Large (20cm Diameter)',
          attributes: { size: '20cm', keyNote: 'C Root Chakra' },
          quantityAvailable: 25,
          warehouse: 'Kathmandu Craft Warehouse',
        },
      ],
      specifications: {
        'Origin': 'Patan, Lalitpur, Nepal',
        'Materials': 'Traditional 7-metal alloy (Copper, Tin, Iron, Zinc, Lead, Silver, Gold)',
        'Includes': 'Singing bowl, Rosewood striker, Embroidered cushion',
        'Weight': '850 grams',
      },
      reviews: [
        {
          id: 'rev-003',
          authorName: 'Sarah Jenkins (Dubai)',
          rating: 5,
          title: 'The resonance lasts for minutes!',
          comment: 'Authentic handmade quality. Beautiful craftsmanship and fast shipping to Dubai.',
          isVerifiedPurchase: true,
          helpfulVotes: 29,
          createdAt: '2026-08-30',
        },
      ],
    },
    {
      id: 'prod-003',
      title: 'Royal Dehn Al Oud Cambodi Pure Concentrated Perfume Oil',
      slug: 'royal-dehn-al-oud-cambodi-oil',
      shortDescription: 'Aged 12-year wild agarwood distilled perfume oil presented in crystal flacon',
      description: `Sourced from sustainable wild agarwood forests and aged for 12 years in traditional copper stills. Deeply smoky, woody, and resinous with balsamic undertones. A timeless oriental signature luxury fragrance that radiates for 24+ hours.`,
      sku: 'OUD-ROYAL-CAMBODI-12ML',
      categorySlug: 'oud-bakhoor',
      categoryName: 'Pure Dehn Al Oud & Bakhoor Incense',
      brandName: 'Al-Mansoor Arabian Oud',
      brandSlug: 'al-mansoor-oud',
      basePriceUsd: 185.0,
      ratingAverage: 5.0,
      reviewCount: 94,
      isInStock: true,
      isFeatured: true,
      listingType: ListingType.STANDARD,
      images: [
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
      ],
      variants: [
        {
          id: 'v-003-tola',
          sku: 'OUD-1-TOLA',
          title: '1 Tola (12ml)',
          attributes: { volume: '12ml', flacon: 'Crystal Gilt' },
          quantityAvailable: 35,
          warehouse: 'Dubai Al Quoz Vault',
        },
      ],
      specifications: {
        'Origin': 'Distilled & Aged in UAE',
        'Concentration': '100% Pure Attar Oil (Alcohol-Free)',
        'Sillage': 'Intense & Majestic',
        'Longevity': '24+ Hours on Skin',
      },
      reviews: [
        {
          id: 'rev-004',
          authorName: 'Ahmed Al-Falasi',
          rating: 5,
          title: 'Masterpiece oud',
          comment: 'Very smooth opening without harshness, develops into a warm earthy sweetness. 10/10.',
          isVerifiedPurchase: true,
          helpfulVotes: 37,
          createdAt: '2026-09-18',
        },
      ],
    },
    {
      id: 'prod-004',
      title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
      slug: 'apple-iphone-15-pro-max-256gb',
      shortDescription: 'Titanium design, A17 Pro chip, Action button, and 5x optical zoom camera system',
      description: `Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever. Available with local carrier certification and warranty across Nepal, India, and UAE.`,
      sku: 'APL-IP15PM-256-NAT',
      categorySlug: 'smartphones',
      categoryName: 'Mobiles & Smartphones',
      brandName: 'Apple',
      brandSlug: 'apple',
      basePriceUsd: 1199.0,
      ratingAverage: 4.9,
      reviewCount: 512,
      isInStock: true,
      isFeatured: true,
      listingType: ListingType.STANDARD,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1695048133021-39e2463e2363?w=800',
      ],
      variants: [
        {
          id: 'v-004-nat',
          sku: 'IP15PM-256-NAT',
          title: 'Natural Titanium / 256GB',
          attributes: { color: 'Natural Titanium', storage: '256GB' },
          quantityAvailable: 18,
          warehouse: 'Primary Regional Hub',
        },
        {
          id: 'v-004-blk',
          sku: 'IP15PM-256-BLK',
          title: 'Black Titanium / 256GB',
          attributes: { color: 'Black Titanium', storage: '256GB' },
          quantityAvailable: 22,
          warehouse: 'Primary Regional Hub',
        },
      ],
      specifications: {
        'Display': '6.7-inch Super Retina XDR with ProMotion 120Hz',
        'Processor': 'A17 Pro chip with 6-core GPU',
        'Camera': '48MP Main | 12MP Ultra Wide | 12MP 5x Telephoto',
        'Connector': 'USB-C with USB 3 speeds (up to 10Gb/s)',
      },
      reviews: [
        {
          id: 'rev-005',
          authorName: 'Kunal Verma',
          rating: 5,
          title: 'Camera quality is mindblowing',
          comment: 'The 5x lens is sharp as a tack. Battery lasts all day with heavy usage.',
          isVerifiedPurchase: true,
          helpfulVotes: 58,
          createdAt: '2026-09-28',
        },
      ],
    },
  ];

  async searchProducts(dto: SearchProductsDto): Promise<SearchProductsResponse> {
    const country = dto.countryCode || CountryCode.NEPAL;
    let list = [...this.mockCatalog];

    // Keyword filter
    if (dto.q && dto.q.trim()) {
      const q = dto.q.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (dto.categorySlug) {
      list = list.filter((p) => p.categorySlug.toLowerCase() === dto.categorySlug?.toLowerCase());
    }

    // Brand filter
    if (dto.brandSlug) {
      list = list.filter((p) => p.brandSlug.toLowerCase() === dto.brandSlug?.toLowerCase());
    }

    // Rating filter
    if (dto.minRating) {
      list = list.filter((p) => p.ratingAverage >= (dto.minRating || 0));
    }

    // In stock filter
    if (dto.inStockOnly) {
      list = list.filter((p) => p.isInStock);
    }

    // Map to localized prices
    const products: ProductSummary[] = list.map((item) => {
      const price = this.calculateLocalizedPrice(item.basePriceUsd, country);
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        sku: item.sku,
        thumbnailUrl: item.images[0],
        brand: {
          id: `brand-${item.brandSlug}`,
          name: item.brandName,
          slug: item.brandSlug,
        },
        category: {
          id: `cat-${item.categorySlug}`,
          name: item.categoryName,
          slug: item.categorySlug,
        },
        store: {
          id: 'store-verified',
          name: 'Dhanshree Verified Partner',
          slug: 'Dhanshree-partner',
          ratingAverage: item.ratingAverage,
        },
        price,
        listingType: item.listingType,
        ratingAverage: item.ratingAverage,
        reviewCount: item.reviewCount,
        isInStock: item.isInStock,
        isFeatured: item.isFeatured,
      };
    });

    // Price range filtering on localized currency
    let filtered = products;
    if (dto.minPrice !== undefined) {
      filtered = filtered.filter((p) => (p.price.salePrice ?? p.price.originalPrice) >= dto.minPrice!);
    }
    if (dto.maxPrice !== undefined) {
      filtered = filtered.filter((p) => (p.price.salePrice ?? p.price.originalPrice) <= dto.maxPrice!);
    }

    // Sorting
    switch (dto.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => (a.price.salePrice ?? a.price.originalPrice) - (b.price.salePrice ?? b.price.originalPrice));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.price.salePrice ?? b.price.originalPrice) - (a.price.salePrice ?? a.price.originalPrice));
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratingAverage - a.ratingAverage);
        break;
      case 'newest':
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    // Compute dynamic facets
    const categoryCounts: Record<string, { label: string; count: number }> = {};
    const brandCounts: Record<string, { label: string; count: number }> = {};
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((p) => {
      const effectivePrice = p.price.salePrice ?? p.price.originalPrice;
      if (effectivePrice < minPrice) minPrice = effectivePrice;
      if (effectivePrice > maxPrice) maxPrice = effectivePrice;

      if (!categoryCounts[p.category.slug]) {
        categoryCounts[p.category.slug] = { label: p.category.name, count: 0 };
      }
      categoryCounts[p.category.slug].count++;

      if (p.brand) {
        if (!brandCounts[p.brand.slug]) {
          brandCounts[p.brand.slug] = { label: p.brand.name, count: 0 };
        }
        brandCounts[p.brand.slug].count++;
      }
    });

    return {
      query: dto.q || '',
      country,
      totalResults: filtered.length,
      page: dto.page || 1,
      totalPages: Math.ceil(filtered.length / (dto.limit || 20)) || 1,
      products: filtered,
      facets: {
        categories: Object.entries(categoryCounts).map(([key, val]) => ({
          key,
          label: val.label,
          count: val.count,
          selected: key === dto.categorySlug,
        })),
        brands: Object.entries(brandCounts).map(([key, val]) => ({
          key,
          label: val.label,
          count: val.count,
          selected: key === dto.brandSlug,
        })),
        priceRange: {
          min: minPrice === Infinity ? 0 : Math.floor(minPrice),
          max: Math.ceil(maxPrice) || 100000,
        },
        ratings: [
          { key: '4', label: '4 Stars & Up', count: products.filter((p) => p.ratingAverage >= 4).length },
          { key: '3', label: '3 Stars & Up', count: products.filter((p) => p.ratingAverage >= 3).length },
        ],
      },
    };
  }

  async getProductBySlug(slug: string, countryCode?: CountryCode): Promise<ProductDetail> {
    const country = countryCode || CountryCode.NEPAL;
    const raw = this.mockCatalog.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

    if (!raw) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }

    const price = this.calculateLocalizedPrice(raw.basePriceUsd, country);

    const related = this.mockCatalog
      .filter((p) => p.id !== raw.id)
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        sku: item.sku,
        thumbnailUrl: item.images[0],
        category: { id: `cat-${item.categorySlug}`, name: item.categoryName, slug: item.categorySlug },
        store: { id: 'store-verified', name: 'Dhanshree Partner', slug: 'Dhanshree-partner', ratingAverage: 4.8 },
        price: this.calculateLocalizedPrice(item.basePriceUsd, country),
        listingType: item.listingType,
        ratingAverage: item.ratingAverage,
        reviewCount: item.reviewCount,
        isInStock: item.isInStock,
        isFeatured: item.isFeatured,
      }));

    return {
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      shortDescription: raw.shortDescription,
      description: raw.description,
      sku: raw.sku,
      thumbnailUrl: raw.images[0],
      brand: { id: `brand-${raw.brandSlug}`, name: raw.brandName, slug: raw.brandSlug },
      category: { id: `cat-${raw.categorySlug}`, name: raw.categoryName, slug: raw.categorySlug },
      store: {
        id: 'store-sony-official',
        name: `${raw.brandName} Official Store`,
        slug: `${raw.brandSlug}-official`,
        ratingAverage: 4.9,
      },
      price,
      listingType: raw.listingType,
      ratingAverage: raw.ratingAverage,
      reviewCount: raw.reviewCount,
      isInStock: raw.isInStock,
      isFeatured: raw.isFeatured,
      images: raw.images.map((url, i) => ({
        id: `img-${i}`,
        url,
        altText: `${raw.title} view ${i + 1}`,
        sortOrder: i,
        isThumbnail: i === 0,
        mediaType: 'IMAGE',
      })),
      variants: raw.variants.map((v) => ({
        ...v,
        productId: raw.id,
      })),
      availableColors: raw.variants.map((v) => v.attributes.color).filter(Boolean),
      availableSizes: raw.variants.map((v) => v.attributes.size).filter(Boolean),
      specifications: raw.specifications,
      ratingBreakdown: {
        averageRating: raw.ratingAverage,
        totalReviews: raw.reviewCount,
        fiveStarCount: Math.round(raw.reviewCount * 0.8),
        fourStarCount: Math.round(raw.reviewCount * 0.15),
        threeStarCount: Math.round(raw.reviewCount * 0.04),
        twoStarCount: Math.round(raw.reviewCount * 0.01),
        oneStarCount: 0,
      },
      recentReviews: raw.reviews,
      relatedProducts: related,
      frequentlyBoughtTogether: related.slice(0, 2),
      seo: {
        title: `${raw.title} - Buy Online in ${COUNTRY_CONFIGS[country].name}`,
        description: raw.shortDescription,
        keywords: `${raw.title}, ${raw.brandName}, buy online ${country}`,
        canonicalUrl: `https://Dhanshree.com/${country.toLowerCase()}/products/${raw.slug}`,
      },
    };
  }

  async createProduct(sellerId: string, dto: CreateProductDto) {
    this.logger.log(`Vendor ${sellerId} listing new product: ${dto.title}`);
    return {
      status: 'SUCCESS',
      message: 'Product listing submitted for review and indexed in Meilisearch',
      product: {
        id: `prod-${Date.now()}`,
        sellerId,
        ...dto,
        slug: dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        status: 'UNDER_REVIEW',
        createdAt: new Date().toISOString(),
      },
    };
  }

  private calculateLocalizedPrice(baseUsd: number, country: CountryCode) {
    switch (country) {
      case CountryCode.NEPAL: {
        const converted = convertCurrency(baseUsd, CurrencyCode.NPR, CurrencyCode.NPR, {
          [CurrencyCode.NPR]: 1 / 133.5, // 1 USD = 133.5 NPR
        });
        const rounded = Math.round(converted);
        return {
          countryCode: CountryCode.NEPAL,
          currency: CurrencyCode.NPR,
          originalPrice: rounded,
          salePrice: Math.round(rounded * 0.9), // 10% promotional deal
          discountPercentage: 10,
          taxLabel: 'Includes Nepal VAT (13%)',
        };
      }
      case CountryCode.INDIA: {
        const converted = convertCurrency(baseUsd, CurrencyCode.INR, CurrencyCode.INR, {
          [CurrencyCode.INR]: 1 / 83.4, // 1 USD = 83.4 INR
        });
        const rounded = Math.round(converted);
        return {
          countryCode: CountryCode.INDIA,
          currency: CurrencyCode.INR,
          originalPrice: rounded,
          salePrice: Math.round(rounded * 0.92),
          discountPercentage: 8,
          taxLabel: 'Includes GST (CGST/SGST/IGST)',
        };
      }
      case CountryCode.UAE: {
        const converted = convertCurrency(baseUsd, CurrencyCode.AED, CurrencyCode.AED, {
          [CurrencyCode.AED]: 1 / 3.6725, // 1 USD = 3.6725 AED
        });
        const rounded = Math.round(converted);
        return {
          countryCode: CountryCode.UAE,
          currency: CurrencyCode.AED,
          originalPrice: rounded,
          salePrice: Math.round(rounded * 0.95),
          discountPercentage: 5,
          taxLabel: 'Includes UAE 5% VAT (TRN)',
        };
      }
    }
  }
}
