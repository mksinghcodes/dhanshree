import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CountryCode,
  CurrencyCode,
  CartSummary,
  CartItemDto,
  calculateItemTax,
  COUNTRY_CONFIGS,
} from '@dhanshree/shared';
import { PrismaService } from '../../database/prisma.service';

interface CartSession {
  userId?: string;
  guestId?: string;
  countryCode: CountryCode;
  items: CartItemDto[];
  couponCode?: string | null;
}

@Injectable()
export class CartService {
  // In-memory session store (backed by Redis / Prisma in production)
  private readonly carts = new Map<string, CartSession>();

  constructor(private readonly prisma: PrismaService) {}

  getCart(ownerKey: string, countryCode: CountryCode = CountryCode.NEPAL): CartSummary {
    let session = this.carts.get(ownerKey);
    if (!session) {
      session = {
        countryCode,
        items: this.getDefaultDemoItems(countryCode),
        couponCode: null,
      };
      this.carts.set(ownerKey, session);
    }

    return this.calculateSummary(session);
  }

  addItem(
    ownerKey: string,
    variantId: string,
    quantity: number,
    countryCode: CountryCode = CountryCode.NEPAL,
  ): CartSummary {
    const session = this.getOrCreateSession(ownerKey, countryCode);

    const existingIndex = session.items.findIndex((i) => i.variantId === variantId);
    if (existingIndex > -1) {
      session.items[existingIndex].quantity += quantity;
    } else {
      // Lookup product details
      const item = this.createCartItem(variantId, quantity, session.countryCode);
      session.items.push(item);
    }

    return this.calculateSummary(session);
  }

  updateQuantity(ownerKey: string, variantId: string, quantity: number): CartSummary {
    const session = this.carts.get(ownerKey);
    if (!session) {
      throw new BadRequestException('Cart not found');
    }

    if (quantity <= 0) {
      session.items = session.items.filter((i) => i.variantId !== variantId);
    } else {
      const item = session.items.find((i) => i.variantId === variantId);
      if (item) item.quantity = quantity;
    }

    return this.calculateSummary(session);
  }

  removeItem(ownerKey: string, variantId: string): CartSummary {
    const session = this.carts.get(ownerKey);
    if (session) {
      session.items = session.items.filter((i) => i.variantId !== variantId);
    }
    return this.calculateSummary(session || { countryCode: CountryCode.NEPAL, items: [] });
  }

  applyCoupon(ownerKey: string, couponCode: string): CartSummary {
    const session = this.carts.get(ownerKey);
    if (!session) {
      throw new BadRequestException('Cart not found');
    }

    const code = couponCode.toUpperCase().trim();
    const validCodes = ['DASHAIN2026', 'DIWALI2026', 'RAMADAN2026', 'WELCOME10'];

    if (!validCodes.includes(code)) {
      throw new BadRequestException(
        `Invalid or expired coupon code. Active festival coupons: ${validCodes.join(', ')}`,
      );
    }

    session.couponCode = code;
    return this.calculateSummary(session);
  }

  clearCart(ownerKey: string) {
    const session = this.carts.get(ownerKey);
    if (session) {
      session.items = [];
      session.couponCode = null;
    }
  }

  private getOrCreateSession(ownerKey: string, countryCode: CountryCode): CartSession {
    let session = this.carts.get(ownerKey);
    if (!session) {
      session = {
        countryCode,
        items: [],
        couponCode: null,
      };
      this.carts.set(ownerKey, session);
    }
    return session;
  }

  private calculateSummary(session: CartSession): CartSummary {
    const country = session.countryCode;
    const config = COUNTRY_CONFIGS[country];
    const currency = config.defaultCurrency;

    let subtotal = 0;
    let itemCount = 0;

    session.items.forEach((item) => {
      subtotal += item.unitPrice * item.quantity;
      itemCount += item.quantity;
    });

    // Coupon discount logic
    let discountAmount = 0;
    if (session.couponCode) {
      discountAmount = Math.round(subtotal * 0.1); // 10% platform discount
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Dynamic tax calculation
    const taxCalc = calculateItemTax({
      countryCode: country,
      amount: discountedSubtotal,
    });

    const shippingAmount = subtotal > 0 ? (country === 'NP' ? 150 : country === 'IN' ? 99 : 25) : 0;
    const codFee = 0; // Calculated on COD checkout selection

    return {
      items: session.items,
      countryCode: country,
      currency,
      itemCount,
      subtotal,
      discountAmount,
      appliedCouponCode: session.couponCode,
      estimatedShipping: shippingAmount,
      taxCalculation: taxCalc,
      totalTax: taxCalc.totalTax,
      codFee,
      grandTotal: discountedSubtotal + taxCalc.totalTax + shippingAmount,
    };
  }

  private createCartItem(variantId: string, quantity: number, country: CountryCode): CartItemDto {
    const currency = COUNTRY_CONFIGS[country].defaultCurrency;
    const price = country === 'NP' ? 44999 : country === 'IN' ? 29999 : 1299;

    return {
      variantId,
      productId: 'prod-001',
      title: 'Sony WH-1000XM5 Premium ANC Headphones',
      variantTitle: 'Midnight Black',
      sku: 'SONY-WH1000XM5-BLK',
      thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120',
      quantity,
      unitPrice: price,
      currency,
      attributes: { color: 'Black' },
      storeName: 'Sony Official Store',
    };
  }

  private getDefaultDemoItems(country: CountryCode): CartItemDto[] {
    const currency = COUNTRY_CONFIGS[country].defaultCurrency;
    return [
      {
        variantId: 'v-001-blk',
        productId: 'prod-001',
        title: 'Sony WH-1000XM5 Premium ANC Headphones',
        variantTitle: 'Midnight Black',
        sku: 'SONY-WH1000XM5-BLK',
        thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120',
        quantity: 1,
        unitPrice: country === 'NP' ? 44999 : country === 'IN' ? 29999 : 1299,
        currency,
        attributes: { color: 'Black' },
        storeName: 'Sony Official Store',
      },
    ];
  }
}
