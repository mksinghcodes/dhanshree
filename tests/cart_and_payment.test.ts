import crypto from 'crypto';
import { EsewaFintechService } from '../backend/services/esewa_fintech_service';
import { KhaltiFintechService } from '../backend/services/khalti_fintech_service';

// Mock Promo Code Engine
interface CartPromoInput {
  subtotalNpr: number;
  deliveryFeeNpr: number;
  promoCode?: string;
}

interface PromoResult {
  discountNpr: number;
  finalTotalNpr: number;
  isFreeDelivery: boolean;
  error?: string;
}

function calculateOrderTotal(input: CartPromoInput): PromoResult {
  const { subtotalNpr, deliveryFeeNpr, promoCode } = input;
  let discount = 0;
  let isFreeDelivery = subtotalNpr >= 3000; // Free delivery threshold
  let effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFeeNpr;

  if (promoCode) {
    const code = promoCode.toUpperCase().trim();
    if (code === 'DHAN100') {
      // Flat NPR 100 off with minimum spend NPR 1,000
      if (subtotalNpr >= 1000) {
        discount = 100;
      } else {
        return {
          discountNpr: 0,
          finalTotalNpr: subtotalNpr + effectiveDeliveryFee,
          isFreeDelivery,
          error: 'Coupon DHAN100 requires minimum order of रु १,०००',
        };
      }
    } else if (code === 'FESTIVE10') {
      // 10% off with maximum discount cap of NPR 500
      const rawDiscount = subtotalNpr * 0.10;
      discount = Math.min(rawDiscount, 500);
    } else if (code === 'FREEDELIVERY') {
      // Free delivery regardless of subtotal
      isFreeDelivery = true;
      effectiveDeliveryFee = 0;
    } else {
      return {
        discountNpr: 0,
        finalTotalNpr: subtotalNpr + effectiveDeliveryFee,
        isFreeDelivery,
        error: 'Invalid promo code',
      };
    }
  }

  const finalTotal = Math.max(0, subtotalNpr + effectiveDeliveryFee - discount);

  return {
    discountNpr: Math.round(discount * 100) / 100,
    finalTotalNpr: Math.round(finalTotal * 100) / 100,
    isFreeDelivery,
  };
}

// ============================================================
// TEST SUITE
// ============================================================
describe('Dhanshree QA & Test Suite: Cart, Promo & FinTech Webhooks', () => {

  describe('1. Cart & Delivery Fee Tier Calculations', () => {
    test('standard cart below threshold includes delivery fee', () => {
      const result = calculateOrderTotal({
        subtotalNpr: 1850.0,
        deliveryFeeNpr: 60.0,
      });

      expect(result.discountNpr).toBe(0);
      expect(result.isFreeDelivery).toBe(false);
      expect(result.finalTotalNpr).toBe(1910.0);
    });

    test('cart exceeding रु ३,००० automatically unlocks free delivery', () => {
      const result = calculateOrderTotal({
        subtotalNpr: 3499.0,
        deliveryFeeNpr: 60.0,
      });

      expect(result.isFreeDelivery).toBe(true);
      expect(result.finalTotalNpr).toBe(3499.0);
    });
  });

  describe('2. Promo Code Validation & Discounts', () => {
    test('DHAN100 applies flat NPR 100 discount when subtotal >= 1000', () => {
      const result = calculateOrderTotal({
        subtotalNpr: 1500.0,
        deliveryFeeNpr: 60.0,
        promoCode: 'DHAN100',
      });

      expect(result.discountNpr).toBe(100.0);
      expect(result.finalTotalNpr).toBe(1460.0);
      expect(result.error).toBeUndefined();
    });

    test('DHAN100 is rejected if minimum subtotal threshold is not met', () => {
      const result = calculateOrderTotal({
        subtotalNpr: 850.0,
        deliveryFeeNpr: 60.0,
        promoCode: 'DHAN100',
      });

      expect(result.discountNpr).toBe(0);
      expect(result.error).toContain('requires minimum order of रु १,०००');
      expect(result.finalTotalNpr).toBe(910.0);
    });

    test('FESTIVE10 caps discount at NPR 500 max limit', () => {
      // 10% of 8,000 is 800, but cap is 500
      const result = calculateOrderTotal({
        subtotalNpr: 8000.0,
        deliveryFeeNpr: 60.0,
        promoCode: 'FESTIVE10',
      });

      expect(result.discountNpr).toBe(500.0);
      expect(result.isFreeDelivery).toBe(true); // >= 3000
      expect(result.finalTotalNpr).toBe(7500.0);
    });

    test('rejects unrecognized promo codes gracefully', () => {
      const result = calculateOrderTotal({
        subtotalNpr: 1500.0,
        deliveryFeeNpr: 60.0,
        promoCode: 'INVALID_CODE',
      });

      expect(result.discountNpr).toBe(0);
      expect(result.error).toBe('Invalid promo code');
    });
  });

  describe('3. eSewa ePay 2.0 HMAC-SHA256 Security Tests', () => {
    const secretKey = '8gBm/:&EnhH.1/q';
    const totalAmount = '3459.00';
    const transactionUuid = 'DHAN-ESEWA-ORDER-12345';
    const productCode = 'EPAYTEST';

    test('signature generation matches expected HMAC-SHA256 digest', () => {
      const rawData = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
      const expectedDigest = crypto
        .createHmac('sha256', secretKey)
        .update(rawData)
        .digest('base64');

      const generatedSignature = EsewaFintechService.generateSignature(
        totalAmount,
        transactionUuid,
        productCode
      );

      expect(generatedSignature).toBe(expectedDigest);
    });

    test('tampered amount in callback fails signature verification', () => {
      const validSignature = EsewaFintechService.generateSignature(
        totalAmount,
        transactionUuid,
        productCode
      );

      // Attacker attempts to change amount from 3459.00 to 1.00
      const tamperedAmount = '1.00';
      const recalculated = EsewaFintechService.generateSignature(
        tamperedAmount,
        transactionUuid,
        productCode
      );

      expect(recalculated).not.toBe(validSignature);
    });

    test('tampered transaction UUID fails signature verification', () => {
      const validSignature = EsewaFintechService.generateSignature(
        totalAmount,
        transactionUuid,
        productCode
      );

      const tamperedUuid = 'DHAN-ESEWA-ORDER-ATTACKER';
      const recalculated = EsewaFintechService.generateSignature(
        totalAmount,
        tamperedUuid,
        productCode
      );

      expect(recalculated).not.toBe(validSignature);
    });
  });

  describe('4. Khalti Paisa / NPR Conversion Tests', () => {
    test('accurately converts NPR 3,459.50 to 345950 Paisa', () => {
      const paisa = KhaltiFintechService.nprToPaisa(3459.50);
      expect(paisa).toBe(345950);
    });

    test('accurately converts 345950 Paisa to NPR 3,459.50', () => {
      const npr = KhaltiFintechService.paisaToNpr(345950);
      expect(npr).toBe(3459.50);
    });

    test('handles edge case single paisa rounding without float drift', () => {
      const paisa = KhaltiFintechService.nprToPaisa(0.01);
      expect(paisa).toBe(1);
    });
  });
});
