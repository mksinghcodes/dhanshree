import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderNumber, amount } = await req.json();
    const amountInPaise = Math.round(Number(amount || 100) * 100);
    const razorpayOrderId = `order_rzp_${Date.now()}`;

    return NextResponse.json({
      orderId: razorpayOrderId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_sampleKey123',
      amountInPaise,
      currency: 'INR',
      name: 'Dhanshree India',
      description: `Payment for Order #${orderNumber}`,
      testCredentials: {
        vpa: 'success@razorpay',
        card: '4111 1111 1111 1111',
        cvv: '123',
        otp: '123456',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
