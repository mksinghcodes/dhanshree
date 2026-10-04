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
import { AuthenticatedRateLimit } from '../rate-limit';
import { PlaceBidDto } from './dto/place-bid.dto';
import { MakeOfferDto } from './dto/make-offer.dto';
import { RfqInquiryDto } from './dto/rfq-inquiry.dto';
import { AiChatPromptDto } from './dto/ai-chat.dto';

@Controller('advanced')
@AuthenticatedRateLimit()
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
    @Body() body: PlaceBidDto,
  ): AuctionItem {
    return this.advancedService.placeBid(auctionId, body.amount, body.bidderEmail);
  }

  @Post('auctions/:id/offer')
  @HttpCode(HttpStatus.OK)
  makeOffer(
    @Param('id') auctionId: string,
    @Body() body: MakeOfferDto,
  ): MakeOfferResult {
    return this.advancedService.makeOffer({
      auctionId: body.auctionId || auctionId,
      buyerName: body.buyerName,
      buyerEmail: body.buyerEmail,
      offerAmount: body.offerAmount,
      message: body.message,
    });
  }

  @Get('rfq/products')
  getWholesaleProducts() {
    return this.advancedService.getWholesaleProducts();
  }

  @Post('rfq/inquiry')
  @HttpCode(HttpStatus.CREATED)
  submitRfq(@Body() body: RfqInquiryDto): RfqInquiryResult {
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
  chatWithAiAssistant(@Body() prompt: AiChatPromptDto): AiChatResponse {
    return this.advancedService.chatWithAiAssistant(prompt);
  }
}
