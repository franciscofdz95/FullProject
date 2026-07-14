import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CbolContextService, CbolRadioType, CbolStatus } from './cbol-context.service';
import { CbolGridComponent } from './cbol-grid/cbol-grid.component';
import { CbolAggregate, VendorStatementSummaryService } from './Service/vendor-statement-summary.service';

@Component({
  standalone: true,
  selector: 'app-vendor-statement-summary',
  templateUrl: './vendor-statement-summary.component.html',
  styleUrl: './vendor-statement-summary.component.css',
  imports: [
    CommonModule,
    FormsModule,
    CbolGridComponent
  ]
})
export class VendorStatementSummaryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  readonly tabs: CbolStatus[] = ['All', 'Matched', 'NonMatched', 'Selected'];
  activeTab: CbolStatus = 'All';

  invoiceIdInput = '';
  aggregate: CbolAggregate | null = null;
  isLoadingAggregate = false;
  unmatchedComment = '';

  constructor(
    public cbolContext: CbolContextService,
    private cbolService: VendorStatementSummaryService
  ) { }

  ngOnInit(): void {
    this.cbolContext.invoiceId$.pipe(takeUntil(this.destroy$)).subscribe(invoiceId => {
      if (invoiceId) this.loadAggregate(invoiceId);
      else this.aggregate = null;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInvoice(): void {
    const invoiceId = this.invoiceIdInput.trim();
    if (!invoiceId) return;
    this.cbolContext.reset(invoiceId);
    this.activeTab = 'All';
  }

  loadAggregate(invoiceId: string): void {
    this.isLoadingAggregate = true;
    this.cbolService.getCbolAggregateData(invoiceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.aggregate = data; this.isLoadingAggregate = false; },
        error: (err) => { console.error('Error loading CBOL aggregate data:', err); this.aggregate = null; this.isLoadingAggregate = false; }
      });
  }

  setActiveTab(tab: CbolStatus): void {
    this.activeTab = tab;
  }

  tabLabel(tab: CbolStatus): string {
    const label = tab === 'NonMatched' ? 'Non-Matched' : tab;
    if (!this.aggregate) return label;
    const count = tab === 'All' ? this.aggregate.All
      : tab === 'Matched' ? this.aggregate.Matched
      : tab === 'NonMatched' ? this.aggregate.NonMatched
      : this.aggregate.Selected;
    return count ? `${label} (${count})` : label;
  }

  get hasMatchedCharges(): boolean {
    return !!this.aggregate && Number(this.aggregate.Matched) > 0;
  }

  get isDrilledIn(): boolean {
    return this.cbolContext.pageType === 'CC';
  }

  get showUnmatchedConfirmBar(): boolean {
    return this.activeTab === 'NonMatched' && this.isDrilledIn;
  }

  setRadioType(type: CbolRadioType): void {
    this.cbolContext.setRadioType(type);
  }

  backToSummary(): void {
    this.cbolContext.clearDrillDown();
  }

  closeInvoice(): void {
    this.invoiceIdInput = '';
    this.cbolContext.reset('');
    this.aggregate = null;
  }

  /** Mirrors the TBar "Process All Matched Charges" bulk action. */
  processAllMatchedCharges(): void {
    this.cbolService.processExcelDataToFlote({
      invoiceId: this.cbolContext.invoiceId,
      carrierBol: this.cbolContext.carrierBol,
      chargeCode: this.cbolContext.chargeCode,
      hbl: this.cbolContext.hbl,
      radioSelection: this.cbolContext.radioType
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loadAggregate(this.cbolContext.invoiceId),
      error: (err) => console.error('Error processing all matched charges:', err)
    });
  }

  /** Mirrors the BBar "Confirm Unmatched Charges" action. */
  confirmUnmatchedCharges(): void {
    if (!this.unmatchedComment.trim()) return;
    this.cbolService.processExcelDataToFlote({
      invoiceId: this.cbolContext.invoiceId,
      carrierBol: this.cbolContext.carrierBol,
      chargeCode: this.cbolContext.chargeCode,
      hbl: this.cbolContext.hbl,
      comments: this.unmatchedComment,
      radioSelection: this.cbolContext.radioType
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.unmatchedComment = '';
        this.loadAggregate(this.cbolContext.invoiceId);
      },
      error: (err) => console.error('Error confirming unmatched charges:', err)
    });
  }
}
