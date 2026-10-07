import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dhanshree-super-secret-access-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dhanshree-super-secret-refresh-key-2026';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 30; // 30 days

export interface AuthenticatedUserPayload {
  userId: string;
  phone: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

/**
 * Generates an Access Token and a Refresh Token (with Token Family tracking)
 */
export async function generateAuthTokens(user: { id: string; phone: string; role: UserRole }) {
  // 1. Sign Access Token
  const payload: AuthenticatedUserPayload = {
    userId: user.id,
    phone: user.phone,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as SignOptions);

  // 2. Generate Refresh Token with Family ID (UUID)
  const tokenFamily = crypto.randomUUID();
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      family: tokenFamily,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: 900, // 15 minutes in seconds
  };
}

/**
 * Refresh Token Rotation (RTR) Handler with Reuse Detection
 * Prevents replay attacks by invalidating all tokens in the family if an old token is reused.
 */
export async function rotateRefreshToken(rawRefreshToken: string) {
  const incomingHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { tokenHash: incomingHash },
    include: { user: true },
  });

  if (!tokenRecord) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  // Token Reuse Detection: If already revoked token is presented, compromise detected!
  if (tokenRecord.isRevoked) {
    // Revoke all tokens in this family immediately to protect the account
    await prisma.refreshToken.updateMany({
      where: { family: tokenRecord.family },
      data: { isRevoked: true },
    });
    throw new Error('TOKEN_REUSE_DETECTED');
  }

  if (new Date() > tokenRecord.expiresAt) {
    throw new Error('REFRESH_TOKEN_EXPIRED');
  }

  if (tokenRecord.user.status !== UserStatus.ACTIVE) {
    throw new Error('USER_INACTIVE');
  }

  // Invalidate current token
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { isRevoked: true },
  });

  // Issue new token in the SAME family
  const nextRawRefreshToken = crypto.randomBytes(40).toString('hex');
  const nextHash = crypto.createHash('sha256').update(nextRawRefreshToken).digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId: tokenRecord.userId,
      tokenHash: nextHash,
      family: tokenRecord.family,
      expiresAt,
    },
  });

  // Generate new Access Token
  const newPayload: AuthenticatedUserPayload = {
    userId: tokenRecord.user.id,
    phone: tokenRecord.user.phone,
    role: tokenRecord.user.role,
  };

  const newAccessToken = jwt.sign(newPayload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as SignOptions);

  return {
    accessToken: newAccessToken,
    refreshToken: nextRawRefreshToken,
    expiresIn: 900,
  };
}

/**
 * Express Middleware: Verifies Bearer JWT Access Token
 */
export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as AuthenticatedUserPayload;
    req.user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        error: 'TokenExpired',
        message: 'Access token expired. Please invoke /api/v1/auth/refresh-token.',
      });
    }

    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid access token.',
    });
  }
}

/**
 * Role-Based Access Control (RBAC) Guard
 */
export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: `Access denied. Required roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
    }

    return next();
  };
}
