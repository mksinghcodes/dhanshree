import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateLimitConfigService } from './rate-limit.config';
import { RateLimitStorage } from './rate-limit.storage';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RateLimitAuthInterceptor } from './interceptors/rate-limit-auth.interceptor';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RateLimitConfigService,
    RateLimitStorage,
    RateLimitService,
    RateLimitGuard,
    RateLimitAuthInterceptor,
  ],
  exports: [
    RateLimitConfigService,
    RateLimitStorage,
    RateLimitService,
    RateLimitGuard,
    RateLimitAuthInterceptor,
  ],
})
export class RateLimitModule {}
