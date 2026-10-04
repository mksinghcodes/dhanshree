import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, PaymentMethod } from '@dhanshree/shared';
import { IsCouponCode } from '../../../common/validation';

export class CheckoutQuoteDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ESEWA })
  @IsEnum(PaymentMethod, { message: 'paymentMethod must be a valid PaymentMethod' })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'DASHAIN2026' })
  @IsOptional()
  @IsCouponCode()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'STANDARD', enum: ['STANDARD', 'EXPRESS'] })
  @IsOptional()
  @IsIn(['STANDARD', 'EXPRESS'], { message: "shippingMethod must be either 'STANDARD' or 'EXPRESS'" })
  shippingMethod?: 'STANDARD' | 'EXPRESS';
}
