import { CountryCode, CurrencyCode } from '../constants/countries.js';

// --- eBay-Style Auctions & Offers ---
export interface AuctionItem {
  id: string;
  productId: string;
  title: string;
  thumbnailUrl: string;
  countryCode: CountryCode;
  currency: CurrencyCode;
  startingPrice: number;
  currentBid: number;
  reservePrice?: number;
  minBidIncrement: number;
  totalBidsCount: number;
  highestBidderMasked: string;
  endsAt: string;
  status: 'ACTIVE' | 'ENDED' | 'RESERVE_NOT_MET';
  allowOffers: boolean;
}

export interface AuctionBidEntry {
  id: string;
  auctionId: string;
  bidderMasked: string;
  amount: number;
  currency: CurrencyCode;
  createdAt: string;
}

export interface MakeOfferInput {
  auctionId: string;
  buyerName: string;
  buyerEmail: string;
  offerAmount: number;
  message?: string;
}

export interface MakeOfferResult {
  offerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  offerAmount: number;
  counterAmount?: number;
  message: string;
}

// --- Alibaba-Style RFQ Wholesale & Tiered Pricing ---
export interface TieredPriceBracket {
  minQty: number;
  maxQty?: number;
  discountPercent: number;
  unitPrice: number;
}

export interface RfqInquiryInput {
  productId?: string;
  productTitle: string;
  category: string;
  requestedQuantity: number;
  targetPricePerUnit: number;
  currency: CurrencyCode;
  destinationCountry: CountryCode;
  businessName: string;
  businessTaxId: string; // PAN for NP, GSTIN for IN, TRN for AE
  contactEmail: string;
  contactPhone: string;
  notes?: string;
}

export interface RfqInquiryResult {
  rfqId: string;
  referenceNumber: string;
  status: 'SUBMITTED' | 'MATCHING_SUPPLIERS' | 'QUOTES_RECEIVED';
  estimatedQuotesCount: number;
  createdAt: string;
}

// --- Seller Sponsored Ads (PPC Engine) ---
export interface SponsoredCampaign {
  id: string;
  sellerId: string;
  campaignName: string;
  productSku: string;
  productTitle: string;
  dailyBudget: number;
  currency: CurrencyCode;
  maxCpc: number; // Cost per click
  impressionsCount: number;
  clicksCount: number;
  spentAmount: number;
  status: 'ACTIVE' | 'PAUSED' | 'BUDGET_EXHAUSTED';
}

// --- Amazon Prime-Style Paid Membership & Loyalty ---
export interface PrimeMembershipBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface LoyaltyWalletBalance {
  availablePoints: number;
  pointsValueLocalCurrency: number;
  currency: CurrencyCode;
  isPrimeMember: boolean;
  primeExpiresAt?: string;
}

// --- AI Shopping Assistant ---
export interface AiChatPrompt {
  countryCode: CountryCode;
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
}

export interface AiProductRecommendation {
  id: string;
  title: string;
  price: number;
  currency: CurrencyCode;
  rating: number;
  image: string;
  slug: string;
  badge?: string;
}

export interface AiChatResponse {
  reply: string;
  recommendations: AiProductRecommendation[];
  intent: 'PRODUCT_RECOMMENDATION' | 'PRICE_COMPARISON' | 'SUPPORT_FAQ' | 'GENERAL_INQUIRY';
}
