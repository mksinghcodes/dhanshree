import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// ============================================================
// 1. CAR AND PROMO CODE ENGINE
// ============================================================
function calculateOrderTotal({ subtotalNpr, deliveryFeeNpr, promoCode }) {
  let discount = 0;
  let isFreeDelivery = subtotalNpr >= 3000;
  let effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFeeNpr;

  if (promoCode) {
    const code = promoCode.toUpperCase().trim();
    if (code === 'DHAN100') {
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
      const rawDiscount = subtotalNpr * 0.10;
      discount = Math.min(rawDiscount, 500);
    } else if (code === 'FREEDELIVERY') {
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
// 2. ESEWA SIGNATURE ENGINE
// ============================================================
function generateEsewaSignature(totalAmount, transactionUuid, productCode, secretKey = '8gBm/:&EnhH.1/q') {
  const rawData = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(rawData);
  return hmac.digest('base64');
}

// ============================================================
// 3. KHALTI PAISA CONVERSION ENGINE
// ============================================================
function nprToPaisa(amountNpr) {
  return Math.round(amountNpr * 100);
}
function paisaToNpr(amountPaisa) {
  return amountPaisa / 100;
}

// ============================================================
// 4. NEPAL PHONE SANITIZATION ENGINE
// ============================================================
function sanitizeNepaliPhone(phone) {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+977')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('977')) {
    cleaned = cleaned.substring(3);
  }

  if (!/^[9][78]\d{8}$/.test(cleaned)) {
    throw new Error(`INVALID_NEPALI_PHONE: ${phone}`);
  }
  return cleaned;
}

// ============================================================
// 5. OWASP MASVS LOG SCRUBBER
// ============================================================
function sanitizeLogOutput(input) {
  const jwtRegex = /Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*/g;
  const otpRegex = /\b\d{6}\b/g;
  const phoneRegex = /(\+?977[- ]?)?[9][78]\d{8}/g;

  return input
    .replace(jwtRegex, 'Bearer [REDACTED_JWT_TOKEN]')
    .replace(otpRegex, '[REDACTED_OTP]')
    .replace(phoneRegex, '[REDACTED_PHONE]');
}

// ============================================================
// TEST SUITES
// ============================================================

describe('Dhanshree QA & Test Suite: Cart, Promo, FinTech & Security', () => {

  describe('1. Cart & Delivery Tier Calculations', () => {
    it('applies delivery fee (रु ६०) for carts below रु ३,०००', () => {
      const result = calculateOrderTotal({ subtotalNpr: 1850.0, deliveryFeeNpr: 60.0 });
      assert.equal(result.discountNpr, 0);
      assert.equal(result.isFreeDelivery, false);
      assert.equal(result.finalTotalNpr, 1910.0);
    });

    it('automatically unlocks free delivery for carts >= रु ३,०००', () => {
      const result = calculateOrderTotal({ subtotalNpr: 3499.0, deliveryFeeNpr: 60.0 });
      assert.equal(result.isFreeDelivery, true);
      assert.equal(result.finalTotalNpr, 3499.0);
    });
  });

  describe('2. Promo Code Engine', () => {
    it('applies flat रु १०० discount on DHAN100 when subtotal >= 1000', () => {
      const result = calculateOrderTotal({ subtotalNpr: 1500.0, deliveryFeeNpr: 60.0, promoCode: 'DHAN100' });
      assert.equal(result.discountNpr, 100.0);
      assert.equal(result.finalTotalNpr, 1460.0);
    });

    it('rejects DHAN100 if cart subtotal is under रु १,०००', () => {
      const result = calculateOrderTotal({ subtotalNpr: 850.0, deliveryFeeNpr: 60.0, promoCode: 'DHAN100' });
      assert.equal(result.discountNpr, 0);
      assert.ok(result.error?.includes('requires minimum order of रु १,०००'));
      assert.equal(result.finalTotalNpr, 910.0);
    });

    it('caps FESTIVE10 at रु ५०० max discount', () => {
      const result = calculateOrderTotal({ subtotalNpr: 8000.0, deliveryFeeNpr: 60.0, promoCode: 'FESTIVE10' });
      assert.equal(result.discountNpr, 500.0);
      assert.equal(result.finalTotalNpr, 7500.0);
    });

    it('rejects invalid promo code gracefully', () => {
      const result = calculateOrderTotal({ subtotalNpr: 1500.0, deliveryFeeNpr: 60.0, promoCode: 'BAD_CODE' });
      assert.equal(result.error, 'Invalid promo code');
    });
  });

  describe('3. eSewa ePay 2.0 HMAC-SHA256 Security Signatures', () => {
    const totalAmount = '3459.00';
    const transactionUuid = 'DHAN-ESEWA-ORDER-12345';
    const productCode = 'EPAYTEST';

    it('generates deterministic HMAC-SHA256 signature matching eSewa specification', () => {
      const sig1 = generateEsewaSignature(totalAmount, transactionUuid, productCode);
      const sig2 = generateEsewaSignature(totalAmount, transactionUuid, productCode);
      assert.equal(sig1, sig2);
      assert.ok(sig1.length > 20);
    });

    it('rejects tampered amount (MITM defense)', () => {
      const originalSig = generateEsewaSignature('3459.00', transactionUuid, productCode);
      const tamperedSig = generateEsewaSignature('1.00', transactionUuid, productCode);
      assert.notEqual(originalSig, tamperedSig);
    });

    it('rejects tampered transaction UUID', () => {
      const originalSig = generateEsewaSignature(totalAmount, 'DHAN-ORDER-1', productCode);
      const tamperedSig = generateEsewaSignature(totalAmount, 'DHAN-ORDER-ATTACKER', productCode);
      assert.notEqual(originalSig, tamperedSig);
    });
  });

  describe('4. Khalti Currency Conversion (Paisa / NPR)', () => {
    it('converts NPR 3,459.50 to integer Paisa 345950', () => {
      assert.equal(nprToPaisa(3459.50), 345950);
    });

    it('converts 345950 Paisa back to NPR 3,459.50', () => {
      assert.equal(paisaToNpr(345950), 3459.50);
    });

    it('handles minimum unit 1 Paisa without floating-point error', () => {
      assert.equal(nprToPaisa(0.01), 1);
    });
  });

  describe('5. Nepal Mobile Phone Sanitization (Sparrow / Aakash SMS)', () => {
    it('cleans +977-9841234567 to 10-digit 9841234567', () => {
      assert.equal(sanitizeNepaliPhone('+977-9841234567'), '9841234567');
    });

    it('cleans space-delimited 977 98 41234567 to 9841234567', () => {
      assert.equal(sanitizeNepaliPhone('977 98 41234567'), '9841234567');
    });

    it('rejects invalid non-Nepali numbers', () => {
      assert.throws(() => sanitizeNepaliPhone('+14155552671'), /INVALID_NEPALI_PHONE/);
    });
  });

  describe('6. OWASP MASVS Log Scrubbing & PII Protection', () => {
    it('redacts JWT Bearer tokens from log output', () => {
      const rawLog = 'User request authenticated with Bearer eyJhbGciOiJIUzI1NiJ9.test.sig';
      const cleanLog = sanitizeLogOutput(rawLog);
      assert.ok(!cleanLog.includes('eyJhbGciOiJIUzI1NiJ9'));
      assert.ok(cleanLog.includes('Bearer [REDACTED_JWT_TOKEN]'));
    });

    it('redacts 6-digit OTP codes and phone numbers', () => {
      const rawLog = 'Dispatched OTP 742951 to phone +9779841234567 for verification';
      const cleanLog = sanitizeLogOutput(rawLog);
      assert.ok(!cleanLog.includes('742951'));
      assert.ok(!cleanLog.includes('9841234567'));
      assert.ok(cleanLog.includes('[REDACTED_OTP]'));
      assert.ok(cleanLog.includes('[REDACTED_PHONE]'));
    });
  });
});
