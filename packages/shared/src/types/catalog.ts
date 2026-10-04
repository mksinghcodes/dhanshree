import { CountryCode, CurrencyCode } from '../constants/countries.js';
import { ListingType, ProductStatus } from './product.js';

export interface CategoryNode {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder: number;
  level: number;
  hierarchyPath: string;
  children: CategoryNode[];
  productCount?: number;
}

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  isFeatured: boolean;
  productCount?: number;
}

export interface ProductAttribute {
  name: string; // e.g., "Color", "Storage", "Size"
  value: string; // e.g., "Midnight Blue", "256GB", "XL"
}

export interface ProductVariantItem {
  id: string;
  productId: string;
  sku: string;
  barcode?: string | null;
  title: string;
  attributes: Record<string, string>;
  weightGrams?: number | null;
  dimensions?: {
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
  };
  quantityAvailable: number;
  warehouseLocation?: string;
}

export interface ProductMedia {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  isThumbnail: boolean;
  mediaType: 'IMAGE' | 'VIDEO';
}

export interface LocalizedPrice {
  countryCode: CountryCode;
  currency: CurrencyCode;
  originalPrice: number;
  salePrice?: number | null;
  discountPercentage?: number;
  taxLabel: string;
}

export interface ProductReviewItem {
  id: string;
  authorName: string;
  rating: number; // 1-5
  title?: string | null;
  comment?: string | null;
  photoUrls?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export interface RatingBreakdown {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ProductSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  sku: string;
  thumbnailUrl?: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  store: {
    id: string;
    name: string;
    slug: string;
    ratingAverage: number;
  };
  price: LocalizedPrice;
  listingType: ListingType;
  ratingAverage: number;
  reviewCount: number;
  isInStock: boolean;
  isFeatured: boolean;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  images: ProductMedia[];
  variants: ProductVariantItem[];
  availableColors?: string[];
  availableSizes?: string[];
  specifications: Record<string, string>;
  ratingBreakdown: RatingBreakdown;
  recentReviews: ProductReviewItem[];
  relatedProducts: ProductSummary[];
  frequentlyBoughtTogether?: ProductSummary[];
  seo: {
    title: string;
    description: string;
    keywords?: string;
    canonicalUrl: string;
  };
}

export interface SearchProductsQuery {
  q?: string;
  countryCode?: CountryCode;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchFacetItem {
  key: string;
  label: string;
  count: number;
  selected?: boolean;
}

export interface SearchProductsResponse {
  query: string;
  country: CountryCode;
  totalResults: number;
  page: number;
  totalPages: number;
  products: ProductSummary[];
  facets: {
    categories: SearchFacetItem[];
    brands: SearchFacetItem[];
    priceRange: { min: number; max: number };
    ratings: SearchFacetItem[];
  };
}
