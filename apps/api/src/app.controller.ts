import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealthStatus();
  }

  @Get('api/v1/health')
  getApiHealth() {
    return this.appService.getHealthStatus();
  }

  @Get('api/v1/countries/:countryCode')
  getCountry(@Param('countryCode') countryCode: string) {
    return this.appService.getCountryConfig(countryCode);
  }
}
