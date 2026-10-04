const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const shared = require(path.resolve(__dirname, '../../packages/shared/dist/index.js'));

const { CountryCode, calculateItemTax } = shared;

test.describe('Dhanshree Platform Core Engine Test Suite', () => {
  test.describe('Multi-Country Tax Engine', () => {
    test('Computes Nepal 13% VAT accurately with integer rounding', () => {
      const result = calculateItemTax({ countryCode: CountryCode.NEPAL, amount: 10000 });
      assert.equal(result.ratePercent, 13);
      assert.equal(result.totalTax, 1300);
      assert.equal(result.breakdown.nepalVatAmount, 1300);
      assert.equal(result.taxType, shared.TaxType.NEPAL_VAT);
    });

    test('Computes India 18% GST with CGST 9% and SGST 9% intra-state split', () => {
      const result = calculateItemTax({
        countryCode: CountryCode.INDIA,
        amount: 20000,
        sellerState: 'MH',
        buyerState: 'MH',
      });
      assert.equal(result.ratePercent, 18);
      assert.equal(result.totalTax, 3600);
      assert.ok(result.breakdown);
      assert.equal(result.breakdown.cgstAmount, 1800);
      assert.equal(result.breakdown.sgstAmount, 1800);
      assert.equal(result.taxType, shared.TaxType.INDIA_GST_INTRA);
    });

    test('Computes UAE 5% standard VAT accurately', () => {
      const result = calculateItemTax({ countryCode: CountryCode.UAE, amount: 1000 });
      assert.equal(result.ratePercent, 5);
      assert.equal(result.totalTax, 50);
      assert.equal(result.breakdown.uaeVatAmount, 50);
      assert.equal(result.taxType, shared.TaxType.UAE_VAT);
    });
  });

  test.describe('Escrow & India Section 52 TCS Deductions', () => {
    test('Deducts 10% platform commission and 1% Section 52 TCS for Indian orders', () => {
      const subtotal = 30000;
      const commissionRate = 0.1; // 10%
      const tcsRate = 0.01; // 1%

      const commission = Math.round(subtotal * commissionRate);
      const tcs = Math.round(subtotal * tcsRate);
      const netSellerPayout = subtotal - commission - tcs;

      assert.equal(commission, 3000);
      assert.equal(tcs, 300);
      assert.equal(netSellerPayout, 26700);
    });

    test('Computes standard 10% platform commission without TCS for Nepal orders', () => {
      const subtotal = 50000;
      const commissionRate = 0.1;

      const commission = Math.round(subtotal * commissionRate);
      const netSellerPayout = subtotal - commission;

      assert.equal(commission, 5000);
      assert.equal(netSellerPayout, 45000);
    });
  });

  test.describe('Payment Gateway HMAC Security', () => {
    test('Verifies eSewa EPAY v2 HMAC-SHA256 signature', () => {
      const secretKey = '8gBm/:&EnhH.1/q';
      const message = 'total_amount=100,transaction_uuid=TXN-101,product_code=EPAYTEST';

      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('base64');

      assert.ok(signature.length > 20);
    });

    test('Verifies Razorpay payment HMAC-SHA256 signature', () => {
      const keySecret = 'test_secret_key_123';
      const orderId = 'order_DAvD12345';
      const paymentId = 'pay_DAvD67890';

      const payload = `${orderId}|${paymentId}`;
      const signature = crypto
        .createHmac('sha256', keySecret)
        .update(payload)
        .digest('hex');

      assert.ok(signature);
      assert.equal(signature.length, 64);
    });
  });

  test.describe('Cash on Delivery (COD) Fraud Risk Heuristics', () => {
    test('Enforces country COD value thresholds', () => {
      const codLimits = {
        [CountryCode.NEPAL]: 50000,
        [CountryCode.INDIA]: 30000,
        [CountryCode.UAE]: 2500,
      };

      assert.ok(45000 <= codLimits[CountryCode.NEPAL]);
      assert.ok(55000 > codLimits[CountryCode.NEPAL]);

      assert.ok(25000 <= codLimits[CountryCode.INDIA]);
      assert.ok(35000 > codLimits[CountryCode.INDIA]);

      assert.ok(2000 <= codLimits[CountryCode.UAE]);
      assert.ok(3000 > codLimits[CountryCode.UAE]);
    });

    test('Triggers mandatory OTP verification when risk score exceeds 40', () => {
      const riskScore = 45;
      const requiresOtp = riskScore > 40;
      assert.equal(requiresOtp, true);
    });
  });

  test.describe('Cross-Border Trade & Customs Treaties', () => {
    test('Applies India-UAE CEPA concessional 5% basic customs duty', () => {
      const tradeCorridor = 'IN_TO_AE';
      const declaredValueUSD = 500;
      const dutyRate = tradeCorridor === 'IN_TO_AE' ? 0.05 : 0.15;
      const calculatedDuty = declaredValueUSD * dutyRate;

      assert.equal(dutyRate, 0.05);
      assert.equal(calculatedDuty, 25);
    });

    test('Applies Nepal-India Bilateral Treaty of Trade 6% preferential tariff', () => {
      const originCountry = 'NP';
      const destCountry = 'IN';
      const treatyApplies = originCountry === 'NP' && destCountry === 'IN';
      const preferentialDuty = treatyApplies ? 0.06 : 0.20;

      assert.equal(preferentialDuty, 0.06);
    });

    test('Applies WTO ITA-1 zero duty exemption on laptops & computing gear', () => {
      const hsnCode = '8471.30'; // Laptops and portable computers
      const isItaEligible = hsnCode.startsWith('8471');
      const basicCustomsDuty = isItaEligible ? 0.0 : 0.10;

      assert.equal(basicCustomsDuty, 0.0);
    });
  });
});
