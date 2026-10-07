import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
  lastRequestTime: number;
}

interface VerifyAttemptRecord {
  attempts: number;
  lockedUntil: number | null;
}

// In-memory stores (In production, replace with ioredis / Redis cluster)
const phoneSendStore = new Map<string, RateLimitRecord>();
const ipSendStore = new Map<string, RateLimitRecord>();
const verifyAttemptStore = new Map<string, VerifyAttemptRecord>();

// Security Configuration
const MAX_OTP_SENDS_PER_WINDOW = 3;      // Max 3 SMS per phone per 10 minutes
const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const MIN_COOLDOWN_MS = 60 * 1000;       // 60 seconds between resends
const MAX_IP_SENDS_PER_WINDOW = 10;      // Max 10 sends per IP per 10 minutes
const MAX_VERIFY_ATTEMPTS = 3;           // 3 wrong OTP attempts triggers a lockout
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15-minute lock

/**
 * Sliding Window Algorithm helper
 */
function checkSlidingWindow(
  key: string,
  store: Map<string, RateLimitRecord>,
  maxAllowed: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSeconds: number; cooldownViolated: boolean } {
  const now = Date.now();
  const record = store.get(key) || { timestamps: [], lastRequestTime: 0 };

  // 1. Check Cooldown (e.g. 60 seconds)
  if (now - record.lastRequestTime < MIN_COOLDOWN_MS) {
    const cooldownWait = Math.ceil((MIN_COOLDOWN_MS - (now - record.lastRequestTime)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: cooldownWait,
      cooldownViolated: true,
    };
  }

  // 2. Prune timestamps outside window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= maxAllowed) {
    const oldestTimestamp = activeTimestamps[0];
    const retryAfter = Math.ceil((windowMs - (now - oldestTimestamp)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: retryAfter,
      cooldownViolated: false,
    };
  }

  // 3. Record new event
  activeTimestamps.push(now);
  store.set(key, { timestamps: activeTimestamps, lastRequestTime: now });

  return {
    allowed: true,
    remaining: maxAllowed - activeTimestamps.length,
    retryAfterSeconds: 0,
    cooldownViolated: false,
  };
}

/**
 * Rate Limiting Middleware for POST /api/v1/auth/send-otp
 * Protects against SMS pumping fraud and spamming users.
 */
export function otpSendRateLimiter(req: Request, res: Response, next: NextFunction) {
  const phone = req.body?.phone;
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  if (!phone) {
    return res.status(400).json({
      statusCode: 400,
      error: 'BadRequest',
      message: 'Field "phone" is required in request body.',
    });
  }

  // 1. Check IP-level abuse
  const ipCheck = checkSlidingWindow(`ip:${ip}`, ipSendStore, MAX_IP_SENDS_PER_WINDOW, WINDOW_DURATION_MS);
  if (!ipCheck.allowed) {
    res.setHeader('Retry-After', ipCheck.retryAfterSeconds);
    return res.status(429).json({
      statusCode: 429,
      error: 'TooManyRequests',
      message: `Too many requests from this network. Try again in ${ipCheck.retryAfterSeconds} seconds.`,
    });
  }

  // 2. Check Phone-level abuse & 60s cooldown
  const phoneCheck = checkSlidingWindow(`phone:${phone}`, phoneSendStore, MAX_OTP_SENDS_PER_WINDOW, WINDOW_DURATION_MS);
  if (!phoneCheck.allowed) {
    res.setHeader('Retry-After', phoneCheck.retryAfterSeconds);
    const msg = phoneCheck.cooldownViolated
      ? `Please wait ${phoneCheck.retryAfterSeconds} seconds before requesting a new OTP.`
      : `Maximum OTP requests reached for this phone number. Try again in ${phoneCheck.retryAfterSeconds} seconds.`;

    return res.status(429).json({
      statusCode: 429,
      error: 'TooManyRequests',
      message: msg,
      retryAfterSeconds: phoneCheck.retryAfterSeconds,
    });
  }

  // Set standard rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_OTP_SENDS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', phoneCheck.remaining);

  return next();
}

/**
 * Brute-Force Shield Middleware for POST /api/v1/auth/verify-otp
 * Invalids OTP and locks verification after 3 consecutive wrong guesses.
 */
export function otpVerifyRateLimiter(req: Request, res: Response, next: NextFunction) {
  const phone = req.body?.phone;

  if (!phone) {
    return res.status(400).json({ statusCode: 400, error: 'BadRequest', message: 'Phone is required.' });
  }

  const now = Date.now();
  const attemptRecord = verifyAttemptStore.get(phone) || { attempts: 0, lockedUntil: null };

  if (attemptRecord.lockedUntil && now < attemptRecord.lockedUntil) {
    const lockWaitSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
    return res.status(429).json({
      statusCode: 429,
      error: 'TooManyRequests',
      message: `Account temporarily locked due to repeated incorrect OTP attempts. Try again in ${lockWaitSeconds} seconds.`,
    });
  }

  return next();
}

/**
 * Call when OTP verification fails to increment failed attempts
 */
export function recordFailedOtpAttempt(phone: string) {
  const now = Date.now();
  const record = verifyAttemptStore.get(phone) || { attempts: 0, lockedUntil: null };
  record.attempts += 1;

  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    record.attempts = 0; // Reset after setting lock
  }

  verifyAttemptStore.set(phone, record);
}

/**
 * Call when OTP verification succeeds to clear the counter
 */
export function clearOtpAttempts(phone: string) {
  verifyAttemptStore.delete(phone);
}
