export enum ProductStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

export enum ListingType {
  STANDARD = 'STANDARD', // Amazon/Flipkart Buy Now
  AUCTION = 'AUCTION', // eBay-style bidding
  RFQ_BULK = 'RFQ_BULK', // Alibaba-style tiered quotes
}

export enum AuctionStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
  RESERVE_NOT_MET = 'RESERVE_NOT_MET',
}

export interface ProductPriceRecord {
  countryCode: string;
  currency: string;
  originalPrice: number;
  salePrice?: number;
  costPrice?: number;
}
