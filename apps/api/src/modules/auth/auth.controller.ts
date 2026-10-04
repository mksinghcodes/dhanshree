import { Controller, Post, Body, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpRequestDto, VerifyOtpRequestDto } from './dto/otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from '@dhanshree/shared';
import { AuthRateLimit, AuthenticatedRateLimit } from '../rate-limit/decorators/rate-limit.decorator';
import { RateLimitAuthInterceptor } from '../rate-limit/interceptors/rate-limit-auth.interceptor';

@ApiTags('Authentication & Identity')
@Controller('api/v1/auth')
@AuthRateLimit()
@UseInterceptors(RateLimitAuthInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new buyer or seller account' })
  @ApiResponse({ status: 201, description: 'User successfully registered, returns JWT tokens' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT tokens' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT access token using refresh token' })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('otp/send')
  @ApiOperation({ summary: 'Request 6-digit SMS OTP (Nepal Sparrow, India MSG91, UAE Twilio)' })
  sendOtp(@Body() dto: SendOtpRequestDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP code for passwordless phone login or COD verification' })
  verifyOtp(@Body() dto: VerifyOtpRequestDto) {
    return this.authService.verifyOtp(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @AuthenticatedRateLimit()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile and permissions of authenticated user' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      status: 'SUCCESS',
      user,
    };
  }
}
