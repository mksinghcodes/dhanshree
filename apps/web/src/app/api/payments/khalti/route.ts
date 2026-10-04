import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderNumber, amount } = await req.json();
    const amountInPaisa = Math.round(Number(amount || 100) * 100);
    const pidx = `kht_${orderNumber}_${Date.now()}`;

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const isProduction = process.env.NODE_ENV === 'production';
    const paymentUrl = isProduction
      ? `https://pay.khalti.com/?pidx=${pidx}`
      : `https://test-pay.khalti.com/?pidx=${pidx}`;

    return NextResponse.json({
      pidx,
      paymentUrl,
      amountInPaisa,
      returnUrl: `${baseUrl}/np/orders/${orderNumber}?payment=success&gateway=khalti`,
      ...(isProduction
        ? {}
        : {
            testCredentials: {
              mobile: '9800000000 / 9800000001',
              mpin: '1111',
              otp: '987654',
            },
          }),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
