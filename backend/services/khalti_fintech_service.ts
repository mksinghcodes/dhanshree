import axios from 'axios';
import { PrismaClient, PaymentGateway, PaymentStatus, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Khalti Environment Configuration
const KHALTI_ENV = process.env.KHALTI_ENV || 'SANDBOX'; // 'SANDBOX' | 'PRODUCTION'
const KHALTI_SECRET_KEY =
  process.env.KHALTI_SECRET_KEY || 'live_secret_key_6821360862b2434f81014e308910b427';

const KHALTI_INITIATE_URL =
  KHALTI_ENV === 'PRODUCTION'
    ? 'https://khalti.com/api/v2/epayment/initiate/'
    : 'https://a.khalti.com/api/v2/epayment/initiate/';

const KHALTI_LOOKUP_URL =
  KHALTI_ENV === 'PRODUCTION'
    ? 'https://khalti.com/api/v2/epayment/lookup/'
    : 'https://a.khalti.com/api/v2/epayment/lookup/';

export interface KhaltiInitiatePayload {
  orderId: string;
  orderNumber: string;
  amountNpr: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  returnUrl: string;
  websiteUrl: string;
}

export interface KhaltiInitiateResponse {
  pidx: string;
  paymentUrl: string;
  expiresAt: string;
  transactionUuid: string;
}

export class KhaltiFintechService {
  /**
   * Helper: Converts Nepali Rupee (NPR) to integer Paisa (1 NPR = 100 Paisa)
   */
  public static nprToPaisa(amountNpr: number): number {
    return Math.round(amountNpr * 100);
  }

  /**
   * Helper: Converts integer Paisa to Nepali Rupee (NPR)
   */
  public static paisaToNpr(amountPaisa: number): number {
    return amountPaisa / 100;
  }

  /**
   * Initiates Khalti v2 EPAY Payment Session
   */
  public static async initiateKhaltiPayment(
    payload: KhaltiInitiatePayload
  ): Promise<KhaltiInitiateResponse> {
    const amountPaisa = this.nprToPaisa(payload.amountNpr);
    const transactionUuid = `DHAN-KHALTI-${Date.now()}-${payload.orderNumber}`;

    const requestBody = {
      return_url: payload.returnUrl,
      website_url: payload.websiteUrl,
      amount: amountPaisa,
      purchase_order_id: transactionUuid,
      purchase_order_name: `Dhanshree Order #${payload.orderNumber}`,
      customer_info: {
        name: payload.customerName,
        email: payload.customerEmail || 'buyer@dhanshree.com.np',
        phone: payload.customerPhone,
      },
    };

    let response: any;
    try {
      response = await axios.post(KHALTI_INITIATE_URL, requestBody, {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
    } catch (error: any) {
      const errMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      throw new Error(`KHALTI_INITIATE_ERROR: ${errMsg}`);
    }

    const { pidx, payment_url, expires_at } = response.data;

    // Persist PaymentTransaction record
    await prisma.paymentTransaction.create({
      data: {
        orderId: payload.orderId,
        gateway: PaymentGateway.KHALTI,
        status: PaymentStatus.INITIATED,
        amountNpr: payload.amountNpr,
        transactionUuid,
        gatewayReferenceId: pidx,
        gatewayRequest: requestBody,
      },
    });

    return {
      pidx,
      paymentUrl: payment_url,
      expiresAt: expires_at,
      transactionUuid,
    };
  }

  /**
   * Verifies Khalti Transaction using Server-to-Server Lookup Endpoint
   */
  public static async verifyKhaltiPayment(pidx: string, transactionUuid: string) {
    let lookupResponse: any;

    try {
      lookupResponse = await axios.post(
        KHALTI_LOOKUP_URL,
        { pidx },
        {
          headers: {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
    } catch (err: any) {
      throw new Error(`KHALTI_LOOKUP_FAILED: ${err.response?.data?.detail || err.message}`);
    }

    const khaltiData = lookupResponse.data;
    const { status, total_amount, transaction_id, fee, refunded } = khaltiData;

    // 1. Check Gateway Status
    if (status !== 'Completed') {
      await prisma.paymentTransaction.updateMany({
        where: { transactionUuid },
        data: {
          status: PaymentStatus.FAILED,
          failureReason: `Khalti status returned ${status}`,
          gatewayResponse: khaltiData,
        },
      });
      throw new Error(`KHALTI_TRANSACTION_INCOMPLETE: Status is ${status}`);
    }

    if (refunded) {
      throw new Error('KHALTI_TRANSACTION_ALREADY_REFUNDED');
    }

    // 2. Atomic Database Settlement
    return await prisma.$transaction(async (tx) => {
      const paymentTx = await tx.paymentTransaction.findUnique({
        where: { transactionUuid },
        include: { order: true },
      });

      if (!paymentTx) {
        throw new Error(`TRANSACTION_NOT_FOUND: ${transactionUuid}`);
      }

      // Idempotency check
      if (paymentTx.status === PaymentStatus.SUCCESS) {
        return {
          success: true,
          alreadyProcessed: true,
          orderId: paymentTx.orderId,
          orderNumber: paymentTx.order.orderNumber,
        };
      }

      // Verify amount in Paisa matches DB record
      const expectedPaisa = this.nprToPaisa(paymentTx.amountNpr.toNumber());
      if (expectedPaisa !== total_amount) {
        throw new Error(
          `AMOUNT_MISMATCH: Khalti total_amount ${total_amount} != expected ${expectedPaisa}`
        );
      }

      // Update PaymentTransaction
      await tx.paymentTransaction.update({
        where: { id: paymentTx.id },
        data: {
          status: PaymentStatus.SUCCESS,
          gatewayReferenceId: transaction_id || pidx,
          verifiedAt: new Date(),
          gatewayResponse: khaltiData,
        },
      });

      // Update Order Status to ORDER_PLACED
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
        gatewayRefId: transaction_id || pidx,
        amountPaidNpr: this.paisaToNpr(total_amount),
      };
    });
  }
}
