import {
  formatVastuPrice,
  getDigitalRoot,
  getVastuPriceBreakdown,
  isAuspiciousDigitalRoot,
  AUSPICIOUS_COUPONS,
  DIGITAL_VASTU_QUADRANTS,
  type VastuPriceBreakdown,
} from '@dhanshree/shared';

export {
  formatVastuPrice,
  getDigitalRoot,
  getVastuPriceBreakdown,
  isAuspiciousDigitalRoot,
  AUSPICIOUS_COUPONS,
  DIGITAL_VASTU_QUADRANTS,
  type VastuPriceBreakdown,
};

/**
 * Formats a localized currency string with Vastu digital root compatibility.
 */
export function formatLocalizedVastuPrice(
  amount: number,
  currency: string = 'NPR',
  preferredRoot: 5 | 6 | 'auto' = 'auto',
): {
  rawPrice: number;
  vastuPrice: number;
  formatted: string;
  digitalRoot: 5 | 6;
  symbol: string;
  planet: string;
  isHarmonic: boolean;
} {
  const vastuPrice = formatVastuPrice(amount, preferredRoot);
  const digitalRoot = getDigitalRoot(vastuPrice) as 5 | 6;

  let symbol = 'रु';
  if (currency.toUpperCase() === 'INR') symbol = '₹';
  if (currency.toUpperCase() === 'AED') symbol = 'AED';

  const formatted = `${symbol} ${vastuPrice.toLocaleString()}`;
  const planet = digitalRoot === 5 ? 'Mercury (बुध #5)' : 'Venus (शुक्र #6)';

  return {
    rawPrice: amount,
    vastuPrice,
    formatted,
    digitalRoot,
    symbol,
    planet,
    isHarmonic: isAuspiciousDigitalRoot(digitalRoot),
  };
}
