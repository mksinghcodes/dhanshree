import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode, CurrencyCode, SupportedLanguage, UserRole } from '@dhanshree/shared';

export class RegisterDto {
  @ApiProperty({ example: 'buyer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'Aarav Sharma' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: '+9779841234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.BUYER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.BUYER;

  @ApiPropertyOptional({ enum: CountryCode, default: CountryCode.NEPAL })
  @IsOptional()
  @IsEnum(CountryCode)
  preferredCountry?: CountryCode = CountryCode.NEPAL;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: SupportedLanguage.EN })
  @IsOptional()
  @IsEnum(SupportedLanguage)
  preferredLanguage?: SupportedLanguage = SupportedLanguage.EN;

  @ApiPropertyOptional({ enum: CurrencyCode, default: CurrencyCode.NPR })
  @IsOptional()
  @IsEnum(CurrencyCode)
  preferredCurrency?: CurrencyCode = CurrencyCode.NPR;
}
