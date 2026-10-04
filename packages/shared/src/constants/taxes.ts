import { CountryCode } from './countries.js';
import { TaxType, TaxCalculationResult } from '../types/tax.js';

export interface TaxRateConfig {
  countryCode: CountryCode;
  standardRatePercent: number;
  reducedRatesPercent?: number[];
  taxLabel: string;
  supportsInterstateSplit: boolean;
  tcsPercent: number; // Tax Collected at Source for marketplace operators
}

export const COUNTRY_TAX_CONFIGS: Record<CountryCode, TaxRateConfig> = {
  [CountryCode.NEPAL]: {
    countryCode: CountryCode.NEPAL,
    standardRatePercent: 13.0,
    reducedRatesPercent: [0.0],
    taxLabel: 'Nepal VAT (13%)',
    supportsInterstateSplit: false,
    tcsPercent: 0.0,
  },
  [CountryCode.INDIA]: {
    countryCode: CountryCode.INDIA,
    standardRatePercent: 18.0,
    reducedRatesPercent: [0.0, 5.0, 12.0, 28.0],
    taxLabel: 'India GST (CGST/SGST/IGST)',
    supportsInterstateSplit: true,
    tcsPercent: 1.0, // 1% TCS on net taxable value
  },
  [CountryCode.UAE]: {
    countryCode: CountryCode.UAE,
    standardRatePercent: 5.0,
    reducedRatesPercent: [0.0],
    taxLabel: 'UAE VAT (5%)',
    supportsInterstateSplit: false,
    tcsPercent: 0.0,
  },
};

/**
 * Calculates localized tax breakdown based on buyer and seller country/state.
 */
export function calculateItemTax(params: {
  countryCode: CountryCode;
  amount: number;
  ratePercent?: number;
  sellerState?: string;
  buyerState?: string;
  hsnCode?: string;
  trnNumber?: string;
}): TaxCalculationResult {
  const { countryCode, amount, sellerState, buyerState, hsnCode, trnNumber } = params;
  const config = COUNTRY_TAX_CONFIGS[countryCode];
  const rate = params.ratePercent ?? config.standardRatePercent;

  const totalTax = Number(((amount * rate) / 100).toFixed(2));

  switch (countryCode) {
    case CountryCode.NEPAL: {
      return {
        country: CountryCode.NEPAL,
        taxableAmount: amount,
        taxType: TaxType.NEPAL_VAT,
        totalTax,
        ratePercent: rate,
        breakdown: {
          nepalVatAmount: totalTax,
        },
      };
    }

    case CountryCode.INDIA: {
      const isIntraState =
        sellerState && buyerState
          ? sellerState.trim().toLowerCase() === buyerState.trim().toLowerCase()
          : true;

      const tcsAmount = Number(((amount * config.tcsPercent) / 100).toFixed(2));

      if (isIntraState) {
        const halfRate = rate / 2;
        const halfTax = Number((totalTax / 2).toFixed(2));
        return {
          country: CountryCode.INDIA,
          taxableAmount: amount,
          taxType: TaxType.INDIA_GST_INTRA,
          totalTax,
          ratePercent: rate,
          breakdown: {
            cgstPercent: halfRate,
            cgstAmount: halfTax,
            sgstPercent: halfRate,
            sgstAmount: halfTax,
            hsnCode,
            indiaTcsAmount: tcsAmount,
          },
        };
      } else {
        return {
          country: CountryCode.INDIA,
          taxableAmount: amount,
          taxType: TaxType.INDIA_GST_INTER,
          totalTax,
          ratePercent: rate,
          breakdown: {
            igstPercent: rate,
            igstAmount: totalTax,
            hsnCode,
            indiaTcsAmount: tcsAmount,
          },
        };
      }
    }

    case CountryCode.UAE: {
      return {
        country: CountryCode.UAE,
        taxableAmount: amount,
        taxType: TaxType.UAE_VAT,
        totalTax,
        ratePercent: rate,
        breakdown: {
          uaeVatAmount: totalTax,
          trnNumber,
        },
      };
    }

    default:
      return {
        country: countryCode,
        taxableAmount: amount,
        taxType: TaxType.EXEMPT,
        totalTax: 0,
        ratePercent: 0,
        breakdown: {},
      };
  }
}
