import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyCode } from '@dhanshree/shared';
import { IsProductSku, IsStrictText } from '../../../common/validation';

export class CreateSellerProductDto {
  @ApiProperty({ example: 'Handmade Pashmina Shawl 100% Cashmere' })
  @IsStrictText({
    minLength: 3,
    maxLength: 200,
    message: 'title must be between 3 and 200 characters and cannot contain HTML markup',
  })
  title: string;

  @ApiPropertyOptional({ example: 'handmade-pashmina-shawl' })
  @IsOptional()
  @IsString({ message: 'slug must be a string' })
  @MaxLength(100)
  slug?: string;

  @ApiProperty({ example: 'Authentic pure Himalayan cashmere handwoven by master artisans in Kathmandu...' })
  @IsStrictText({
    minLength: 10,
    maxLength: 5000,
    message: 'description must be between 10 and 5000 characters and cannot contain HTML markup',
  })
  description: string;

  @ApiProperty({ example: 'cat-fashion-shawls' })
  @IsString({ message: 'categoryId must be a string' })
  @IsNotEmpty({ message: 'categoryId cannot be empty' })
  @MaxLength(100)
  categoryId: string;

  @ApiPropertyOptional({ example: 'brand-himalaya' })
  @IsOptional()
  @IsString({ message: 'brandId must be a string' })
  @MaxLength(100)
  brandId?: string;

  @ApiProperty({ example: 15000, description: 'Base price in specified currency' })
  @IsNumber({}, { message: 'basePrice must be a valid number' })
  @IsPositive({ message: 'basePrice must be positive' })
  @Max(100000000, { message: 'basePrice exceeds maximum permitted limit' })
  basePrice: number;

  @ApiProperty({ enum: CurrencyCode, example: CurrencyCode.NPR })
  @IsEnum(CurrencyCode, { message: 'currency must be a valid CurrencyCode (NPR, INR, AED, USD)' })
  currency: CurrencyCode;

  @ApiProperty({ example: 'PAS-001-RED' })
  @IsProductSku()
  sku: string;

  @ApiPropertyOptional({ example: '8901234567890' })
  @IsOptional()
  @IsString({ message: 'barcode must be a string' })
  @MaxLength(50)
  barcode?: string;

  @ApiProperty({ example: 50, minimum: 0, maximum: 100000 })
  @IsNumber({}, { message: 'stock must be a valid number' })
  @Min(0, { message: 'stock cannot be negative' })
  @Max(100000, { message: 'stock cannot exceed 100,000 units' })
  stock: number;

  @ApiProperty({ example: 'KTM-WH-01' })
  @IsStrictText({
    minLength: 2,
    maxLength: 100,
    message: 'warehouseLocation must be between 2 and 100 characters',
  })
  warehouseLocation: string;

  @ApiPropertyOptional({ example: 'Buy Authentic Pashmina Shawl' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Premium 100% cashmere handmade shawl online in Nepal.' })
  @IsOptional()
  @IsStrictText({ maxLength: 300 })
  seoDescription?: string;

  @ApiProperty({ example: ['https://storage.dhanshree.com/products/pashmina1.jpg'] })
  @IsArray({ message: 'images must be an array of image URLs' })
  @IsString({ each: true, message: 'Each image URL must be a string' })
  images: string[];

  @ApiPropertyOptional({ example: { Material: '100% Cashmere', Weave: 'Diamond Weave' } })
  @IsOptional()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'generateAiDescription must be a boolean' })
  generateAiDescription?: boolean;
}
