import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CountryCode,
  CurrencyCode,
  AuctionItem,
  AuctionBidEntry,
  MakeOfferInput,
  MakeOfferResult,
  TieredPriceBracket,
  RfqInquiryInput,
  RfqInquiryResult,
  SponsoredCampaign,
  LoyaltyWalletBalance,
  AiChatPrompt,
  AiChatResponse,
  AiProductRecommendation,
} from '@dhanshree/shared';

@Injectable()
export class AdvancedService {
  private readonly logger = new Logger(AdvancedService.name);

  // In-memory auctions store
  private auctionsStore: AuctionItem[] = [
    {
      id: 'auc-001',
      productId: 'prod-vintage-camera',
      title: 'Leica M6 Classic 35mm Rangefinder Camera (Near Mint)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      countryCode: CountryCode.NEPAL,
      currency: CurrencyCode.NPR,
      startingPrice: 180000,
      currentBid: 245000,
      reservePrice: 220000,
      minBidIncrement: 5000,
      totalBidsCount: 14,
      highestBidderMasked: 'b***r@gmail.com',
      endsAt: new Date(Date.now() + 3600000 * 5).toISOString(), // Ends in 5 hours
      status: 'ACTIVE',
      allowOffers: true,
    },
    {
      id: 'auc-002',
      productId: 'prod-macbook-custom',
      title: 'Apple MacBook Pro 16" M3 Max 64GB RAM / 2TB SSD Custom Space Black',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      countryCode: CountryCode.INDIA,
      currency: CurrencyCode.INR,
      startingPrice: 220000,
      currentBid: 285000,
      reservePrice: 275000,
      minBidIncrement: 5000,
      totalBidsCount: 22,
      highestBidderMasked: 'v***k@outlook.com',
      endsAt: new Date(Date.now() + 3600000 * 2).toISOString(), // Ends in 2 hours
      status: 'ACTIVE',
      allowOffers: true,
    },
    {
      id: 'auc-003',
      productId: 'prod-rolex-sub',
      title: 'Rolex Submariner Date 41mm Oystersteel 2024 Box & Papers',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
      countryCode: CountryCode.UAE,
      currency: CurrencyCode.AED,
      startingPrice: 42000,
      currentBid: 51500,
      reservePrice: 50000,
      minBidIncrement: 1000,
      totalBidsCount: 18,
      highestBidderMasked: 't***q@emirates.net.ae',
      endsAt: new Date(Date.now() + 3600000 * 8).toISOString(), // Ends in 8 hours
      status: 'ACTIVE',
      allowOffers: true,
    },
  ];

  // In-memory wholesale tiered catalog
  private wholesaleProducts = [
    {
      id: 'ws-001',
      title: 'Universal High-Speed USB-C GaN 65W Fast Chargers (Bulk Pack)',
      category: 'Electronics & Accessories',
      basePriceNpr: 2500,
      basePriceInr: 1600,
      basePriceAed: 70,
      tiers: [
        { minQty: 10, maxQty: 49, discountPercent: 12, unitPriceNpr: 2200, unitPriceInr: 1408, unitPriceAed: 61.6 },
        { minQty: 50, maxQty: 199, discountPercent: 22, unitPriceNpr: 1950, unitPriceInr: 1248, unitPriceAed: 54.6 },
        { minQty: 200, discountPercent: 35, unitPriceNpr: 1625, unitPriceInr: 1040, unitPriceAed: 45.5 },
      ],
      leadTimeDays: 7,
      minOrderQty: 10,
    },
    {
      id: 'ws-002',
      title: 'Organic Certified Himalayan Orthodox Black Tea (50kg Food Grade Drums)',
      category: 'Agricultural Commodities',
      basePriceNpr: 85000,
      basePriceInr: 53125,
      basePriceAed: 2295,
      tiers: [
        { minQty: 2, maxQty: 5, discountPercent: 10, unitPriceNpr: 76500, unitPriceInr: 47812, unitPriceAed: 2065 },
        { minQty: 6, maxQty: 15, discountPercent: 18, unitPriceNpr: 69700, unitPriceInr: 43562, unitPriceAed: 1881 },
        { minQty: 16, discountPercent: 28, unitPriceNpr: 61200, unitPriceInr: 38250, unitPriceAed: 1652 },
      ],
      leadTimeDays: 14,
      minOrderQty: 2,
    },
  ];

  // In-memory PPC Campaigns
  private campaignsStore: SponsoredCampaign[] = [
    {
      id: 'camp-001',
      sellerId: 'demo-seller-1',
      campaignName: 'Sony XM5 Festive Search Boost',
      productSku: 'SNY-XM5-BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      dailyBudget: 2500,
      currency: CurrencyCode.NPR,
      maxCpc: 15,
      impressionsCount: 8420,
      clicksCount: 312,
      spentAmount: 1840,
      status: 'ACTIVE',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // AUCTIONS (eBay-Style)
  // ==========================================

  getAuctions(countryCode?: CountryCode): AuctionItem[] {
    if (countryCode) {
      return this.auctionsStore.filter((a) => a.countryCode === countryCode);
    }
    return this.auctionsStore;
  }

  placeBid(auctionId: string, amount: number, bidderEmail: string): AuctionItem {
    const auction = this.auctionsStore.find((a) => a.id === auctionId);
    if (!auction) {
      throw new NotFoundException(`Auction ${auctionId} not found`);
    }

    if (new Date(auction.endsAt).getTime() < Date.now()) {
      auction.status = 'ENDED';
      throw new BadRequestException('Auction has already concluded');
    }

    const minAllowed = auction.currentBid + auction.minBidIncrement;
    if (amount < minAllowed) {
      throw new BadRequestException(
        `Bid amount must be at least ${auction.currency} ${minAllowed.toLocaleString()}`,
      );
    }

    // Mask bidder
    const parts = bidderEmail.split('@');
    const masked = `${parts[0].slice(0, 1)}***${parts[0].slice(-1)}@${parts[1] || 'gmail.com'}`;

    auction.currentBid = amount;
    auction.totalBidsCount += 1;
    auction.highestBidderMasked = masked;

    this.logger.log(`New highest bid on ${auctionId}: ${auction.currency} ${amount} by ${masked}`);
    return auction;
  }

  makeOffer(input: MakeOfferInput): MakeOfferResult {
    const auction = this.auctionsStore.find((a) => a.id === input.auctionId);
    if (!auction) {
      throw new NotFoundException(`Auction ${input.auctionId} not found`);
    }

    // Automated counter-offer logic:
    // If offer is >= 90% of reserve, accept!
    // If between 75% and 89%, counter at 92%.
    // If < 75%, reject.
    const reserve = auction.reservePrice || auction.currentBid;
    const ratio = input.offerAmount / reserve;

    if (ratio >= 0.9) {
      return {
        offerId: `off-${Date.now()}`,
        status: 'ACCEPTED',
        offerAmount: input.offerAmount,
        message: 'Congratulations! The seller has automatically accepted your formal offer.',
      };
    } else if (ratio >= 0.75) {
      const counter = Math.round(reserve * 0.92);
      return {
        offerId: `off-${Date.now()}`,
        status: 'COUNTERED',
        offerAmount: input.offerAmount,
        counterAmount: counter,
        message: `The seller has proposed a counter-offer of ${auction.currency} ${counter.toLocaleString()}.`,
      };
    } else {
      return {
        offerId: `off-${Date.now()}`,
        status: 'REJECTED',
        offerAmount: input.offerAmount,
        message: 'Your offer is below the minimum threshold acceptable by the seller.',
      };
    }
  }

  // ==========================================
  // WHOLESALE & RFQ (Alibaba-Style)
  // ==========================================

  getWholesaleProducts() {
    return this.wholesaleProducts;
  }

  submitRfq(input: RfqInquiryInput): RfqInquiryResult {
    if (!input.businessName || !input.businessTaxId || !input.requestedQuantity) {
      throw new BadRequestException('Business Name, Tax Registration (PAN/GSTIN/TRN), and Quantity are required for wholesale RFQ');
    }

    const ref = `RFQ-${input.destinationCountry}-${Math.floor(100000 + Math.random() * 900000)}`;
    this.logger.log(`Created RFQ ${ref} for ${input.businessName} (${input.requestedQuantity} units of ${input.productTitle})`);

    return {
      rfqId: `rfq-${Date.now()}`,
      referenceNumber: ref,
      status: 'MATCHING_SUPPLIERS',
      estimatedQuotesCount: 3,
      createdAt: new Date().toISOString(),
    };
  }

  // ==========================================
  // SPONSORED ADS (PPC Engine)
  // ==========================================

  getSponsoredCampaigns(sellerId: string): SponsoredCampaign[] {
    return this.campaignsStore.filter((c) => c.sellerId === sellerId);
  }

  recordAdClick(campaignId: string): { recorded: boolean; remainingBudget: number } {
    const camp = this.campaignsStore.find((c) => c.id === campaignId);
    if (!camp || camp.status !== 'ACTIVE') {
      return { recorded: false, remainingBudget: 0 };
    }

    camp.clicksCount += 1;
    camp.spentAmount += camp.maxCpc;

    if (camp.spentAmount >= camp.dailyBudget) {
      camp.status = 'BUDGET_EXHAUSTED';
    }

    return { recorded: true, remainingBudget: Math.max(0, camp.dailyBudget - camp.spentAmount) };
  }

  // ==========================================
  // PRIME MEMBERSHIP & LOYALTY
  // ==========================================

  getLoyaltyBalance(userId: string, countryCode: CountryCode = CountryCode.NEPAL): LoyaltyWalletBalance {
    const isIndia = countryCode === CountryCode.INDIA;
    const isUae = countryCode === CountryCode.UAE;

    const points = 4850;
    // 100 points = 10 NPR / 6.25 INR / 0.27 AED
    const pointValue = isIndia ? (points / 100) * 6.25 : isUae ? (points / 100) * 0.27 : (points / 100) * 10;

    return {
      availablePoints: points,
      pointsValueLocalCurrency: Math.round(pointValue),
      currency: isIndia ? CurrencyCode.INR : isUae ? CurrencyCode.AED : CurrencyCode.NPR,
      isPrimeMember: true,
      primeExpiresAt: '2027-10-04T00:00:00Z',
    };
  }

  // ==========================================
  // AI SHOPPING ASSISTANT
  // ==========================================

  chatWithAiAssistant(prompt: AiChatPrompt): AiChatResponse {
    const lastUserMsg = prompt.messages
      .filter((m) => m.role === 'user')
      .pop()
      ?.content.toLowerCase() || '';

    const country = prompt.countryCode;
    const isIndia = country === CountryCode.INDIA;
    const isUae = country === CountryCode.UAE;

    const symbol = isIndia ? '₹' : isUae ? 'AED' : 'रु';
    const currency = isIndia ? CurrencyCode.INR : isUae ? CurrencyCode.AED : CurrencyCode.NPR;

    // Semantic matching
    if (lastUserMsg.includes('headphone') || lastUserMsg.includes('audio') || lastUserMsg.includes('sony') || lastUserMsg.includes('anc')) {
      const recs: AiProductRecommendation[] = [
        {
          id: 'rec-001',
          title: 'Sony WH-1000XM5 ANC Wireless Headphones',
          price: isIndia ? 29999 : isUae ? 1299 : 44999,
          currency,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          slug: 'sony-wh-1000xm5-anc-headphones',
          badge: 'Editor’s Choice',
        },
        {
          id: 'rec-002',
          title: 'Sony LinkBuds S Truly Wireless Earbuds',
          price: isIndia ? 12990 : isUae ? 549 : 19999,
          currency,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
          slug: 'sony-linkbuds-s-truly-wireless',
          badge: 'Best Value',
        },
      ];

      return {
        reply: `I found the best noise-cancelling options for you in ${country === 'NP' ? 'Nepal' : country === 'IN' ? 'India' : 'Dubai'}. The Sony WH-1000XM5 leads the category with industry-leading dual-processor ANC and 30-hour battery life. Both items qualify for free Prime Delivery and are backed by official warranty!`,
        recommendations: recs,
        intent: 'PRODUCT_RECOMMENDATION',
      };
    }

    if (lastUserMsg.includes('laptop') || lastUserMsg.includes('macbook') || lastUserMsg.includes('computer')) {
      const recs: AiProductRecommendation[] = [
        {
          id: 'rec-003',
          title: 'Apple MacBook Pro 14" (M3 Pro 18GB/512GB)',
          price: isIndia ? 199900 : isUae ? 8499 : 289999,
          currency,
          rating: 5.0,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
          slug: 'apple-macbook-pro-14-m3-pro',
          badge: 'Pro Grade',
        },
      ];

      return {
        reply: `For demanding professional workflows, coding, and creative rendering, the Apple MacBook Pro 14" with M3 Pro silicon is currently available in stock with verified serial number guarantee.`,
        recommendations: recs,
        intent: 'PRODUCT_RECOMMENDATION',
      };
    }

    // Default festival gift / recommendation reply
    const festivalName = country === 'NP' ? 'Dashain & Tihar' : country === 'IN' ? 'Diwali Dhamaka' : 'Ramadan & Eid';
    const recs: AiProductRecommendation[] = [
      {
        id: 'rec-001',
        title: 'Sony WH-1000XM5 ANC Wireless Headphones',
        price: isIndia ? 29999 : isUae ? 1299 : 44999,
        currency,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        slug: 'sony-wh-1000xm5-anc-headphones',
        badge: `${festivalName} Deal`,
      },
    ];

    return {
      reply: `Hello! I am Dhanshree's AI Shopping Concierge. I can help you discover genuine products, compare specs, find ${festivalName} festival offers, or calculate bulk wholesale discounts. What are you looking to buy today?`,
      recommendations: recs,
      intent: 'GENERAL_INQUIRY',
    };
  }
}
