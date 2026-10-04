import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CountryCode } from '@dhanshree/shared';

@ApiTags('Cart & Bag')
@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user or guest cart with localized pricing and tax calculation' })
  getCart(
    @Headers('x-session-id') sessionId?: string,
    @Headers('x-country-code') countryCode?: CountryCode,
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    const country = countryCode || CountryCode.NEPAL;
    return {
      status: 'SUCCESS',
      data: this.cartService.getCart(ownerKey, country),
    };
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product variant to cart' })
  addItem(
    @Headers('x-session-id') sessionId: string | undefined,
    @Headers('x-country-code') countryCode: CountryCode | undefined,
    @Body() body: { variantId: string; quantity: number },
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    const country = countryCode || CountryCode.NEPAL;
    return {
      status: 'SUCCESS',
      data: this.cartService.addItem(ownerKey, body.variantId, body.quantity || 1, country),
    };
  }

  @Patch('items/:variantId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @Headers('x-session-id') sessionId: string | undefined,
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    return {
      status: 'SUCCESS',
      data: this.cartService.updateQuantity(ownerKey, variantId, quantity),
    };
  }

  @Delete('items/:variantId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @Headers('x-session-id') sessionId: string | undefined,
    @Param('variantId') variantId: string,
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    return {
      status: 'SUCCESS',
      data: this.cartService.removeItem(ownerKey, variantId),
    };
  }

  @Post('coupon')
  @ApiOperation({ summary: 'Apply festival promotional coupon code (e.g. DASHAIN2026, DIWALI2026, RAMADAN2026)' })
  applyCoupon(
    @Headers('x-session-id') sessionId: string | undefined,
    @Body('couponCode') couponCode: string,
  ) {
    const ownerKey = sessionId || 'default-guest-session';
    return {
      status: 'SUCCESS',
      data: this.cartService.applyCoupon(ownerKey, couponCode),
    };
  }
}
