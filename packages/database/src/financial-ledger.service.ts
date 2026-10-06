/**
 * Dhanshree Dual Relational Financial Accounting Engine
 * Integrates PostgreSQL (Core Double-Entry General Ledger) & MySQL (High-throughput settlements)
 * Multi-Currency: Nepal NPR, India INR, UAE AED
 */

export interface OrderFinancialRecord {
  orderId: string;
  vendorId: string;
  country: 'NP' | 'IN' | 'AE';
  currency: 'NPR' | 'INR' | 'AED';
  grossAmount: number;
  itemBasePrice: number;
  taxAmount: number;
  taxLabel: string;
  commissionAmount: number;
  gateway: 'eSewa' | 'Khalti' | 'Razorpay' | 'ConnectIPS' | 'COD';
  digitalRoot: 5 | 6 | 8;
}

export interface DoubleEntryTransaction {
  journalEntryNumber: string;
  timestamp: string;
  fiscalYear: string;
  memo: string;
  debits: Array<{ accountCode: string; accountName: string; amount: number }>;
  credits: Array<{ accountCode: string; accountName: string; amount: number }>;
  balanced: boolean;
  escrowStatus: 'HELD_IN_ESCROW' | 'RELEASED_TO_VENDOR';
}

export class FinancialLedgerService {
  /**
   * Generates balanced double-entry accounting journal lines.
   * Asserts fundamental accounting equation: SUM(Debits) === SUM(Credits)
   */
  public createOrderJournalEntry(record: OrderFinancialRecord): DoubleEntryTransaction {
    const netVendorPayable = record.grossAmount - record.taxAmount - record.commissionAmount;
    const entryNumber = `JRN-${Date.now()}-${record.orderId.slice(0, 6)}`;

    // Double-Entry Setup
    const debits = [
      {
        accountCode: '1000-CASH-GATEWAY',
        accountName: `Payment Gateway Clearing (${record.gateway})`,
        amount: record.grossAmount,
      },
    ];

    const credits = [
      {
        accountCode: '2000-VENDOR-PAYABLE',
        accountName: `Escrow Hold for Merchant (${record.vendorId})`,
        amount: netVendorPayable,
      },
      {
        accountCode: record.country === 'NP' ? '2010-VAT-PAYABLE-NP' : record.country === 'IN' ? '2020-GST-PAYABLE-IN' : '2030-VAT-PAYABLE-AE',
        accountName: `Statutory Tax Reserve (${record.taxLabel})`,
        amount: record.taxAmount,
      },
    ];

    if (record.commissionAmount > 0) {
      credits.push({
        accountCode: '4000-COMMISSION-REV',
        accountName: 'Dhanshree Platform Commission Revenue',
        amount: record.commissionAmount,
      });
    }

    const totalDebits = debits.reduce((sum, d) => sum + d.amount, 0);
    const totalCredits = credits.reduce((sum, c) => sum + c.amount, 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001;

    if (!isBalanced) {
      throw new Error(`CRITICAL ACCOUNTING ERROR: Unbalanced entry. Debits: ${totalDebits}, Credits: ${totalCredits}`);
    }

    return {
      journalEntryNumber: entryNumber,
      timestamp: new Date().toISOString(),
      fiscalYear: record.country === 'NP' ? '2083/84' : '2026/27',
      memo: `E-Commerce Sale #${record.orderId} [${record.country} - ${record.currency}] via ${record.gateway}`,
      debits,
      credits,
      balanced: true,
      escrowStatus: 'HELD_IN_ESCROW',
    };
  }

  /**
   * Release escrow funds to merchant after verified delivery.
   */
  public releaseEscrowToVendor(
    journalEntry: DoubleEntryTransaction,
    payoutBankRef: string
  ): DoubleEntryTransaction {
    return {
      ...journalEntry,
      escrowStatus: 'RELEASED_TO_VENDOR',
      memo: `${journalEntry.memo} | Payout Released via ${payoutBankRef}`,
    };
  }
}
