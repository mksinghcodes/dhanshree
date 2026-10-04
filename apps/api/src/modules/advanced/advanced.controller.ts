import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdvancedService } from './advanced.service';
import {
  CountryCode,
  AuctionItem,
  MakeOfferInput,
  MakeOfferResult,
  RfqInquiryInput,
  RfqInquiryResult,
  SponsoredCampaign,
  LoyaltyWalletBalance,
  AiChatPrompt,
  AiChatResponse,
} from '@dhanshree/shared';

@Controller('advanced')
export class AdvancedController {
  constructor(private readonly advancedService: AdvancedService) {}

  @Get('auctions')
  getAuctions(@Query('country') country?: CountryCode): AuctionItem[] {
    return this.advancedService.getAuctions(country);
  }

  @Post('auctions/:id/bid')
  @HttpCode(HttpStatus.OK)
  placeBid(
    @Param('id') auctionId: string,
    @Body() body: { amount: number; bidderEmail: string },
  ): AuctionItem {
    return this.advancedService.placeBid(auctionId, body.amount, body.bidderEmail || 'buyer@example.com');
  }

  @Post('auctions/:id/offer')
  @HttpCode(HttpStatus.OK)
  makeOffer(
    @Param('id') auctionId: string,
    @Body() body: MakeOfferInput,
  ): MakeOfferResult {
    return this.advancedService.makeOffer({ ...body, auctionId });
  }

  @Get('rfq/products')
  getWholesaleProducts() {
    return this.advancedService.getWholesaleProducts();
  }

  @Post('rfq/inquiry')
  @HttpCode(HttpStatus.CREATED)
  submitRfq(@Body() body: RfqInquiryInput): RfqInquiryResult {
    return this.advancedService.submitRfq(body);
  }

  @Get('ads/campaigns')
  getSponsoredCampaigns(): SponsoredCampaign[] {
    return this.advancedService.getSponsoredCampaigns('demo-seller-1');
  }

  @Post('ads/campaigns/:id/click')
  @HttpCode(HttpStatus.OK)
  recordAdClick(@Param('id') campaignId: string) {
    return this.advancedService.recordAdClick(campaignId);
  }

  @Get('loyalty')
  getLoyalty(@Query('country') country?: CountryCode): LoyaltyWalletBalance {
    return this.advancedService.getLoyaltyBalance('usr-demo-1', country);
  }

  @Post('ai-assistant/chat')
  @HttpCode(HttpStatus.OK)
  chatWithAiAssistant(@Body() prompt: AiChatPrompt): AiChatResponse {
    return this.advancedService.chatWithAiAssistant(prompt);
  }
}
