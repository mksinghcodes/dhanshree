import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimitConfig } from '@dhanshree/shared';

@Injectable()
export class RateLimitConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): RateLimitConfig {
    const parseNum = (key: string, defaultVal: number): number => {
      const val = this.configService.get<string | number>(key);
      if (val === undefined || val === null || val === '') return defaultVal;
      const parsed = Number(val);
      return Number.isFinite(parsed) ? parsed : defaultVal;
    };

    const parseBool = (key: string, defaultVal: boolean): boolean => {
      const val = this.configService.get<string | boolean>(key);
      if (val === undefined || val === null || val === '') return defaultVal;
      if (typeof val === 'boolean') return val;
      return String(val).toLowerCase() !== 'false' && String(val) !== '0';
    };

    return {
      enabled: parseBool('RATE_LIMIT_ENABLED', true),
      auth: {
        ipMax: parseNum('RATE_LIMIT_AUTH_IP_MAX', 10),
        ipWindowMs: parseNum('RATE_LIMIT_AUTH_IP_WINDOW_MS', 60000), // 1 minute
        accountMax: parseNum('RATE_LIMIT_AUTH_ACCOUNT_MAX', 5), // 5 failed attempts before backoff kicks in
        accountWindowMs: parseNum('RATE_LIMIT_AUTH_ACCOUNT_WINDOW_MS', 900000), // 15 minutes window
        baseBackoffSec: parseNum('RATE_LIMIT_AUTH_BASE_BACKOFF_SEC', 5), // 5s initial backoff
        maxBackoffSec: parseNum('RATE_LIMIT_AUTH_MAX_BACKOFF_SEC', 1800), // 30 mins max backoff
      },
      public: {
        max: parseNum('RATE_LIMIT_PUBLIC_MAX', 100),
        windowMs: parseNum('RATE_LIMIT_PUBLIC_WINDOW_MS', 60000), // 1 minute
      },
      authenticated: {
        max: parseNum('RATE_LIMIT_AUTHENTICATED_MAX', 300),
        windowMs: parseNum('RATE_LIMIT_AUTHENTICATED_WINDOW_MS', 60000), // 1 minute
      },
    };
  }
}
