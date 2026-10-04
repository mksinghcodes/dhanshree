import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';

export class SearchProductsDto {
  @ApiPropertyOptional({ example: 'wireless headphones' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: CountryCode, default: CountryCode.NEPAL })
  @IsOptional()
  @IsEnum(CountryCode)
  countryCode?: CountryCode = CountryCode.NEPAL;

  @ApiPropertyOptional({ example: 'electronics' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ example: 'sony' })
  @IsOptional()
  @IsString()
  brandSlug?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 4, description: 'Minimum rating (1 to 5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minRating?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  inStockOnly?: boolean = false;

  @ApiPropertyOptional({
    enum: ['featured', 'price_asc', 'price_desc', 'rating', 'newest'],
    default: 'featured',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'featured';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
