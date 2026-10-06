import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialAccountingService, FinancialSummary } from '../../services/financial-accounting.service';

@Component({
  selector: 'app-vastu-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vastu-kpi-card.component.html',
  styleUrls: ['./vastu-kpi-card.component.css']
})
export class VastuKpiCardComponent implements OnInit {
  public summary: FinancialSummary = {
    totalGrossRevenue: 0,
    totalEscrowHeld: 0,
    totalReleasedPayouts: 0,
    totalVatTaxCollected: 0,
    totalPlatformCommission: 0,
    transactionCount: 0
  };

  constructor(private financialService: FinancialAccountingService) {}

  ngOnInit(): void {
    this.financialService.summary$.subscribe((res) => {
      this.summary = res;
    });
  }
}
