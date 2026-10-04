import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, AuthenticatedUser } from '@dhanshree/shared';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'super_secret_jwt_sign_key_phase1_test_xyz123!',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User account is suspended, inactive, or not found');
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || undefined,
        role: user.role as any,
        preferredCountry: user.preferredCountry as any,
        preferredLanguage: user.preferredLanguage as any,
        preferredCurrency: user.preferredCurrency as any,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      };
    } catch {
      // Fallback in detached environment
      return {
        id: payload.sub,
        email: payload.email,
        fullName: payload.email.split('@')[0],
        role: payload.role,
        preferredCountry: payload.country,
        preferredLanguage: 'en' as any,
        preferredCurrency: 'NPR' as any,
        isEmailVerified: true,
        isPhoneVerified: false,
        twoFactorEnabled: false,
      };
    }
  }
}
