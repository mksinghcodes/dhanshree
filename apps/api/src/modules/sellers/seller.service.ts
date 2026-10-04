import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CountryCode,
  CurrencyCode,
  OrderStatus,
  PayoutStatus,
  SellerDashboardKpi,
  SellerProductItem,
  CreateSellerProductInput,
  BulkUploadResult,
  SellerOrderSummary,
  ShippingLabelData,
  SellerPayoutRecord,
} from '@dhanshree/shared';

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);

  // In-memory catalog store for demo / mock state
  private productsStore: SellerProductItem[] = [
    {
      id: 'prod-sny-001',
      sku: 'SNY-XM5-BLK',
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      categoryName: 'Consumer Electronics > Audio',
      brandName: 'Sony',
      price: 44999,
      currency: CurrencyCode.NPR,
      stockQuantity: 42,
      warehouseLocation: 'Kathmandu Central Hub (WH-KT-01)',
      status: 'ACTIVE',
      rating: 4.9,
      salesCount: 148,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-sny-002',
      sku: 'SNY-XM5-SLV',
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Platinum Silver',
      categoryName: 'Consumer Electronics > Audio',
      brandName: 'Sony',
      price: 44999,
      currency: CurrencyCode.NPR,
      stockQuantity: 8, // Low stock alert
      warehouseLocation: 'Kathmandu Central Hub (WH-KT-01)',
      status: 'ACTIVE',
      rating: 4.8,
      salesCount: 86,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-apl-003',
      sku: 'APL-MBP-M3',
      title: 'Apple MacBook Pro 14" (M3 Pro 18GB/512GB)',
      categoryName: 'Computers > Laptops',
      brandName: 'Apple',
      price: 289999,
      currency: CurrencyCode.NPR,
      stockQuantity: 15,
      warehouseLocation: 'Lalitpur Logistics Hub (WH-LP-02)',
      status: 'ACTIVE',
      rating: 5.0,
      salesCount: 34,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-sam-004',
      sku: 'SAM-S24U-512',
      title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
      categoryName: 'Mobile Phones > Flagships',
      brandName: 'Samsung',
      price: 184999,
      currency: CurrencyCode.NPR,
      stockQuantity: 0, // Out of stock
      warehouseLocation: 'Kathmandu Central Hub (WH-KT-01)',
      status: 'OUT_OF_STOCK',
      rating: 4.7,
      salesCount: 112,
      updatedAt: new Date().toISOString(),
    },
  ];

  // In-memory orders store
  private ordersStore: SellerOrderSummary[] = [
    {
      id: 'ord-s-101',
      orderNumber: 'ORD-2026-NP-89211',
      buyerName: 'Manoj Singh',
      buyerPhone: '+977 9801234567',
      destinationCity: 'Kathmandu (Ward 4, Baluwatar)',
      itemCount: 1,
      totalAmount: 46499,
      currency: CurrencyCode.NPR,
      orderStatus: OrderStatus.PACKED,
      paymentMethod: 'eSewa Mobile Wallet',
      isCod: false,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      courierName: 'Nepal CanShip Express',
      trackingNumber: 'CAN-NP-99821447',
      shippingLabelGenerated: true,
    },
    {
      id: 'ord-s-102',
      orderNumber: 'ORD-2026-NP-89215',
      buyerName: 'Pooja Shrestha',
      buyerPhone: '+977 9841890212',
      destinationCity: 'Pokhara (Lakeside Ward 6)',
      itemCount: 1,
      totalAmount: 44999,
      currency: CurrencyCode.NPR,
      orderStatus: OrderStatus.PAYMENT_CONFIRMED,
      paymentMethod: 'Khalti e-Payment',
      isCod: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      shippingLabelGenerated: false,
    },
    {
      id: 'ord-s-103',
      orderNumber: 'ORD-2026-NP-89219',
      buyerName: 'Rabin Thapa',
      buyerPhone: '+977 9851099231',
      destinationCity: 'Biratnagar (Main Road)',
      itemCount: 2,
      totalAmount: 91498,
      currency: CurrencyCode.NPR,
      orderStatus: OrderStatus.PENDING_PAYMENT,
      paymentMethod: 'Cash on Delivery (COD)',
      isCod: true,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      shippingLabelGenerated: false,
    },
  ];

  // In-memory payouts store
  private payoutsStore: SellerPayoutRecord[] = [
    {
      id: 'pay-001',
      payoutReference: 'PO-2026-09-001',
      amount: 425000,
      currency: CurrencyCode.NPR,
      bankName: 'Nabil Bank Ltd (Kathmandu)',
      accountNumberMasked: '•••• •••• •••• 4892',
      status: PayoutStatus.COMPLETED,
      periodStart: '2026-09-01T00:00:00Z',
      periodEnd: '2026-09-15T23:59:59Z',
      commissionDeducted: 47200,
      createdAt: '2026-09-17T10:00:00Z',
    },
    {
      id: 'pay-002',
      payoutReference: 'PO-2026-09-002',
      amount: 380000,
      currency: CurrencyCode.NPR,
      bankName: 'Nabil Bank Ltd (Kathmandu)',
      accountNumberMasked: '•••• •••• •••• 4892',
      status: PayoutStatus.COMPLETED,
      periodStart: '2026-09-16T00:00:00Z',
      periodEnd: '2026-09-30T23:59:59Z',
      commissionDeducted: 42200,
      createdAt: '2026-10-02T11:30:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get Seller Dashboard KPIs tailored per country
   */
  getDashboardKpi(sellerId: string, countryCode: CountryCode = CountryCode.NEPAL): SellerDashboardKpi {
    // Dynamic KPI multipliers based on active storefront
    const isIndia = countryCode === CountryCode.INDIA;
    const isUae = countryCode === CountryCode.UAE;

    const currency = isIndia ? CurrencyCode.INR : isUae ? CurrencyCode.AED : CurrencyCode.NPR;
    const rateScale = isIndia ? 0.625 : isUae ? 0.027 : 1.0;

    return {
      totalRevenue: Math.round(1845000 * rateScale),
      currency,
      orderCount: 164,
      averageOrderValue: Math.round(11250 * rateScale),
      pendingShipments: this.ordersStore.filter(
        (o) => o.orderStatus === OrderStatus.PAYMENT_CONFIRMED || o.orderStatus === OrderStatus.PACKED,
      ).length,
      lowStockItemsCount: this.productsStore.filter((p) => p.stockQuantity <= 10).length,
      sellerRating: 4.86,
      reviewCount: 382,
      rtoRatePercent: 1.8, // 1.8% RTO rate
      escrowBalance: Math.round(345000 * rateScale),
      availablePayoutBalance: Math.round(520000 * rateScale),
      tcsDeductedYtd: isIndia ? 18450 : undefined, // 1% TCS Section 52 for India
    };
  }

  /**
   * List seller products with inventory filters
   */
  getProducts(sellerId: string, query?: { status?: string; search?: string }): SellerProductItem[] {
    let list = [...this.productsStore];

    if (query?.status && query.status !== 'ALL') {
      list = list.filter((p) => p.status === query.status);
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q),
      );
    }

    return list;
  }

  /**
   * Create new product with SEO & Multi-warehouse inventory
   */
  createProduct(sellerId: string, input: CreateSellerProductInput): SellerProductItem {
    if (!input.title || !input.sku || !input.basePrice) {
      throw new BadRequestException('Product title, SKU, and basePrice are required');
    }

    // Auto-generate AI description if requested
    let finalDescription = input.description;
    if (input.generateAiDescription || !finalDescription) {
      finalDescription = this.generateAiProductDescription({
        title: input.title,
        category: input.categoryId || 'General',
        keyFeatures: ['Flagship Grade Performance', 'Official Manufacturer Warranty', 'Fast Shipping'],
      }).description;
    }

    const newProduct: SellerProductItem = {
      id: `prod-s-${Date.now()}`,
      sku: input.sku.toUpperCase(),
      title: input.title,
      categoryName: input.categoryId || 'Consumer Goods',
      brandName: input.brandId || 'Generic Store Brand',
      price: input.basePrice,
      currency: input.currency || CurrencyCode.NPR,
      stockQuantity: input.stock || 10,
      warehouseLocation: input.warehouseLocation || 'Primary Regional Hub',
      status: input.stock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
      rating: 5.0,
      salesCount: 0,
      updatedAt: new Date().toISOString(),
    };

    this.productsStore.unshift(newProduct);
    this.logger.log(`Created product ${newProduct.sku} for seller ${sellerId}`);
    return newProduct;
  }

  /**
   * AI-Assisted Product Copy & SEO Generator
   */
  generateAiProductDescription(params: {
    title: string;
    category: string;
    keyFeatures?: string[];
  }): { description: string; seoTitle: string; seoKeywords: string[] } {
    const featuresList = (params.keyFeatures || ['High durability', '100% Genuine Guaranteed', 'Best-in-class performance'])
      .map((f) => `• ${f}`)
      .join('\n');

    const description = `Elevate your lifestyle with the all-new ${params.title}. Precision engineered for superior durability, exceptional aesthetic refinement, and outstanding daily performance in its category (${params.category}).\n\nKey Highlights:\n${featuresList}\n\nBacked by our comprehensive 100% authenticity guarantee and verified marketplace seller protection.`;

    const seoTitle = `${params.title} - Best Price Online | Fast Delivery Guaranteed`;
    const seoKeywords = [
      params.title.toLowerCase(),
      params.category.toLowerCase(),
      'buy online',
      'best price',
      'genuine warranty',
    ];

    return { description, seoTitle, seoKeywords };
  }

  /**
   * Bulk Product Upload via CSV/TSV
   */
  bulkUploadProducts(sellerId: string, csvContent: string): BulkUploadResult {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      throw new BadRequestException('CSV must contain a header row and at least one data row');
    }

    const importedProducts: SellerProductItem[] = [];
    const errors: { row: number; sku: string; error: string }[] = [];

    // Header index mapping
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const skuIdx = headers.indexOf('sku');
    const titleIdx = headers.indexOf('title');
    const categoryIdx = headers.indexOf('category');
    const priceIdx = headers.indexOf('price');
    const stockIdx = headers.indexOf('stock');
    const warehouseIdx = headers.indexOf('warehouse');

    if (skuIdx === -1 || titleIdx === -1 || priceIdx === -1) {
      throw new BadRequestException('CSV requires at minimum: sku, title, and price columns');
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      const sku = cols[skuIdx];
      const title = cols[titleIdx];
      const priceStr = cols[priceIdx];
      const price = parseFloat(priceStr);
      const stock = stockIdx !== -1 && cols[stockIdx] ? parseInt(cols[stockIdx], 10) : 10;
      const category = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx] : 'General';
      const warehouse = warehouseIdx !== -1 && cols[warehouseIdx] ? cols[warehouseIdx] : 'Primary WH';

      if (!sku || !title || isNaN(price) || price <= 0) {
        errors.push({
          row: i + 1,
          sku: sku || 'UNKNOWN',
          error: 'Missing required field or invalid numerical price',
        });
        continue;
      }

      // Check duplicate in session
      if (this.productsStore.some((p) => p.sku === sku.toUpperCase())) {
        errors.push({
          row: i + 1,
          sku: sku.toUpperCase(),
          error: 'Duplicate SKU already exists in store catalog',
        });
        continue;
      }

      const item: SellerProductItem = {
        id: `prod-bulk-${Date.now()}-${i}`,
        sku: sku.toUpperCase(),
        title,
        categoryName: category,
        brandName: 'Imported Brand',
        price,
        currency: CurrencyCode.NPR,
        stockQuantity: isNaN(stock) ? 0 : stock,
        warehouseLocation: warehouse,
        status: stock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
        rating: 5.0,
        salesCount: 0,
        updatedAt: new Date().toISOString(),
      };

      this.productsStore.push(item);
      importedProducts.push(item);
    }

    return {
      totalRows: lines.length - 1,
      successfulRows: importedProducts.length,
      failedRows: errors.length,
      errors,
      importedProducts,
    };
  }

  /**
   * Get orders assigned to seller
   */
  getOrders(sellerId: string, status?: OrderStatus): SellerOrderSummary[] {
    if (status) {
      return this.ordersStore.filter((o) => o.orderStatus === status);
    }
    return this.ordersStore;
  }

  /**
   * Generate official courier shipping label (AWB + barcode data)
   */
  packAndGenerateShippingLabel(orderId: string, sellerId: string): ShippingLabelData {
    const order = this.ordersStore.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found for this seller`);
    }

    const isNepal = order.currency === CurrencyCode.NPR;
    const isIndia = order.currency === CurrencyCode.INR;

    const carrier = isNepal
      ? 'Nepal CanShip & Express Logistics'
      : isIndia
      ? 'Delhivery Surface Express'
      : 'Aramex Priority UAE';

    const awbPrefix = isNepal ? 'NP-CAN-' : isIndia ? 'IN-DEL-' : 'AE-ARX-';
    const awbNumber = order.trackingNumber || `${awbPrefix}${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Update order status
    order.orderStatus = OrderStatus.PACKED;
    order.trackingNumber = awbNumber;
    order.courierName = carrier;
    order.shippingLabelGenerated = true;

    // SVG Barcode representation
    const barcodeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="60" viewBox="0 0 280 60"><rect width="280" height="60" fill="#ffffff"/><path d="M10 10h4v40h-4zM18 10h2v40h-2zM24 10h6v40h-6zM34 10h2v40h-2zM40 10h4v40h-4zM48 10h6v40h-6zM58 10h2v40h-2zM64 10h4v40h-4zM72 10h2v40h-2zM78 10h8v40h-8zM90 10h4v40h-4zM98 10h2v40h-2zM104 10h4v40h-4zM112 10h6v40h-6zM122 10h2v40h-2zM128 10h4v40h-4zM136 10h2v40h-2zM142 10h6v40h-6zM152 10h4v40h-4zM160 10h2v40h-2zM166 10h6v40h-6zM176 10h4v40h-4zM184 10h2v40h-2zM190 10h6v40h-6zM200 10h4v40h-4zM208 10h2v40h-2zM214 10h6v40h-6zM224 10h4v40h-4zM232 10h2v40h-2zM238 10h8v40h-8zM250 10h4v40h-4zM258 10h2v40h-2zM264 10h4v40h-4z" fill="#000000"/><text x="140" y="58" font-family="monospace" font-size="10" text-anchor="middle">${awbNumber}</text></svg>`;

    return {
      orderNumber: order.orderNumber,
      carrier,
      awbNumber,
      barcodeSvg,
      sellerStoreName: 'Sony Official Flagship Store',
      sellerTaxId: isNepal ? 'PAN 601992819' : isIndia ? 'GSTIN 27AABCS1429B1Z8' : 'TRN 100488291000003',
      sellerAddress: isNepal
        ? 'Durbarmarg Commercial Center, Kathmandu, Nepal'
        : isIndia
        ? 'Nariman Point, Mumbai 400021, India'
        : 'Downtown Financial Center, Dubai, UAE',
      buyerName: order.buyerName,
      buyerPhone: order.buyerPhone,
      buyerAddress: order.destinationCity,
      declaredValue: order.totalAmount,
      currency: order.currency,
      packageWeightKg: 0.85,
      routingCode: isNepal ? 'HUB-KTM-NORTH-04' : isIndia ? 'BOM-WEST-400' : 'DXB-DOWNTOWN-01',
      isCod: order.isCod,
      codCollectAmount: order.isCod ? order.totalAmount : undefined,
    };
  }

  /**
   * Payouts and Financial Settlements
   */
  getPayouts(sellerId: string): {
    availableBalance: number;
    escrowLocked: number;
    history: SellerPayoutRecord[];
  } {
    return {
      availableBalance: 520000,
      escrowLocked: 345000,
      history: this.payoutsStore,
    };
  }

  /**
   * Request withdrawal to registered bank
   */
  requestPayout(
    sellerId: string,
    amount: number,
    bankInfo: { bankName: string; accountNumber: string },
  ): SellerPayoutRecord {
    if (amount <= 0 || amount > 520000) {
      throw new BadRequestException('Requested payout amount exceeds available cleared balance');
    }

    const record: SellerPayoutRecord = {
      id: `pay-${Date.now()}`,
      payoutReference: `PO-2026-10-${Math.floor(100 + Math.random() * 900)}`,
      amount,
      currency: CurrencyCode.NPR,
      bankName: bankInfo.bankName || 'Nabil Bank Ltd',
      accountNumberMasked: `•••• •••• •••• ${bankInfo.accountNumber ? bankInfo.accountNumber.slice(-4) : '4892'}`,
      status: PayoutStatus.PROCESSING,
      periodStart: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      periodEnd: new Date().toISOString(),
      commissionDeducted: Math.round(amount * 0.1),
      createdAt: new Date().toISOString(),
    };

    this.payoutsStore.unshift(record);
    this.logger.log(`Seller ${sellerId} requested payout of ${record.currency} ${amount}`);
    return record;
  }
}
