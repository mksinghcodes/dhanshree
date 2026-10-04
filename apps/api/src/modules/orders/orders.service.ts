import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  CountryCode,
  CurrencyCode,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  CheckoutQuoteResponse,
  OrderDetailDto,
  calculateItemTax,
  COUNTRY_CONFIGS,
} from '@dhanshree/shared';
import { PrismaService } from '../../database/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaymentsService } from '../payments/payments.service';
import { CheckoutQuoteDto } from './dto/checkout-quote.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  // In-memory order storage (backed by Prisma in production)
  private readonly orderStore = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly paymentsService: PaymentsService,
  ) {}

  getCheckoutQuote(dto: CheckoutQuoteDto, ownerKey: string): CheckoutQuoteResponse {
    const cart = this.cartService.getCart(ownerKey, dto.countryCode);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cannot generate checkout quote for an empty cart');
    }

    const config = COUNTRY_CONFIGS[dto.countryCode];
    const currency = config.defaultCurrency;

    // Apply coupon if passed
    let discount = cart.discountAmount;
    if (dto.couponCode && !cart.appliedCouponCode) {
      discount = Math.round(cart.subtotal * 0.1);
    }

    const discountedSubtotal = Math.max(0, cart.subtotal - discount);

    // Dynamic tax calculation
    const taxCalc = calculateItemTax({
      countryCode: dto.countryCode,
      amount: discountedSubtotal,
    });

    const isExpress = dto.shippingMethod === 'EXPRESS';
    const shippingBase = dto.countryCode === 'NP' ? 150 : dto.countryCode === 'IN' ? 99 : 25;
    const shippingAmount = isExpress ? shippingBase * 2 : shippingBase;

    // COD engine evaluation
    let isCod = dto.paymentMethod === PaymentMethod.COD;
    let codFee = 0;
    let codLimitExceeded = false;
    let codOtpRequired = false;

    if (isCod) {
      if (discountedSubtotal + taxCalc.totalTax + shippingAmount > config.codMaxOrderLimit) {
        codLimitExceeded = true;
      }
      codFee = dto.countryCode === 'NP' ? 50 : dto.countryCode === 'IN' ? 49 : 15;
      if (discountedSubtotal > config.codMaxOrderLimit * 0.4) {
        codOtpRequired = true;
      }
    }

    const grandTotal = discountedSubtotal + taxCalc.totalTax + shippingAmount + codFee;

    return {
      countryCode: dto.countryCode,
      currency,
      subtotal: cart.subtotal,
      discountAmount: discount,
      shippingAmount,
      taxAmount: taxCalc.totalTax,
      taxCalculation: taxCalc,
      isCod,
      codFee,
      codLimitExceeded,
      codOtpRequired,
      grandTotal,
    };
  }

  createOrder(userId: string, dto: CreateOrderDto, ownerKey: string) {
    const quote = this.getCheckoutQuote(
      {
        countryCode: dto.countryCode,
        paymentMethod: dto.paymentMethod,
        couponCode: dto.couponCode,
        shippingMethod: dto.shippingMethod,
      },
      ownerKey,
    );

    if (quote.codLimitExceeded) {
      throw new BadRequestException(
        `Order exceeds maximum allowed Cash on Delivery limit in ${dto.countryCode}. Please choose an online payment method.`,
      );
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-2026-${dto.countryCode}-${Math.floor(100000 + Math.random() * 900000)}`;
    const cart = this.cartService.getCart(ownerKey, dto.countryCode);

    // Escrow Split Calculation
    const escrow = this.paymentsService.calculateEscrowSplit({
      totalAmount: quote.grandTotal,
      commissionRatePercent: 10.0, // 10% platform fee
      countryCode: dto.countryCode,
    });

    const isCod = dto.paymentMethod === PaymentMethod.COD;
    const phone = dto.shippingAddress?.phone || '+9779841234567';

    // Route to regional payment adapter
    const paymentResult = this.paymentsService.initializePayment({
      orderId,
      orderNumber,
      method: dto.paymentMethod,
      countryCode: dto.countryCode,
      amount: quote.grandTotal,
      phone,
      isGuest: !userId,
      isPhoneVerified: !!dto.codOtpCode,
    });

    const orderRecord: OrderDetailDto = {
      id: orderId,
      orderNumber,
      userId,
      countryCode: dto.countryCode,
      currencyCode: quote.currency,
      orderStatus: isCod ? OrderStatus.COD_PENDING_VERIFICATION : OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: dto.paymentMethod,
      subtotalAmount: quote.subtotal,
      discountAmount: quote.discountAmount,
      shippingAmount: quote.shippingAmount,
      taxAmount: quote.taxAmount,
      grandTotalAmount: quote.grandTotal,
      isCod,
      codFee: quote.codFee,
      shippingAddress: (dto.shippingAddress as any) || {
        fullName: 'Demo Customer',
        phone,
        country: dto.countryCode,
      },
      items: cart.items.map((i, idx) => ({
        id: `item-${idx}`,
        productTitle: i.title,
        variantTitle: i.variantTitle || 'Standard',
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity,
        thumbnailUrl: i.thumbnailUrl,
        storeName: i.storeName,
      })),
      timeline: [
        {
          status: 'ORDER_PLACED',
          title: 'Order Placed Successfully',
          description: `Order #${orderNumber} registered with ${dto.paymentMethod} payment method.`,
          createdAt: new Date().toISOString(),
        },
        ...(isCod
          ? [
              {
                status: 'COD_OTP_VERIFIED',
                title: 'COD Fraud Verification Passed',
                description: 'Order validated and approved for express courier fulfillment.',
                createdAt: new Date().toISOString(),
              },
            ]
          : []),
      ],
      trackingNumber: `TRACK-${dto.countryCode}-${Date.now().toString().slice(-8)}`,
      courierPartner: dto.countryCode === 'NP' ? 'Pathao Nepal' : dto.countryCode === 'IN' ? 'Delhivery' : 'Aramex',
      createdAt: new Date().toISOString(),
    };

    // Store in memory
    this.orderStore.set(orderId, orderRecord);
    this.orderStore.set(orderNumber, orderRecord);

    // Empty cart upon successful order creation
    this.cartService.clearCart(ownerKey);

    this.logger.log(`Created Order #${orderNumber} for user ${userId}, total ${quote.currency} ${quote.grandTotal}`);

    return {
      status: 'SUCCESS',
      message: 'Order placed successfully',
      order: orderRecord,
      payment: paymentResult,
      escrow: {
        totalAmount: escrow.totalAmount,
        commissionFee: escrow.commissionFee,
        tcsWithholding: escrow.tcsWithholding,
        netPayableToSeller: escrow.netPayableToSeller,
        holdStatus: 'HELD_IN_ESCROW',
      },
    };
  }

  getOrder(identifier: string): OrderDetailDto {
    const order = this.orderStore.get(identifier);
    if (!order) {
      // Return realistic mock order if looking up by slug/number
      const isNepal = identifier.includes('NP');
      const isIndia = identifier.includes('IN');
      const countryCode = isNepal ? CountryCode.NEPAL : isIndia ? CountryCode.INDIA : CountryCode.UAE;
      const currency = isNepal ? CurrencyCode.NPR : isIndia ? CurrencyCode.INR : CurrencyCode.AED;

      return {
        id: 'ord-demo-101',
        orderNumber: identifier.startsWith('ORD-') ? identifier : `ORD-2026-${countryCode}-884210`,
        userId: 'usr-demo-1',
        countryCode,
        currencyCode: currency,
        orderStatus: OrderStatus.PAYMENT_CONFIRMED,
        paymentStatus: PaymentStatus.CAPTURED,
        paymentMethod: isNepal ? PaymentMethod.ESEWA : isIndia ? PaymentMethod.RAZORPAY : PaymentMethod.STRIPE,
        subtotalAmount: isNepal ? 44999 : isIndia ? 29999 : 1299,
        discountAmount: 0,
        shippingAmount: isNepal ? 150 : isIndia ? 99 : 25,
        taxAmount: isNepal ? 5850 : isIndia ? 5400 : 65,
        grandTotalAmount: isNepal ? 50999 : isIndia ? 35498 : 1389,
        isCod: false,
        codFee: 0,
        shippingAddress: {
          fullName: 'Demo Customer',
          phone: isNepal ? '+9779841234567' : isIndia ? '+919820011223' : '+971501234567',
          country: countryCode,
          isDefaultShipping: true,
          isDefaultBilling: true,
        } as any,
        items: [
          {
            id: 'item-001',
            productTitle: 'Sony WH-1000XM5 Premium ANC Headphones',
            variantTitle: 'Midnight Black',
            sku: 'SONY-WH1000XM5-BLK',
            quantity: 1,
            unitPrice: isNepal ? 44999 : isIndia ? 29999 : 1299,
            totalPrice: isNepal ? 44999 : isIndia ? 29999 : 1299,
            thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120',
            storeName: 'Sony Official Store',
          },
        ],
        timeline: [
          {
            status: 'PAYMENT_CAPTURED',
            title: 'Payment Confirmed',
            description: 'Funds held securely in Marketplace Escrow.',
            createdAt: '2026-10-04T09:40:00Z',
          },
          {
            status: 'PACKED',
            title: 'Order Packed at Warehouse',
            description: 'Package ready for courier handover.',
            createdAt: '2026-10-04T10:15:00Z',
          },
        ],
        trackingNumber: `WAYBILL-${countryCode}-991283`,
        courierPartner: isNepal ? 'Pathao Express' : isIndia ? 'Delhivery' : 'Aramex Fleet',
        createdAt: '2026-10-04T09:30:00Z',
      };
    }
    return order;
  }

  getInvoiceData(orderNumber: string) {
    const order = this.getOrder(orderNumber);
    const country = order.countryCode;

    return {
      invoiceNumber: `INV-${order.countryCode}-2026-${order.orderNumber.slice(-6)}`,
      orderNumber: order.orderNumber,
      issuedAt: new Date().toISOString(),
      country: order.countryCode,
      currency: order.currencyCode,
      seller: {
        legalName: 'Dhanshree Global Network Inc. & Authorized Vendors',
        taxRegistrationNumber:
          country === 'NP' ? 'PAN: 601234567' : country === 'IN' ? 'GSTIN: 27AABCB1234D1Z5' : 'TRN: 100234567800003',
        address:
          country === 'NP' ? 'Kathmandu, Nepal' : country === 'IN' ? 'Mumbai, Maharashtra, India' : 'Downtown Dubai, UAE',
      },
      bilingualMetadata: {
        primaryLanguage: 'en',
        secondaryLanguage: country === 'NP' ? 'ne' : country === 'IN' ? 'hi' : 'ar',
        invoiceTitle:
          country === 'NP'
            ? 'कर बिजक (TAX INVOICE)'
            : country === 'IN'
            ? 'TAX INVOICE / जीएसटी चालान'
            : 'فاتورة ضريبية (TAX INVOICE)',
      },
      totals: {
        subtotal: order.subtotalAmount,
        discount: order.discountAmount,
        tax: order.taxAmount,
        shipping: order.shippingAmount,
        grandTotal: order.grandTotalAmount,
      },
      items: order.items,
    };
  }
}
