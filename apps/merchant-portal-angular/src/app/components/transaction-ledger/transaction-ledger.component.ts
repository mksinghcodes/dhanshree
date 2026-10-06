import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialAccountingService, LedgerEntry } from '../../services/financial-accounting.service';

@Component({
  selector: 'app-transaction-ledger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-ledger.component.html',
  styleUrls: ['./transaction-ledger.component.css']
})
export class TransactionLedgerComponent implements OnInit {
  public transactions: LedgerEntry[] = [];
  public selectedCountryFilter: 'ALL' | 'NP' | 'IN' | 'AE' = 'ALL';

  constructor(private financialService: FinancialAccountingService) {}

  ngOnInit(): void {
    this.financialService.transactions$.subscribe((data) => {
      this.transactions = data;
    });
  }

  get filteredTransactions(): LedgerEntry[] {
    if (this.selectedCountryFilter === 'ALL') {
      return this.transactions;
    }
    return this.transactions.filter((t) => t.country === this.selectedCountryFilter);
  }

  setCountryFilter(country: 'ALL' | 'NP' | 'IN' | 'AE'): void {
    this.selectedCountryFilter = country;
  }

  releaseEscrow(id: string): void {
    this.financialService.releaseEscrowPayout(id);
  }
}
