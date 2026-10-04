import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TabbyPaymentAdapter {
  private readonly logger = new Logger(TabbyPaymentAdapter.name);

  createBnplSession(orderNumber: string, amountAed: number) {
    const sessionId = `tabby_sess_${orderNumber}_${Date.now()}`;
    const installmentAmount = (amountAed / 4).toFixed(2);

    this.logger.log(
      `Created Tabby 4-month BNPL session for ${orderNumber}, installment: 4x AED ${installmentAmount}`,
    );

    return {
      sessionId,
      webUrl: `https://checkout.tabby.ai/?sessionId=${sessionId}`,
      installments: 4,
      installmentAmount: Number(installmentAmount),
      termsText: 'Pay 25% today, and 3 equal monthly payments automatically.',
    };
  }
}
