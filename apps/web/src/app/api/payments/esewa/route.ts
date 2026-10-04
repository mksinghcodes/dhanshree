import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { orderNumber, amount } = await req.json();

    const merchantCode = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
    const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
    const esewaUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    const transactionUuid = `${orderNumber || 'ORD-' + Date.now()}-${Date.now().toString().slice(-4)}`;
    const totalAmount = Number(amount || 100).toFixed(2);
    const productCode = merchantCode;

    // eSewa EPAY v2 HMAC-SHA256 signature
    const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureString)
      .digest('base64');

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const formFields = {
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${baseUrl}/np/orders/${orderNumber}?payment=success`,
      failure_url: `${baseUrl}/np/orders/${orderNumber}?payment=failed`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    };

    return NextResponse.json({
      actionUrl: esewaUrl,
      fields: formFields,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
