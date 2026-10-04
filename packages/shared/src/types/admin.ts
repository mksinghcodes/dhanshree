import { CountryCode, CurrencyCode } from '../constants/countries.js';
import { UserRole } from './user.js';
import { ReturnStatus } from './order.js';

export interface AdminDashboardMetrics {
  totalGmvUsd: number;
  totalOrders: number;
  totalRegisteredUsers: number;
  activeSellersCount: number;
  pendingSellerKycCount: number;
  openDisputesCount: number;
  escrowLockedTotalUsd: number;
  netCommissionEarnedUsd: number;
  countryBreakdown: {
    country: CountryCode;
    currency: CurrencyCode;
    gmvLocal: number;
    orderCount: number;
    activeSellers: number;
    vatGstCollected: number;
  }[];
}

export interface AdminUserSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  country: CountryCode;
  isActive: boolean;
  isKycVerified: boolean;
  orderCount: number;
  createdAt: string;
}

export interface AdminSellerKycItem {
  id: string;
  sellerId: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  country: CountryCode;
  registrationNumber: string; // PAN for NP, GSTIN for IN, Trade License for AE
  taxNumber: string;
  documentUrls: string[];
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  commissionRatePercent: number;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface AdminCommissionRule {
  id: string;
  categoryName: string;
  countryCode: CountryCode;
  standardRatePercent: number;
  promotionalRatePercent?: number;
  minFeeAmount: number;
  currency: CurrencyCode;
  updatedAt: string;
}

export interface AdminDisputeItem {
  id: string;
  orderNumber: string;
  buyerName: string;
  sellerStoreName: string;
  disputeReason: string;
  claimAmount: number;
  currency: CurrencyCode;
  status: 'OPEN' | 'UNDER_REVIEW' | 'REFUNDED_TO_BUYER' | 'RELEASED_TO_SELLER';
  escrowHoldId: string;
  evidenceBuyer: string[];
  evidenceSeller: string[];
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  details: string;
  createdAt: string;
}
