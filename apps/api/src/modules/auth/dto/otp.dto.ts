import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';

export class SendOtpRequestDto {
  @ApiProperty({ example: '+9779841234567', description: 'E.164 formatted phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty({ example: 'LOGIN', enum: ['LOGIN', 'REGISTER', 'COD_VERIFICATION', 'PHONE_VERIFY'] })
  @IsString()
  @IsNotEmpty()
  purpose: 'LOGIN' | 'REGISTER' | 'COD_VERIFICATION' | 'PHONE_VERIFY';
}

export class VerifyOtpRequestDto {
  @ApiProperty({ example: '+9779841234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP passcode' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty({ example: 'LOGIN', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;
}
