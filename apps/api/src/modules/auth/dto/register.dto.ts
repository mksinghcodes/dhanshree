import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, CurrencyCode, SupportedLanguage, UserRole } from '@dhanshree/shared';
import { IsE164Phone, IsStrictText } from '../../../common/validation';

export class RegisterDto {
  @ApiProperty({ example: 'buyer@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(255, { message: 'email must not exceed 255 characters' })
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8, maxLength: 128 })
  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @IsStrictText({ minLength: 8, maxLength: 128 })
  password: string;

  @ApiProperty({ example: 'Aarav Sharma' })
  @IsStrictText({
    minLength: 2,
    maxLength: 100,
    message: 'fullName must be between 2 and 100 characters and cannot contain HTML markup or scripts',
  })
  fullName: string;

  @ApiPropertyOptional({ example: '+9779841234567' })
  @IsOptional()
  @IsE164Phone()
  @MaxLength(20, { message: 'phoneNumber must not exceed 20 characters' })
  phoneNumber?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.BUYER })
  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be a valid UserRole' })
  role?: UserRole = UserRole.BUYER;

  @ApiPropertyOptional({ enum: CountryCode, default: CountryCode.NEPAL })
  @IsOptional()
  @IsEnum(CountryCode, { message: 'preferredCountry must be a valid CountryCode (NP, IN, AE)' })
  preferredCountry?: CountryCode = CountryCode.NEPAL;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: SupportedLanguage.EN })
  @IsOptional()
  @IsEnum(SupportedLanguage, { message: 'preferredLanguage must be a valid SupportedLanguage (en, ne, hi, ar)' })
  preferredLanguage?: SupportedLanguage = SupportedLanguage.EN;

  @ApiPropertyOptional({ enum: CurrencyCode, default: CurrencyCode.NPR })
  @IsOptional()
  @IsEnum(CurrencyCode, { message: 'preferredCurrency must be a valid CurrencyCode (NPR, INR, AED, USD)' })
  preferredCurrency?: CurrencyCode = CurrencyCode.NPR;
}
