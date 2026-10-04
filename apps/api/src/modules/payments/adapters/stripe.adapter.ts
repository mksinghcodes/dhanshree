import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StripePaymentAdapter {
  private readonly logger = new Logger(StripePaymentAdapter.name);

  private readonly publishableKey =
    process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_sampleStripeUaeKey';

  createPaymentIntent(orderNumber: string, amountAed: number) {
    const clientSecret = `pi_test_${orderNumber}_secret_${Date.now()}`;

    this.logger.log(`Created Stripe PaymentIntent for order ${orderNumber}, amount AED ${amountAed}`);

    return {
      clientSecret,
      publishableKey: this.publishableKey,
      currency: 'aed',
      amountInFils: Math.round(amountAed * 100),
      supportedWallets: ['apple_pay', 'google_pay'],
    };
  }
}
