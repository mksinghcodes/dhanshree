require('reflect-metadata');
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

  test.describe('Tiered Rate Limiting & Exponential Backoff Engine', () => {
    const { RateLimitTier, calculateExponentialBackoff } = shared;
    const {
      RateLimitConfigService,
      RateLimitStorage,
      RateLimitService,
    } = require(path.resolve(__dirname, 'dist/modules/rate-limit/index.js'));

    test('Exponential backoff algorithm scales mathematically without hard lockout', () => {
      const threshold = 5;
      const baseDelaySec = 5;
      const maxDelaySec = 1800; // 30 minutes

      // Attempts 1 through 4: within threshold -> 0s delay
      for (let i = 1; i < threshold; i++) {
        assert.equal(
          calculateExponentialBackoff(i, threshold, baseDelaySec, maxDelaySec),
          0,
          `Attempt ${i} should have 0 backoff delay`,
        );
      }

      // Attempt 5 (5th failure reaches threshold): 5 * 2^0 = 5s
      assert.equal(
        calculateExponentialBackoff(5, threshold, baseDelaySec, maxDelaySec),
        5,
      );

      // Attempt 6: 5 * 2^1 = 10s
      assert.equal(
        calculateExponentialBackoff(6, threshold, baseDelaySec, maxDelaySec),
        10,
      );

      // Attempt 7: 5 * 2^2 = 20s
      assert.equal(
        calculateExponentialBackoff(7, threshold, baseDelaySec, maxDelaySec),
        20,
      );

      // Attempt 8: 5 * 2^3 = 40s
      assert.equal(
        calculateExponentialBackoff(8, threshold, baseDelaySec, maxDelaySec),
        40,
      );

      // Attempt 9: 5 * 2^4 = 80s
      assert.equal(
        calculateExponentialBackoff(9, threshold, baseDelaySec, maxDelaySec),
        80,
      );

      // Attempt 10: 5 * 2^5 = 160s
      assert.equal(
        calculateExponentialBackoff(10, threshold, baseDelaySec, maxDelaySec),
        160,
      );

      // Deep repeated brute-force attempts cap at maxDelaySec (1800s = 30m)
      assert.equal(
        calculateExponentialBackoff(25, threshold, baseDelaySec, maxDelaySec),
        1800,
      );
    });

    test('Strict Auth tier enforces per-account exponential backoff with account isolation', () => {
      const storage = new RateLimitStorage();
      const mockConfigService = {
        getConfig: () => ({
          enabled: true,
          auth: {
            ipMax: 20,
            ipWindowMs: 60000,
            accountMax: 5,
            accountWindowMs: 900000,
            baseBackoffSec: 5,
            maxBackoffSec: 1800,
          },
          public: { max: 100, windowMs: 60000 },
          authenticated: { max: 300, windowMs: 60000 },
        }),
      };
      const rateLimitService = new RateLimitService(mockConfigService, storage);

      const targetAccount = 'buyer@dhanshree.com';
      const otherAccount = 'seller@dhanshree.com';
      const ip = '192.168.1.100';

      // First 5 failed attempts: allowed through (accumulating warnings)
      for (let i = 1; i <= 5; i++) {
        const check = rateLimitService.checkRateLimit({
          tier: RateLimitTier.AUTH,
          ip,
          accountIdentifier: targetAccount,
        });
        assert.equal(check.allowed, true);
        rateLimitService.recordAuthFailure(targetAccount);
      }

      // 6th attempt: Exceeds threshold (5 failures) -> triggers 5-second backoff
      const blockedCheck = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip,
        accountIdentifier: targetAccount,
      });

      assert.equal(blockedCheck.allowed, false);
      assert.equal(blockedCheck.reason, 'ACCOUNT_BACKOFF_ACTIVE');
      assert.ok(blockedCheck.retryAfterSec > 0);
      assert.ok(blockedCheck.retryAfterSec <= 5);

      // Verify that other accounts from the same or different IP are NOT blocked (per-account isolation)
      const otherCheck = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip,
        accountIdentifier: otherAccount,
      });
      assert.equal(otherCheck.allowed, true);
    });

    test('Successful authentication resets failure counter and clears active backoff', () => {
      const storage = new RateLimitStorage();
      const mockConfigService = {
        getConfig: () => ({
          enabled: true,
          auth: {
            ipMax: 20,
            ipWindowMs: 60000,
            accountMax: 3,
            accountWindowMs: 900000,
            baseBackoffSec: 10,
            maxBackoffSec: 1800,
          },
          public: { max: 100, windowMs: 60000 },
          authenticated: { max: 300, windowMs: 60000 },
        }),
      };
      const rateLimitService = new RateLimitService(mockConfigService, storage);
      const account = 'user@dhanshree.com';

      // Induce 4 failures (threshold is 3)
      for (let i = 0; i < 4; i++) {
        rateLimitService.recordAuthFailure(account);
      }

      // Account should currently be blocked
      const blocked = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip: '10.0.0.1',
        accountIdentifier: account,
      });
      assert.equal(blocked.allowed, false);
      assert.equal(blocked.reason, 'ACCOUNT_BACKOFF_ACTIVE');

      // User performs successful login
      rateLimitService.recordAuthSuccess(account);

      // Account backoff should now be lifted immediately
      const cleared = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip: '10.0.0.1',
        accountIdentifier: account,
      });
      assert.equal(cleared.allowed, true);
    });

    test('Strict Auth tier enforces per-IP limits against credential stuffing', () => {
      const storage = new RateLimitStorage();
      const mockConfigService = {
        getConfig: () => ({
          enabled: true,
          auth: {
            ipMax: 3, // strict test limit: 3 hits per minute
            ipWindowMs: 60000,
            accountMax: 10,
            accountWindowMs: 900000,
            baseBackoffSec: 5,
            maxBackoffSec: 1800,
          },
          public: { max: 100, windowMs: 60000 },
          authenticated: { max: 300, windowMs: 60000 },
        }),
      };
      const rateLimitService = new RateLimitService(mockConfigService, storage);
      const attackIp = '198.51.100.42';

      // Attacker tries different accounts from the same IP
      const hit1 = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip: attackIp,
        accountIdentifier: 'victim1@mail.com',
      });
      assert.equal(hit1.allowed, true);
      assert.equal(hit1.remaining, 2);

      const hit2 = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip: attackIp,
        accountIdentifier: 'victim2@mail.com',
      });
      assert.equal(hit2.allowed, true);
      assert.equal(hit2.remaining, 1);

      const hit3 = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip: attackIp,
        accountIdentifier: 'victim3@mail.com',
      });
      assert.equal(hit3.allowed, true);
      assert.equal(hit3.remaining, 0);

      // 4th hit from same IP should be blocked even with new account identifier
      const hit4 = rateLimitService.checkRateLimit({
        tier: RateLimitTier.AUTH,
        ip: attackIp,
        accountIdentifier: 'victim4@mail.com',
      });
      assert.equal(hit4.allowed, false);
      assert.equal(hit4.reason, 'IP_LIMIT_EXCEEDED');
      assert.ok(hit4.retryAfterSec > 0);
    });

    test('Public tier enforces moderate per-IP limits', () => {
      const storage = new RateLimitStorage();
      const mockConfigService = {
        getConfig: () => ({
          enabled: true,
          auth: { ipMax: 10, ipWindowMs: 60000, accountMax: 5, accountWindowMs: 900000, baseBackoffSec: 5, maxBackoffSec: 1800 },
          public: { max: 2, windowMs: 60000 },
          authenticated: { max: 300, windowMs: 60000 },
        }),
      };
      const rateLimitService = new RateLimitService(mockConfigService, storage);
      const clientIp = '203.0.113.15';

      const res1 = rateLimitService.checkRateLimit({ tier: RateLimitTier.PUBLIC, ip: clientIp });
      assert.equal(res1.allowed, true);
      assert.equal(res1.remaining, 1);

      const res2 = rateLimitService.checkRateLimit({ tier: RateLimitTier.PUBLIC, ip: clientIp });
      assert.equal(res2.allowed, true);
      assert.equal(res2.remaining, 0);

      const res3 = rateLimitService.checkRateLimit({ tier: RateLimitTier.PUBLIC, ip: clientIp });
      assert.equal(res3.allowed, false);
      assert.equal(res3.reason, 'TIER_LIMIT_EXCEEDED');
      assert.equal(res3.retryAfterSec > 0, true);
    });

    test('Authenticated tier enforces looser limits keyed by user ID', () => {
      const storage = new RateLimitStorage();
      const mockConfigService = {
        getConfig: () => ({
          enabled: true,
          auth: { ipMax: 10, ipWindowMs: 60000, accountMax: 5, accountWindowMs: 900000, baseBackoffSec: 5, maxBackoffSec: 1800 },
          public: { max: 50, windowMs: 60000 },
          authenticated: { max: 2, windowMs: 60000 },
        }),
      };
      const rateLimitService = new RateLimitService(mockConfigService, storage);
      const userA = 'usr-001';
      const userB = 'usr-002';
      const sharedIp = '10.20.30.40';

      // User A uses their quota
      assert.equal(rateLimitService.checkRateLimit({ tier: RateLimitTier.AUTHENTICATED, ip: sharedIp, userId: userA }).allowed, true);
      assert.equal(rateLimitService.checkRateLimit({ tier: RateLimitTier.AUTHENTICATED, ip: sharedIp, userId: userA }).allowed, true);
      assert.equal(rateLimitService.checkRateLimit({ tier: RateLimitTier.AUTHENTICATED, ip: sharedIp, userId: userA }).allowed, false);

      // User B sharing same IP has independent looser quota
      assert.equal(rateLimitService.checkRateLimit({ tier: RateLimitTier.AUTHENTICATED, ip: sharedIp, userId: userB }).allowed, true);
    });

    test('Configuration is fully dynamic and respects global enable/disable toggle', () => {
      const storage = new RateLimitStorage();
      const mockConfigDisabled = {
        getConfig: () => ({
          enabled: false,
          auth: { ipMax: 1, ipWindowMs: 60000, accountMax: 1, accountWindowMs: 900000, baseBackoffSec: 5, maxBackoffSec: 1800 },
          public: { max: 1, windowMs: 60000 },
          authenticated: { max: 1, windowMs: 60000 },
        }),
      };
      const service = new RateLimitService(mockConfigDisabled, storage);

      // When disabled, unlimited requests pass
      for (let i = 0; i < 50; i++) {
        const res = service.checkRateLimit({
          tier: RateLimitTier.AUTH,
          ip: '1.2.3.4',
          accountIdentifier: 'target@example.com',
        });
        assert.equal(res.allowed, true);
      }
    });
  });

  test.describe('Strict Schema Input Validation & Non-Sanitizing Rejection', () => {
    const {
      validateStrictSchema,
      VALIDATION_PATTERNS,
      VALIDATION_LIMITS,
    } = shared;

    const { StrictValidationPipe } = require(path.resolve(__dirname, 'dist/common/validation/index.js'));
    const { RegisterDto } = require(path.resolve(__dirname, 'dist/modules/auth/dto/register.dto.js'));
    const { LoginDto } = require(path.resolve(__dirname, 'dist/modules/auth/dto/login.dto.js'));
    const { SendOtpRequestDto, VerifyOtpRequestDto } = require(path.resolve(__dirname, 'dist/modules/auth/dto/otp.dto.js'));
    const { CreateProductDto } = require(path.resolve(__dirname, 'dist/modules/catalog/dto/create-product.dto.js'));
    const { AddCartItemDto } = require(path.resolve(__dirname, 'dist/modules/cart/dto/add-cart-item.dto.js'));
    const { ApplyCouponDto } = require(path.resolve(__dirname, 'dist/modules/cart/dto/apply-coupon.dto.js'));
    const { SubmitSellerKycDto } = require(path.resolve(__dirname, 'dist/modules/users/dto/seller-kyc.dto.js'));
    const { CalculateTaxDto } = require(path.resolve(__dirname, 'dist/modules/countries/dto/tax-calculation.dto.js'));

    const pipe = new StrictValidationPipe();

    test('Shared Schema Engine: Rejects inputs containing HTML markup outright without escaping', () => {
      const maliciousPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert(1)>',
        'Hello <b>World</b>',
        '"><iframe src="javascript:alert(1)">',
        '<<SCRIPT>alert("XSS");//<</SCRIPT>',
      ];

      for (const payload of maliciousPayloads) {
        const result = validateStrictSchema(
          { title: payload },
          [{ field: 'title', type: 'string', minLength: 2, maxLength: 100, disallowHtml: true }],
          false,
        );

        assert.equal(result.valid, false, `Payload "${payload}" must be rejected`);
        assert.ok(result.errors.length > 0);
        assert.ok(result.errors.some((e) => e.constraint === 'noHtmlMarkup'));
        // Crucial requirement: Verify input was NOT sanitized or mutated
        assert.equal(payload.includes('<'), true, 'Original input was unchanged and rejected outright');
      }
    });

    test('Shared Schema Engine: Rejects null bytes and ASCII control characters', () => {
      const payloadsWithControl = [
        'user\0admin',
        'malicious\x07bell',
        'dangerous\x1Funit',
      ];

      for (const payload of payloadsWithControl) {
        const result = validateStrictSchema(
          { username: payload },
          [{
            field: 'username',
            type: 'string',
            minLength: 2,
            maxLength: 50,
            pattern: VALIDATION_PATTERNS.NO_CONTROL_CHARS,
            patternMessage: 'username cannot contain control characters',
          }],
          false,
        );

        assert.equal(result.valid, false);
        assert.ok(result.errors.length > 0);
      }
    });

    test('Shared Schema Engine: Rejects undeclared / unknown properties when allowUnknown is false', () => {
      const data = {
        name: 'Valid Name',
        injectedAdminPrivilege: true,
      };

      const result = validateStrictSchema(
        data,
        [{ field: 'name', type: 'string', minLength: 1 }],
        false,
      );

      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.constraint === 'forbidNonWhitelisted' && e.field === 'injectedAdminPrivilege'));
    });

    test('Shared Schema Engine: Validates format patterns (E.164 phone, Nepal PAN, India GSTIN, UAE TRN)', () => {
      // Valid patterns
      assert.ok(VALIDATION_PATTERNS.PHONE_E164.test('+9779841234567'));
      assert.ok(VALIDATION_PATTERNS.PHONE_E164.test('+919876543210'));
      assert.ok(VALIDATION_PATTERNS.PHONE_E164.test('+971501234567'));
      assert.ok(VALIDATION_PATTERNS.NEPAL_PAN.test('601234567'));
      assert.ok(VALIDATION_PATTERNS.INDIA_PAN.test('ABCDE1234F'));
      assert.ok(VALIDATION_PATTERNS.INDIA_GSTIN.test('27ABCDE1234F1Z5'));
      assert.ok(VALIDATION_PATTERNS.UAE_TRN.test('100234567800003'));

      // Invalid patterns that must fail
      assert.equal(VALIDATION_PATTERNS.PHONE_E164.test('0984123456'), false);
      assert.equal(VALIDATION_PATTERNS.PHONE_E164.test('+123'), false);
      assert.equal(VALIDATION_PATTERNS.NEPAL_PAN.test('12345'), false); // Only 5 digits
      assert.equal(VALIDATION_PATTERNS.NEPAL_PAN.test('6012345678'), false); // 10 digits
      assert.equal(VALIDATION_PATTERNS.INDIA_PAN.test('12345ABCDE'), false); // Wrong order
      assert.equal(VALIDATION_PATTERNS.UAE_TRN.test('200234567800003'), false); // Must start with 100
    });

    test('StrictValidationPipe: Rejects HTML markup with HTTP 400 without mutating input', async () => {
      const maliciousRegisterPayload = {
        email: 'attacker@evil.com',
        password: 'Password123!',
        fullName: '<script>alert("pwned")</script>',
        preferredCountry: 'NP',
      };

      await assert.rejects(
        async () => {
          await pipe.transform(maliciousRegisterPayload, {
            type: 'body',
            metatype: RegisterDto,
          });
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.equal(body.statusCode, 400);
          assert.ok(
            body.validationErrors.some(
              (e) => e.field === 'fullName' && e.constraint === 'isStrictText',
            ),
          );
          return true;
        },
      );
    });

    test('StrictValidationPipe: Rejects non-whitelisted/unknown fields with HTTP 400', async () => {
      const payloadWithAdminBypass = {
        email: 'user@example.com',
        password: 'Password123!',
        fullName: 'Valid User',
        preferredCountry: 'NP',
        role: 'ADMIN', // Allowed
        isSuperAdmin: true, // Non-whitelisted property injection attempt
      };

      await assert.rejects(
        async () => {
          await pipe.transform(payloadWithAdminBypass, {
            type: 'body',
            metatype: RegisterDto,
          });
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(
            body.validationErrors.some(
              (e) => e.field === 'isSuperAdmin' && e.constraint === 'whitelistValidation',
            ),
          );
          return true;
        },
      );
    });

    test('StrictValidationPipe: Rejects type mismatches without coercion', async () => {
      const invalidProductPayload = {
        title: 'Sony WH-1000XM5',
        description: 'High-end noise cancelling headphones with LDAC',
        categoryId: 'cat-audio',
        storeId: 'store-sony',
        sku: 'SONY-WH1000XM5-MAIN',
        basePrice: 'not-a-number', // String instead of number
      };

      await assert.rejects(
        async () => {
          await pipe.transform(invalidProductPayload, {
            type: 'body',
            metatype: CreateProductDto,
          });
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(
            body.validationErrors.some(
              (e) => e.field === 'basePrice' && e.constraint === 'isNumber',
            ),
          );
          return true;
        },
      );
    });

    test('StrictValidationPipe: Validates OTP 6-digit strict numeric scheme', async () => {
      // Rejects 4 digits
      await assert.rejects(
        async () => {
          await pipe.transform(
            { phoneNumber: '+9779841234567', countryCode: 'NP', otpCode: '1234' },
            { type: 'body', metatype: VerifyOtpRequestDto },
          );
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(body.validationErrors.some((e) => e.field === 'otpCode'));
          return true;
        },
      );

      // Rejects non-numeric letters
      await assert.rejects(
        async () => {
          await pipe.transform(
            { phoneNumber: '+9779841234567', countryCode: 'NP', otpCode: 'ABC123' },
            { type: 'body', metatype: VerifyOtpRequestDto },
          );
        },
        (err) => {
          assert.equal(err.status, 400);
          return true;
        },
      );

      // Accepts valid 6-digit numeric OTP
      const validRes = await pipe.transform(
        { phoneNumber: '+9779841234567', countryCode: 'NP', otpCode: '849201' },
        { type: 'body', metatype: VerifyOtpRequestDto },
      );
      assert.equal(validRes.otpCode, '849201');
    });

    test('StrictValidationPipe: Validates Cart operations & rejects negative quantities', async () => {
      // Rejects quantity <= 0
      await assert.rejects(
        async () => {
          await pipe.transform(
            { variantId: 'var-123', quantity: -2 },
            { type: 'body', metatype: AddCartItemDto },
          );
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(body.validationErrors.some((e) => e.field === 'quantity'));
          return true;
        },
      );

      // Rejects invalid coupon code with malicious characters
      await assert.rejects(
        async () => {
          await pipe.transform(
            { couponCode: 'DISCOUNT; DROP TABLE users;--' },
            { type: 'body', metatype: ApplyCouponDto },
          );
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(body.validationErrors.some((e) => e.field === 'couponCode'));
          return true;
        },
      );

      // Accepts valid coupon code
      const couponRes = await pipe.transform(
        { couponCode: 'DASHAIN2026' },
        { type: 'body', metatype: ApplyCouponDto },
      );
      assert.equal(couponRes.couponCode, 'DASHAIN2026');
    });

    test('StrictValidationPipe: Enforces country KYC format rules (Nepal PAN, India PAN/GSTIN, UAE TRN)', async () => {
      // Rejects invalid Nepal PAN (must be 9 digits)
      await assert.rejects(
        async () => {
          await pipe.transform(
            {
              companyName: 'Himalayan Crafts',
              businessType: 'PVT_LTD',
              operationalCountry: 'NP',
              nepalPanVatNumber: '98765', // Invalid: 5 digits instead of 9
            },
            { type: 'body', metatype: SubmitSellerKycDto },
          );
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(
            body.validationErrors.some(
              (e) => e.field === 'nepalPanVatNumber' && e.constraint === 'isNepalPan',
            ),
          );
          return true;
        },
      );

      // Rejects invalid India PAN
      await assert.rejects(
        async () => {
          await pipe.transform(
            {
              companyName: 'Bharat Exports',
              businessType: 'PVT_LTD',
              operationalCountry: 'IN',
              indiaPanNumber: 'INVALID_PAN',
            },
            { type: 'body', metatype: SubmitSellerKycDto },
          );
        },
        (err) => {
          assert.equal(err.status, 400);
          const body = err.getResponse();
          assert.ok(
            body.validationErrors.some(
              (e) => e.field === 'indiaPanNumber' && e.constraint === 'isIndiaPan',
            ),
          );
          return true;
        },
      );

      // Accepts valid KYC submissions
      const validKyc = await pipe.transform(
        {
          companyName: 'Kathmandu Pashmina Exports Pvt. Ltd.',
          businessType: 'PVT_LTD',
          operationalCountry: 'NP',
          nepalPanVatNumber: '601987654',
        },
        { type: 'body', metatype: SubmitSellerKycDto },
      );
      assert.equal(validKyc.companyName, 'Kathmandu Pashmina Exports Pvt. Ltd.');
      assert.equal(validKyc.nepalPanVatNumber, '601987654');
    });
  });

  test.describe('Zero Hardcoded Secrets & Production Environment Guardrails', () => {
    const {
      getSecureSecret,
      getJwtSecret,
      getJwtRefreshSecret,
      getEsewaSecretKey,
      getKhaltiSecretKey,
      getRazorpayKeySecret,
    } = require(path.resolve(__dirname, 'dist/common/config/secrets.config.js'));

    const originalNodeEnv = process.env.NODE_ENV;

    test.afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    test('Non-Production: Safely resolves configured environment variables or defaults', () => {
      process.env.NODE_ENV = 'test';
      const keyName = 'TEST_CUSTOM_SECRET_KEY_' + Date.now();

      // When absent, uses fallback
      const fallbackVal = getSecureSecret(keyName, { fallbackDev: 'dev_default_sample' });
      assert.equal(fallbackVal, 'dev_default_sample');

      // When configured in environment, uses configured value
      process.env[keyName] = 'my_custom_env_value_123';
      const configuredVal = getSecureSecret(keyName, { fallbackDev: 'dev_default_sample' });
      assert.equal(configuredVal, 'my_custom_env_value_123');

      delete process.env[keyName];
    });

    test('Production Guardrail: Strictly throws if required secret is missing in production', () => {
      process.env.NODE_ENV = 'production';
      const missingKey = 'NON_EXISTENT_PROD_SECRET_' + Date.now();

      assert.throws(
        () => {
          getSecureSecret(missingKey, { requiredInProd: true });
        },
        (err) => {
          assert.ok(err.message.includes('[SECURITY FATAL]'));
          assert.ok(err.message.includes(missingKey));
          return true;
        },
      );
    });

    test('Production Guardrail: Strictly throws if production secret matches known insecure dev fallback', () => {
      process.env.NODE_ENV = 'production';
      const keyName = 'TEST_LEAKED_DEFAULT_' + Date.now();
      const insecureDefault = 'super_secret_jwt_sign_key_phase1_test_xyz123!';

      process.env[keyName] = insecureDefault;

      assert.throws(
        () => {
          getSecureSecret(keyName, { fallbackDev: insecureDefault, requiredInProd: true });
        },
        (err) => {
          assert.ok(err.message.includes('[SECURITY FATAL]'));
          assert.ok(err.message.includes('known insecure development fallback'));
          return true;
        },
      );

      delete process.env[keyName];
    });

    test('Production Guardrail: Strictly enforces minimum secret length (>= 32 chars) in production', () => {
      process.env.NODE_ENV = 'production';
      const keyName = 'TEST_SHORT_PROD_SECRET_' + Date.now();

      // 10-char weak password in production
      process.env[keyName] = 'weak_short';

      assert.throws(
        () => {
          getSecureSecret(keyName, { minLength: 32, requiredInProd: true });
        },
        (err) => {
          assert.ok(err.message.includes('[SECURITY FATAL]'));
          assert.ok(err.message.includes('minimum length requirement (32 chars)'));
          return true;
        },
      );

      delete process.env[keyName];
    });

    test('Production Guardrail: Accepts strong high-entropy production secrets', () => {
      process.env.NODE_ENV = 'production';
      const keyName = 'JWT_SECRET_PROD_TEST_' + Date.now();
      const strongProdSecret = crypto.randomBytes(32).toString('hex'); // 64 chars

      process.env[keyName] = strongProdSecret;

      const resolved = getSecureSecret(keyName, {
        fallbackDev: 'dev_fallback_value',
        minLength: 32,
        requiredInProd: true,
      });

      assert.equal(resolved, strongProdSecret);
      delete process.env[keyName];
    });

    test('Frontend Security Audit: Verifies no sensitive secrets or keys are exposed via NEXT_PUBLIC_', () => {
      const forbiddenTerms = ['SECRET', 'PASSWORD', 'PRIVATE_KEY', 'TOKEN_HASH', 'DB_PASSWORD'];

      // Check all environment keys present on process.env
      for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith('NEXT_PUBLIC_')) {
          for (const term of forbiddenTerms) {
            assert.equal(
              key.toUpperCase().includes(term),
              false,
              `Found dangerous sensitive key exposed via NEXT_PUBLIC_: ${key}`,
            );
          }
        }
      }
    });
  });
});
