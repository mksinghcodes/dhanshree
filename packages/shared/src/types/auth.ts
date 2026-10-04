import { UserRole } from './user.js';
import { CountryCode, CurrencyCode, SupportedLanguage } from '../constants/countries.js';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: UserRole;
  country: CountryCode;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  preferredCountry: CountryCode;
  preferredLanguage: SupportedLanguage;
  preferredCurrency: CurrencyCode;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}

export interface SendOtpDto {
  phoneNumber: string;
  countryCode: CountryCode;
  purpose: 'LOGIN' | 'REGISTER' | 'COD_VERIFICATION' | 'PHONE_VERIFY';
}

export interface VerifyOtpDto {
  phoneNumber: string;
  otpCode: string;
  countryCode: CountryCode;
}
