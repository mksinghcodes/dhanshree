import { Injectable, NotFoundException } from '@nestjs/common';
import {
  COUNTRY_CONFIGS,
  CountryCode,
  CountryConfig,
  CURRENCY_METADATA,
  CurrencyCode,
  convertCurrency,
  calculateItemTax,
  TaxCalculationResult,
} from '@dhanshree/shared';
import { CalculateTaxDto } from './dto/tax-calculation.dto';

@Injectable()
export class CountryService {
  getAllCountries(): CountryConfig[] {
    return Object.values(COUNTRY_CONFIGS);
  }

  getCountry(code: string): CountryConfig {
    const countryCode = code.toUpperCase() as CountryCode;
    const config = COUNTRY_CONFIGS[countryCode];
    if (!config) {
      throw new NotFoundException(
        `Unsupported country code '${code}'. Supported: ${Object.keys(COUNTRY_CONFIGS).join(', ')}`,
      );
    }
    return config;
  }

  getAllCurrencies() {
    return Object.values(CURRENCY_METADATA);
  }

  convert(amount: number, from: CurrencyCode, to: CurrencyCode): { original: number; converted: number; from: CurrencyCode; to: CurrencyCode; rate: number } {
    const converted = convertCurrency(amount, from, to);
    const rate = convertCurrency(1, from, to);
    return {
      original: amount,
      converted,
      from,
      to,
      rate,
    };
  }

  calculateTax(dto: CalculateTaxDto): TaxCalculationResult {
    return calculateItemTax({
      countryCode: dto.countryCode,
      amount: dto.amount,
      ratePercent: dto.ratePercent,
      sellerState: dto.sellerState,
      buyerState: dto.buyerState,
      hsnCode: dto.hsnCode,
      trnNumber: dto.trnNumber,
    });
  }
}
