import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InvoiceProcessingLine, InvoiceProcessingService } from '../Service/invoice-processing.service';

export interface CommentsDialogData {
  record: InvoiceProcessingLine;
  invoiceId: string;
}

@Component({
  standalone: true,
  selector: 'app-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrl: './comments-dialog.component.css',
  imports: [CommonModule, FormsModule, MatDialogModule]
})
export class CommentsDialogComponent implements OnInit {
  reasons: any[] = [];
  showReason = false;

  comment = '';
  reason = '';

  constructor(
    public dialogRef: MatDialogRef<CommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentsDialogData,
    private invoiceProcessingService: InvoiceProcessingService
  ) { }

  ngOnInit(): void {
    this.comment = this.data.record.comment || '';
    this.reason = this.data.record.PaidDifferentlyReason || '';
    // Mirrors IPSingleTonCls.CheckPaidDifferentReason's tolerance rule.
    const r = this.data.record;
    const manTolAmt = Number(r.man_tol_amt || 0);
    const locTolAmt = Number(r.loc_tol_amt || 0);
    const locTolPer = Number(r.loc_tol_per || 0);
    if (r.MBL_fk && r.MBL_fk !== '0' && r.MBL_nbr) {
      this.showReason = manTolAmt >= 250 || manTolAmt <= -250;
    } else if ((!r.MBL_fk || r.MBL_fk === '0') && !r.MBL_nbr) {
      this.showReason = (locTolAmt >= 50 || locTolAmt <= -50) && (locTolPer >= 0.10 || locTolPer <= -0.10);
    }

    if (this.showReason) {
      this.invoiceProcessingService.loadPaidDifferentlyReasons().subscribe({
        next: (rows) => this.reasons = rows || [],
        error: () => this.reasons = []
      });
    }
  }

  save(): void {
    if (!this.comment.trim()) return;
    this.invoiceProcessingService.postInvoiceLine({
      invoiceId: this.data.invoiceId,
      shipmentDimFK: this.data.record.shipment_dim_fk,
      mblFk: this.data.record.MBL_fk,
      shipmentNumber: this.data.record.shpmnt_nbr,
      chargeFk: this.data.record.mbl_chg_fk,
      chargeCode: this.data.record.Charge_code,
      invoiceVATId: this.data.record.invoicevat_id,
      chargeAmt: Number(this.data.record.buy_amt || 0),
      buyCID: this.data.record.buy_cid,
      invoiceCID: this.data.record.invoice_cid,
      comments: this.comment,
      paidDifferentlyReason: this.reason,
      activeFlag: this.data.record.frontCheck === 'true' || this.data.record.frontCheck === '1' ? 1 : 0,
      vatAmt: Number(this.data.record.invoicevat_amt || 0),
      accrualFlag: this.data.record.backCheck === 'true' || this.data.record.backCheck === '1' ? 1 : 0,
      splitAmt: Number(this.data.record.sell_amt || 0),
      convRate: Number(this.data.record.ConvRate || 1),
      rowType: this.data.record.rowtype
    }).subscribe({
      next: () => this.dialogRef.close({ comment: this.comment, reason: this.reason }),
      error: () => this.dialogRef.close(null)
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
