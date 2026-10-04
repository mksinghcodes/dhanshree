import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';

export class SubmitSellerKycDto {
  @ApiProperty({ example: 'Himalayan Tech Enterprises Pvt. Ltd.' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'PVT_LTD', enum: ['INDIVIDUAL', 'PVT_LTD', 'LLC', 'SOLE_PROPRIETORSHIP', 'PARTNERSHIP'] })
  @IsString()
  @IsNotEmpty()
  businessType: string;

  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode)
  operationalCountry: CountryCode;

  // -------------------------------------------------------------
  // Nepal KYC Specifics
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: '601234567', description: '9-digit Nepal Permanent Account Number (PAN) or VAT' })
  @IsOptional()
  @IsString()
  nepalPanVatNumber?: string;

  @ApiPropertyOptional({ example: 'https://storage.dhanshree.com/kyc/citizenship.pdf' })
  @IsOptional()
  @IsString()
  nepalCitizenshipDoc?: string;

  @ApiPropertyOptional({ example: 'https://storage.dhanshree.com/kyc/company-reg.pdf' })
  @IsOptional()
  @IsString()
  nepalCompanyRegDoc?: string;

  // -------------------------------------------------------------
  // India KYC Specifics
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'ABCDE1234F', description: '10-character Indian PAN number' })
  @IsOptional()
  @IsString()
  indiaPanNumber?: string;

  @ApiPropertyOptional({ example: '27ABCDE1234F1Z5', description: '15-character Indian GSTIN' })
  @IsOptional()
  @IsString()
  indiaGstinNumber?: string;

  @ApiPropertyOptional({ example: 'U72900MH2021PTC123456', description: 'Corporate Identification Number (CIN)' })
  @IsOptional()
  @IsString()
  indiaCinNumber?: string;

  // -------------------------------------------------------------
  // UAE KYC Specifics
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'TL-DXB-987654', description: 'Department of Economy and Tourism (DET) Trade License Number' })
  @IsOptional()
  @IsString()
  uaeTradeLicenseNo?: string;

  @ApiPropertyOptional({ example: 'https://storage.dhanshree.com/kyc/trade-license.pdf' })
  @IsOptional()
  @IsString()
  uaeTradeLicenseDoc?: string;

  @ApiPropertyOptional({ example: '784-1988-1234567-1', description: 'Masked Emirates ID Number' })
  @IsOptional()
  @IsString()
  uaeEmiratesIdMasked?: string;

  @ApiPropertyOptional({ example: '100234567800003', description: '15-digit Federal Tax Authority TRN' })
  @IsOptional()
  @IsString()
  uaeVatTrnNumber?: string;

  // -------------------------------------------------------------
  // Payout Bank Details
  // -------------------------------------------------------------
  @ApiPropertyOptional({ example: 'Nabil Bank / HDFC Bank / Emirates NBD' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '01234567890123' })
  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @ApiPropertyOptional({ example: 'AE070331234567890123456' })
  @IsOptional()
  @IsString()
  bankIbanOrSwift?: string;

  @ApiPropertyOptional({ example: 'HDFC0001234 or Branch Name' })
  @IsOptional()
  @IsString()
  bankBranchOrIfsc?: string;
}

export class ReviewKycDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'DOCUMENTS_REQUESTED'], example: 'APPROVED' })
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED' | 'DOCUMENTS_REQUESTED';

  @ApiPropertyOptional({ example: 'Trade license document image was blurry or expired' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
