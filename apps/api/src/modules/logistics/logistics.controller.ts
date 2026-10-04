import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import {
  CourierServiceabilityRequest,
  CourierServiceabilityResult,
  CrossBorderDutyRequest,
  CrossBorderDutyResult,
  CarrierTrackingWebhookPayload,
} from '@dhanshree/shared';
import { PublicRateLimit, SkipRateLimit } from '../rate-limit';

@Controller('logistics')
@PublicRateLimit()
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('serviceability')
  @HttpCode(HttpStatus.OK)
  checkServiceability(
    @Body() body: CourierServiceabilityRequest,
  ): CourierServiceabilityResult {
    return this.logisticsService.checkServiceability(body);
  }

  @Post('cross-border/estimate')
  @HttpCode(HttpStatus.OK)
  estimateCrossBorderDuty(
    @Body() body: CrossBorderDutyRequest,
  ): CrossBorderDutyResult {
    return this.logisticsService.estimateCrossBorderDuty(body);
  }

  @Post('webhooks/carrier')
  @SkipRateLimit()
  @HttpCode(HttpStatus.OK)
  handleCarrierWebhook(
    @Body() body: CarrierTrackingWebhookPayload,
  ) {
    return this.logisticsService.handleCarrierWebhook(body);
  }
}
