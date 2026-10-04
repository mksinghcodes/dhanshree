import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [
    CategoriesController,
    BrandsController,
    ProductsController,
    SearchController,
  ],
  providers: [
    CategoriesService,
    BrandsService,
    ProductsService,
    SearchService,
    PrismaService,
  ],
  exports: [CategoriesService, BrandsService, ProductsService, SearchService],
})
export class CatalogModule {}
