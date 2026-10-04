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
import { AuthenticatedRateLimit } from '../rate-limit';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { AiDescriptionDto } from './dto/ai-description.dto';
import { BulkUploadProductsDto } from './dto/bulk-upload.dto';
import { RequestPayoutDto } from './dto/request-payout.dto';

@Controller('sellers')
@AuthenticatedRateLimit()
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
  createProduct(@Body() input: CreateSellerProductDto): SellerProductItem {
    return this.sellerService.createProduct('demo-seller-1', input);
  }

  @Post('products/ai-description')
  @HttpCode(HttpStatus.OK)
  generateAiDescription(
    @Body() body: AiDescriptionDto,
  ) {
    return this.sellerService.generateAiProductDescription(body);
  }

  @Post('products/bulk-upload')
  @HttpCode(HttpStatus.OK)
  bulkUploadProducts(
    @Body() body: BulkUploadProductsDto,
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
    @Body() body: RequestPayoutDto,
  ): SellerPayoutRecord {
    return this.sellerService.requestPayout('demo-seller-1', body.amount, body.bankInfo);
  }
}
