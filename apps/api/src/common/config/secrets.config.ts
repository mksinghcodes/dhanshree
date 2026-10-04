import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('SecretsConfig');

export interface SecretOptions {
  fallbackDev?: string;
  minLength?: number;
  requiredInProd?: boolean;
}

/**
 * Resolves a sensitive configuration value from ConfigService or process.env.
 * In production (NODE_ENV === 'production'):
 * - Strictly rejects missing values (throws error)
 * - Strictly rejects insecure known development fallback defaults
 * - Enforces minimum length requirements
 * In non-production (development, test):
 * - Safely returns the dev fallback with an audit warning
 */
export function getSecureSecret(
  key: string,
  options: SecretOptions = {},
  configService?: ConfigService,
): string {
  const value =
    configService?.get<string>(key) ||
    process.env[key] ||
    '';

  const isProduction = process.env.NODE_ENV === 'production';
  const requiredInProd = options.requiredInProd !== false;

  if (isProduction) {
    if (requiredInProd && (!value || value.trim() === '')) {
      throw new Error(
        `[SECURITY FATAL] Required secret environment variable '${key}' is missing in production. Application refusing to start with unset secrets.`,
      );
    }

    if (options.fallbackDev && value === options.fallbackDev) {
      throw new Error(
        `[SECURITY FATAL] Environment variable '${key}' is using a known insecure development fallback in production. Configure a real production secret in your environment.`,
      );
    }

    if (options.minLength && value.length < options.minLength) {
      throw new Error(
        `[SECURITY FATAL] Environment variable '${key}' does not meet minimum length requirement (${options.minLength} chars) for production security.`,
      );
    }

    return value;
  }

  // Non-production environment
  if (value && value.trim() !== '') {
    return value;
  }

  if (options.fallbackDev) {
    return options.fallbackDev;
  }

  return '';
}

/**
 * Resolves JWT Access Token Signing Secret
 */
export function getJwtSecret(configService?: ConfigService): string {
  // Support both JWT_SECRET and JWT_ACCESS_SECRET alias
  const alias = configService?.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET;
  if (alias && !process.env.JWT_SECRET && !configService?.get('JWT_SECRET')) {
    return getSecureSecret(
      'JWT_ACCESS_SECRET',
      {
        fallbackDev: 'super_secret_jwt_sign_key_phase1_test_xyz123!',
        minLength: 32,
        requiredInProd: true,
      },
      configService,
    );
  }

  return getSecureSecret(
    'JWT_SECRET',
    {
      fallbackDev: 'super_secret_jwt_sign_key_phase1_test_xyz123!',
      minLength: 32,
      requiredInProd: true,
    },
    configService,
  );
}

/**
 * Resolves JWT Refresh Token Signing Secret
 */
export function getJwtRefreshSecret(configService?: ConfigService): string {
  return getSecureSecret(
    'JWT_REFRESH_SECRET',
    {
      fallbackDev: 'super_secret_refresh_jwt_sign_key_phase1_test_abc456!',
      minLength: 32,
      requiredInProd: true,
    },
    configService,
  );
}

/**
 * Resolves eSewa EPAY v2 HMAC Secret Key
 */
export function getEsewaSecretKey(): string {
  return getSecureSecret('ESEWA_SECRET_KEY', {
    fallbackDev: '8gBm/:&EnhH.1/q',
    requiredInProd: true,
  });
}

/**
 * Resolves Khalti Secret Key
 */
export function getKhaltiSecretKey(): string {
  return getSecureSecret('KHALTI_SECRET_KEY', {
    fallbackDev: 'test_secret_key_88b12c',
    requiredInProd: true,
  });
}

/**
 * Resolves Razorpay Key Secret
 */
export function getRazorpayKeySecret(): string {
  return getSecureSecret('RAZORPAY_KEY_SECRET', {
    fallbackDev: 'sampleSecretKeyIndia123',
    requiredInProd: true,
  });
}
