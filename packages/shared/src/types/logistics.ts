import { CountryCode, CurrencyCode } from '../constants/countries.js';

export interface CourierServiceabilityRequest {
  countryCode: CountryCode;
  postalCodeOrWard: string;
  destinationCity: string;
  weightKg: number;
  isCod: boolean;
}

export interface CourierServiceabilityResult {
  isServiceable: boolean;
  carrierName: string;
  transitTimeDays: string;
  estimatedDeliveryDate: string;
  shippingFee: number;
  codAvailable: boolean;
  currency: CurrencyCode;
}

export interface CrossBorderDutyRequest {
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  category: string;
  declaredValue: number;
  currency: CurrencyCode;
  weightKg: number;
}

export interface CrossBorderDutyResult {
  isAllowed: boolean;
  hsCode: string;
  customsDutyPercent: number;
  customsDutyAmount: number;
  importVatGstPercent: number;
  importVatGstAmount: number;
  carrierClearanceFee: number;
  totalLandedCost: number;
  currency: CurrencyCode;
  notes: string;
}

export interface CarrierTrackingWebhookPayload {
  carrier: string;
  awbNumber: string;
  orderNumber: string;
  event: 'PICKED_UP' | 'IN_TRANSIT_HUB' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELIVERY_FAILED' | 'RTO_INITIATED';
  eventLocation: string;
  timestamp: string;
  signature: string;
  deliveryProofUrl?: string;
  notes?: string;
}
