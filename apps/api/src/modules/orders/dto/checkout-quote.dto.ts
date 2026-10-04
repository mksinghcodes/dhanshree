import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, PaymentMethod } from '@dhanshree/shared';

export class CheckoutQuoteDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ESEWA })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'DASHAIN2026' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'STANDARD', enum: ['STANDARD', 'EXPRESS'] })
  @IsOptional()
  @IsString()
  shippingMethod?: 'STANDARD' | 'EXPRESS';
}
