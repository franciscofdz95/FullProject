import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { InvoiceProcessingContextService } from '../invoice-processing-context.service';
import { InvoiceProcessingLine, InvoiceProcessingService } from '../Service/invoice-processing.service';
import { ExchangeRateDialogComponent, ExchangeRateDialogData } from '../exchange-rate-dialog/exchange-rate-dialog.component';
import { CommentsDialogComponent, CommentsDialogData } from '../comments-dialog/comments-dialog.component';

@Component({
  standalone: true,
  selector: 'app-invoice-processing-grid',
  templateUrl: './invoice-processing-grid.component.html',
  styleUrl: './invoice-processing-grid.component.css',
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AgGridAngular,
  ]
})
export class InvoiceProcessingGridComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;

  rowData: InvoiceProcessingLine[] = [];
  isLoading = false;
  radioSelection: 'Selected' | 'Unselected' = 'Unselected';

  constructor(
    public invoiceContext: InvoiceProcessingContextService,
    private invoiceProcessingService: InvoiceProcessingService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.invoiceContext.invoiceId$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.loadData();
  }

  setRadioSelection(value: 'Selected' | 'Unselected'): void {
    this.radioSelection = value;
    this.loadData();
  }

  loadData(): void {
    const invoiceId = this.invoiceContext.invoiceId;
    if (!invoiceId) { this.rowData = []; return; }

    this.isLoading = true;
    if (this.gridApi) this.gridApi.showLoadingOverlay();

    this.invoiceProcessingService.getInvoiceProcessingReport({
      invoiceId,
      radioSelection: this.radioSelection
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.rowData = data || [];
        this.isLoading = false;
        if (this.gridApi) {
          this.gridApi.hideOverlay();
          if (this.rowData.length === 0) this.gridApi.showNoRowsOverlay();
        }
      },
      error: (err) => {
        console.error('Error loading Invoice Processing report:', err);
        this.rowData = [];
        this.isLoading = false;
        if (this.gridApi) this.gridApi.showNoRowsOverlay();
      }
    });
  }

  onCellClicked(event: CellClickedEvent): void {
    if (event.node.rowPinned) return;
    const field = event.colDef.field;
    const record = event.data as InvoiceProcessingLine;

    if (field === 'ExchangeRateAction') {
      if (record.Invoice_detail_id && record.buy_cid !== this.invoiceContext.invoiceCID) {
        this.openExchangeRateDialog(record);
      }
      return;
    }
    if (field === 'CommentsAction') {
      if (record.comment || record.PaidDifferentlyReason) {
        this.openCommentsDialog(record);
      }
      return;
    }
    if (field === 'SplitPaymentAction') {
      this.splitPayment(record);
      return;
    }
    if (field === 'InfoAction') {
      // TODO: Bills detail popup (the other invoice a charge is already logged on)
      // is a separate module that hasn't been migrated to Angular yet.
      console.warn('Invoice Processing: Bills detail hand-off requested, but that module is not yet migrated.', record);
      return;
    }
  }

  onCellValueChanged(record: InvoiceProcessingLine): void {
    this.checkForAmountAndCid(record);
  }

  onFrontCheckChanged(record: InvoiceProcessingLine, checked: boolean): void {
    record.frontCheck = checked ? 'true' : 'false';
    if (!checked) record.backCheck = 'false';
    this.checkForAmountAndCid(record);
  }

  /** Ports IPSingleTonCls.CheckForAmountandCID's post + exchange-rate/comments branching. */
  private checkForAmountAndCid(record: InvoiceProcessingLine): void {
    this.invoiceProcessingService.postInvoiceLine({
      invoiceId: this.invoiceContext.invoiceId,
      shipmentDimFK: record.shipment_dim_fk,
      mblFk: record.MBL_fk,
      shipmentNumber: record.shpmnt_nbr,
      chargeFk: record.mbl_chg_fk,
      chargeCode: record.Charge_code,
      invoiceVATId: record.invoicevat_id,
      chargeAmt: Number(record.buy_amt || 0),
      buyCID: record.buy_cid,
      invoiceCID: record.invoice_cid,
      comments: record.comment,
      paidDifferentlyReason: record.PaidDifferentlyReason,
      activeFlag: record.frontCheck === 'true' ? 1 : 0,
      vatAmt: Number(record.invoicevat_amt || 0),
      accrualFlag: record.backCheck === 'true' ? 1 : 0,
      splitAmt: Number(record.sell_amt || 0),
      convRate: Number(record.ConvRate || 1),
      rowType: record.rowtype
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        if (result?.Invoice_detail_id) record.Invoice_detail_id = result.Invoice_detail_id;

        const buyCidDiffers = !!record.buy_cid && record.buy_cid.length === 3 && record.buy_cid !== this.invoiceContext.invoiceCID;
        if (buyCidDiffers) {
          this.invoiceProcessingService.checkInvoiceCurrency({
            invoiceId: this.invoiceContext.invoiceId,
            fromCID: record.buy_cid
          }).subscribe(cic => {
            if (!cic?.invoice_currency_id) {
              this.openExchangeRateDialog(record);
            } else if (this.getVarianceAmount(record) && !record.comment) {
              this.openCommentsDialog(record);
            }
          });
        } else if (this.getVarianceAmount(record) && !record.comment) {
          this.openCommentsDialog(record);
        }

        if (this.gridApi) this.gridApi.applyTransaction({ update: [record] });
      },
      error: (err) => console.error('Error posting invoice line:', err)
    });
  }

  /** Ports IPSingleTonCls.GetVarianceAmount's tolerance check. */
  private getVarianceAmount(record: InvoiceProcessingLine): boolean {
    const uAmt = Number(record.buy_amt || 0);
    const oldAmt = Number(record.old_amt || 0);
    const exchRate = Number(record.ConvRate || 1) || 1;
    const e2kAmt = oldAmt * exchRate;
    const diff = Math.abs(e2kAmt - uAmt);
    const relDiff = e2kAmt !== 0 ? diff / Math.abs(e2kAmt) : 0;
    const manTolAmt = Number(record.man_tol_amt || 0);
    const locTolAmt = Number(record.loc_tol_amt || 0);
    const locTolPer = Number(record.loc_tol_per || 0);

    if (record.MBL_fk && record.MBL_fk !== '0' && record.MBL_nbr) {
      return manTolAmt <= diff || e2kAmt === 0;
    }
    return e2kAmt === 0 || locTolAmt <= diff || locTolPer <= relDiff;
  }

  private openExchangeRateDialog(record: InvoiceProcessingLine): void {
    const data: ExchangeRateDialogData = {
      record,
      invoiceId: this.invoiceContext.invoiceId,
      fromCID: record.buy_cid,
      toCID: this.invoiceContext.invoiceCID
    };
    this.dialog.open(ExchangeRateDialogComponent, { data, width: '700px', autoFocus: false })
      .afterClosed().subscribe(result => {
        if (result?.convRate) {
          record.ConvRate = String(result.convRate);
          if (this.gridApi) this.gridApi.applyTransaction({ update: [record] });
        }
        this.loadData();
      });
  }

  private openCommentsDialog(record: InvoiceProcessingLine): void {
    const data: CommentsDialogData = { record, invoiceId: this.invoiceContext.invoiceId };
    this.dialog.open(CommentsDialogComponent, { data, width: '500px', autoFocus: false })
      .afterClosed().subscribe(result => {
        if (result) {
          record.comment = result.comment;
          record.PaidDifferentlyReason = result.reason;
          if (this.gridApi) this.gridApi.applyTransaction({ update: [record] });
        }
      });
  }

  /** Ports Grid.js's split-payment (add-16x16.png) action-column handler. */
  private splitPayment(record: InvoiceProcessingLine): void {
    this.invoiceProcessingService.getSplitRemainder({
      shipmentDimFK: record.shipment_dim_fk,
      mblFk: record.MBL_fk,
      chargeFk: record.mbl_chg_fk,
      chargeCode: record.Charge_code
    }).pipe(takeUntil(this.destroy$)).subscribe(result => {
      const copy: InvoiceProcessingLine = {
        ...record,
        buy_amt: String(result?.remainder ?? 0),
        sell_amt: '0',
        frontCheck: 'true',
        Invoice_detail_id: ''
      };
      this.rowData = [...this.rowData, copy];
      if (this.gridApi) {
        this.gridApi.setGridOption('rowData', this.rowData);
        const rowIndex = this.rowData.length - 1;
        setTimeout(() => this.gridApi.startEditingCell({ rowIndex, colKey: 'buy_amt' }), 0);
      }
    });
  }

  numberFormatter(params: ValueFormatterParams): string {
    if (params.value === null || params.value === undefined || params.value === '') return '';
    const num = parseFloat(params.value);
    if (isNaN(num)) return params.value;
    const abs = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num < 0 ? `(${abs})` : abs;
  }

  isBuyFieldsEditable(record: InvoiceProcessingLine): boolean {
    return record.invoice_id === '0' || record.invoice_id === this.invoiceContext.invoiceId;
  }

  onCurrencyEdited(record: InvoiceProcessingLine, newValue: string): void {
    const value = (newValue || '').toUpperCase();
    if (value.length !== 3 || !/^[A-Za-z]+$/.test(value)) {
      record.buy_cid = record.invoice_cid;
      return;
    }
    this.invoiceProcessingService.checkValidCurrency({ currencyCode: value }).subscribe(valid => {
      if (!valid) {
        record.buy_cid = record.invoice_cid;
        if (this.gridApi) this.gridApi.applyTransaction({ update: [record] });
      } else {
        record.buy_cid = value;
        this.checkForAmountAndCid(record);
      }
    });
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
    {
      headerName: '*', field: 'frontCheck', width: 50, sortable: false,
      cellRenderer: (p: any) => `<input type="checkbox" ${p.value === 'true' ? 'checked' : ''} />`,
      onCellClicked: (p: any) => this.onFrontCheckChanged(p.data, p.value !== 'true')
    },
    {
      headerName: '', field: 'InfoAction', width: 90, sortable: false, filter: false,
      cellRenderer: () => `<i class="fa fa-info-circle" style="cursor:pointer" title="On in-process bill"></i>`
    },
    {
      headerName: '', field: 'SplitPaymentAction', width: 40, sortable: false, filter: false,
      cellRenderer: (p: any) => p.data?.invoice_id !== '0' && p.data?.invoice_id !== this.invoiceContext.invoiceId
        ? `<i class="fa fa-plus-square" style="cursor:pointer" title="Split Payment"></i>` : ''
    },
    { headerName: 'Rcvd at date', field: 'rcvd_at_dt', width: 110 },
    { headerName: 'Loc Code', field: 'location_code', width: 90 },
    { headerName: 'Vendor Carrier Code', field: 'vendor_code', width: 130 },
    { headerName: 'MBL Number', field: 'MBL_nbr', width: 110 },
    { headerName: 'CBOL', field: 'mbl_iata_busid', width: 100 },
    { headerName: 'Shipment Number', field: 'shpmnt_nbr', width: 130 },
    { headerName: 'Charge Split', field: 'rev_split', width: 100 },
    {
      headerName: 'VAT', field: 'invoicevat_id', width: 130,
      valueFormatter: (p: any) => {
        const match = this.invoiceContext.vatListCodes.find(v => v.invoicevat_id === p.value);
        return match?.displayVat || '';
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: () => ({ values: this.invoiceContext.vatListCodes.map(v => v.invoicevat_id) }),
      editable: (p: any) => this.isBuyFieldsEditable(p.data)
    },
    { headerName: 'Charge Code', field: 'charge_code_txt', width: 90 },
    { headerName: 'Charge Description', field: 'CHARGE_DESCRIPTION', width: 160 },
    { headerName: 'Sell Amt', field: 'sell_amt', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Sell Curr', field: 'sell_cid', width: 90, cellStyle: { textAlign: 'right' } },
    {
      headerName: 'Buy Amt', field: 'buy_amt', width: 110, cellStyle: { textAlign: 'right' },
      valueFormatter: this.numberFormatter,
      editable: (p: any) => this.isBuyFieldsEditable(p.data)
    },
    {
      headerName: 'Buy Curr', field: 'buy_cid', width: 90, cellStyle: { textAlign: 'right' },
      editable: (p: any) => this.isBuyFieldsEditable(p.data),
      valueSetter: (p: any) => { this.onCurrencyEdited(p.data, p.newValue); return true; }
    },
    {
      headerName: '', field: 'ExchangeRateAction', width: 40, sortable: false, filter: false,
      cellRenderer: (p: any) => p.data?.Invoice_detail_id && p.data?.buy_cid !== this.invoiceContext.invoiceCID
        ? `<i class="fa fa-exchange-alt" style="cursor:pointer" title="Exchange Rate: ${p.data?.ConvRate || ''}"></i>` : ''
    },
    {
      headerName: '', field: 'CommentsAction', width: 40, sortable: false, filter: false,
      cellRenderer: (p: any) => p.data?.comment || p.data?.PaidDifferentlyReason
        ? `<i class="fa fa-comment" style="cursor:pointer" title="${p.data?.comment || ''}"></i>` : ''
    },
    { headerName: 'Bill Amt', field: 'invoice_amt', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    {
      headerName: 'A', field: 'backCheck', width: 40, hide: true, sortable: false,
      cellRenderer: (p: any) => `<input type="checkbox" ${p.value === 'true' ? 'checked' : ''} />`,
      onCellClicked: (p: any) => { p.data.backCheck = p.value === 'true' ? 'false' : 'true'; this.checkForAmountAndCid(p.data); }
    },
    { headerName: 'Paid Differently Reason', field: 'PaidDifferentlyReason', hide: true },
    { headerName: 'MBLFK', field: 'MBL_fk', hide: true },
  ];

  exportData() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'InvoiceProcessing.csv' });
    }
  }
}
