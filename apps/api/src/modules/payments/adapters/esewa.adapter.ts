import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EsewaPaymentAdapter {
  private readonly logger = new Logger(EsewaPaymentAdapter.name);

  private readonly merchantCode = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
  private readonly secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
  private readonly esewaUrl =
    process.env.ESEWA_API_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

  createPaymentPayload(orderNumber: string, amount: number) {
    const transactionUuid = `${orderNumber}-${Date.now()}`;
    const totalAmount = amount.toFixed(2);
    const productCode = this.merchantCode;

    // eSewa EPAY v2 HMAC-SHA256 signature: "total_amount,transaction_uuid,product_code"
    const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(signatureString)
      .digest('base64');

    this.logger.log(`Initialized eSewa EPAY for order ${orderNumber}, amount NPR ${totalAmount}`);

    return {
      actionUrl: this.esewaUrl,
      formFields: {
        amount: totalAmount,
        tax_amount: '0',
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: `${process.env.WEB_PUBLIC_URL || 'http://localhost:3000'}/np/orders/${orderNumber}?payment=success`,
        failure_url: `${process.env.WEB_PUBLIC_URL || 'http://localhost:3000'}/np/orders/${orderNumber}?payment=failed`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature,
      },
    };
  }

  verifyPayment(encodedResponse: string): boolean {
    try {
      const decoded = JSON.parse(Buffer.from(encodedResponse, 'base64').toString('utf-8'));
      const { total_amount, transaction_uuid, product_code, signature } = decoded;
      const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      const expected = crypto
        .createHmac('sha256', this.secretKey)
        .update(signatureString)
        .digest('base64');
      return signature === expected;
    } catch {
      return false;
    }
  }
}
