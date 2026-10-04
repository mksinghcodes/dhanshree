import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';

export class CreateAddressDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  countryCode: CountryCode;

  @ApiProperty({ example: 'Rohan Shrestha' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+9779841234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '+9779801234567' })
  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isDefaultShipping?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isDefaultBilling?: boolean = true;

  // -------------------------------------------------------------
  // Nepal Localized Fields
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'Bagmati Province' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'Kathmandu' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Kathmandu Metropolitan City' })
  @IsOptional()
  @IsString()
  municipality?: string;

  @ApiPropertyOptional({ example: 10, description: 'Ward number between 1 and 32' })
  @IsOptional()
  @IsNumber()
  wardNumber?: number;

  @ApiPropertyOptional({ example: 'Baneshwor, New Baneshwor Marg' })
  @IsOptional()
  @IsString()
  toleStreet?: string;

  // -------------------------------------------------------------
  // India Localized Fields
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  districtCity?: string;

  @ApiPropertyOptional({ example: '400001', description: '6-digit Indian PIN Code' })
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiPropertyOptional({ example: 'Flat 402, Sea View Apartments' })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Linking Road, Bandra West' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  // -------------------------------------------------------------
  // UAE Localized Fields
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'DUBAI', enum: ['DUBAI', 'ABU_DHABI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN'] })
  @IsOptional()
  @IsString()
  emirate?: string;

  @ApiPropertyOptional({ example: 'Downtown Dubai' })
  @IsOptional()
  @IsString()
  areaNeighborhood?: string;

  @ApiPropertyOptional({ example: 'Sheikh Mohammed bin Rashid Blvd' })
  @IsOptional()
  @IsString()
  streetName?: string;

  @ApiPropertyOptional({ example: 'Burj Crown Tower' })
  @IsOptional()
  @IsString()
  buildingVillaName?: string;

  @ApiPropertyOptional({ example: 'Apartment 1804' })
  @IsOptional()
  @IsString()
  apartmentVillaNumber?: string;

  @ApiPropertyOptional({ example: '30032 95320', description: '10-digit Dubai Makani Number' })
  @IsOptional()
  @IsString()
  makaniNumber?: string;

  @ApiPropertyOptional({ example: 'PO Box 12345' })
  @IsOptional()
  @IsString()
  poBox?: string;

  @ApiPropertyOptional({ example: 'Near Dubai Mall Entrance 3' })
  @IsOptional()
  @IsString()
  landmark?: string;
}
