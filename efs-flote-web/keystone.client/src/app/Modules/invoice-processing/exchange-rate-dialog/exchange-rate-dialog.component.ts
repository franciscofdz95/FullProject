import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InvoiceProcessingLine, InvoiceProcessingService } from '../Service/invoice-processing.service';

export interface ExchangeRateDialogData {
  record: InvoiceProcessingLine;
  invoiceId: string;
  fromCID: string;
  toCID: string;
}

@Component({
  standalone: true,
  selector: 'app-exchange-rate-dialog',
  templateUrl: './exchange-rate-dialog.component.html',
  styleUrl: './exchange-rate-dialog.component.css',
  imports: [CommonModule, FormsModule, MatDialogModule]
})
export class ExchangeRateDialogComponent implements OnInit {
  rates: any[] = [];
  isLoading = false;

  fromRate = 0;
  toRate = 0;
  selectedRate: any = null;

  constructor(
    public dialogRef: MatDialogRef<ExchangeRateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExchangeRateDialogData,
    private invoiceProcessingService: InvoiceProcessingService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.invoiceProcessingService.getExchangeRateData({
      invoiceId: this.data.invoiceId,
      fromCID: this.data.fromCID,
      toCID: this.data.toCID,
      shipmentDimFK: this.data.record.shipment_dim_fk,
      mblFk: this.data.record.MBL_fk,
      shipmentNumber: this.data.record.shpmnt_nbr,
      chargeFk: this.data.record.mbl_chg_fk,
      chargeCode: this.data.record.Charge_code
    }).subscribe({
      next: (rows) => { this.rates = rows || []; this.isLoading = false; },
      error: () => { this.rates = []; this.isLoading = false; }
    });
  }

  selectRate(rate: any): void {
    this.selectedRate = rate;
    this.fromRate = 0;
    this.toRate = 0;
  }

  get computedRate(): number {
    if (this.selectedRate) return Number(this.selectedRate.ConvRate ?? this.selectedRate.rate ?? 0);
    if (this.fromRate > 0) return this.toRate / this.fromRate;
    return 0;
  }

  apply(): void {
    const convRate = this.computedRate;
    this.invoiceProcessingService.postInvoiceCurrency({
      invoiceId: this.data.invoiceId,
      fromCID: this.data.fromCID,
      toCID: this.data.toCID,
      fromRate: this.fromRate,
      toRate: this.toRate,
      convRate,
      shipmentDimFK: this.data.record.shipment_dim_fk,
      mblFk: this.data.record.MBL_fk,
      shipmentNumber: this.data.record.shpmnt_nbr,
      chargeFk: this.data.record.mbl_chg_fk,
      chargeCode: this.data.record.Charge_code,
      invoiceDetId: this.data.record.Invoice_detail_id
    }).subscribe({
      next: () => this.dialogRef.close({ convRate }),
      error: () => this.dialogRef.close(null)
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
