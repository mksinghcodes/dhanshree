import {
  IsEmail,
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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, CurrencyCode } from '@dhanshree/shared';
import { IsE164Phone, IsStrictText } from '../../../common/validation';

export class RfqInquiryDto {
  @ApiPropertyOptional({ example: 'prod-wholesale-cotton-yarn' })
  @IsOptional()
  @IsString({ message: 'productId must be a string' })
  @MaxLength(100)
  productId?: string;

  @ApiProperty({ example: '100% Organic Combed Cotton Yarn 30s' })
  @IsStrictText({ minLength: 2, maxLength: 200 })
  productTitle: string;

  @ApiProperty({ example: 'Textiles & Fabrics' })
  @IsStrictText({ minLength: 2, maxLength: 100 })
  category: string;

  @ApiProperty({ example: 1000, minimum: 1, maximum: 1000000 })
  @IsInt({ message: 'requestedQuantity must be an integer' })
  @Min(1, { message: 'requestedQuantity must be at least 1' })
  @Max(1000000, { message: 'requestedQuantity cannot exceed 1,000,000 units' })
  requestedQuantity: number;

  @ApiProperty({ example: 4.5, description: 'Target wholesale price per unit' })
  @IsNumber({}, { message: 'targetPricePerUnit must be a valid number' })
  @IsPositive({ message: 'targetPricePerUnit must be positive' })
  @Max(100000000, { message: 'targetPricePerUnit exceeds maximum allowed price' })
  targetPricePerUnit: number;

  @ApiProperty({ enum: CurrencyCode, example: CurrencyCode.NPR })
  @IsEnum(CurrencyCode, { message: 'currency must be a valid CurrencyCode' })
  currency: CurrencyCode;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'destinationCountry must be a valid CountryCode (NP, IN, AE)' })
  destinationCountry: CountryCode;

  @ApiProperty({ example: 'Kathmandu Apparel Industries Pvt. Ltd.' })
  @IsStrictText({ minLength: 2, maxLength: 150 })
  businessName: string;

  @ApiProperty({ example: '601987654', description: 'Business Tax ID (PAN/GSTIN/TRN)' })
  @IsString({ message: 'businessTaxId must be a string' })
  @IsNotEmpty({ message: 'businessTaxId cannot be empty' })
  @MaxLength(50, { message: 'businessTaxId must not exceed 50 characters' })
  businessTaxId: string;

  @ApiProperty({ example: 'procurement@kathmanduapparel.com' })
  @IsEmail({}, { message: 'contactEmail must be a valid email address' })
  @MaxLength(255)
  contactEmail: string;

  @ApiProperty({ example: '+9779841234567' })
  @IsE164Phone()
  @MaxLength(20)
  contactPhone: string;

  @ApiPropertyOptional({ example: 'FOB delivery to Birgunj Dry Port, container shipping' })
  @IsOptional()
  @IsStrictText({ maxLength: 500 })
  notes?: string;
}
