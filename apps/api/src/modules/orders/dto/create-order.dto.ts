import { IsEnum, IsIn, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, PaymentMethod } from '@dhanshree/shared';
import { CreateAddressDto } from '../../users/dto/create-address.dto';
import { IsCouponCode, IsOtpCode, IsStrictText } from '../../../common/validation';

export class CreateOrderDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ESEWA })
  @IsEnum(PaymentMethod, { message: 'paymentMethod must be a valid PaymentMethod' })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'addr-uuid-1234' })
  @IsOptional()
  @IsString({ message: 'shippingAddressId must be a string' })
  @MaxLength(100)
  shippingAddressId?: string;

  @ApiPropertyOptional({ type: CreateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  shippingAddress?: CreateAddressDto;

  @ApiPropertyOptional({ example: 'DASHAIN2026' })
  @IsOptional()
  @IsCouponCode()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'STANDARD', enum: ['STANDARD', 'EXPRESS'] })
  @IsOptional()
  @IsIn(['STANDARD', 'EXPRESS'], { message: "shippingMethod must be either 'STANDARD' or 'EXPRESS'" })
  shippingMethod?: 'STANDARD' | 'EXPRESS';

  @ApiPropertyOptional({ example: 'Please ring the doorbell upon arrival' })
  @IsOptional()
  @IsStrictText({
    maxLength: 500,
    message: 'customerNotes must not exceed 500 characters and cannot contain HTML markup',
  })
  customerNotes?: string;

  @ApiPropertyOptional({ example: '123456', description: 'SMS OTP Code required if COD risk triggered' })
  @IsOptional()
  @IsOtpCode()
  codOtpCode?: string;
}
