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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import {
  CountryCode,
  OrderStatus,
  SellerDashboardKpi,
  SellerProductItem,
  BulkUploadResult,
  SellerOrderSummary,
  ShippingLabelData,
  SellerPayoutRecord,
  UserRole,
  AuthenticatedUser,
} from '@dhanshree/shared';
import { AuthenticatedRateLimit } from '../rate-limit';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { AiDescriptionDto } from './dto/ai-description.dto';
import { BulkUploadProductsDto } from './dto/bulk-upload.dto';
import { RequestPayoutDto } from './dto/request-payout.dto';

@ApiTags('Merchant & Seller Operations')
@Controller('sellers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
@AuthenticatedRateLimit()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  private resolveSellerId(user: AuthenticatedUser): string {
    return user?.id || 'demo-seller-1';
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Retrieve verified merchant KPIs, escrow balances, and order statistics' })
  getDashboardKpi(
    @CurrentUser() user: AuthenticatedUser,
    @Query('countryCode') countryCode?: CountryCode,
  ): SellerDashboardKpi {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.getDashboardKpi(sellerId, countryCode);
  }

  @Get('products')
  @ApiOperation({ summary: 'List inventory items owned by the authenticated merchant' })
  getProducts(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): SellerProductItem[] {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.getProducts(sellerId, { status, search });
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new marketplace product catalog entry under merchant ownership' })
  createProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Body() input: CreateSellerProductDto,
  ): SellerProductItem {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.createProduct(sellerId, input);
  }

  @Post('products/ai-description')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate localized, high-conversion product description via Gemini AI' })
  generateAiDescription(
    @Body() body: AiDescriptionDto,
  ) {
    return this.sellerService.generateAiProductDescription(body);
  }

  @Post('products/bulk-upload')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk ingest CSV inventory with schema and formula injection validation' })
  bulkUploadProducts(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: BulkUploadProductsDto,
  ): BulkUploadResult {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.bulkUploadProducts(sellerId, body.csvContent);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Fetch orders requiring merchant fulfillment and dispatch' })
  getOrders(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: OrderStatus,
  ): SellerOrderSummary[] {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.getOrders(sellerId, status);
  }

  @Post('orders/:id/shipping-label')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm packing and generate barcoded courier dispatch label' })
  generateShippingLabel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') orderId: string,
  ): ShippingLabelData {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.packAndGenerateShippingLabel(orderId, sellerId);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'View available bank payout balance and historical settlement records' })
  getPayouts(@CurrentUser() user: AuthenticatedUser): {
    availableBalance: number;
    escrowLocked: number;
    history: SellerPayoutRecord[];
  } {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.getPayouts(sellerId);
  }

  @Post('payouts/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request disbursement of unlocked escrow funds to merchant bank account' })
  requestPayout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RequestPayoutDto,
  ): SellerPayoutRecord {
    const sellerId = this.resolveSellerId(user);
    return this.sellerService.requestPayout(sellerId, body.amount, body.bankInfo);
  }
}
