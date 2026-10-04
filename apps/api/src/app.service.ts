import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { COUNTRY_CONFIGS, CountryCode } from '@dhanshree/shared';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthStatus() {
    const dbStatus = await this.prisma.checkHealth();

    return {
      name: 'Dhanshree Multi-Vendor Marketplace API',
      version: '1.0.0-phase1',
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      supportedRegions: [
        {
          country: COUNTRY_CONFIGS[CountryCode.NEPAL].name,
          code: CountryCode.NEPAL,
          currency: COUNTRY_CONFIGS[CountryCode.NEPAL].defaultCurrency,
          languages: COUNTRY_CONFIGS[CountryCode.NEPAL].supportedLanguages,
          tax: COUNTRY_CONFIGS[CountryCode.NEPAL].taxLabel,
          paymentAdapters: COUNTRY_CONFIGS[CountryCode.NEPAL].supportedPaymentMethods,
          codAllowed: COUNTRY_CONFIGS[CountryCode.NEPAL].codAllowed,
        },
        {
          country: COUNTRY_CONFIGS[CountryCode.INDIA].name,
          code: CountryCode.INDIA,
          currency: COUNTRY_CONFIGS[CountryCode.INDIA].defaultCurrency,
          languages: COUNTRY_CONFIGS[CountryCode.INDIA].supportedLanguages,
          tax: COUNTRY_CONFIGS[CountryCode.INDIA].taxLabel,
          paymentAdapters: COUNTRY_CONFIGS[CountryCode.INDIA].supportedPaymentMethods,
          codAllowed: COUNTRY_CONFIGS[CountryCode.INDIA].codAllowed,
        },
        {
          country: COUNTRY_CONFIGS[CountryCode.UAE].name,
          code: CountryCode.UAE,
          currency: COUNTRY_CONFIGS[CountryCode.UAE].defaultCurrency,
          languages: COUNTRY_CONFIGS[CountryCode.UAE].supportedLanguages,
          tax: COUNTRY_CONFIGS[CountryCode.UAE].taxLabel,
          paymentAdapters: COUNTRY_CONFIGS[CountryCode.UAE].supportedPaymentMethods,
          codAllowed: COUNTRY_CONFIGS[CountryCode.UAE].codAllowed,
        },
      ],
      features: [
        'Multi-Vendor Stores',
        'eBay-style Live Auctions & Proxy Bids',
        'Alibaba-style Tiered RFQ Quotes',
        'COD Fraud Scoring & OTP Engine',
        'Country-specific Tax (Nepal VAT, India GST/TCS, UAE 5% VAT with TRN)',
        'Escrow Marketplace Split Payments',
      ],
    };
  }

  getCountryConfig(countryCode: string) {
    const code = countryCode.toUpperCase() as CountryCode;
    const config = COUNTRY_CONFIGS[code];
    if (!config) {
      return {
        error: `Unsupported country code '${countryCode}'. Valid codes: NP, IN, AE`,
      };
    }
    return {
      status: 'SUCCESS',
      country: config,
    };
  }
}
