import crypto from 'crypto';
import axios from 'axios';
import { PrismaClient, PaymentGateway, PaymentStatus, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

// eSewa Environment Configuration
const ESEWA_ENV = process.env.ESEWA_ENV || 'SANDBOX'; // 'SANDBOX' | 'PRODUCTION'
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

const ESEWA_FORM_URL =
  ESEWA_ENV === 'PRODUCTION'
    ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
    : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

const ESEWA_STATUS_CHECK_URL =
  ESEWA_ENV === 'PRODUCTION'
    ? 'https://epay.esewa.com.np/api/epay/transaction/status/'
    : 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';

export interface EsewaInitiationPayload {
  orderId: string;
  orderNumber: string;
  amountNpr: number;
  deliveryFeeNpr: number;
  successCallbackUrl: string;
  failureCallbackUrl: string;
}

export interface EsewaFormParameters {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
  action_url: string;
}

export class EsewaFintechService {
  /**
   * Generates cryptographic HMAC-SHA256 signature for eSewa ePay 2.0
   * Formula: Base64(HMAC-SHA256(SecretKey, "total_amount=X,transaction_uuid=Y,product_code=Z"))
   */
  public static generateSignature(
    totalAmount: string,
    transactionUuid: string,
    productCode: string
  ): string {
    const rawData = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
    hmac.update(rawData);
    return hmac.digest('base64');
  }

  /**
   * Prepares signed parameters for Mobile SDK or Web Checkout Form
   */
  public static async initiateEsewaPayment(
    payload: EsewaInitiationPayload
  ): Promise<EsewaFormParameters> {
    const transactionUuid = `DHAN-ESEWA-${Date.now()}-${payload.orderNumber}`;
    const formattedItemAmount = payload.amountNpr.toFixed(2);
    const formattedDeliveryCharge = payload.deliveryFeeNpr.toFixed(2);
    const formattedTotalAmount = (payload.amountNpr + payload.deliveryFeeNpr).toFixed(2);

    // 1. Generate Signature
    const signature = this.generateSignature(
      formattedTotalAmount,
      transactionUuid,
      ESEWA_PRODUCT_CODE
    );

    // 2. Persist Payment Transaction in INITIATED state
    await prisma.paymentTransaction.create({
      data: {
        orderId: payload.orderId,
        gateway: PaymentGateway.ESEWA,
        status: PaymentStatus.INITIATED,
        amountNpr: parseFloat(formattedTotalAmount),
        transactionUuid,
        signature,
        gatewayRequest: {
          product_code: ESEWA_PRODUCT_CODE,
          total_amount: formattedTotalAmount,
          transaction_uuid: transactionUuid,
        },
      },
    });

    return {
      amount: formattedItemAmount,
      tax_amount: '0.00',
      total_amount: formattedTotalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: '0.00',
      product_delivery_charge: formattedDeliveryCharge,
      success_url: payload.successCallbackUrl,
      failure_url: payload.failureCallbackUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
      action_url: ESEWA_FORM_URL,
    };
  }

  /**
   * Verifies eSewa Return Data (Base64 Encoded Response)
   * 1. Validates incoming signature
   * 2. Executes server-to-server status lookup
   * 3. Atomically updates order and payment status
   */
  public static async verifyEsewaPayment(encodedData: string) {
    let decodedString: string;
    let parsedData: any;

    try {
      decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
      parsedData = JSON.parse(decodedString);
    } catch (e) {
      throw new Error('ESEWA_PAYLOAD_DECODE_ERROR: Invalid base64 or JSON structure');
    }

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signature: receivedSignature,
    } = parsedData;

    // 1. Validate Callback Status
    if (status !== 'COMPLETE') {
      await this.markTransactionFailed(
        transaction_uuid,
        `Gateway status reported non-complete: ${status}`
      );
      throw new Error(`ESEWA_TRANSACTION_FAILED: Status is ${status}`);
    }

    // 2. Cryptographic Validation
    const expectedSignature = this.generateSignature(
      total_amount,
      transaction_uuid,
      product_code || ESEWA_PRODUCT_CODE
    );

    if (expectedSignature !== receivedSignature) {
      await this.markTransactionFailed(
        transaction_uuid,
        'CRITICAL: Signature mismatch! Potential tampering detected.'
      );
      throw new Error('SECURITY_ALERT: Esewa signature verification failed');
    }

    // 3. Server-to-Server Lookup for Double Verification
    const lookupUrl = `${ESEWA_STATUS_CHECK_URL}?product_code=${product_code || ESEWA_PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    let statusResponse: any;
    try {
      statusResponse = await axios.get(lookupUrl, { timeout: 8000 });
    } catch (err: any) {
      throw new Error(`ESEWA_SERVER_LOOKUP_TIMEOUT: ${err.message}`);
    }

    if (statusResponse.data?.status !== 'COMPLETE') {
      await this.markTransactionFailed(
        transaction_uuid,
        `Status API verification failed: ${JSON.stringify(statusResponse.data)}`
      );
      throw new Error('ESEWA_VERIFICATION_REJECTED: Server status check mismatch');
    }

    // 4. Atomic Database Reconciliation
    return await prisma.$transaction(async (tx) => {
      const paymentTx = await tx.paymentTransaction.findUnique({
        where: { transactionUuid: transaction_uuid },
        include: { order: true },
      });

      if (!paymentTx) {
        throw new Error(`TRANSACTION_NOT_FOUND: ${transaction_uuid}`);
      }

      // Idempotency: If already verified, return cached success
      if (paymentTx.status === PaymentStatus.SUCCESS) {
        return {
          success: true,
          alreadyProcessed: true,
          orderId: paymentTx.orderId,
          orderNumber: paymentTx.order.orderNumber,
        };
      }

      // Verify amount match
      if (paymentTx.amountNpr.toNumber() !== parseFloat(total_amount)) {
        throw new Error('AMOUNT_MISMATCH: Paid amount does not match order record');
      }

      // Update PaymentTransaction
      await tx.paymentTransaction.update({
        where: { id: paymentTx.id },
        data: {
          status: PaymentStatus.SUCCESS,
          gatewayReferenceId: transaction_code,
          verifiedAt: new Date(),
          gatewayResponse: {
            callbackData: parsedData,
            statusCheck: statusResponse.data,
          },
        },
      });

      // Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: paymentTx.orderId },
        data: {
          orderStatus: OrderStatus.ORDER_PLACED,
        },
      });

      return {
        success: true,
        alreadyProcessed: false,
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        gatewayRefId: transaction_code,
        amountPaidNpr: parseFloat(total_amount),
      };
    });
  }

  private static async markTransactionFailed(transactionUuid: string, reason: string) {
    try {
      await prisma.paymentTransaction.update({
        where: { transactionUuid },
        data: {
          status: PaymentStatus.FAILED,
          failureReason: reason,
        },
      });
    } catch {
      // Non-blocking log
    }
  }
}
