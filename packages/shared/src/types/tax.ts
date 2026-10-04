import { CountryCode } from '../constants/countries.js';

export enum TaxType {
  NEPAL_VAT = 'NEPAL_VAT',
  INDIA_GST_INTRA = 'INDIA_GST_INTRA', // CGST + SGST
  INDIA_GST_INTER = 'INDIA_GST_INTER', // IGST
  UAE_VAT = 'UAE_VAT',
  EXEMPT = 'EXEMPT',
  ZERO_RATED = 'ZERO_RATED',
}

export interface TaxCalculationResult {
  country: CountryCode;
  taxableAmount: number;
  taxType: TaxType;
  totalTax: number;
  ratePercent: number;
  breakdown: {
    // Nepal
    nepalVatAmount?: number;
    // India
    cgstAmount?: number;
    cgstPercent?: number;
    sgstAmount?: number;
    sgstPercent?: number;
    igstAmount?: number;
    igstPercent?: number;
    hsnCode?: string;
    indiaTcsAmount?: number; // 1% TCS under Section 52 of CGST Act
    // UAE
    uaeVatAmount?: number;
    trnNumber?: string;
  };
}
