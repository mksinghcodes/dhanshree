import { Injectable, Logger } from '@nestjs/common';
import { getKhaltiSecretKey } from '../../../common/config';

@Injectable()
export class KhaltiPaymentAdapter {
  private readonly logger = new Logger(KhaltiPaymentAdapter.name);

  private readonly publicKey = process.env.KHALTI_PUBLIC_KEY || 'test_public_key_77a94b';
  private readonly secretKey = getKhaltiSecretKey();
  private readonly apiUrl = process.env.KHALTI_API_URL || 'https://a.khalti.com/api/v2';

  createPaymentPayload(orderNumber: string, amountNpr: number) {
    const amountInPaisa = Math.round(amountNpr * 100);
    const pidx = `kht_${orderNumber}_${Date.now()}`;

    this.logger.log(`Initialized Khalti epayment for order ${orderNumber}, amount: ${amountInPaisa} paisa`);

    return {
      pidx,
      paymentUrl: `https://test-pay.khalti.com/?pidx=${pidx}`,
      publicKey: this.publicKey,
      amountInPaisa,
    };
  }
}
