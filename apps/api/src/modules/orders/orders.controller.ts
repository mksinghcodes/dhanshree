import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CheckoutQuoteDto } from './dto/checkout-quote.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticatedRateLimit } from '../rate-limit';

@ApiTags('Orders, Checkout & Invoicing')
@Controller('api/v1')
@AuthenticatedRateLimit()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout/quote')
  @ApiOperation({ summary: 'Calculate checkout total with localized taxes, shipping, coupons, and COD fee' })
  getCheckoutQuote(
    @Headers('x-session-id') sessionId: string | undefined,
    @Body() dto: CheckoutQuoteDto,
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    return {
      status: 'SUCCESS',
      data: this.ordersService.getCheckoutQuote(dto, ownerKey),
    };
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place order, create escrow hold, and initialize localized payment adapter' })
  createOrder(
    @Headers('x-session-id') sessionId: string | undefined,
    @Headers('x-user-id') userId: string | undefined,
    @Body() dto: CreateOrderDto,
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    const effectiveUserId = userId || 'usr-guest-buyer';
    return this.ordersService.createOrder(effectiveUserId, dto, ownerKey);
  }

  @Get('orders/:orderNumber')
  @ApiOperation({ summary: 'Get order details, tracking number, and live fulfillment timeline' })
  getOrder(@Param('orderNumber') orderNumber: string) {
    return {
      status: 'SUCCESS',
      data: this.ordersService.getOrder(orderNumber),
    };
  }

  @Get('orders/:orderNumber/invoice')
  @ApiOperation({ summary: 'Retrieve bilingual tax invoice data (English/Nepali, English/Arabic with TRN)' })
  getInvoice(@Param('orderNumber') orderNumber: string) {
    return {
      status: 'SUCCESS',
      data: this.ordersService.getInvoiceData(orderNumber),
    };
  }
}
