import { CountryCode, CurrencyCode } from '../constants/countries.js';
import { TaxCalculationResult } from './tax.js';

export interface CartItemDto {
  variantId: string;
  productId: string;
  title: string;
  variantTitle?: string;
  sku: string;
  thumbnailUrl?: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice?: number;
  currency: CurrencyCode;
  attributes: Record<string, string>;
  sellerId?: string;
  storeName?: string;
}

export interface CartSummary {
  items: CartItemDto[];
  countryCode: CountryCode;
  currency: CurrencyCode;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  appliedCouponCode?: string | null;
  estimatedShipping: number;
  taxCalculation?: TaxCalculationResult;
  totalTax: number;
  codFee: number;
  grandTotal: number;
}

export interface AddToCartRequest {
  variantId: string;
  quantity: number;
  countryCode?: CountryCode;
}

export interface UpdateCartItemRequest {
  variantId: string;
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
  countryCode?: CountryCode;
}
