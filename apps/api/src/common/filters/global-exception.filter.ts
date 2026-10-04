import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

export interface SanitizedErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  requestId: string;
  timestamp: string;
  path: string;
}

/**
 * Global Exception & Information Leakage Hardening Filter
 *
 * Security Objectives:
 * 1. ZERO Information Leakage: Never expose raw database errors, Prisma error codes,
 *    table names, column names, SQL queries, or internal filesystem paths to clients.
 * 2. ZERO Stack Trace Exposure: Unhandled server errors (500) are replaced with
 *    a clean sanitized user message and a unique correlation ID (`requestId`).
 * 3. Complete Observability: Full error details, stack traces, request IP, method,
 *    and URL are logged server-side with the corresponding `requestId` for safe debugging.
 * 4. Standardized Response Format: All 4xx and 5xx responses strictly adhere to
 *    a unified schema aligned with RFC 7807.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Security-ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Generate or extract request correlation ID
    const requestId =
      (request.headers?.['x-request-id'] as string) ||
      `req-${crypto.randomUUID()}`;

    // Ensure the response header carries the correlation ID for client tracking
    if (response && typeof response.setHeader === 'function') {
      response.setHeader('x-request-id', requestId);
    }

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorTitle = 'Internal Server Error';
    let clientMessage: string | string[] =
      'An unexpected error occurred. Please contact customer support with the request ID if the issue persists.';

    const anyEx = exception as any;

    // 1. Handle standard NestJS / Express HttpExceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        clientMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        errorTitle = resObj.error || this.getDefaultTitleForStatus(statusCode);
        clientMessage = resObj.message || errorTitle;
      }
    }
    // 2. Handle Prisma Database Engine Known Request Errors (P2000, P2002, P2025, etc.)
    else if (
      anyEx?.name === 'PrismaClientKnownRequestError' ||
      (typeof anyEx?.code === 'string' && anyEx.code.startsWith('P'))
    ) {
      const sanitizedPrisma = this.handlePrismaKnownError(anyEx);
      statusCode = sanitizedPrisma.statusCode;
      errorTitle = sanitizedPrisma.error;
      clientMessage = sanitizedPrisma.message;

      // Log the original Prisma metadata and code securely server-side
      this.logger.error(
        `[${requestId}] Prisma Database Error [${anyEx.code}]: ${anyEx.message} | Meta: ${JSON.stringify(
          anyEx.meta,
        )}`,
      );
    }
    // 3. Handle Prisma Validation or Initialization Errors
    else if (
      anyEx?.name === 'PrismaClientValidationError' ||
      anyEx?.name === 'PrismaClientInitializationError' ||
      anyEx?.name === 'PrismaClientRustPanicError'
    ) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorTitle = 'Database Validation Error';
      clientMessage = 'The request payload violated database schema constraints.';

      this.logger.error(
        `[${requestId}] Prisma Engine Constraint: ${anyEx?.message}`,
      );
    }
    // 4. Handle all other unhandled runtime exceptions
    else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorTitle = 'Internal Server Error';
      clientMessage =
        process.env.NODE_ENV === 'test-verbose'
          ? (exception as Error)?.message || 'Internal Server Error'
          : 'An unexpected error occurred. Please contact customer support with the request ID if the issue persists.';

      const err = exception as Error;
      this.logger.error(
        `[${requestId}] Unhandled Server Exception: ${err?.message || 'Unknown'} | Stack: ${err?.stack || 'No stack'}`,
      );
    }

    // Server-side audit log for all 4xx/5xx responses
    if (statusCode >= 500) {
      this.logger.error(
        `[${requestId}] ${request?.method} ${request?.url} -> HTTP ${statusCode} [${errorTitle}]`,
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${request?.method} ${request?.url} -> HTTP ${statusCode} [${errorTitle}]: ${JSON.stringify(
          clientMessage,
        )}`,
      );
    }

    const payload: SanitizedErrorResponse = {
      statusCode,
      error: errorTitle,
      message: clientMessage,
      requestId,
      timestamp: new Date().toISOString(),
      path: request?.url?.split('?')[0] || '/',
    };

    if (response && typeof response.status === 'function') {
      response.status(statusCode).json(payload);
    }
  }

  /**
   * Translates Prisma error codes into clean, non-leaking domain responses.
   * Strips out raw table names, column names, constraints, and SQL statements.
   */
  public handlePrismaKnownError(err: { code?: string; meta?: any }): {
    statusCode: number;
    error: string;
    message: string;
  } {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation (e.g. duplicate email, PAN, sku)
        // Never return err.meta.target (e.g. ['email']) directly as raw database schema
        return {
          statusCode: HttpStatus.CONFLICT,
          error: 'Resource Conflict',
          message:
            'A record with the specified unique identifier already exists in our system.',
        };
      }
      case 'P2025': {
        // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Resource Not Found',
          message: 'The requested resource was not found.',
        };
      }
      case 'P2003': {
        // Foreign key constraint failed
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Invalid Association',
          message:
            'The requested operation refers to a related resource that does not exist or cannot be modified.',
        };
      }
      case 'P2000': {
        // Value too long for column
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Field Value Exceeded',
          message: 'One or more fields exceed the allowable storage limit.',
        };
      }
      case 'P2014': {
        // Required relation violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Relationship Constraint',
          message: 'The requested update violates a required entity relationship.',
        };
      }
      default: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message:
            'A database processing error occurred. Please try again later.',
        };
      }
    }
  }

  public getDefaultTitleForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Too Many Requests';
      default:
        return status >= 500 ? 'Internal Server Error' : 'Client Error';
    }
  }
}
