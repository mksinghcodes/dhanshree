import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { SearchProductsDto } from './dto/search-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CountryCode, AuthenticatedUser, UserRole } from '@dhanshree/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Catalog: Products & PDP')
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter products with facets and localized country pricing' })
  async searchProducts(@Query() query: SearchProductsDto) {
    const data = await this.productsService.searchProducts(query);
    return {
      status: 'SUCCESS',
      data,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get complete Product Detail Page (PDP) payload with localized price, stock, gallery and reviews' })
  async getProductBySlug(
    @Param('slug') slug: string,
    @Query('countryCode') countryCode?: CountryCode,
  ) {
    const data = await this.productsService.getProductBySlug(slug, countryCode);
    return {
      status: 'SUCCESS',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product listing (Vendor/Admin)' })
  async createProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.createProduct(user.id, dto);
  }
}
