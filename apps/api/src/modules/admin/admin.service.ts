import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CountryCode,
  CurrencyCode,
  UserRole,
  AdminDashboardMetrics,
  AdminSellerKycItem,
  AdminCommissionRule,
  AdminDisputeItem,
  AdminAuditLog,
} from '@dhanshree/shared';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  // In-memory audit trail
  private auditLogs: AdminAuditLog[] = [
    {
      id: 'aud-001',
      actorEmail: 'superadmin@marketplace.global',
      actorRole: UserRole.SUPER_ADMIN,
      action: 'PLATFORM_BOOTSTRAP',
      entityType: 'SYSTEM',
      entityId: 'SYS-GLOBAL-01',
      ipAddress: '10.0.0.1',
      details: 'Tri-country localized storefront clusters initialized for NP, IN, AE',
      createdAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'aud-002',
      actorEmail: 'finance.lead@marketplace.global',
      actorRole: UserRole.FINANCE,
      action: 'TCS_LEDGER_SYNC',
      entityType: 'TAX_RECONCILIATION',
      entityId: 'GST-TCS-IN-2026-09',
      ipAddress: '10.0.0.4',
      details: 'Reconciled 1% Section 52 TCS returns with GSTN portal for September 2026',
      createdAt: '2026-10-02T14:30:00Z',
    },
  ];

  // In-memory Seller KYC Queue
  private sellerKycQueue: AdminSellerKycItem[] = [
    {
      id: 'kyc-sny-001',
      sellerId: 'usr-seller-sny',
      storeName: 'Sony Official Flagship Store',
      ownerName: 'Manoj Shrestha',
      email: 'authorized.dealer@sony.np',
      phone: '+977 9801992819',
      country: CountryCode.NEPAL,
      registrationNumber: 'PAN 601992819',
      taxNumber: 'VAT-NP-601992819',
      documentUrls: [
        'https://docs.marketplace.global/kyc/np-pan-cert.pdf',
        'https://docs.marketplace.global/kyc/np-company-reg.pdf',
      ],
      status: 'VERIFIED',
      commissionRatePercent: 8.5,
      submittedAt: '2026-09-15T10:00:00Z',
      reviewedBy: 'superadmin@marketplace.global',
      reviewedAt: '2026-09-16T11:00:00Z',
      notes: 'Brand authorization verified directly with regional distributor',
    },
    {
      id: 'kyc-him-002',
      sellerId: 'usr-seller-him',
      storeName: 'Himalayan Organic Tea & Spices',
      ownerName: 'Sunita Basnet',
      email: 'export@himalayanpure.com',
      phone: '+977 9841009988',
      country: CountryCode.NEPAL,
      registrationNumber: 'PAN 609812445',
      taxNumber: 'VAT-NP-609812445',
      documentUrls: [
        'https://docs.marketplace.global/kyc/cottage-industry-license.pdf',
      ],
      status: 'PENDING_REVIEW',
      commissionRatePercent: 10.0,
      submittedAt: '2026-10-03T18:30:00Z',
      notes: 'Awaiting Department of Food Technology clearance document',
    },
    {
      id: 'kyc-mum-003',
      sellerId: 'usr-seller-mum',
      storeName: 'Mumbai Silk & Textile Crafts',
      ownerName: 'Rajesh Patel',
      email: 'rajesh@mumbaisilks.in',
      phone: '+91 9820019283',
      country: CountryCode.INDIA,
      registrationNumber: 'GSTIN 27AABCS1429B1Z8',
      taxNumber: 'PAN ABCDE1234F',
      documentUrls: [
        'https://docs.marketplace.global/kyc/gstn-cert.pdf',
      ],
      status: 'PENDING_REVIEW',
      commissionRatePercent: 12.0,
      submittedAt: '2026-10-04T06:15:00Z',
    },
    {
      id: 'kyc-dxb-004',
      sellerId: 'usr-seller-dxb',
      storeName: 'Dubai Gold & Fragrance Trading FZE',
      ownerName: 'Rashid Al Nuaimi',
      email: 'rashid@goldfze.ae',
      phone: '+971 501239988',
      country: CountryCode.UAE,
      registrationNumber: 'DED Trade License #992144',
      taxNumber: 'TRN 100488291000003',
      documentUrls: [
        'https://docs.marketplace.global/kyc/ded-commercial-license.pdf',
        'https://docs.marketplace.global/kyc/emirates-id-passport.pdf',
      ],
      status: 'VERIFIED',
      commissionRatePercent: 7.5,
      submittedAt: '2026-09-20T12:00:00Z',
      reviewedBy: 'superadmin@marketplace.global',
      reviewedAt: '2026-09-21T09:00:00Z',
    },
  ];

  // In-memory Commission Rules
  private commissionRules: AdminCommissionRule[] = [
    {
      id: 'rule-elec-np',
      categoryName: 'Consumer Electronics & Audio',
      countryCode: CountryCode.NEPAL,
      standardRatePercent: 8.5,
      promotionalRatePercent: 6.5,
      minFeeAmount: 150,
      currency: CurrencyCode.NPR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-fash-np',
      categoryName: 'Fashion, Apparel & Footwear',
      countryCode: CountryCode.NEPAL,
      standardRatePercent: 14.0,
      promotionalRatePercent: 10.0,
      minFeeAmount: 100,
      currency: CurrencyCode.NPR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-elec-in',
      categoryName: 'Consumer Electronics & Audio',
      countryCode: CountryCode.INDIA,
      standardRatePercent: 9.0,
      promotionalRatePercent: 7.0,
      minFeeAmount: 99,
      currency: CurrencyCode.INR,
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'rule-lux-ae',
      categoryName: 'Luxury Fragrance & Gold Jewelry',
      countryCode: CountryCode.UAE,
      standardRatePercent: 7.5,
      promotionalRatePercent: 5.0,
      minFeeAmount: 20,
      currency: CurrencyCode.AED,
      updatedAt: '2026-10-01T00:00:00Z',
    },
  ];

  // In-memory Disputes
  private disputesStore: AdminDisputeItem[] = [
    {
      id: 'disp-001',
      orderNumber: 'ORD-2026-NP-88190',
      buyerName: 'Amit Gurung',
      sellerStoreName: 'Himalayan Organic Tea & Spices',
      disputeReason: 'Item arrived with torn outer carton seal and broken glass container',
      claimAmount: 4800,
      currency: CurrencyCode.NPR,
      status: 'OPEN',
      escrowHoldId: 'escrow-np-88190',
      evidenceBuyer: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300',
      ],
      evidenceSeller: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300',
      ],
      createdAt: '2026-10-03T16:00:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Global cross-market platform metrics
   */
  getGlobalMetrics(): AdminDashboardMetrics {
    return {
      totalGmvUsd: 184500,
      totalOrders: 1420,
      totalRegisteredUsers: 9840,
      activeSellersCount: 148,
      pendingSellerKycCount: this.sellerKycQueue.filter((s) => s.status === 'PENDING_REVIEW').length,
      openDisputesCount: this.disputesStore.filter((d) => d.status === 'OPEN').length,
      escrowLockedTotalUsd: 42100,
      netCommissionEarnedUsd: 18450,
      countryBreakdown: [
        {
          country: CountryCode.NEPAL,
          currency: CurrencyCode.NPR,
          gmvLocal: 14500000,
          orderCount: 840,
          activeSellers: 82,
          vatGstCollected: 1885000, // 13% VAT
        },
        {
          country: CountryCode.INDIA,
          currency: CurrencyCode.INR,
          gmvLocal: 4800000,
          orderCount: 420,
          activeSellers: 44,
          vatGstCollected: 864000, // 18% GST average
        },
        {
          country: CountryCode.UAE,
          currency: CurrencyCode.AED,
          gmvLocal: 125000,
          orderCount: 160,
          activeSellers: 22,
          vatGstCollected: 6250, // 5% VAT
        },
      ],
    };
  }

  /**
   * Seller KYC Queue
   */
  getSellerKycQueue(status?: string): AdminSellerKycItem[] {
    if (status) {
      return this.sellerKycQueue.filter((s) => s.status === status);
    }
    return this.sellerKycQueue;
  }

  /**
   * Approve or reject a seller KYC application
   */
  reviewSellerKyc(
    kycId: string,
    decision: 'VERIFY' | 'REJECT',
    reviewerEmail: string,
    notes?: string,
    commissionOverride?: number,
  ): AdminSellerKycItem {
    const item = this.sellerKycQueue.find((s) => s.id === kycId || s.sellerId === kycId);
    if (!item) {
      throw new NotFoundException(`Seller KYC application ${kycId} not found`);
    }

    item.status = decision === 'VERIFY' ? 'VERIFIED' : 'REJECTED';
    item.reviewedBy = reviewerEmail;
    item.reviewedAt = new Date().toISOString();
    if (notes) item.notes = notes;
    if (commissionOverride && commissionOverride > 0) {
      item.commissionRatePercent = commissionOverride;
    }

    // Append to audit log
    this.logAction({
      actorEmail: reviewerEmail,
      actorRole: UserRole.SUPER_ADMIN,
      action: decision === 'VERIFY' ? 'SELLER_KYC_APPROVED' : 'SELLER_KYC_REJECTED',
      entityType: 'SELLER',
      entityId: item.sellerId,
      details: `Seller ${item.storeName} (${item.country}) ${decision === 'VERIFY' ? 'approved' : 'rejected'}. Commission: ${item.commissionRatePercent}%. Notes: ${notes || 'N/A'}`,
    });

    return item;
  }

  /**
   * Commission rules engine
   */
  getCommissionRules(): AdminCommissionRule[] {
    return this.commissionRules;
  }

  /**
   * Update category commission rule
   */
  updateCommissionRule(
    ruleId: string,
    ratePercent: number,
    adminEmail: string,
  ): AdminCommissionRule {
    const rule = this.commissionRules.find((r) => r.id === ruleId);
    if (!rule) {
      throw new NotFoundException(`Commission rule ${ruleId} not found`);
    }

    const prevRate = rule.standardRatePercent;
    rule.standardRatePercent = ratePercent;
    rule.updatedAt = new Date().toISOString();

    this.logAction({
      actorEmail: adminEmail,
      actorRole: UserRole.FINANCE,
      action: 'COMMISSION_RATE_UPDATED',
      entityType: 'COMMISSION_RULE',
      entityId: ruleId,
      details: `Updated ${rule.categoryName} (${rule.countryCode}) standard commission from ${prevRate}% to ${ratePercent}%`,
    });

    return rule;
  }

  /**
   * Disputes arbitration
   */
  getDisputes(): AdminDisputeItem[] {
    return this.disputesStore;
  }

  /**
   * Arbitrate escrow dispute
   */
  resolveDispute(
    disputeId: string,
    decision: 'REFUND_BUYER' | 'RELEASE_SELLER',
    adminEmail: string,
    adminNotes: string,
  ): AdminDisputeItem {
    const dispute = this.disputesStore.find((d) => d.id === disputeId);
    if (!dispute) {
      throw new NotFoundException(`Dispute ${disputeId} not found`);
    }

    dispute.status = decision === 'REFUND_BUYER' ? 'REFUNDED_TO_BUYER' : 'RELEASED_TO_SELLER';

    this.logAction({
      actorEmail: adminEmail,
      actorRole: UserRole.SUPPORT,
      action: `DISPUTE_${decision}`,
      entityType: 'ESCROW_DISPUTE',
      entityId: disputeId,
      details: `Dispute on ${dispute.orderNumber} resolved with decision: ${decision}. Amount: ${dispute.currency} ${dispute.claimAmount}. Reason: ${adminNotes}`,
    });

    return dispute;
  }

  /**
   * Audit Logs
   */
  getAuditLogs(): AdminAuditLog[] {
    return this.auditLogs;
  }

  /**
   * Internal tamper-evident log helper
   */
  logAction(log: {
    actorEmail: string;
    actorRole: UserRole;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
  }) {
    const entry: AdminAuditLog = {
      id: `aud-${Date.now()}`,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString(),
      ...log,
    };
    this.auditLogs.unshift(entry);
    this.logger.log(`[AUDIT] ${entry.actorEmail} executed ${entry.action} on ${entry.entityType}:${entry.entityId}`);
  }
}
