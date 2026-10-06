import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';

export interface LedgerEntry {
  id: string;
  orderNumber: string;
  date: string;
  country: 'NP' | 'IN' | 'AE';
  currency: 'NPR' | 'INR' | 'AED';
  grossAmount: number;
  vatTaxAmount: number;
  taxLabel: string;
  platformFeeAmount: number; // 10% standard or 0% festive
  netVendorPayable: number;
  status: 'HELD_IN_ESCROW' | 'RELEASED_TO_VENDOR' | 'REFUNDED';
  digitalRoot: 5 | 6 | 8;
  paymentGateway: 'eSewa' | 'Khalti' | 'Razorpay' | 'ConnectIPS' | 'COD';
}

export interface FinancialSummary {
  totalGrossRevenue: number;
  totalEscrowHeld: number;
  totalReleasedPayouts: number;
  totalVatTaxCollected: number;
  totalPlatformCommission: number;
  transactionCount: number;
}

export class FinancialAccountingService {
  private initialTransactions: LedgerEntry[] = [
    {
      id: 'TXN-908101',
      orderNumber: 'DHAN-ORD-100234',
      date: '2026-10-06 14:30',
      country: 'NP',
      currency: 'NPR',
      grossAmount: 334400,
      vatTaxAmount: 38470,
      taxLabel: '13% Nepal VAT',
      platformFeeAmount: 0, // 0% festive commission active
      netVendorPayable: 295930,
      status: 'HELD_IN_ESCROW',
      digitalRoot: 5,
      paymentGateway: 'eSewa',
    },
    {
      id: 'TXN-908102',
      orderNumber: 'DHAN-ORD-100235',
      date: '2026-10-06 15:15',
      country: 'NP',
      currency: 'NPR',
      grossAmount: 1203,
      vatTaxAmount: 138,
      taxLabel: '13% Nepal VAT',
      platformFeeAmount: 0,
      netVendorPayable: 1065,
      status: 'RELEASED_TO_VENDOR',
      digitalRoot: 6,
      paymentGateway: 'Khalti',
    },
    {
      id: 'TXN-908103',
      orderNumber: 'DHAN-ORD-100236',
      date: '2026-10-06 16:00',
      country: 'IN',
      currency: 'INR',
      grossAmount: 34999,
      vatTaxAmount: 5338,
      taxLabel: '18% GST (CGST 9% + SGST 9%)',
      platformFeeAmount: 349.99, // 1% Sec 52 TCS
      netVendorPayable: 29311.01,
      status: 'HELD_IN_ESCROW',
      digitalRoot: 5,
      paymentGateway: 'Razorpay',
    },
    {
      id: 'TXN-908104',
      orderNumber: 'DHAN-ORD-100237',
      date: '2026-10-06 16:45',
      country: 'AE',
      currency: 'AED',
      grossAmount: 1450,
      vatTaxAmount: 69,
      taxLabel: '5% Standard VAT',
      platformFeeAmount: 0,
      netVendorPayable: 1381,
      status: 'RELEASED_TO_VENDOR',
      digitalRoot: 6,
      paymentGateway: 'COD',
    },
  ];

  private transactionsSubject = new BehaviorSubject<LedgerEntry[]>(this.initialTransactions);
  public transactions$: Observable<LedgerEntry[]> = this.transactionsSubject.asObservable();

  public summary$: Observable<FinancialSummary> = this.transactions$.pipe(
    map((txns) => {
      let gross = 0;
      let escrow = 0;
      let released = 0;
      let vat = 0;
      let platform = 0;

      for (const t of txns) {
        // Normalize roughly to NPR for cross-border summary display
        const multiplier = t.currency === 'INR' ? 1.6 : t.currency === 'AED' ? 36.5 : 1.0;
        gross += t.grossAmount * multiplier;
        vat += t.vatTaxAmount * multiplier;
        platform += t.platformFeeAmount * multiplier;

        if (t.status === 'HELD_IN_ESCROW') {
          escrow += t.netVendorPayable * multiplier;
        } else if (t.status === 'RELEASED_TO_VENDOR') {
          released += t.netVendorPayable * multiplier;
        }
      }

      return {
        totalGrossRevenue: Math.round(gross),
        totalEscrowHeld: Math.round(escrow),
        totalReleasedPayouts: Math.round(released),
        totalVatTaxCollected: Math.round(vat),
        totalPlatformCommission: Math.round(platform),
        transactionCount: txns.length,
      };
    })
  );

  public releaseEscrowPayout(transactionId: string): void {
    const current = this.transactionsSubject.getValue();
    const updated = current.map((t) => {
      if (t.id === transactionId && t.status === 'HELD_IN_ESCROW') {
        return { ...t, status: 'RELEASED_TO_VENDOR' as const };
      }
      return t;
    });
    this.transactionsSubject.next(updated);
  }
}
