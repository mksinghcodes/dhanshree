import crypto from 'crypto';
import { PrismaClient, PaymentGateway, PaymentStatus, OrderStatus, OtpPurpose } from '@prisma/client';
import { SmsGatewayService } from './sms_gateway_service';

const prisma = new PrismaClient();
const COD_OTP_EXPIRY_MINUTES = 5;

export class CodVerificationService {
  /**
   * Generates a 6-digit cryptographically secure OTP
   */
  private static generateNumericOtp(): string {
    return Math.floor(100000 + crypto.randomInt(900000)).toString();
  }

  /**
   * Hashes the OTP using SHA-256 for secure DB persistence
   */
  private static hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Initiates COD Order Confirmation:
   * Dispatches SMS OTP to customer's delivery contact phone.
   */
  public static async initiateCodOtp(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { shippingAddress: true, user: true },
    });

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    if (order.userId !== userId) {
      throw new Error('UNAUTHORIZED_ORDER_ACCESS');
    }

    const contactPhone = order.shippingAddress.contactPhone || order.user.phone;
    const otpCode = this.generateNumericOtp();
    const otpHash = this.hashOtp(otpCode);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + COD_OTP_EXPIRY_MINUTES);

    // Persist OTP in database
    await prisma.otpVerification.create({
      data: {
        userId,
        phone: contactPhone,
        otpHash,
        purpose: OtpPurpose.CHECKOUT_VERIFICATION,
        maxAttempts: 3,
        expiresAt,
      },
    });

    // Send SMS via Local Nepal Gateway
    await SmsGatewayService.sendOtp(contactPhone, otpCode);

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      phoneMasked: contactPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
      expiresInSeconds: COD_OTP_EXPIRY_MINUTES * 60,
    };
  }

  /**
   * Verifies COD Confirmation OTP and transitions Order to ORDER_PLACED
   */
  public static async verifyCodOtp(orderId: string, userId: string, enteredOtp: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { shippingAddress: true },
    });

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    const phone = order.shippingAddress.contactPhone;
    const incomingHash = this.hashOtp(enteredOtp);

    // Retrieve active OTP record
    const activeOtp = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose: OtpPurpose.CHECKOUT_VERIFICATION,
        isConsumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeOtp) {
      throw new Error('OTP_EXPIRED_OR_NOT_FOUND: Please request a new confirmation code');
    }

    // Check attempts limit
    if (activeOtp.attempts >= activeOtp.maxAttempts) {
      throw new Error('MAX_ATTEMPTS_EXCEEDED: This verification session has been locked');
    }

    // Validate Hash
    if (activeOtp.otpHash !== incomingHash) {
      // Increment attempt counter
      await prisma.otpVerification.update({
        where: { id: activeOtp.id },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = activeOtp.maxAttempts - (activeOtp.attempts + 1);
      throw new Error(`INVALID_OTP: ${remainingAttempts} attempt(s) remaining`);
    }

    // Mark OTP consumed
    await prisma.otpVerification.update({
      where: { id: activeOtp.id },
      data: { isConsumed: true },
    });

    // Complete Order Confirmation inside atomic transaction
    return await prisma.$transaction(async (tx) => {
      // Create Pending COD Payment Transaction
      const transactionUuid = `DHAN-COD-${Date.now()}-${order.orderNumber}`;

      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          gateway: PaymentGateway.CASH_ON_DELIVERY,
          status: PaymentStatus.PENDING, // Cash collected on delivery
          amountNpr: order.totalAmountNpr,
          transactionUuid,
          gatewayReferenceId: 'COD-CONFIRMED',
          verifiedAt: new Date(),
        },
      });

      // Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: OrderStatus.ORDER_PLACED,
        },
      });

      return {
        success: true,
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: OrderStatus.ORDER_PLACED,
        paymentGateway: PaymentGateway.CASH_ON_DELIVERY,
      };
    });
  }

  /**
   * Cancellation handler: unreserves inventory if order is canceled
   */
  public static async cancelOrderAndReleaseStock(orderId: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error('ORDER_NOT_FOUND');
      }

      if (order.orderStatus === OrderStatus.CANCELLED) {
        return { success: true, alreadyCancelled: true };
      }

      // Restore inventory stock for each item
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        });
      }

      // Update Order Status
      await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: OrderStatus.CANCELLED,
        },
      });

      return {
        success: true,
        orderId: order.id,
        restoredItemsCount: order.items.length,
        cancelReason: reason,
      };
    });
  }
}
