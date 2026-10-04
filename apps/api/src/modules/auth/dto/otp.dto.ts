import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import { IsE164Phone, IsOtpCode } from '../../../common/validation';

export class SendOtpRequestDto {
  @ApiProperty({ example: '+9779841234567', description: 'E.164 formatted phone number' })
  @IsE164Phone()
  @MaxLength(20, { message: 'phoneNumber must not exceed 20 characters' })
  phoneNumber: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ example: 'LOGIN', enum: ['LOGIN', 'REGISTER', 'COD_VERIFICATION', 'PHONE_VERIFY'] })
  @IsString({ message: 'purpose must be a string' })
  @IsIn(['LOGIN', 'REGISTER', 'COD_VERIFICATION', 'PHONE_VERIFY'], {
    message: 'purpose must be one of: LOGIN, REGISTER, COD_VERIFICATION, PHONE_VERIFY',
  })
  purpose: 'LOGIN' | 'REGISTER' | 'COD_VERIFICATION' | 'PHONE_VERIFY';
}

export class VerifyOtpRequestDto {
  @ApiProperty({ example: '+9779841234567' })
  @IsE164Phone()
  @MaxLength(20, { message: 'phoneNumber must not exceed 20 characters' })
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP passcode' })
  @IsOtpCode()
  otpCode: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiPropertyOptional({ example: 'LOGIN', enum: ['LOGIN', 'REGISTER', 'COD_VERIFICATION', 'PHONE_VERIFY'] })
  @IsOptional()
  @IsIn(['LOGIN', 'REGISTER', 'COD_VERIFICATION', 'PHONE_VERIFY'])
  purpose?: string;
}
