import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import {
  IsIndiaGstin,
  IsIndiaPan,
  IsNepalPan,
  IsStrictText,
  IsUaeTrn,
} from '../../../common/validation';

export class SubmitSellerKycDto {
  @ApiProperty({ example: 'Himalayan Tech Enterprises Pvt. Ltd.' })
  @IsStrictText({
    minLength: 2,
    maxLength: 150,
    message: 'companyName must be between 2 and 150 characters and cannot contain HTML markup',
  })
  companyName: string;

  @ApiProperty({ example: 'PVT_LTD', enum: ['INDIVIDUAL', 'PVT_LTD', 'LLC', 'SOLE_PROPRIETORSHIP', 'PARTNERSHIP'] })
  @IsIn(['INDIVIDUAL', 'PVT_LTD', 'LLC', 'SOLE_PROPRIETORSHIP', 'PARTNERSHIP'], {
    message: 'businessType must be one of: INDIVIDUAL, PVT_LTD, LLC, SOLE_PROPRIETORSHIP, PARTNERSHIP',
  })
  businessType: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'operationalCountry must be a valid CountryCode (NP, IN, AE)' })
  operationalCountry: CountryCode;

  // -------------------------------------------------------------
  // Nepal KYC Specifics
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: '601234567', description: '9-digit Nepal Permanent Account Number (PAN) or VAT' })
  @IsOptional()
  @IsNepalPan()
  nepalPanVatNumber?: string;

  @ApiPropertyOptional({ example: 'https://storage.dhanshree.com/kyc/citizenship.pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  nepalCitizenshipDoc?: string;

  @ApiPropertyOptional({ example: 'https://storage.dhanshree.com/kyc/company-reg.pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  nepalCompanyRegDoc?: string;

  // -------------------------------------------------------------
  // India KYC Specifics
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'ABCDE1234F', description: '10-character Indian PAN number' })
  @IsOptional()
  @IsIndiaPan()
  indiaPanNumber?: string;

  @ApiPropertyOptional({ example: '27ABCDE1234F1Z5', description: '15-character Indian GSTIN' })
  @IsOptional()
  @IsIndiaGstin()
  indiaGstinNumber?: string;

  @ApiPropertyOptional({ example: 'U72900MH2021PTC123456', description: 'Corporate Identification Number (CIN)' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  indiaCinNumber?: string;

  // -------------------------------------------------------------
  // UAE KYC Specifics
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'TL-DXB-987654', description: 'Department of Economy and Tourism (DET) Trade License Number' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  uaeTradeLicenseNo?: string;

  @ApiPropertyOptional({ example: 'https://storage.dhanshree.com/kyc/trade-license.pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  uaeTradeLicenseDoc?: string;

  @ApiPropertyOptional({ example: '784-1988-1234567-1', description: 'Masked Emirates ID Number' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  uaeEmiratesIdMasked?: string;

  @ApiPropertyOptional({ example: '100234567800003', description: '15-digit Federal Tax Authority TRN' })
  @IsOptional()
  @IsUaeTrn()
  uaeVatTrnNumber?: string;

  // -------------------------------------------------------------
  // Payout Bank Details
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'Nabil Bank / HDFC Bank / Emirates NBD' })
  @IsOptional()
  @IsStrictText({ maxLength: 100 })
  bankName?: string;

  @ApiPropertyOptional({ example: '01234567890123' })
  @IsOptional()
  @IsString({ message: 'bankAccountNumber must be a string' })
  @MaxLength(50)
  bankAccountNumber?: string;

  @ApiPropertyOptional({ example: 'AE070331234567890123456' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  bankIbanOrSwift?: string;

  @ApiPropertyOptional({ example: 'HDFC0001234 or Branch Name' })
  @IsOptional()
  @IsStrictText({ maxLength: 50 })
  bankBranchOrIfsc?: string;
}

export class ReviewKycDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'DOCUMENTS_REQUESTED'], example: 'APPROVED' })
  @IsIn(['APPROVED', 'REJECTED', 'DOCUMENTS_REQUESTED'], {
    message: "status must be one of: 'APPROVED', 'REJECTED', 'DOCUMENTS_REQUESTED'",
  })
  status: 'APPROVED' | 'REJECTED' | 'DOCUMENTS_REQUESTED';

  @ApiPropertyOptional({ example: 'Trade license document image was blurry or expired' })
  @IsOptional()
  @IsStrictText({ maxLength: 500 })
  rejectionReason?: string;
}
