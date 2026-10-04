import { CountryCode, CurrencyCode } from '../constants/countries.js';
import { OrderStatus, ReturnStatus, PayoutStatus } from './order.js';

export interface SellerDashboardKpi {
  totalRevenue: number;
  currency: CurrencyCode;
  orderCount: number;
  averageOrderValue: number;
  pendingShipments: number;
  lowStockItemsCount: number;
  sellerRating: number; // 0.0 - 5.0
  reviewCount: number;
  rtoRatePercent: number;
  escrowBalance: number;
  availablePayoutBalance: number;
  tcsDeductedYtd?: number; // India specific
}

export interface SellerProductItem {
  id: string;
  sku: string;
  title: string;
  categoryName: string;
  brandName: string;
  price: number;
  currency: CurrencyCode;
  stockQuantity: number;
  warehouseLocation: string;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'ARCHIVED';
  rating: number;
  salesCount: number;
  updatedAt: string;
}

export interface CreateSellerProductInput {
  title: string;
  slug?: string;
  description: string;
  categoryId: string;
  brandId?: string;
  basePrice: number;
  currency: CurrencyCode;
  sku: string;
  barcode?: string;
  stock: number;
  warehouseLocation: string;
  seoTitle?: string;
  seoDescription?: string;
  images: string[];
  attributes?: Record<string, string>;
  generateAiDescription?: boolean;
}

export interface BulkUploadRow {
  sku: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  warehouse: string;
}

export interface BulkUploadResult {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: { row: number; sku: string; error: string }[];
  importedProducts: SellerProductItem[];
}

export interface SellerOrderSummary {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  destinationCity: string;
  itemCount: number;
  totalAmount: number;
  currency: CurrencyCode;
  orderStatus: OrderStatus;
  paymentMethod: string;
  isCod: boolean;
  createdAt: string;
  courierName?: string;
  trackingNumber?: string;
  shippingLabelGenerated: boolean;
}

export interface ShippingLabelData {
  orderNumber: string;
  carrier: string;
  awbNumber: string;
  barcodeSvg: string;
  sellerStoreName: string;
  sellerTaxId: string; // PAN/GSTIN/TRN
  sellerAddress: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  declaredValue: number;
  currency: CurrencyCode;
  packageWeightKg: number;
  routingCode: string;
  isCod: boolean;
  codCollectAmount?: number;
}

export interface SellerPayoutRecord {
  id: string;
  payoutReference: string;
  amount: number;
  currency: CurrencyCode;
  bankName: string;
  accountNumberMasked: string;
  status: PayoutStatus;
  periodStart: string;
  periodEnd: string;
  commissionDeducted: number;
  tcsDeducted?: number; // India Section 52
  createdAt: string;
}
