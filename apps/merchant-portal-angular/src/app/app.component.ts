import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VastuKpiCardComponent } from './components/vastu-kpi-card/vastu-kpi-card.component';
import { TransactionLedgerComponent } from './components/transaction-ledger/transaction-ledger.component';
import { FinancialAccountingService } from './services/financial-accounting.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, VastuKpiCardComponent, TransactionLedgerComponent],
  providers: [FinancialAccountingService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Dhanshree Merchant & Financial Accounting Console';
  public currentFiscalYear = '2083/84 (2026/27)';

  printInvoiceReport(): void {
    window.print();
  }
}
