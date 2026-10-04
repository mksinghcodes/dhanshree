import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import {
  CountryCode,
  OrderStatus,
  CreateSellerProductInput,
  SellerDashboardKpi,
  SellerProductItem,
  BulkUploadResult,
  SellerOrderSummary,
  ShippingLabelData,
  SellerPayoutRecord,
} from '@dhanshree/shared';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('dashboard')
  getDashboardKpi(
    @Query('countryCode') countryCode?: CountryCode,
  ): SellerDashboardKpi {
    return this.sellerService.getDashboardKpi('demo-seller-1', countryCode);
  }

  @Get('products')
  getProducts(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): SellerProductItem[] {
    return this.sellerService.getProducts('demo-seller-1', { status, search });
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() input: CreateSellerProductInput): SellerProductItem {
    return this.sellerService.createProduct('demo-seller-1', input);
  }

  @Post('products/ai-description')
  @HttpCode(HttpStatus.OK)
  generateAiDescription(
    @Body() body: { title: string; category: string; keyFeatures?: string[] },
  ) {
    return this.sellerService.generateAiProductDescription(body);
  }

  @Post('products/bulk-upload')
  @HttpCode(HttpStatus.OK)
  bulkUploadProducts(
    @Body() body: { csvContent: string },
  ): BulkUploadResult {
    return this.sellerService.bulkUploadProducts('demo-seller-1', body.csvContent);
  }

  @Get('orders')
  getOrders(@Query('status') status?: OrderStatus): SellerOrderSummary[] {
    return this.sellerService.getOrders('demo-seller-1', status);
  }

  @Post('orders/:id/shipping-label')
  @HttpCode(HttpStatus.OK)
  generateShippingLabel(
    @Param('id') orderId: string,
  ): ShippingLabelData {
    return this.sellerService.packAndGenerateShippingLabel(orderId, 'demo-seller-1');
  }

  @Get('payouts')
  getPayouts(): {
    availableBalance: number;
    escrowLocked: number;
    history: SellerPayoutRecord[];
  } {
    return this.sellerService.getPayouts('demo-seller-1');
  }

  @Post('payouts/request')
  @HttpCode(HttpStatus.CREATED)
  requestPayout(
    @Body() body: { amount: number; bankInfo: { bankName: string; accountNumber: string } },
  ): SellerPayoutRecord {
    return this.sellerService.requestPayout('demo-seller-1', body.amount, body.bankInfo);
  }
}
