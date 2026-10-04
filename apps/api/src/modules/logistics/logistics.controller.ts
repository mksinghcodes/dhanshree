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

@Controller('logistics')
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
  @HttpCode(HttpStatus.OK)
  handleCarrierWebhook(
    @Body() body: CarrierTrackingWebhookPayload,
  ) {
    return this.logisticsService.handleCarrierWebhook(body);
  }
}
