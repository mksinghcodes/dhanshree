export enum CountryCode {
  NEPAL = 'NP',
  INDIA = 'IN',
  UAE = 'AE',
}

export enum CurrencyCode {
  NPR = 'NPR',
  INR = 'INR',
  AED = 'AED',
}

export enum SupportedLanguage {
  EN = 'en',
  NE = 'ne', // Nepali
  HI = 'hi', // Hindi
  AR = 'ar', // Arabic (RTL)
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  defaultCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  isRTL: boolean;
  phonePrefix: string;
  taxLabel: string;
  taxRegistrationName: string; // e.g., "PAN / VAT", "GSTIN", "TRN"
  addressFormat: {
    requiresState: boolean;
    requiresDistrict: boolean;
    requiresMunicipality: boolean;
    requiresWard: boolean;
    requiresPostalCode: boolean;
    requiresEmirate: boolean;
    requiresMakaniNumber: boolean;
    postalCodePattern?: string;
  };
  supportedPaymentMethods: string[];
  codAllowed: boolean;
  codMaxOrderLimit: number;
}

export const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
  [CountryCode.NEPAL]: {
    code: CountryCode.NEPAL,
    name: 'Nepal',
    nativeName: 'नेपाल',
    defaultCurrency: CurrencyCode.NPR,
    supportedCurrencies: [CurrencyCode.NPR],
    defaultLanguage: SupportedLanguage.EN,
    supportedLanguages: [SupportedLanguage.EN, SupportedLanguage.NE],
    isRTL: false,
    phonePrefix: '+977',
    taxLabel: 'VAT (13%)',
    taxRegistrationName: 'PAN / VAT',
    addressFormat: {
      requiresState: true, // Province 1-7 (e.g. Bagmati)
      requiresDistrict: true, // e.g. Kathmandu
      requiresMunicipality: true, // e.g. Kathmandu Metropolitan City
      requiresWard: true, // Ward 1-32
      requiresPostalCode: true,
      requiresEmirate: false,
      requiresMakaniNumber: false,
      postalCodePattern: '^[0-9]{5}$',
    },
    supportedPaymentMethods: [
      'ESEWA',
      'KHALTI',
      'IME_PAY',
      'FONEPAY_QR',
      'CONNECT_IPS',
      'CARD_NPR',
      'COD',
    ],
    codAllowed: true,
    codMaxOrderLimit: 50000, // 50,000 NPR
  },
  [CountryCode.INDIA]: {
    code: CountryCode.INDIA,
    name: 'India',
    nativeName: 'भारत',
    defaultCurrency: CurrencyCode.INR,
    supportedCurrencies: [CurrencyCode.INR],
    defaultLanguage: SupportedLanguage.EN,
    supportedLanguages: [SupportedLanguage.EN, SupportedLanguage.HI],
    isRTL: false,
    phonePrefix: '+91',
    taxLabel: 'GST (CGST / SGST / IGST)',
    taxRegistrationName: 'GSTIN / PAN',
    addressFormat: {
      requiresState: true, // State/UT (e.g. Maharashtra)
      requiresDistrict: true,
      requiresMunicipality: false,
      requiresWard: false,
      requiresPostalCode: true, // 6-digit PIN
      requiresEmirate: false,
      requiresMakaniNumber: false,
      postalCodePattern: '^[1-9][0-9]{5}$',
    },
    supportedPaymentMethods: [
      'UPI',
      'RAZORPAY',
      'CASHFREE',
      'PAYU',
      'NET_BANKING',
      'CARD_INR',
      'EMI',
      'COD',
    ],
    codAllowed: true,
    codMaxOrderLimit: 30000, // 30,000 INR
  },
  [CountryCode.UAE]: {
    code: CountryCode.UAE,
    name: 'United Arab Emirates',
    nativeName: 'الإمارات العربية المتحدة',
    defaultCurrency: CurrencyCode.AED,
    supportedCurrencies: [CurrencyCode.AED],
    defaultLanguage: SupportedLanguage.EN,
    supportedLanguages: [SupportedLanguage.EN, SupportedLanguage.AR],
    isRTL: false, // Default EN is LTR, Arabic page views switch to RTL
    phonePrefix: '+971',
    taxLabel: 'VAT (5%)',
    taxRegistrationName: 'TRN (Tax Registration Number)',
    addressFormat: {
      requiresState: false,
      requiresDistrict: false,
      requiresMunicipality: false,
      requiresWard: false,
      requiresPostalCode: false, // PO Box or optional
      requiresEmirate: true, // Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah
      requiresMakaniNumber: true, // 10-digit Makani coordinate
      postalCodePattern: '^[0-9]{5,6}$',
    },
    supportedPaymentMethods: [
      'STRIPE',
      'APPLE_PAY',
      'GOOGLE_PAY',
      'TABBY', // BNPL
      'TAMARA', // BNPL
      'TELR',
      'PAYTABS',
      'COD',
    ],
    codAllowed: true,
    codMaxOrderLimit: 2500, // 2,500 AED
  },
};
