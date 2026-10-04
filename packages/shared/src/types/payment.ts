import { CurrencyCode } from '../constants/countries.js';

export enum PaymentMethod {
  // Nepal Gateways
  ESEWA = 'ESEWA',
  KHALTI = 'KHALTI',
  IME_PAY = 'IME_PAY',
  FONEPAY_QR = 'FONEPAY_QR',
  CONNECT_IPS = 'CONNECT_IPS',

  // India Gateways
  RAZORPAY = 'RAZORPAY',
  UPI = 'UPI',
  CASHFREE = 'CASHFREE',
  PAYU = 'PAYU',
  NET_BANKING = 'NET_BANKING',
  EMI = 'EMI',

  // UAE Gateways
  STRIPE = 'STRIPE',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  TABBY = 'TABBY', // BNPL
  TAMARA = 'TAMARA', // BNPL
  TELR = 'TELR',
  PAYTABS = 'PAYTABS',

  // Common
  CREDIT_DEBIT_CARD = 'CREDIT_DEBIT_CARD',
  COD = 'COD', // Cash On Delivery
  WALLET = 'WALLET',
}

export enum PaymentStatus {
  INITIALIZED = 'INITIALIZED',
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  ESCROW_HELD = 'ESCROW_HELD',
}

export enum EscrowStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  HELD = 'HELD',
  RELEASED_TO_SELLER = 'RELEASED_TO_SELLER',
  DISPUTED = 'DISPUTED',
  REFUNDED_TO_BUYER = 'REFUNDED_TO_BUYER',
}

export enum CodRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  BLOCKED = 'BLOCKED',
}

export interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: CurrencyCode;
  method: PaymentMethod;
  country: string;
  metadata?: Record<string, unknown>;
}
