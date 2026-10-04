import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import { IsAlphanumericSlug, IsStrictText } from '../../../common/validation';

export class SearchProductsDto {
  @ApiPropertyOptional({ example: 'wireless headphones' })
  @IsOptional()
  @IsStrictText({
    maxLength: 100,
    message: 'q must not exceed 100 characters and cannot contain HTML markup',
  })
  q?: string;

  @ApiPropertyOptional({ enum: CountryCode, default: CountryCode.NEPAL })
  @IsOptional()
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode' })
  countryCode?: CountryCode = CountryCode.NEPAL;

  @ApiPropertyOptional({ example: 'electronics' })
  @IsOptional()
  @IsAlphanumericSlug()
  categorySlug?: string;

  @ApiPropertyOptional({ example: 'sony' })
  @IsOptional()
  @IsAlphanumericSlug()
  brandSlug?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a number' })
  @Min(0, { message: 'minPrice cannot be negative' })
  @Max(100000000)
  minPrice?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a number' })
  @Min(0)
  @Max(100000000)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 4, description: 'Minimum rating (1 to 5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minRating must be a number' })
  @Min(1, { message: 'minRating must be at least 1' })
  @Max(5, { message: 'minRating cannot exceed 5' })
  minRating?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'inStockOnly must be a boolean' })
  inStockOnly?: boolean = false;

  @ApiPropertyOptional({
    enum: ['featured', 'price_asc', 'price_desc', 'rating', 'newest'],
    default: 'featured',
  })
  @IsOptional()
  @IsIn(['featured', 'price_asc', 'price_desc', 'rating', 'newest'], {
    message: "sortBy must be one of: 'featured', 'price_asc', 'price_desc', 'rating', 'newest'",
  })
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'featured';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  @Max(10000, { message: 'page cannot exceed 10,000' })
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit cannot exceed 100 items per page' })
  limit?: number = 20;
}
