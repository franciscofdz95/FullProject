import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CbolContextService } from '../vendor-statement-summary/cbol-context.service';
import { InvoiceProcessingContextService } from './invoice-processing-context.service';
import { InvoiceProcessingGridComponent } from './invoice-processing-grid/invoice-processing-grid.component';
import { InvoiceChargesDetail, InvoiceProcessingService, VatCode } from './Service/invoice-processing.service';

@Component({
  standalone: true,
  selector: 'app-invoice-processing',
  templateUrl: './invoice-processing.component.html',
  styleUrl: './invoice-processing.component.css',
  imports: [
    CommonModule,
    FormsModule,
    InvoiceProcessingGridComponent
  ]
})
export class InvoiceProcessingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  invoiceIdInput = '';
  details: InvoiceChargesDetail | null = null;
  isLoadingDetails = false;
  verifyMessage = '';

  nonE2kSearch = '';
  nonE2kOptions: any[] = [];
  selectedNonE2k: any = null;

  twhSearch = '';
  twhOptions: any[] = [];
  selectedTwh: any = null;

  constructor(
    public invoiceContext: InvoiceProcessingContextService,
    private cbolContext: CbolContextService,
    private invoiceProcessingService: InvoiceProcessingService
  ) { }

  ngOnInit(): void {
    this.invoiceContext.invoiceId$.pipe(takeUntil(this.destroy$)).subscribe(invoiceId => {
      if (invoiceId) this.loadDetailsAndVat(invoiceId);
      else this.details = null;
    });

    // Completes the CBOL Vendor Statement Summary drill-down hand-off (was a TODO).
    this.cbolContext.recDetails$.pipe(takeUntil(this.destroy$)).subscribe(rec => {
      if (!rec || !this.cbolContext.invoiceId) return;
      this.invoiceIdInput = this.cbolContext.invoiceId;
      this.invoiceContext.load(this.cbolContext.invoiceId, 'CbolCC', {
        invoice_id: this.cbolContext.invoiceId,
        Type: rec.Type,
        pageType: rec.pageType,
        shipment_number: rec.shipment_number
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInvoice(): void {
    const invoiceId = this.invoiceIdInput.trim();
    if (!invoiceId) return;
    this.invoiceContext.load(invoiceId, 'Bills');
  }

  closeInvoice(): void {
    this.invoiceIdInput = '';
    this.invoiceContext.reset();
    this.details = null;
    this.verifyMessage = '';
  }

  private loadDetailsAndVat(invoiceId: string): void {
    this.isLoadingDetails = true;
    this.invoiceProcessingService.getInvoiceChargesDetails({ invoiceId, columnNames: 'All' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.details = data;
          this.isLoadingDetails = false;
          this.invoiceContext.setToCID(data?.Invoice_CID || '');
        },
        error: () => { this.details = null; this.isLoadingDetails = false; }
      });

    this.invoiceProcessingService.getVATCodesBP({ invoiceId, invoiceVATId: '0' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vatCodes: VatCode[]) => this.invoiceContext.setVatListCodes(vatCodes || []),
        error: () => this.invoiceContext.setVatListCodes([])
      });
  }

  get allVariancesZero(): boolean {
    if (!this.details) return false;
    return Number(this.details.Total_Variance || 0) === 0
      && Number(this.details.VAT_Variance || 0) === 0
      && Number(this.details.TWH_Variance || 0) === 0
      && Number(this.details.Charges_Variance || 0) === 0;
  }

  /** Ports Fields.cnt.js's VerifyInvoice handler. */
  verifyInvoice(): void {
    this.verifyMessage = '';
    if (!this.allVariancesZero) {
      this.verifyMessage = 'Cannot verify: variances must be zero before verifying this invoice.';
      return;
    }

    // NOTE: the old ExtJS call used a global "current location code" (PgAtt.getLocation_code())
    // that has no equivalent shared context in this app yet; left blank here — verify against
    // a real invoice and wire in a real location code source if the SP requires it.
    const invoiceId = this.invoiceContext.invoiceId;
    this.invoiceProcessingService.getInvoiceChargeCountByVatId({ invoiceId, locCode: '' })
      .subscribe(count => {
        if (count && count > 0) {
          this.verifyMessage = 'Cannot verify: one or more charges are missing a VAT code.';
          return;
        }

        // NOTE: assuming any returned SCAC rows indicate a mismatch requiring confirmation —
        // the exact match/mismatch comparison lives in the old Fields.cnt.js controller, not
        // yet ported; verify this against real data.
        this.invoiceProcessingService.getSCACCode({ invoiceId }).subscribe(scacRows => {
          const proceed = () => {
            this.invoiceProcessingService.verifyInvoice({
              invoiceId,
              invoiceStatusTo: 'Verified',
              canApprove: 1,
              e2kUserId: ''
            }).subscribe({
              next: () => { this.verifyMessage = 'Invoice verified successfully.'; },
              error: () => { this.verifyMessage = 'Verify failed — please try again.'; }
            });
          };

          if (scacRows && scacRows.length > 0) {
            if (confirm('SCAC code mismatch detected for this invoice. Continue verifying anyway?')) {
              proceed();
            }
          } else {
            proceed();
          }
        });
      });
  }

  /** Ports NonE2kCost.js's combo search. */
  searchNonE2kCost(): void {
    if (!this.nonE2kSearch.trim()) { this.nonE2kOptions = []; return; }
    this.invoiceProcessingService.getNonE2kCost({
      invoiceId: this.invoiceContext.invoiceId,
      description: this.nonE2kSearch
    }).subscribe(rows => this.nonE2kOptions = rows || []);
  }

  insertNonE2kCharge(): void {
    if (!this.selectedNonE2k) return;
    this.invoiceProcessingService.insertNonE2KCharge({
      invoiceId: this.invoiceContext.invoiceId,
      chargeCode: this.selectedNonE2k.charge_code || this.selectedNonE2k.Charge_code,
      description: this.selectedNonE2k.description || this.selectedNonE2k.Description
    }).subscribe(() => {
      this.nonE2kSearch = '';
      this.nonE2kOptions = [];
      this.selectedNonE2k = null;
      this.loadDetailsAndVat(this.invoiceContext.invoiceId);
    });
  }

  /** Ports TaxWHCode.js's combo search. */
  searchTWHCodes(): void {
    this.invoiceProcessingService.getTWHCodes({
      invoiceId: this.invoiceContext.invoiceId,
      currencyCode: this.details?.Invoice_CID
    }).subscribe(rows => this.twhOptions = rows || []);
  }

  insertTaxWithholding(): void {
    if (!this.selectedTwh) return;
    this.invoiceProcessingService.insertTaxWithholding({
      invoiceId: this.invoiceContext.invoiceId,
      twhCode: this.selectedTwh.twh_code || this.selectedTwh.TWHCode,
      description: this.selectedTwh.description || this.selectedTwh.Description,
      currencyCode: this.details?.Invoice_CID
    }).subscribe(() => {
      this.selectedTwh = null;
      this.loadDetailsAndVat(this.invoiceContext.invoiceId);
    });
  }
}
