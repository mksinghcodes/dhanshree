import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';

export class CalculateTaxDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty({ example: 5000, description: 'Taxable amount before tax' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: 13, description: 'Custom tax rate percent' })
  @IsOptional()
  @IsNumber()
  ratePercent?: number;

  @ApiPropertyOptional({ example: 'Bagmati', description: 'Seller state/province' })
  @IsOptional()
  @IsString()
  sellerState?: string;

  @ApiPropertyOptional({ example: 'Bagmati', description: 'Buyer delivery state/province' })
  @IsOptional()
  @IsString()
  buyerState?: string;

  @ApiPropertyOptional({ example: '8517.13.00', description: 'Harmonized System of Nomenclature code for India GST' })
  @IsOptional()
  @IsString()
  hsnCode?: string;

  @ApiPropertyOptional({ example: '100234567800003', description: 'UAE Tax Registration Number (TRN)' })
  @IsOptional()
  @IsString()
  trnNumber?: string;
}
