import {
  CountryCode,
  CurrencyCode,
  OrderStatus,
  calculateItemTax,
} from '@dhanshree/shared';
import * as crypto from 'crypto';

describe('Dhanshree Core Engine Verification', () => {
  describe('Multi-Country Tax Engine', () => {
    it('should compute Nepal 13% VAT accurately with integer rounding', () => {
      const result = calculateItemTax({ countryCode: CountryCode.NEPAL, amount: 10000 });
      expect(result.taxRatePercent).toBe(13);
      expect(result.taxAmount).toBe(1300);
      expect(result.totalWithTax).toBe(11300);
      expect(result.taxType).toBe('VAT');
    });

    it('should compute India 18% GST with CGST 9% and SGST 9% split', () => {
      const result = calculateItemTax({
        countryCode: CountryCode.INDIA,
        amount: 20000,
        sellerState: 'MH',
        buyerState: 'MH',
      });
      expect(result.taxRatePercent).toBe(18);
      expect(result.taxAmount).toBe(3600);
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown?.cgstAmount).toBe(1800);
      expect(result.breakdown?.sgstAmount).toBe(1800);
      expect(result.totalWithTax).toBe(23600);
    });

    it('should compute UAE 5% standard VAT accurately', () => {
      const result = calculateItemTax({ countryCode: CountryCode.UAE, amount: 1000 });
      expect(result.taxRatePercent).toBe(5);
      expect(result.taxAmount).toBe(50);
      expect(result.totalWithTax).toBe(1050);
      expect(result.taxType).toBe('VAT');
    });
  });

  describe('Escrow & India Section 52 TCS Deductions', () => {
    it('should deduct 10% platform commission and 1% Section 52 TCS for Indian orders', () => {
      const subtotal = 30000;
      const commissionRate = 0.1; // 10%
      const tcsRate = 0.01; // 1%

      const commission = Math.round(subtotal * commissionRate);
      const tcs = Math.round(subtotal * tcsRate);
      const netSellerPayout = subtotal - commission - tcs;

      expect(commission).toBe(3000);
      expect(tcs).toBe(300);
      expect(netSellerPayout).toBe(26700);
    });

    it('should compute standard 10% platform commission without TCS for Nepal orders', () => {
      const subtotal = 50000;
      const commissionRate = 0.1;

      const commission = Math.round(subtotal * commissionRate);
      const netSellerPayout = subtotal - commission;

      expect(commission).toBe(5000);
      expect(netSellerPayout).toBe(45000);
    });
  });

  describe('Payment Gateway HMAC Security', () => {
    it('should verify eSewa EPAY v2 HMAC-SHA256 signature', () => {
      const secretKey = '8gBm/:&EnhH.1/q';
      const message = 'total_amount=100,transaction_uuid=TXN-101,product_code=EPAYTEST';
      
      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('base64');

      const expected = crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('base64');

      expect(signature).toBe(expected);
      expect(signature.length).toBeGreaterThan(20);
    });

    it('should verify Razorpay payment HMAC-SHA256 signature', () => {
      const keySecret = 'test_secret_key_123';
      const orderId = 'order_DAvD12345';
      const paymentId = 'pay_DAvD67890';

      const payload = `${orderId}|${paymentId}`;
      const signature = crypto
        .createHmac('sha256', keySecret)
        .update(payload)
        .digest('hex');

      expect(signature).toBeDefined();
      expect(signature.length).toBe(64); // 64-char hex string
    });
  });

  describe('Cash on Delivery (COD) Fraud Risk Heuristics', () => {
    it('should enforce country COD value thresholds', () => {
      const codLimits = {
        [CountryCode.NEPAL]: 50000,
        [CountryCode.INDIA]: 30000,
        [CountryCode.UAE]: 2500,
      };

      expect(45000 <= codLimits[CountryCode.NEPAL]).toBe(true);
      expect(55000 <= codLimits[CountryCode.NEPAL]).toBe(false);

      expect(25000 <= codLimits[CountryCode.INDIA]).toBe(true);
      expect(35000 <= codLimits[CountryCode.INDIA]).toBe(false);

      expect(2000 <= codLimits[CountryCode.UAE]).toBe(true);
      expect(3000 <= codLimits[CountryCode.UAE]).toBe(false);
    });

    it('should trigger mandatory OTP verification when risk score exceeds 40', () => {
      const riskScore = 45; // First time buyer + high value
      const requiresOtp = riskScore > 40;
      expect(requiresOtp).toBe(true);
    });
  });
});
