import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipRateLimit, PublicRateLimit } from './modules/rate-limit';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @SkipRateLimit()
  getHealth() {
    return this.appService.getHealthStatus();
  }

  @Get('api/v1/health')
  @SkipRateLimit()
  getApiHealth() {
    return this.appService.getHealthStatus();
  }

  @Get('api/v1/countries/:countryCode')
  @PublicRateLimit()
  getCountry(@Param('countryCode') countryCode: string) {
    return this.appService.getCountryConfig(countryCode);
  }
}
