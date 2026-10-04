import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CountryCode, CodRiskLevel, COUNTRY_CONFIGS } from '@dhanshree/shared';

@Injectable()
export class CodEngineAdapter {
  private readonly logger = new Logger(CodEngineAdapter.name);

  evaluateRisk(params: {
    countryCode: CountryCode;
    amount: number;
    phone: string;
    isGuest: boolean;
    isPhoneVerified: boolean;
  }): {
    allowed: boolean;
    fee: number;
    riskScore: number;
    riskLevel: CodRiskLevel;
    otpRequired: boolean;
    reason?: string;
  } {
    const config = COUNTRY_CONFIGS[params.countryCode];

    // 1. Value limit check
    if (params.amount > config.codMaxOrderLimit) {
      return {
        allowed: false,
        fee: 0,
        riskScore: 100,
        riskLevel: CodRiskLevel.BLOCKED,
        otpRequired: false,
        reason: `Order total exceeds the maximum COD limit of ${config.defaultCurrency} ${config.codMaxOrderLimit.toLocaleString()} in ${config.name}. Please select digital prepaid payment.`,
      };
    }

    // 2. Risk scoring (0 - 100)
    let score = 15; // Base baseline

    // High value threshold adds risk
    const highValueThreshold = config.codMaxOrderLimit * 0.4;
    if (params.amount > highValueThreshold) {
      score += 35;
    }

    if (params.isGuest) {
      score += 20;
    }

    if (!params.isPhoneVerified) {
      score += 20;
    }

    let riskLevel = CodRiskLevel.LOW;
    let otpRequired = false;

    if (score >= 70) {
      riskLevel = CodRiskLevel.HIGH;
      otpRequired = true;
    } else if (score >= 40) {
      riskLevel = CodRiskLevel.MEDIUM;
      otpRequired = true;
    }

    // Country-specific COD fees
    const fee = params.countryCode === 'NP' ? 50 : params.countryCode === 'IN' ? 49 : 15;

    this.logger.log(
      `Evaluated COD risk: Score=${score}, Level=${riskLevel}, OTP=${otpRequired} for ${params.phone} (${params.countryCode})`,
    );

    return {
      allowed: true,
      fee,
      riskScore: score,
      riskLevel,
      otpRequired,
    };
  }
}
