import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { CbolContextService, CbolStatus } from '../cbol-context.service';
import { CbolSummaryRow, VendorStatementSummaryService } from '../Service/vendor-statement-summary.service';

@Component({
  standalone: true,
  selector: 'app-cbol-grid',
  templateUrl: './cbol-grid.component.html',
  styleUrl: './cbol-grid.component.css',
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AgGridAngular,
  ]
})
export class CbolGridComponent implements OnInit, OnDestroy {
  @Input() status: CbolStatus = 'All';

  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;

  rowData: CbolSummaryRow[] = [];
  isLoading = false;

  constructor(
    private cbolContext: CbolContextService,
    private cbolService: VendorStatementSummaryService
  ) { }

  ngOnInit(): void {
    this.cbolContext.invoiceId$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
    this.cbolContext.radioType$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
    this.cbolContext.pageType$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.loadData();
  }

  loadData(): void {
    const invoiceId = this.cbolContext.invoiceId;
    if (!invoiceId) {
      this.rowData = [];
      this.updateSummaryRow();
      return;
    }

    this.isLoading = true;
    if (this.gridApi) this.gridApi.showLoadingOverlay();

    this.cbolService.getCbolSummary({
      invoiceId,
      carrierBol: this.cbolContext.carrierBol,
      chargeCode: this.cbolContext.chargeCode,
      hbl: this.cbolContext.hbl,
      cbolStatus: this.status,
      radioSelection: this.cbolContext.radioType
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.rowData = data || [];
        this.isLoading = false;
        this.updateSummaryRow();
        if (this.gridApi) {
          this.gridApi.hideOverlay();
          if (this.rowData.length === 0) this.gridApi.showNoRowsOverlay();
        }
      },
      error: (err) => {
        console.error('Error loading CBOL summary:', err);
        this.rowData = [];
        this.isLoading = false;
        this.updateSummaryRow();
        if (this.gridApi) this.gridApi.showNoRowsOverlay();
      }
    });
  }

  /** Reflects the in-tab drill-down (cbolReportCellClick) / Invoice-Processing hand-off from ReportTabActivate. */
  onCellClicked(event: CellClickedEvent): void {
    if (event.node.rowPinned) return;
    const field = event.colDef.field;
    const record = event.data as CbolSummaryRow;

    if (field === 'MatchAction') {
      if (this.isCommentEditable(record)) this.matchRow(record, record.Comment);
      return;
    }

    if (field !== 'Carrier_BOL' && field !== 'Containers') return;

    if (this.cbolContext.pageType === 'CBOL') {
      // Top-level: drilling into a Carrier BOL / HBL / Charge Code re-filters this same tab.
      this.cbolContext.setDrillDownValue(record.Carrier_BOL);
      this.cbolContext.setPageType('CC');
      return;
    }

    // Already drilled in — this is the Invoice Processing hand-off.
    const type: 'CC' | 'HBL' | 'CBOL' = this.cbolContext.radioType === 'ByCarrierBol' ? 'CC'
      : this.cbolContext.radioType === 'ByHBL' ? 'HBL' : 'CBOL';

    this.cbolContext.setRecDetails({
      Carrier_BOL: record.Carrier_BOL,
      Containers: record.Containers,
      Type: type,
      pageType: field === 'Containers' ? 'Containers' : 'CbolCC'
    });

    // Invoice Processing subscribes to CbolContextService.recDetails$ (see
    // InvoiceProcessingComponent.ngOnInit) and loads this record's invoice as soon as
    // it's set above; switching the visible tab mirrors the old
    // tabPanel.setActiveTab(9) navigation, adapted to this app's Bootstrap-tab convention.
    (document.getElementById('reports-tab') as HTMLElement | null)?.click();
  }

  /** Row-level "match" action — mirrors CBOLSinCls.processExcelDataToInvDetails. */
  matchRow(record: CbolSummaryRow, comment: string): void {
    this.cbolService.processExcelDataToFlote({
      invoiceId: this.cbolContext.invoiceId,
      carrierBol: this.cbolContext.pageType === 'CC' ? this.cbolContext.carrierBol : record.Carrier_BOL,
      chargeCode: this.cbolContext.chargeCode,
      hbl: this.cbolContext.hbl,
      comments: comment,
      radioSelection: this.cbolContext.radioType
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error processing CBOL match:', err)
    });
  }

  isCommentEditable(record: CbolSummaryRow): boolean {
    return this.cbolContext.pageType === 'CC'
      && this.status === 'NonMatched'
      && record.ChargeUsed !== 'Y'
      && Number(record.Shipment_Count) > 0;
  }

  onCommentSave(record: CbolSummaryRow): void {
    this.matchRow(record, record.Comment);
  }

  numberFormatter(params: ValueFormatterParams): string {
    if (params.value === null || params.value === undefined || params.value === '') return '';
    const num = parseFloat(params.value);
    if (isNaN(num)) return params.value;
    const abs = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num < 0 ? `(${abs})` : abs;
  }

  private toNumber(value: string | undefined): number {
    const n = parseFloat(value || '0');
    return isNaN(n) ? 0 : n;
  }

  private updateSummaryRow(): void {
    if (!this.gridApi) return;
    if (this.rowData.length === 0) {
      this.gridApi.setGridOption('pinnedBottomRowData', []);
      return;
    }

    const totals = this.rowData.reduce((acc, row) => {
      acc.Invoice_Amt += this.toNumber(row.Invoice_Amt);
      acc.E2K_Buy_Amt += this.toNumber(row.E2K_Buy_Amt);
      acc.Diff_Amt += this.toNumber(row.Diff_Amt);
      acc.Sell_Amt += this.toNumber(row.Sell_Amt);
      acc.Net_Amt += this.toNumber(row.Net_Amt);
      acc.Processed_Amt += this.toNumber(row.Processed_Amt);
      acc.UnSelected_Amt += this.toNumber(row.Invoice_Amt) - this.toNumber(row.Processed_Amt);
      return acc;
    }, { Invoice_Amt: 0, E2K_Buy_Amt: 0, Diff_Amt: 0, Sell_Amt: 0, Net_Amt: 0, Processed_Amt: 0, UnSelected_Amt: 0 });

    this.gridApi.setGridOption('pinnedBottomRowData', [{
      Carrier_BOL: 'Total',
      Invoice_Amt: totals.Invoice_Amt.toFixed(2),
      E2K_Buy_Amt: totals.E2K_Buy_Amt.toFixed(2),
      Diff_Amt: totals.Diff_Amt.toFixed(2),
      Sell_Amt: totals.Sell_Amt.toFixed(2),
      Net_Amt: totals.Net_Amt.toFixed(2),
      Processed_Amt: totals.Processed_Amt.toFixed(2),
      UnSelected_Amt: totals.UnSelected_Amt.toFixed(2)
    }]);
  }

  statusIconClass(record: CbolSummaryRow): string {
    if (record.ChargeUsed === 'Y') return 'fa fa-check-circle text-success';
    if (this.status === 'NonMatched') return 'fa fa-exclamation-circle text-warning';
    if (this.status === 'Selected') return 'fa fa-hand-pointer text-info';
    return 'fa fa-info-circle text-secondary';
  }

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Query in progress, please wait...
    </span>`;

  columnDefs: ColDef[] = [
    { headerName: 'Carrier BOL', field: 'Carrier_BOL', width: 140, cellStyle: { textDecoration: 'underline', cursor: 'pointer' } },
    { headerName: 'Containers', field: 'Containers', width: 110, cellStyle: { textDecoration: 'underline', cursor: 'pointer' } },
    {
      headerName: 'Status', field: 'MatchAction', width: 90, sortable: false, filter: false,
      cellRenderer: (p: any) => `<i class="${this.statusIconClass(p.data)}" title="${p.data?.Status || ''}"></i>`,
      cellStyle: (p: any) => this.isCommentEditable(p.data) ? { cursor: 'pointer', textAlign: 'center' } : { textAlign: 'center' }
    },
    { headerName: 'Matched Charge Codes', field: 'Ver_Charge_Code', width: 150 },
    { headerName: 'Non-Matched Charge Codes', field: 'NonVer_charge_code', width: 170 },
    { headerName: 'Selected Charge Codes', field: 'Processed_charge_code', width: 160 },
    { headerName: 'Shipment Count', field: 'Shipment_Count', width: 130 },
    { headerName: 'Container Count', field: 'Container_Count', width: 130 },
    { headerName: 'Invoice Amt', field: 'Invoice_Amt', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'E2K Buy Amt', field: 'E2K_Buy_Amt', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Buy CID Orig', field: 'Buy_Cid_Orig', width: 110 },
    { headerName: 'Diff Amt', field: 'Diff_Amt', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Sell Amt', field: 'Sell_Amt', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Net Amt', field: 'Net_Amt', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Processed Amt', field: 'Processed_Amt', width: 130, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    {
      headerName: 'UnSelected Amt', width: 130, cellStyle: { textAlign: 'right' },
      valueGetter: (p: any) => this.toNumber(p.data?.Invoice_Amt) - this.toNumber(p.data?.Processed_Amt),
      valueFormatter: (p: any) => this.numberFormatter({ ...p, value: String(p.value) })
    },
    { headerName: 'Comment', field: 'Comment', width: 180, editable: (p: any) => this.isCommentEditable(p.data) },
  ];

  exportData() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: `VendorStatementSummary_${this.status}.csv` });
    }
  }
}
