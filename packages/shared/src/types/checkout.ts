import { CountryCode, CurrencyCode } from '../constants/countries.js';
import { PaymentMethod, PaymentStatus, CodRiskLevel, EscrowStatus } from './payment.js';
import { OrderStatus } from './order.js';
import { TaxCalculationResult } from './tax.js';
import { LocalizedAddress } from './address.js';

export interface CheckoutQuoteRequest {
  countryCode: CountryCode;
  shippingAddressId?: string;
  temporaryAddress?: LocalizedAddress;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  shippingMethod?: 'STANDARD' | 'EXPRESS';
}

export interface CheckoutQuoteResponse {
  countryCode: CountryCode;
  currency: CurrencyCode;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  taxCalculation: TaxCalculationResult;
  isCod: boolean;
  codFee: number;
  codLimitExceeded: boolean;
  codOtpRequired: boolean;
  grandTotal: number;
}

export interface CreateOrderRequest {
  countryCode: CountryCode;
  shippingAddressId?: string;
  shippingAddress?: LocalizedAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  shippingMethod?: 'STANDARD' | 'EXPRESS';
  customerNotes?: string;
  codOtpCode?: string; // Required if COD risk triggered
}

export interface PaymentInitResult {
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: CurrencyCode;

  // Regional Gateway Specific Payloads
  esewaPayload?: {
    actionUrl: string;
    formFields: Record<string, string>;
  };
  khaltiPayload?: {
    paymentUrl: string;
    pidx: string;
  };
  razorpayPayload?: {
    orderId: string;
    keyId: string;
    amountInPaise: number;
    currency: string;
  };
  stripePayload?: {
    clientSecret: string;
    publishableKey: string;
  };
  tabbyPayload?: {
    webUrl: string;
    sessionId: string;
  };
  codPayload?: {
    codFee: number;
    riskScore: number;
    riskLevel: CodRiskLevel;
    otpVerified: boolean;
    dispatchNotice: string;
  };
}

export interface OrderDetailDto {
  id: string;
  orderNumber: string;
  userId: string;
  countryCode: CountryCode;
  currencyCode: CurrencyCode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  grandTotalAmount: number;
  isCod: boolean;
  codFee: number;
  shippingAddress: LocalizedAddress;
  items: Array<{
    id: string;
    productTitle: string;
    variantTitle: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    thumbnailUrl?: string;
    storeName?: string;
  }>;
  timeline: Array<{
    status: string;
    title: string;
    description?: string;
    createdAt: string;
  }>;
  escrowStatus?: EscrowStatus;
  trackingNumber?: string;
  courierPartner?: string;
  createdAt: string;
}
