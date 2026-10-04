import { CurrencyCode } from './countries.js';

export interface CurrencyMetadata {
  code: CurrencyCode;
  symbol: string;
  name: string;
  fractionDigits: number;
  // Rates relative to 1 USD
  usdExchangeRate: number;
}

export const CURRENCY_METADATA: Record<CurrencyCode, CurrencyMetadata> = {
  [CurrencyCode.NPR]: {
    code: CurrencyCode.NPR,
    symbol: 'रु',
    name: 'Nepalese Rupee',
    fractionDigits: 2,
    usdExchangeRate: 133.5, // 1 USD = ~133.5 NPR
  },
  [CurrencyCode.INR]: {
    code: CurrencyCode.INR,
    symbol: '₹',
    name: 'Indian Rupee',
    fractionDigits: 2,
    usdExchangeRate: 83.4, // 1 USD = ~83.4 INR
  },
  [CurrencyCode.AED]: {
    code: CurrencyCode.AED,
    symbol: 'AED',
    name: 'UAE Dirham',
    fractionDigits: 2,
    usdExchangeRate: 3.6725, // 1 USD = 3.6725 AED (pegged)
  },
};

/**
 * Converts an amount from one currency to another using base USD rates.
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  customRates?: Partial<Record<CurrencyCode, number>>,
): number {
  if (from === to) return amount;

  const rateFrom = customRates?.[from] ?? CURRENCY_METADATA[from].usdExchangeRate;
  const rateTo = customRates?.[to] ?? CURRENCY_METADATA[to].usdExchangeRate;

  // Convert from origin currency to USD, then USD to target currency
  const inUsd = amount / rateFrom;
  const result = inUsd * rateTo;
  return Number(result.toFixed(CURRENCY_METADATA[to].fractionDigits));
}

/**
 * Formats a currency amount into standard locale-aware string.
 */
export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyCode,
  locale = 'en-US',
): string {
  const meta = CURRENCY_METADATA[currency];
  return `${meta.symbol} ${amount.toLocaleString(locale, {
    minimumFractionDigits: meta.fractionDigits,
    maximumFractionDigits: meta.fractionDigits,
  })}`;
}
