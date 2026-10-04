import { IsBoolean, IsEnum, IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import { IsStrictText } from '../../../common/validation';

export class CourierServiceabilityDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ example: 'Ward 10' })
  @IsStrictText({ minLength: 1, maxLength: 50 })
  postalCodeOrWard: string;

  @ApiProperty({ example: 'Kathmandu' })
  @IsStrictText({ minLength: 2, maxLength: 100 })
  destinationCity: string;

  @ApiProperty({ example: 1.5, minimum: 0.01, maximum: 1000 })
  @IsNumber({}, { message: 'weightKg must be a valid number' })
  @IsPositive({ message: 'weightKg must be positive' })
  @Max(1000, { message: 'weightKg cannot exceed 1000 kg' })
  weightKg: number;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'isCod must be a boolean' })
  isCod: boolean;
}
