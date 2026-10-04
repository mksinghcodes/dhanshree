import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { SubmitSellerKycDto, ReviewKycDto } from './dto/seller-kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser, UserRole } from '@dhanshree/shared';
import { AuthenticatedRateLimit } from '../rate-limit';

@ApiTags('Users, Addresses & KYC')
@Controller('api/v1')
@AuthenticatedRateLimit()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full profile of current authenticated user' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Get('users/addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all saved addresses for current user' })
  getAddresses(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getAddresses(user.id);
  }

  @Post('users/addresses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a localized address (Nepal Ward/Muni, India PIN/State, UAE Makani/Emirate)' })
  addAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAddressDto,
  ) {
    return this.usersService.addAddress(user.id, dto);
  }

  @Post('users/seller-kyc')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit localized seller KYC documents for review (Nepal PAN, India GST, UAE Trade License)' })
  submitSellerKyc(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitSellerKycDto,
  ) {
    return this.usersService.submitSellerKyc(user.id, dto);
  }

  @Patch('admin/sellers/:id/kyc')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin/Finance review and approve/reject seller KYC documents' })
  reviewKyc(@Param('id') sellerId: string, @Body() dto: ReviewKycDto) {
    return this.usersService.reviewSellerKyc(sellerId, dto);
  }
}
