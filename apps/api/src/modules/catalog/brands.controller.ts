import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BrandsService } from './brands.service';

@ApiTags('Catalog: Brands')
@Controller('api/v1/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active brands with logos and product counts' })
  async getBrands() {
    const data = await this.brandsService.getBrands();
    return {
      status: 'SUCCESS',
      count: data.length,
      data,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get brand details by slug' })
  async getBrand(@Param('slug') slug: string) {
    const data = await this.brandsService.getBrandBySlug(slug);
    return {
      status: 'SUCCESS',
      data,
    };
  }
}
