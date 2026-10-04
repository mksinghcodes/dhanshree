import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { EsewaPaymentAdapter } from './adapters/esewa.adapter';
import { KhaltiPaymentAdapter } from './adapters/khalti.adapter';
import { RazorpayPaymentAdapter } from './adapters/razorpay.adapter';
import { StripePaymentAdapter } from './adapters/stripe.adapter';
import { TabbyPaymentAdapter } from './adapters/tabby.adapter';
import { CodEngineAdapter } from './adapters/cod.adapter';

@Module({
  providers: [
    PaymentsService,
    EsewaPaymentAdapter,
    KhaltiPaymentAdapter,
    RazorpayPaymentAdapter,
    StripePaymentAdapter,
    TabbyPaymentAdapter,
    CodEngineAdapter,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
