import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, CurrencyCode, ListingType } from '@dhanshree/shared';
import { IsProductSku, IsStrictText } from '../../../common/validation';

export class CreateProductVariantDto {
  @ApiProperty({ example: 'WH-1000XM5-BLK' })
  @IsProductSku()
  sku: string;

  @ApiProperty({ example: 'Black / Over-Ear' })
  @IsStrictText({
    minLength: 1,
    maxLength: 100,
    message: 'variant title must be between 1 and 100 characters and cannot contain HTML markup',
  })
  title: string;

  @ApiProperty({ example: { color: 'Black', style: 'Over-Ear' } })
  @IsNotEmpty({ message: 'attributes cannot be empty' })
  attributes: Record<string, string>;

  @ApiPropertyOptional({ example: 250, minimum: 0, maximum: 100000 })
  @IsOptional()
  @IsNumber({}, { message: 'weightGrams must be a number' })
  @Min(0)
  @Max(100000)
  weightGrams?: number;

  @ApiPropertyOptional({ example: 100, minimum: 0, maximum: 100000 })
  @IsOptional()
  @IsInt({ message: 'initialStock must be an integer' })
  @Min(0)
  @Max(100000)
  initialStock?: number = 10;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones' })
  @IsStrictText({
    minLength: 3,
    maxLength: 200,
    message: 'title must be between 3 and 200 characters and cannot contain HTML markup',
  })
  title: string;

  @ApiProperty({ example: 'Industry-leading noise cancellation with 2 processors and 8 microphones...' })
  @IsStrictText({
    minLength: 10,
    maxLength: 5000,
    message: 'description must be between 10 and 5000 characters and cannot contain HTML markup',
  })
  description: string;

  @ApiPropertyOptional({ example: 'Premium wireless ANC headphones with 30-hour battery life' })
  @IsOptional()
  @IsStrictText({
    maxLength: 300,
    message: 'shortDescription must not exceed 300 characters',
  })
  shortDescription?: string;

  @ApiProperty({ example: 'cat-electronics-audio' })
  @IsString({ message: 'categoryId must be a string' })
  @IsNotEmpty({ message: 'categoryId cannot be empty' })
  @MaxLength(100)
  categoryId: string;

  @ApiPropertyOptional({ example: 'brand-sony' })
  @IsOptional()
  @IsString({ message: 'brandId must be a string' })
  @MaxLength(100)
  brandId?: string;

  @ApiProperty({ example: 'store-sony-official' })
  @IsString({ message: 'storeId must be a string' })
  @IsNotEmpty({ message: 'storeId cannot be empty' })
  @MaxLength(100)
  storeId: string;

  @ApiProperty({ enum: ListingType, default: ListingType.STANDARD })
  @IsEnum(ListingType, { message: 'listingType must be a valid ListingType' })
  listingType: ListingType = ListingType.STANDARD;

  @ApiProperty({ example: 'SONY-WH1000XM5-MAIN' })
  @IsProductSku()
  sku: string;

  @ApiProperty({ example: 399.99, description: 'Base price in USD or primary store currency' })
  @IsNumber({}, { message: 'basePrice must be a valid number' })
  @IsPositive({ message: 'basePrice must be positive' })
  @Max(100000000, { message: 'basePrice exceeds maximum permitted limit' })
  basePrice: number;

  @ApiPropertyOptional({ enum: CurrencyCode, default: CurrencyCode.NPR })
  @IsOptional()
  @IsEnum(CurrencyCode, { message: 'baseCurrency must be a valid CurrencyCode' })
  baseCurrency?: CurrencyCode = CurrencyCode.NPR;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'] })
  @IsOptional()
  @IsArray({ message: 'imageUrls must be an array' })
  @IsString({ each: true, message: 'Each imageUrl must be a string' })
  imageUrls?: string[];

  @ApiPropertyOptional({ type: [CreateProductVariantDto] })
  @IsOptional()
  @IsArray({ message: 'variants must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @ApiPropertyOptional({ example: { NP: 49999, IN: 34999, AE: 1399 } })
  @IsOptional()
  countryPriceOverrides?: Partial<Record<CountryCode, number>>;
}
