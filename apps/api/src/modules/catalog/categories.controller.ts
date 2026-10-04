import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { PublicRateLimit } from '../rate-limit';

@ApiTags('Catalog: Categories')
@Controller('api/v1/categories')
@PublicRateLimit()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('tree')
  @ApiOperation({ summary: 'Get full multi-level category tree for mega-menu navigation' })
  async getCategoryTree() {
    const data = await this.categoriesService.getCategoryTree();
    return {
      status: 'SUCCESS',
      count: data.length,
      data,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category details and breadcrumbs by slug' })
  async getCategory(@Param('slug') slug: string) {
    const data = await this.categoriesService.getCategoryBySlug(slug);
    return {
      status: 'SUCCESS',
      data,
    };
  }
}
