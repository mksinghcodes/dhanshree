import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

/**
 * Recursively flattens ValidationError tree into clear error details
 */
export function formatValidationErrors(
  errors: ValidationError[],
  parentField: string = '',
): Array<{ field: string; message: string; constraint: string }> {
  const result: Array<{ field: string; message: string; constraint: string }> = [];

  for (const err of errors) {
    const fieldPath = parentField ? `${parentField}.${err.property}` : err.property;

    if (err.constraints) {
      for (const [constraint, message] of Object.entries(err.constraints)) {
        result.push({
          field: fieldPath,
          message,
          constraint,
        });
      }
    }

    if (err.children && err.children.length > 0) {
      result.push(...formatValidationErrors(err.children, fieldPath));
    }
  }

  return result;
}

/**
 * Strict ValidationPipe that enforces strict type, length, and format validation,
 * rejects non-whitelisted/unexpected properties, and NEVER sanitizes or escapes.
 */
export class StrictValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true, // Reject unexpected fields outright
      transform: true,
      transformOptions: {
        enableImplicitConversion: false, // Disallow automatic type coercion that masks type errors
      },
      stopAtFirstError: false,
      validationError: {
        target: false,
        value: false, // Do not echo raw malicious values in response
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = formatValidationErrors(errors);
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Input validation failed. All fields must adhere to strict type, length, and format schemes.',
          validationErrors: formatted,
        });
      },
      ...options,
    });
  }
}
