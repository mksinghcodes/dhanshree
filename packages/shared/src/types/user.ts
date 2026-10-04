export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  SUPPORT = 'SUPPORT',
  FINANCE = 'FINANCE',
  MODERATOR = 'MODERATOR',
}

export enum KycStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DOCUMENTS_REQUESTED = 'DOCUMENTS_REQUESTED',
}

export enum KycDocumentType {
  // Nepal
  NEPAL_CITIZENSHIP = 'NEPAL_CITIZENSHIP',
  NEPAL_PAN_CERTIFICATE = 'NEPAL_PAN_CERTIFICATE',
  NEPAL_VAT_REGISTRATION = 'NEPAL_VAT_REGISTRATION',
  NEPAL_COMPANY_REGISTRATION = 'NEPAL_COMPANY_REGISTRATION',

  // India
  INDIA_PAN = 'INDIA_PAN',
  INDIA_GSTIN_CERTIFICATE = 'INDIA_GSTIN_CERTIFICATE',
  INDIA_AADHAAR = 'INDIA_AADHAAR',
  INDIA_CIN = 'INDIA_CIN', // Corporate Identification Number

  // UAE
  UAE_TRADE_LICENSE = 'UAE_TRADE_LICENSE',
  UAE_EMIRATES_ID = 'UAE_EMIRATES_ID',
  UAE_VAT_TRN_CERTIFICATE = 'UAE_VAT_TRN_CERTIFICATE',
  UAE_PASSPORT_VISA = 'UAE_PASSPORT_VISA',
}

export interface UserSummary {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  country: string;
  createdAt: string;
}
