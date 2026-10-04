import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import {
  IsDubaiMakani,
  IsE164Phone,
  IsIndiaPinCode,
  IsStrictText,
} from '../../../common/validation';

export class CreateAddressDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ example: 'Rohan Shrestha' })
  @IsStrictText({
    minLength: 2,
    maxLength: 100,
    message: 'fullName must be between 2 and 100 characters and cannot contain HTML markup',
  })
  fullName: string;

  @ApiProperty({ example: '+9779841234567' })
  @IsE164Phone()
  phone: string;

  @ApiPropertyOptional({ example: '+9779801234567' })
  @IsOptional()
  @IsE164Phone()
  alternatePhone?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean({ message: 'isDefaultShipping must be a boolean' })
  isDefaultShipping?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean({ message: 'isDefaultBilling must be a boolean' })
  isDefaultBilling?: boolean = true;

  // -------------------------------------------------------------
  // Nepal Localized Fields
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'Bagmati Province' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  province?: string;

  @ApiPropertyOptional({ example: 'Kathmandu' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  district?: string;

  @ApiPropertyOptional({ example: 'Kathmandu Metropolitan City' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  municipality?: string;

  @ApiPropertyOptional({ example: 10, description: 'Ward number between 1 and 35' })
  @IsOptional()
  @IsInt({ message: 'wardNumber must be an integer' })
  @Min(1, { message: 'wardNumber must be at least 1' })
  @Max(100, { message: 'wardNumber cannot exceed 100' })
  wardNumber?: number;

  @ApiPropertyOptional({ example: 'Baneshwor, New Baneshwor Marg' })
  @IsOptional()
  @IsStrictText({ maxLength: 150 })
  toleStreet?: string;

  // -------------------------------------------------------------
  // India Localized Fields
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  state?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  districtCity?: string;

  @ApiPropertyOptional({ example: '400001', description: '6-digit Indian PIN Code' })
  @IsOptional()
  @IsIndiaPinCode()
  pinCode?: string;

  @ApiPropertyOptional({ example: 'Flat 402, Sea View Apartments' })
  @IsOptional()
  @IsStrictText({ maxLength: 150 })
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Linking Road, Bandra West' })
  @IsOptional()
  @IsStrictText({ maxLength: 150 })
  addressLine2?: string;

  // -------------------------------------------------------------
  // UAE Localized Fields
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'DUBAI', enum: ['DUBAI', 'ABU_DHABI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN'] })
  @IsOptional()
  @IsIn(['DUBAI', 'ABU_DHABI', 'SHARJAH', 'AJMAN', 'RAS_AL_KHAIMAH', 'FUJAIRAH', 'UMM_AL_QUWAIN'], {
    message: 'emirate must be a valid UAE emirate',
  })
  emirate?: string;

  @ApiPropertyOptional({ example: 'Downtown Dubai' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  areaNeighborhood?: string;

  @ApiPropertyOptional({ example: 'Sheikh Mohammed bin Rashid Blvd' })
  @IsOptional()
  @IsStrictText({ maxLength: 150 })
  streetName?: string;

  @ApiPropertyOptional({ example: 'Burj Crown Tower' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  buildingVillaName?: string;

  @ApiPropertyOptional({ example: 'Apartment 1804' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  apartmentVillaNumber?: string;

  @ApiPropertyOptional({ example: '30032 95320', description: '10-digit Dubai Makani Number' })
  @IsOptional()
  @IsDubaiMakani()
  makaniNumber?: string;

  @ApiPropertyOptional({ example: 'PO Box 12345' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  poBox?: string;

  @ApiPropertyOptional({ example: 'Near Dubai Mall Entrance 3' })
  @IsOptional()
  @IsStrictText({ maxLength: 150 })
  landmark?: string;
}
