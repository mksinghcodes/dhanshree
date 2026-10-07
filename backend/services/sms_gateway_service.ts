import axios from 'axios';

// Environment Configuration
const SMS_ENABLED = process.env.SMS_ENABLED === 'true';

// Sparrow SMS Config
const SPARROW_TOKEN = process.env.SPARROW_SMS_TOKEN || 'sparrow_test_token_2026';
const SPARROW_SENDER_ID = process.env.SPARROW_SENDER_ID || 'Dhanshree';
const SPARROW_API_URL = 'http://api.sparrowsms.com/v2/sms/';

// Aakash SMS Config (Secondary / Fallback Gateway)
const AAKASH_AUTH_TOKEN = process.env.AAKASH_SMS_AUTH_TOKEN || 'aakash_test_token_2026';
const AAKASH_API_URL = 'https://sms.aakashsms.com/sms/v3/send';

export interface SmsDispatchResult {
  success: boolean;
  provider: 'SPARROW' | 'AAKASH' | 'MOCK';
  messageId?: string;
  recipient: string;
  error?: string;
}

export class SmsGatewayService {
  /**
   * Cleans input to standard 10-digit Nepali mobile format (e.g., "9841234567")
   */
  public static sanitizeNepaliPhone(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+977')) {
      cleaned = cleaned.substring(4);
    } else if (cleaned.startsWith('977')) {
      cleaned = cleaned.substring(3);
    }

    if (!/^[9][78]\d{8}$/.test(cleaned)) {
      throw new Error(`INVALID_NEPALI_PHONE: ${phone} is not a valid 10-digit NTC/Ncell number`);
    }

    return cleaned;
  }

  /**
   * Sends 6-Digit OTP via primary gateway (Sparrow) with auto-failover to secondary (Aakash)
   */
  public static async sendOtp(phone: string, otpCode: string): Promise<SmsDispatchResult> {
    const sanitizedNumber = this.sanitizeNepaliPhone(phone);
    const message = `Your Dhanshree verification code is ${otpCode}. Valid for 5 minutes. Do not share this code with anyone.`;

    // Local / Dev bypass
    if (!SMS_ENABLED) {
      console.log(`\n=================================================`);
      console.log(`[SMS MOCK] Dispatching OTP to: +977-${sanitizedNumber}`);
      console.log(`[SMS MOCK] Message: "${message}"`);
      console.log(`=================================================\n`);

      return {
        success: true,
        provider: 'MOCK',
        recipient: sanitizedNumber,
      };
    }

    // 1. Attempt Primary: Sparrow SMS
    try {
      const sparrowResult = await this.sendViaSparrow(sanitizedNumber, message);
      if (sparrowResult.success) {
        return sparrowResult;
      }
    } catch (sparrowErr: any) {
      console.warn(`[SMS] Sparrow gateway error: ${sparrowErr.message}. Triggering fallback...`);
    }

    // 2. Failover: Aakash SMS
    try {
      const aakashResult = await this.sendViaAakash(sanitizedNumber, message);
      return aakashResult;
    } catch (aakashErr: any) {
      console.error(`[SMS] Both SMS providers failed for ${sanitizedNumber}: ${aakashErr.message}`);
      return {
        success: false,
        provider: 'AAKASH',
        recipient: sanitizedNumber,
        error: aakashErr.message,
      };
    }
  }

  /**
   * Primary Provider: Sparrow SMS (Janaki Technology)
   */
  private static async sendViaSparrow(to: string, text: string): Promise<SmsDispatchResult> {
    const response = await axios.post(
      SPARROW_API_URL,
      null,
      {
        params: {
          token: SPARROW_TOKEN,
          from: SPARROW_SENDER_ID,
          to,
          text,
        },
        timeout: 6000,
      }
    );

    // Sparrow returns response_code: 200 on success
    if (response.data?.response_code === 200 || response.status === 200) {
      return {
        success: true,
        provider: 'SPARROW',
        recipient: to,
        messageId: response.data?.response,
      };
    }

    throw new Error(`Sparrow rejected message: ${JSON.stringify(response.data)}`);
  }

  /**
   * Secondary Provider: Aakash SMS
   */
  private static async sendViaAakash(to: string, text: string): Promise<SmsDispatchResult> {
    const response = await axios.post(
      AAKASH_API_URL,
      {
        auth_token: AAKASH_AUTH_TOKEN,
        to,
        text,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 6000,
      }
    );

    if (response.data?.error === false || response.status === 200) {
      return {
        success: true,
        provider: 'AAKASH',
        recipient: to,
        messageId: response.data?.message,
      };
    }

    throw new Error(`Aakash rejected message: ${JSON.stringify(response.data)}`);
  }
}
