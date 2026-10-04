import { IsEnum, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import { IsStrictText, IsUaeTrn } from '../../../common/validation';

export class CalculateTaxDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ example: 5000, description: 'Taxable amount before tax' })
  @IsNumber({}, { message: 'amount must be a valid number' })
  @IsPositive({ message: 'amount must be positive' })
  @Max(100000000, { message: 'amount exceeds maximum allowable limit' })
  amount: number;

  @ApiPropertyOptional({ example: 13, description: 'Custom tax rate percent' })
  @IsOptional()
  @IsNumber({}, { message: 'ratePercent must be a valid number' })
  @Min(0, { message: 'ratePercent cannot be negative' })
  @Max(100, { message: 'ratePercent cannot exceed 100%' })
  ratePercent?: number;

  @ApiPropertyOptional({ example: 'Bagmati', description: 'Seller state/province' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  sellerState?: string;

  @ApiPropertyOptional({ example: 'Bagmati', description: 'Buyer delivery state/province' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  buyerState?: string;

  @ApiPropertyOptional({ example: '8517.13.00', description: 'Harmonized System of Nomenclature code for India GST' })
  @IsOptional()
  @IsStrictText({ maxLength: 20 })
  hsnCode?: string;

  @ApiPropertyOptional({ example: '100234567800003', description: 'UAE Tax Registration Number (TRN)' })
  @IsOptional()
  @IsUaeTrn()
  trnNumber?: string;
}
