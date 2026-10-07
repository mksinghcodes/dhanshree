import { Request, Response, NextFunction } from 'express';

interface IdempotencyRecord {
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  statusCode?: number;
  responseBody?: any;
  createdAt: number;
}

// In-memory cache for idempotency keys (In production, replace with Redis)
const idempotencyStore = new Map<string, IdempotencyRecord>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

/**
 * Idempotency Middleware: Guarantees zero duplicate orders on network retries
 */
export function idempotencyGuard(req: Request, res: Response, next: NextFunction) {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  // Enforce idempotency header on mutating checkout operations
  if (!idempotencyKey) {
    return res.status(400).json({
      statusCode: 400,
      error: 'MissingIdempotencyKey',
      message: 'Header "Idempotency-Key" (UUID) is mandatory for this financial transaction.',
    });
  }

  const existing = idempotencyStore.get(idempotencyKey);

  if (existing) {
    // Case 1: Transaction currently being processed
    if (existing.status === 'PROCESSING') {
      return res.status(409).json({
        statusCode: 409,
        error: 'Conflict',
        message: 'A transaction with this Idempotency-Key is currently in-flight. Please wait.',
      });
    }

    // Case 2: Transaction previously completed successfully -> Return cached response
    if (existing.status === 'COMPLETED') {
      res.setHeader('X-Idempotent-Replay', 'true');
      return res.status(existing.statusCode || 200).json(existing.responseBody);
    }
  }

  // Mark as PROCESSING
  idempotencyStore.set(idempotencyKey, {
    status: 'PROCESSING',
    createdAt: Date.now(),
  });

  // Intercept response to cache upon completion
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    const statusCode = res.statusCode;

    if (statusCode >= 200 && statusCode < 300) {
      idempotencyStore.set(idempotencyKey, {
        status: 'COMPLETED',
        statusCode,
        responseBody: body,
        createdAt: Date.now(),
      });
    } else {
      // If endpoint failed with 4xx or 5xx, release key so client can retry
      idempotencyStore.delete(idempotencyKey);
    }

    return originalJson(body);
  };

  return next();
}
