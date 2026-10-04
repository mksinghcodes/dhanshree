/**
 * Dhanshree Platform Validation Constants & Regular Expressions
 * Used across @dhanshree/shared and apps/api to enforce strict scheme validation.
 * Rule: Reject invalid input outright (type, length, format) — NEVER silently sanitize or escape.
 */

export const VALIDATION_PATTERNS = {
  // E.164 International Phone Number format: +[country code][subscriber number] (8 to 15 digits)
  // e.g. +9779841234567 (Nepal), +919876543210 (India), +971501234567 (UAE)
  PHONE_E164: /^\+[1-9]\d{7,14}$/,

  // 6-digit numeric OTP code
  OTP_6DIGIT: /^\d{6}$/,

  // Strict email regex (RFC 5322 compatible subset, max 255 chars)
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

  // URL format (HTTP / HTTPS only, no javascript: or data: URIs)
  SAFE_URL: /^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/,

  // Alphanumeric URL slug with hyphens (e.g. 'sony-wh1000xm5-black')
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  // Product SKU: Uppercase alphanumeric with hyphens/underscores (3-50 chars)
  SKU: /^[A-Z0-9_-]{3,50}$/,

  // Coupon code: Uppercase alphanumeric with hyphens/underscores (3-30 chars)
  COUPON_CODE: /^[A-Z0-9_-]{3,30}$/,

  // Currencies: 3-letter ISO 4217 code (NPR, INR, AED, USD)
  CURRENCY_CODE: /^[A-Z]{3}$/,

  // Country tax identifiers
  // Nepal Permanent Account Number (PAN) or VAT: Exactly 9 numeric digits
  NEPAL_PAN: /^\d{9}$/,

  // India Income Tax PAN: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)
  INDIA_PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,

  // India Goods and Services Tax Identification Number (GSTIN): 15 characters
  INDIA_GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,

  // UAE Tax Registration Number (TRN): Exactly 15 digits starting with 100
  UAE_TRN: /^100\d{12}$/,

  // Postal codes
  // India Postal Index Number (PIN Code): Exactly 6 numeric digits
  INDIA_PINCODE: /^\d{6}$/,

  // Dubai Makani number: 10 numeric digits, optional middle space (e.g. '30032 95320')
  DUBAI_MAKANI: /^\d{5}\s?\d{5}$/,

  // Strict text: REJECT any markup (<, >), null bytes (\0), or dangerous control characters
  // Ensures data is never silently escaped or sanitized; malicious payloads are rejected outright
  NO_HTML_MARKUP: /^[^<>]*$/,
  NO_CONTROL_CHARS: /^[^\x00-\x08\x0B\x0C\x0E-\x1F\x7F]*$/,
};

export const VALIDATION_LIMITS = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 5000,
  SHORT_DESC_MAX_LENGTH: 300,
  NOTES_MAX_LENGTH: 500,
  ADDRESS_LINE_MAX_LENGTH: 150,
  MAX_QUANTITY_PER_ITEM: 100,
  MIN_QUANTITY_PER_ITEM: 1,
  MAX_PRICE: 100000000, // 100M
  MIN_PRICE: 0.01,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
};

export interface StrictValidationRule {
  field: string;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
  allowedEnum?: string[] | readonly string[];
  disallowHtml?: boolean;
}

export interface StrictValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string; constraint: string }>;
}

/**
 * Validates a plain object against a strict schema without mutating, escaping, or sanitizing.
 * Rejects with clear errors if any type, length, or format requirement is not met,
 * or if unrecognized properties are found.
 */
export function validateStrictSchema(
  data: Record<string, any>,
  rules: StrictValidationRule[],
  allowUnknownProperties: boolean = false,
): StrictValidationResult {
  const errors: Array<{ field: string; message: string; constraint: string }> = [];

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      valid: false,
      errors: [
        { field: 'root', message: 'Payload must be a non-null object', constraint: 'isObject' },
      ],
    };
  }

  const knownFields = new Set(rules.map((r) => r.field));

  // Reject unexpected / non-whitelisted properties
  if (!allowUnknownProperties) {
    for (const key of Object.keys(data)) {
      if (!knownFields.has(key)) {
        errors.push({
          field: key,
          message: `Property '${key}' should not exist in strict scheme`,
          constraint: 'forbidNonWhitelisted',
        });
      }
    }
  }

  for (const rule of rules) {
    const val = data[rule.field];

    // Check required
    if (val === undefined || val === null || val === '') {
      if (rule.required) {
        errors.push({
          field: rule.field,
          message: `${rule.field} is required and cannot be empty`,
          constraint: 'isNotEmpty',
        });
      }
      continue;
    }

    // Check Type
    if (rule.type) {
      if (rule.type === 'array') {
        if (!Array.isArray(val)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be an array`,
            constraint: 'isArray',
          });
          continue;
        }
      } else if (typeof val !== rule.type) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be a ${rule.type} (received ${typeof val})`,
          constraint: 'isType',
        });
        continue;
      }
    }

    // String-specific checks
    if (typeof val === 'string') {
      // Disallow HTML / script markup if requested (default: true for safety)
      if (rule.disallowHtml !== false) {
        if (/[<>]/.test(val) || /\0/.test(val)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} contains forbidden markup characters (<, >) or null bytes. Sanitization is not permitted; input must be clean.`,
            constraint: 'noHtmlMarkup',
          });
        }
      }

      // Length checks
      if (rule.minLength !== undefined && val.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be at least ${rule.minLength} characters long (current length: ${val.length})`,
          constraint: 'minLength',
        });
      }
      if (rule.maxLength !== undefined && val.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must not exceed ${rule.maxLength} characters (current length: ${val.length})`,
          constraint: 'maxLength',
        });
      }

      // Format regex check
      if (rule.pattern && !rule.pattern.test(val)) {
        errors.push({
          field: rule.field,
          message: rule.patternMessage || `${rule.field} does not conform to the expected format`,
          constraint: 'matchesFormat',
        });
      }

      // Enum check
      if (rule.allowedEnum && !rule.allowedEnum.includes(val)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be one of: ${rule.allowedEnum.join(', ')}`,
          constraint: 'isEnum',
        });
      }
    }

    // Number-specific checks
    if (typeof val === 'number') {
      if (isNaN(val) || !isFinite(val)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be a valid finite number`,
          constraint: 'isNumber',
        });
        continue;
      }
      if (rule.min !== undefined && val < rule.min) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be greater than or equal to ${rule.min}`,
          constraint: 'min',
        });
      }
      if (rule.max !== undefined && val > rule.max) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be less than or equal to ${rule.max}`,
          constraint: 'max',
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
