import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { getRazorpayKeySecret } from '../../../common/config';

@Injectable()
export class RazorpayPaymentAdapter {
  private readonly logger = new Logger(RazorpayPaymentAdapter.name);

  private readonly keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_sampleKey123';
  private readonly keySecret = getRazorpayKeySecret();

  createOrderPayload(orderNumber: string, amountInr: number) {
    const amountInPaise = Math.round(amountInr * 100);
    const razorpayOrderId = `order_rzp_${Date.now()}`;

    this.logger.log(`Created Razorpay/UPI Order ${razorpayOrderId} for ${orderNumber}, amount ₹${amountInr}`);

    return {
      orderId: razorpayOrderId,
      keyId: this.keyId,
      amountInPaise,
      currency: 'INR',
      name: 'Dhanshree India',
      description: `Payment for Order #${orderNumber}`,
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const body = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac('sha256', this.keySecret).update(body).digest('hex');
    return expected === signature;
  }
}
