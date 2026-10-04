import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  CountryCode,
  CurrencyCode,
  PaymentMethod,
  PaymentStatus,
  PaymentInitResult,
} from '@dhanshree/shared';
import { EsewaPaymentAdapter } from './adapters/esewa.adapter';
import { KhaltiPaymentAdapter } from './adapters/khalti.adapter';
import { RazorpayPaymentAdapter } from './adapters/razorpay.adapter';
import { StripePaymentAdapter } from './adapters/stripe.adapter';
import { TabbyPaymentAdapter } from './adapters/tabby.adapter';
import { CodEngineAdapter } from './adapters/cod.adapter';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly esewaAdapter: EsewaPaymentAdapter,
    private readonly khaltiAdapter: KhaltiPaymentAdapter,
    private readonly razorpayAdapter: RazorpayPaymentAdapter,
    private readonly stripeAdapter: StripePaymentAdapter,
    private readonly tabbyAdapter: TabbyPaymentAdapter,
    private readonly codAdapter: CodEngineAdapter,
  ) {}

  initializePayment(params: {
    orderId: string;
    orderNumber: string;
    method: PaymentMethod;
    countryCode: CountryCode;
    amount: number;
    phone: string;
    isGuest?: boolean;
    isPhoneVerified?: boolean;
  }): PaymentInitResult {
    const { orderId, orderNumber, method, countryCode, amount, phone } = params;

    const baseResult: PaymentInitResult = {
      orderId,
      orderNumber,
      paymentMethod: method,
      status: PaymentStatus.PENDING,
      amount,
      currency: countryCode === 'NP' ? CurrencyCode.NPR : countryCode === 'IN' ? CurrencyCode.INR : CurrencyCode.AED,
    };

    switch (method) {
      case PaymentMethod.ESEWA: {
        const esewaData = this.esewaAdapter.createPaymentPayload(orderNumber, amount);
        return {
          ...baseResult,
          esewaPayload: esewaData,
        };
      }

      case PaymentMethod.KHALTI: {
        const khaltiData = this.khaltiAdapter.createPaymentPayload(orderNumber, amount);
        return {
          ...baseResult,
          khaltiPayload: {
            paymentUrl: khaltiData.paymentUrl,
            pidx: khaltiData.pidx,
          },
        };
      }

      case PaymentMethod.RAZORPAY:
      case PaymentMethod.UPI: {
        const rzpData = this.razorpayAdapter.createOrderPayload(orderNumber, amount);
        return {
          ...baseResult,
          razorpayPayload: {
            orderId: rzpData.orderId,
            keyId: rzpData.keyId,
            amountInPaise: rzpData.amountInPaise,
            currency: rzpData.currency,
          },
        };
      }

      case PaymentMethod.STRIPE:
      case PaymentMethod.APPLE_PAY:
      case PaymentMethod.GOOGLE_PAY: {
        const stripeData = this.stripeAdapter.createPaymentIntent(orderNumber, amount);
        return {
          ...baseResult,
          stripePayload: {
            clientSecret: stripeData.clientSecret,
            publishableKey: stripeData.publishableKey,
          },
        };
      }

      case PaymentMethod.TABBY: {
        const tabbyData = this.tabbyAdapter.createBnplSession(orderNumber, amount);
        return {
          ...baseResult,
          tabbyPayload: {
            webUrl: tabbyData.webUrl,
            sessionId: tabbyData.sessionId,
          },
        };
      }

      case PaymentMethod.COD: {
        const codEval = this.codAdapter.evaluateRisk({
          countryCode,
          amount,
          phone,
          isGuest: params.isGuest || false,
          isPhoneVerified: params.isPhoneVerified || false,
        });

        if (!codEval.allowed) {
          throw new BadRequestException(codEval.reason);
        }

        return {
          ...baseResult,
          status: PaymentStatus.PENDING,
          codPayload: {
            codFee: codEval.fee,
            riskScore: codEval.riskScore,
            riskLevel: codEval.riskLevel,
            otpVerified: !codEval.otpRequired,
            dispatchNotice: codEval.otpRequired
              ? 'SMS OTP verification required before order fulfillment.'
              : 'Order confirmed for Cash on Delivery. Prepare exact cash upon courier arrival.',
          },
        };
      }

      default:
        throw new BadRequestException(`Payment method '${method}' is not supported for ${countryCode}`);
    }
  }

  calculateEscrowSplit(params: {
    totalAmount: number;
    commissionRatePercent: number;
    countryCode: CountryCode;
  }) {
    const commissionFee = Number(
      ((params.totalAmount * params.commissionRatePercent) / 100).toFixed(2),
    );

    // India 1% Section 52 TCS tax withholding for marketplace operators
    let tcsWithholding = 0;
    if (params.countryCode === CountryCode.INDIA) {
      tcsWithholding = Number(((params.totalAmount * 1.0) / 100).toFixed(2));
    }

    const netPayable = Number(
      (params.totalAmount - commissionFee - tcsWithholding).toFixed(2),
    );

    return {
      totalAmount: params.totalAmount,
      commissionFee,
      tcsWithholding,
      netPayableToSeller: netPayable,
      escrowHoldDays: 7, // 7 days after delivery return window closes
    };
  }
}
