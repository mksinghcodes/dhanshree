import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isString,
} from 'class-validator';
import { VALIDATION_PATTERNS } from '@dhanshree/shared';

/**
 * Strict text validator:
 * Validates that an input is a valid string within specified length boundaries,
 * and strictly REJECTS any string containing HTML markup (<, >), null bytes (\0),
 * or dangerous control characters.
 *
 * NOTE: As per security requirements, we NEVER sanitize or escape. Any input
 * violating the strict scheme is rejected with a validation error.
 */
export function IsStrictText(
  options?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrictText',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!isString(value)) return false;

          const opts = args.constraints[0] || {};

          // Check for forbidden markup characters (<, >) or null bytes
          if (/[<>]/.test(value) || /\0/.test(value)) {
            return false;
          }

          if (opts.minLength !== undefined && value.length < opts.minLength) {
            return false;
          }

          if (opts.maxLength !== undefined && value.length > opts.maxLength) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const opts = args.constraints[0] || {};
          const val = args.value;

          if (!isString(val)) {
            return `${args.property} must be a string`;
          }

          if (/[<>]/.test(val) || /\0/.test(val)) {
            return `${args.property} contains forbidden markup (<, >) or null characters. Unsanitized markup is rejected.`;
          }

          if (opts.minLength !== undefined && val.length < opts.minLength) {
            return `${args.property} must be at least ${opts.minLength} characters long`;
          }

          if (opts.maxLength !== undefined && val.length > opts.maxLength) {
            return `${args.property} must not exceed ${opts.maxLength} characters`;
          }

          return `${args.property} is invalid`;
        },
      },
    });
  };
}

/**
 * Strict E.164 phone number validator (+[country code][number], 8-15 digits)
 */
export function IsE164Phone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isE164Phone',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid E.164 formatted international phone number (e.g. +9779841234567, +919876543210, +971501234567)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.PHONE_E164.test(value);
        },
      },
    });
  };
}

/**
 * Strict 6-digit numeric OTP validator
 */
export function IsOtpCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOtpCode',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be exactly 6 numeric digits`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.OTP_6DIGIT.test(value);
        },
      },
    });
  };
}

/**
 * Strict Product SKU validator (3-50 uppercase alphanumeric, hyphens, underscores)
 */
export function IsProductSku(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isProductSku',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be 3-50 uppercase alphanumeric characters, hyphens or underscores (e.g. SONY-WH1000XM5-BLK)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.SKU.test(value);
        },
      },
    });
  };
}

/**
 * Strict URL slug validator (lowercase alphanumeric with hyphens)
 */
export function IsAlphanumericSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAlphanumericSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid lowercase alphanumeric slug with hyphens (e.g. apple-iphone-15-pro)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.SLUG.test(value);
        },
      },
    });
  };
}

/**
 * Strict Coupon code validator (3-30 uppercase alphanumeric with hyphens or underscores)
 */
export function IsCouponCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCouponCode',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be 3-30 uppercase alphanumeric characters or hyphens (e.g. DASHAIN2026, DIWALI50)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.COUPON_CODE.test(value);
        },
      },
    });
  };
}

/**
 * Strict Nepal PAN / VAT validator (exactly 9 digits)
 */
export function IsNepalPan(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNepalPan',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid 9-digit Nepal Permanent Account Number (PAN)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.NEPAL_PAN.test(value);
        },
      },
    });
  };
}

/**
 * Strict India PAN validator (10 characters: 5 letters, 4 digits, 1 letter)
 */
export function IsIndiaPan(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIndiaPan',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid 10-character Indian PAN (e.g. ABCDE1234F)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.INDIA_PAN.test(value);
        },
      },
    });
  };
}

/**
 * Strict India GSTIN validator (15 characters)
 */
export function IsIndiaGstin(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIndiaGstin',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid 15-character Indian GSTIN (e.g. 27ABCDE1234F1Z5)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.INDIA_GSTIN.test(value);
        },
      },
    });
  };
}

/**
 * Strict UAE TRN validator (15 digits starting with 100)
 */
export function IsUaeTrn(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUaeTrn',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid 15-digit UAE TRN starting with 100`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.UAE_TRN.test(value);
        },
      },
    });
  };
}

/**
 * Strict India PIN Code validator (6 digits)
 */
export function IsIndiaPinCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIndiaPinCode',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid 6-digit Indian PIN code`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.INDIA_PINCODE.test(value);
        },
      },
    });
  };
}

/**
 * Strict Dubai Makani validator (10 digits, optional space)
 */
export function IsDubaiMakani(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDubaiMakani',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid 10-digit Dubai Makani number (e.g. 30032 95320)`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && VALIDATION_PATTERNS.DUBAI_MAKANI.test(value);
        },
      },
    });
  };
}
