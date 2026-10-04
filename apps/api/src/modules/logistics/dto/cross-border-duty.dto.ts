import { IsEnum, IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode, CurrencyCode } from '@dhanshree/shared';
import { IsStrictText } from '../../../common/validation';

export class CrossBorderDutyDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.INDIA })
  @IsEnum(CountryCode, { message: 'originCountry must be a valid CountryCode (NP, IN, AE)' })
  originCountry: CountryCode;

  @ApiProperty({ enum: CountryCode, example: CountryCode.UAE })
  @IsEnum(CountryCode, { message: 'destinationCountry must be a valid CountryCode (NP, IN, AE)' })
  destinationCountry: CountryCode;

  @ApiProperty({ example: 'Jewelry & Gemstones' })
  @IsStrictText({ minLength: 2, maxLength: 100 })
  category: string;

  @ApiProperty({ example: 1200 })
  @IsNumber({}, { message: 'declaredValue must be a valid number' })
  @IsPositive({ message: 'declaredValue must be positive' })
  @Max(100000000, { message: 'declaredValue exceeds maximum allowable limit' })
  declaredValue: number;

  @ApiProperty({ enum: CurrencyCode, example: CurrencyCode.INR })
  @IsEnum(CurrencyCode, { message: 'currency must be a valid CurrencyCode' })
  currency: CurrencyCode;

  @ApiProperty({ example: 0.5, minimum: 0.01, maximum: 1000 })
  @IsNumber({}, { message: 'weightKg must be a valid number' })
  @IsPositive({ message: 'weightKg must be positive' })
  @Max(1000, { message: 'weightKg cannot exceed 1000 kg' })
  weightKg: number;
}
