import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderNumber, amount } = await req.json();
    const amountInPaise = Math.round(Number(amount || 100) * 100);
    const razorpayOrderId = `order_rzp_${Date.now()}`;

    const isProduction = process.env.NODE_ENV === 'production';
    const keyId = process.env.RAZORPAY_KEY_ID || (isProduction ? '' : 'rzp_test_sampleKey123');

    if (isProduction && !keyId) {
      return NextResponse.json({ error: 'Razorpay payment gateway not configured in production' }, { status: 500 });
    }

    return NextResponse.json({
      orderId: razorpayOrderId,
      keyId,
      amountInPaise,
      currency: 'INR',
      name: 'Dhanshree India',
      description: `Payment for Order #${orderNumber}`,
      ...(isProduction
        ? {}
        : {
            testCredentials: {
              vpa: 'success@razorpay',
              card: '4111 1111 1111 1111',
              cvv: '123',
              otp: '123456',
            },
          }),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
