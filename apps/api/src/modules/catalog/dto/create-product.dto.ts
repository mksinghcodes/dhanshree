import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, ListingType } from '@dhanshree/shared';

export class CreateProductVariantDto {
  @ApiProperty({ example: 'WH-1000XM5-BLK' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Black / Over-Ear' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: { color: 'Black', style: 'Over-Ear' } })
  @IsNotEmpty()
  attributes: Record<string, string>;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @IsNumber()
  weightGrams?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  initialStock?: number = 10;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Industry-leading noise cancellation with 2 processors and 8 microphones...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Premium wireless ANC headphones with 30-hour battery life' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ example: 'cat-electronics-audio' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 'brand-sony' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiProperty({ example: 'store-sony-official' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ enum: ListingType, default: ListingType.STANDARD })
  @IsEnum(ListingType)
  listingType: ListingType = ListingType.STANDARD;

  @ApiProperty({ example: 'SONY-WH1000XM5-MAIN' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 399.99, description: 'Base price in USD or primary store currency' })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  baseCurrency?: string = 'USD';

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'] })
  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @ApiPropertyOptional({ type: [CreateProductVariantDto] })
  @IsOptional()
  @IsArray()
  variants?: CreateProductVariantDto[];

  @ApiPropertyOptional({ example: { NP: 49999, IN: 34999, AE: 1399 } })
  @IsOptional()
  countryPriceOverrides?: Partial<Record<CountryCode, number>>;
}
