import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, PaymentMethod } from '@dhanshree/shared';
import { CreateAddressDto } from '../../users/dto/create-address.dto';

export class CreateOrderDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ESEWA })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'addr-uuid-1234' })
  @IsOptional()
  @IsString()
  shippingAddressId?: string;

  @ApiPropertyOptional({ type: CreateAddressDto })
  @IsOptional()
  shippingAddress?: CreateAddressDto;

  @ApiPropertyOptional({ example: 'DASHAIN2026' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'STANDARD', enum: ['STANDARD', 'EXPRESS'] })
  @IsOptional()
  @IsString()
  shippingMethod?: 'STANDARD' | 'EXPRESS';

  @ApiPropertyOptional({ example: 'Please ring the doorbell upon arrival' })
  @IsOptional()
  @IsString()
  customerNotes?: string;

  @ApiPropertyOptional({ example: '123456', description: 'SMS OTP Code required if COD risk triggered' })
  @IsOptional()
  @IsString()
  codOtpCode?: string;
}
