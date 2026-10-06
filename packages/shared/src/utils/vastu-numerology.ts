/**
 * Digital Vastu & Commercial Numerology Engine for Dhanshree
 * Optimized for Venus (#6 - Luxury & Prosperity), Mercury (#5 - Trade & Velocity), and Saturn (#8 - Authority)
 */

export interface VastuPriceBreakdown {
  originalPrice: number;
  vastuPrice: number;
  originalDigitalRoot: number;
  vastuDigitalRoot: 5 | 6;
  planet: 'Mercury (बुध)' | 'Venus (शुक्र)';
  commercialVibration: string;
  isAdjusted: boolean;
  adjustmentDelta: number;
}

/**
 * Calculates the single-digit digital root sum (1 to 9) of any positive integer.
 * Mathematical formula: 1 + ((n - 1) % 9) for n > 0
 */
export function getDigitalRoot(value: number): number {
  const n = Math.abs(Math.round(value));
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}

/**
 * Checks whether a given number possesses an auspicious commercial vibration.
 * Numbers 5 (Mercury) and 6 (Venus) represent prime retail prosperity.
 * Numbers 4 (Rahu - sudden delay) and 8 (Saturn - transaction resistance) are restricted in pricing.
 */
export function isAuspiciousDigitalRoot(root: number): boolean {
  return root === 5 || root === 6;
}

/**
 * Adjusts any price to resolve to an auspicious commercial digital root of 5 (Mercury) or 6 (Venus).
 *
 * Energy Mapping:
 * - 5 (Mercury): Best for fast-moving items, deals, flash sales, high transaction velocity.
 * - 6 (Venus): Best for premium luxury goods, festive purchases, fashion, high customer satisfaction.
 *
 * Prohibited Roots:
 * - 4 (Rahu): Causes buyer remorse, second-guessing at checkout.
 * - 8 (Saturn): Causes transaction delays, COD hesitation, long fulfillment friction.
 *
 * @param price Raw price input
 * @param preferredRoot Optional preferred vibration (5 or 6). Defaults to 'auto' (nearest harmonic).
 */
export function formatVastuPrice(
  price: number,
  preferredRoot: 5 | 6 | 'auto' = 'auto',
): number {
  if (price <= 0) return 0;
  const basePrice = Math.round(price);
  const currentRoot = getDigitalRoot(basePrice);

  // If already at target auspicious root, keep it intact
  if (preferredRoot === 'auto') {
    if (currentRoot === 5 || currentRoot === 6) {
      return basePrice;
    }
  } else if (currentRoot === preferredRoot) {
    return basePrice;
  }

  // Calculate candidate adjustments for roots 5 and 6
  // We search in a tight window [-4, +5] to find the smallest price delta
  const candidates: Array<{ price: number; root: 5 | 6; delta: number }> = [];

  for (let delta = -4; delta <= 5; delta++) {
    const candidatePrice = basePrice + delta;
    if (candidatePrice <= 0) continue;
    const root = getDigitalRoot(candidatePrice);
    if (root === 5 || root === 6) {
      if (preferredRoot === 'auto' || root === preferredRoot) {
        candidates.push({
          price: candidatePrice,
          root: root as 5 | 6,
          delta: Math.abs(delta),
        });
      }
    }
  }

  // Sort by smallest absolute delta, favoring upward adjustment (+1) over downward for positive merchant energy
  candidates.sort((a, b) => {
    if (a.delta !== b.delta) return a.delta - b.delta;
    return b.price - a.price;
  });

  return candidates.length > 0 ? candidates[0].price : basePrice;
}

/**
 * Provides full astrological breakdown and vibration details for display in UI tooltips.
 */
export function getVastuPriceBreakdown(
  price: number,
  preferredRoot: 5 | 6 | 'auto' = 'auto',
): VastuPriceBreakdown {
  const basePrice = Math.round(price);
  const originalRoot = getDigitalRoot(basePrice);
  const vastuPrice = formatVastuPrice(basePrice, preferredRoot);
  const vastuRoot = getDigitalRoot(vastuPrice) as 5 | 6;

  const planet = vastuRoot === 5 ? 'Mercury (बुध)' : 'Venus (शुक्र)';
  const commercialVibration =
    vastuRoot === 5
      ? 'Budha Energy (Mercury #5): Fast Commerce, Instant Cash Flow, Fluid Transactions'
      : 'Shukra Energy (Venus #6): Customer Attraction, Luxury, Delight, Lasting Prosperity';

  return {
    originalPrice: basePrice,
    vastuPrice,
    originalDigitalRoot: originalRoot,
    vastuDigitalRoot: vastuRoot,
    planet,
    commercialVibration,
    isAdjusted: basePrice !== vastuPrice,
    adjustmentDelta: vastuPrice - basePrice,
  };
}

/**
 * Auspicious Compound Coupon Codes with Verified Digital Roots (5 & 6)
 */
export const AUSPICIOUS_COUPONS = [
  {
    code: 'DHAN5',
    discountPercent: 10,
    digitalRoot: 5,
    title: 'Mercury Speed Voucher',
    description: '10% Instant Festival Discount (Budha Energy)',
    color: '#059669',
  },
  {
    code: 'SHREE6',
    discountPercent: 15,
    digitalRoot: 6,
    title: 'Venus Prosperity Pass',
    description: '15% Luxury Attraction Voucher (Shukra Energy)',
    color: '#F59E0B',
  },
  {
    code: 'GROW51',
    discountPercent: 20,
    digitalRoot: 6, // 5 + 1 = 6
    title: 'Festival Golden Pass',
    description: '20% Mega Celebration Voucher (5+1 = 6 Harmony)',
    color: '#059669',
  },
  {
    code: 'LAKSHMI6',
    discountPercent: 25,
    digitalRoot: 6,
    title: 'Maha Lakshmi Boon',
    description: '25% VIP Club Prosperity Privilege',
    color: '#F59E0B',
  },
  {
    code: 'KUBER5',
    discountPercent: 12,
    digitalRoot: 5,
    title: 'Kuber Treasury Discount',
    description: '12% Business & Trade Acceleration Voucher',
    color: '#059669',
  },
] as const;

/**
 * Chaldean Numerological Alphabet Map
 */
const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

/**
 * Calculates Chaldean name number and single-digit root for brand words or coupon codes.
 */
export function getChaldeanVibration(text: string): { compound: number; root: number } {
  const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let sum = 0;
  for (const char of clean) {
    if (char >= '0' && char <= '9') {
      sum += parseInt(char, 10);
    } else if (CHALDEAN_MAP[char]) {
      sum += CHALDEAN_MAP[char];
    }
  }
  return {
    compound: sum,
    root: getDigitalRoot(sum),
  };
}

/**
 * Generates an auspicious voucher code with compound harmonic root 5 or 6.
 */
export function generateAuspiciousCoupon(prefix: string, targetRoot: 5 | 6 = 5): string {
  const base = prefix.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
  // Test numeric suffixes until digital root matches targetRoot
  for (let num = 1; num <= 99; num++) {
    const candidate = `${base}${num}`;
    const { root } = getChaldeanVibration(candidate);
    if (root === targetRoot) {
      return candidate;
    }
  }
  return `${base}${targetRoot}`;
}

/**
 * Architectural Quadrants of Screen-Space Digital Vastu
 */
export const DIGITAL_VASTU_QUADRANTS = {
  NORTH_WEST: {
    direction: 'North-West (वायव्य - Movement & Air)',
    screenPosition: 'Top-Left Header',
    element: 'Vayu (वायु)',
    energy: 'Speed, Delivery Flow & Global Outreach',
    uiComponents: ['Brand Logo with Prosperity Emblem', 'Dynamic Delivery Pin', 'Social Proof Links'],
    color: '#0F172A',
  },
  NORTH: {
    direction: 'North (उत्तर - Opportunity & Water)',
    screenPosition: 'Top-Center Header',
    element: 'Jala / Kubera (कुबेर)',
    energy: 'Cash Flow, Opportunity Ingestion, Product Discovery',
    uiComponents: ['High-Velocity AI Predictive Search', 'Category Filter', 'Live Trending Tags'],
    color: '#059669',
  },
  NORTH_EAST: {
    direction: 'North-East (ईशान्य - Clarity & Light)',
    screenPosition: 'Top-Right Header',
    element: 'Ishanya (ईशान)',
    energy: 'Trust, Spiritual Calm, Customer Goodwill',
    uiComponents: ['Customer Hotline / WhatsApp Direct', 'Track Order', 'Wishlist', 'Verified Account'],
    color: '#F59E0B',
  },
  BRAHMASTHAN: {
    direction: 'Brahmasthan (ब्रह्मस्थान - Cosmic Center Void)',
    screenPosition: 'Center Canvas',
    element: 'Akasha (आकाश - Space)',
    energy: 'Zero-Clutter Equilibrium, Pure Negative Space, Visual Breathing Room',
    uiComponents: ['Serene Hero Section', 'Balanced Layout without Heavy Typography'],
    color: '#FFFFFF',
  },
  EAST: {
    direction: 'East (पूर्व - New Beginnings & Sun)',
    screenPosition: 'Middle-Right Canvas',
    element: 'Surya (सूर्य)',
    energy: 'Vitality, Fresh Energy, New Arrivals, Upward Trajectory',
    uiComponents: ['New Releases Carousel', 'Trending Deals Today', 'Daily Highlights'],
    color: '#F59E0B',
  },
  SOUTH_EAST: {
    direction: 'South-East (आग्नेय - Conversion Fire)',
    screenPosition: 'Bottom-Right & Primary Action Zones',
    element: 'Agni (अग्नि)',
    energy: 'Transaction Ignition, Conversion Force, Decisive Buying',
    uiComponents: ['Add to Cart (Right-aligned)', 'Buy Now CTA', 'Checkout Progress Bar'],
    color: '#059669',
  },
  SOUTH_WEST: {
    direction: 'South-West (नैऋत्य - Stability & Earth)',
    screenPosition: 'Footer Base',
    element: 'Prithvi (पृथ्वी)',
    energy: 'Heavy Grounding, Security, Reliability, Long-Term Protection',
    uiComponents: ['Verified Payment Badges (eSewa, Khalti, ConnectIPS)', 'Legal Registration', 'Warranty Policy'],
    color: '#0F172A',
  },
} as const;
