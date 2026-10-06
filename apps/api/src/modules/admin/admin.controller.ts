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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  AdminDashboardMetrics,
  AdminSellerKycItem,
  AdminCommissionRule,
  AdminDisputeItem,
  AdminAuditLog,
  UserRole,
  AuthenticatedUser,
} from '@dhanshree/shared';
import { AuthenticatedRateLimit } from '../rate-limit';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminKycDecisionDto } from './dto/admin-kyc-decision.dto';
import { UpdateCommissionRuleDto } from './dto/admin-commission.dto';
import { ResolveDisputeDto } from './dto/admin-dispute.dto';

@ApiTags('Admin Cockpit, KYC & Platform Governance')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
@AuthenticatedRateLimit()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Retrieve high-level cross-country GMV, order, and escrow metrics (Admin Only)' })
  getMetrics(): AdminDashboardMetrics {
    return this.adminService.getGlobalMetrics();
  }

  @Get('sellers/kyc')
  @ApiOperation({ summary: 'List pending or reviewed vendor KYC registrations across Nepal, India, and UAE' })
  getSellerKycQueue(@Query('status') status?: string): AdminSellerKycItem[] {
    return this.adminService.getSellerKycQueue(status);
  }

  @Post('sellers/:id/kyc-decision')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or reject a vendor KYC submission with custom commission rate' })
  reviewSellerKyc(
    @Param('id') kycId: string,
    @Body() body: AdminKycDecisionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): AdminSellerKycItem {
    return this.adminService.reviewSellerKyc(
      kycId,
      body.decision,
      user?.email || 'admin@dhanshree.com',
      body.notes,
      body.commissionOverride,
    );
  }

  @Get('commissions')
  @ApiOperation({ summary: 'List platform fee and commission rules' })
  getCommissionRules(): AdminCommissionRule[] {
    return this.adminService.getCommissionRules();
  }

  @Put('commissions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update platform fee rules by category and region' })
  updateCommissionRule(
    @Param('id') ruleId: string,
    @Body() body: UpdateCommissionRuleDto,
    @CurrentUser() user: AuthenticatedUser,
  ): AdminCommissionRule {
    return this.adminService.updateCommissionRule(
      ruleId,
      body.ratePercent,
      user?.email || 'admin@dhanshree.com',
    );
  }

  @Get('disputes')
  @ApiOperation({ summary: 'List open buyer-seller escrow disputes' })
  getDisputes(): AdminDisputeItem[] {
    return this.adminService.getDisputes();
  }

  @Post('disputes/:id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arbitrate dispute and release or refund escrow funds' })
  resolveDispute(
    @Param('id') disputeId: string,
    @Body() body: ResolveDisputeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): AdminDisputeItem {
    return this.adminService.resolveDispute(
      disputeId,
      body.decision,
      user?.email || 'admin@dhanshree.com',
      body.notes,
    );
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Access immutable system governance and financial audit trail' })
  getAuditLogs(): AdminAuditLog[] {
    return this.adminService.getAuditLogs();
  }
}
