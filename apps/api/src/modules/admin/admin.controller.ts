import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AdminDashboardMetrics,
  AdminSellerKycItem,
  AdminCommissionRule,
  AdminDisputeItem,
  AdminAuditLog,
} from '@dhanshree/shared';
import { AuthenticatedRateLimit } from '../rate-limit';
import { AdminKycDecisionDto } from './dto/admin-kyc-decision.dto';
import { UpdateCommissionRuleDto } from './dto/admin-commission.dto';
import { ResolveDisputeDto } from './dto/admin-dispute.dto';

@Controller('admin')
@AuthenticatedRateLimit()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  getMetrics(): AdminDashboardMetrics {
    return this.adminService.getGlobalMetrics();
  }

  @Get('sellers/kyc')
  getSellerKycQueue(@Query('status') status?: string): AdminSellerKycItem[] {
    return this.adminService.getSellerKycQueue(status);
  }

  @Post('sellers/:id/kyc-decision')
  @HttpCode(HttpStatus.OK)
  reviewSellerKyc(
    @Param('id') kycId: string,
    @Body() body: AdminKycDecisionDto,
  ): AdminSellerKycItem {
    return this.adminService.reviewSellerKyc(
      kycId,
      body.decision,
      'superadmin@marketplace.global',
      body.notes,
      body.commissionOverride,
    );
  }

  @Get('commissions')
  getCommissionRules(): AdminCommissionRule[] {
    return this.adminService.getCommissionRules();
  }

  @Put('commissions/:id')
  @HttpCode(HttpStatus.OK)
  updateCommissionRule(
    @Param('id') ruleId: string,
    @Body() body: UpdateCommissionRuleDto,
  ): AdminCommissionRule {
    return this.adminService.updateCommissionRule(
      ruleId,
      body.ratePercent,
      'finance.lead@marketplace.global',
    );
  }

  @Get('disputes')
  getDisputes(): AdminDisputeItem[] {
    return this.adminService.getDisputes();
  }

  @Post('disputes/:id/resolve')
  @HttpCode(HttpStatus.OK)
  resolveDispute(
    @Param('id') disputeId: string,
    @Body() body: ResolveDisputeDto,
  ): AdminDisputeItem {
    return this.adminService.resolveDispute(
      disputeId,
      body.decision,
      'support.arbitrator@marketplace.global',
      body.notes,
    );
  }

  @Get('audit-logs')
  getAuditLogs(): AdminAuditLog[] {
    return this.adminService.getAuditLogs();
  }
}
