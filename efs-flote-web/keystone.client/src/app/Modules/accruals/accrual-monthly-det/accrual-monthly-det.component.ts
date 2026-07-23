import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { Paramlist } from '../../../Models/Paramlist.model';
import { ExecuteService } from '../../../Service/execute.service';
import { AccrualService, AccrualFilter } from '../Service/accrual.service';

@Component({
  standalone: true,
  selector: 'app-accrual-monthly-det',
  templateUrl: './accrual-monthly-det.component.html',
  styleUrl: './accrual-monthly-det.component.css',
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AgGridAngular,
  ]
})
export class AccrualMonthlyDetComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;

  rowData: any[] = [];
  isLoading: boolean = false;
  totalRows: number = 0;

  constructor(private executeService: ExecuteService, private accrualService: AccrualService) {

  }

  ngOnInit(): void {
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.mainTab === 'Accruals' && event.subTab === 'Accrual Monthly Details') {
          this.executecall(event.params);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    const filters: AccrualFilter = {
      acctYear: params.accountingyearval ? params.accountingyearval.toString() : new Date().getFullYear().toString(),
      acctMonth: params.accountingmonthval ? params.accountingmonthval.toString() : (new Date().getMonth() + 1).toString(),
      displayCurr: params.displaycurrentval?.toString() || '',
      locCode: params.locationcodeval?.toString() || ''
    };

    this.loadData(filters);
  }

  loadData(filters: AccrualFilter): void {
    this.isLoading = true;

    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }

    this.accrualService.getAccrualMonthlyDetailReport(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.rowData = this.removeBlankRows(data);
          this.totalRows = this.rowData.length;
          this.isLoading = false;
          if (this.gridApi) {
            this.gridApi.hideOverlay();
            if (this.rowData.length === 0) {
              this.gridApi.showNoRowsOverlay();
            }
          }
        },
        error: (err) => {
          console.error('Error loading Accrual Monthly Details:', err);
          this.rowData = [];
          this.totalRows = 0;
          this.isLoading = false;
          if (this.gridApi) {
            this.gridApi.showNoRowsOverlay();
          }
        }
      });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  /** Fields the stored procedure always populates for pagination, even on the trailing blank row it appends. */
  private static readonly META_FIELDS = ['ROWNUMBER', 'TotalRows'];

  /** Drop fully-empty rows the stored procedure sometimes appends (all real fields null/blank). */
  private removeBlankRows(data: any[]): any[] {
    return (data || []).filter(row =>
      Object.entries(row).some(([key, v]) =>
        !AccrualMonthlyDetComponent.META_FIELDS.includes(key) && v !== null && v !== undefined && v !== ''
      )
    );
  }

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Query in progress, please wait...
    </span>`;

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  numberFormatter(params: ValueFormatterParams): string {
    if (params.value === null || params.value === undefined || params.value === '') return '';
    const num = parseFloat(params.value);
    if (isNaN(num)) return params.value;
    const abs = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num < 0 ? `(${abs})` : abs;
  }

  invoiceStatusFormatter(params: ValueFormatterParams): string {
    return params.value === null || params.value === undefined || params.value === '' ? 'NULL' : params.value;
  }

  columnDefs: ColDef[] = [
    { headerName: 'Rcvd At Date (mm-dd-yyyy)', field: 'RCVD_AT_DATE', width: 130 },
    { headerName: 'Depart Date (mm-dd-yyyy)', field: 'DEPART_DATE', width: 130 },
    { headerName: 'Year', field: 'acctg_per_year', width: 90 },
    { headerName: 'Month', field: 'acctg_per_month', width: 90 },
    { headerName: 'Shipment Number', field: 'shipment_nbr', width: 130 },
    { headerName: 'Shipment Dim FK', field: 'shipment_dim_fk', width: 130 },
    { headerName: 'Orig. Loc.', field: 'ORIG_TP', width: 100 },
    { headerName: 'Orig. CC', field: 'ORIG_CC', width: 100 },
    { headerName: 'Dest. Loc.', field: 'DEST_TP', width: 100 },
    { headerName: 'Dest. CC', field: 'DEST_CC', width: 100 },
    { headerName: 'Charge Code', field: 'CHARGE_CODE', width: 110 },
    { headerName: 'Service Code', field: 'SERVICE_CODE', width: 110 },
    { headerName: 'COMP.', field: 'company_code', width: 90 },
    { headerName: 'JRNL Date (yyyy-mm-dd)', field: 'jrnl_date', width: 130 },
    { headerName: 'ACC.', field: 'account_code', width: 100 },
    { headerName: 'PROD.', field: 'product', width: 100 },
    { headerName: 'Center', field: 'center_code', width: 100 },
    { headerName: 'Oper.', field: 'opstypecode', width: 100 },
    { headerName: 'RRDD', field: 'rrdd_code', width: 90 },
    { headerName: 'Captured Info', field: 'Captured_Info_DEF', width: 120 },
    { headerName: 'STAT EXP AMT', field: 'STAT_AMOUNT', width: 130, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Debit', field: 'ORA_LOCAL_AMOUNT_DR', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Credit', field: 'ORA_LOCAL_AMOUNT_CR', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'CID', field: 'ORA_CURRENCY_CODE', width: 90 },
    { headerName: 'Rev Split', field: 'REV_SPLIT', width: 100 },
    { headerName: 'Cost Loc.', field: 'COST_LOC_CODE', width: 110 },
    { headerName: 'Rev Amt.', field: 'SELL_AMT_LOCAL', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Vendor Code', field: 'vendor_code', width: 110 },
    { headerName: 'Vendor Name', field: 'vendor_name', width: 160 },
    { headerName: 'Carrier BOL', field: 'Carrier_Bol', width: 110 },
    { headerName: 'EPA LOC.', field: 'EPA_LOC', width: 100 },
    { headerName: 'EPA CC.', field: 'EPA_CC', width: 100 },
    { headerName: 'Notes', field: 'Notes', width: 160 },
    { headerName: 'Charge Description', field: 'charge_Description', width: 180 },
    { headerName: 'Ship Period', field: 'Ship_period', width: 110 },
    { headerName: 'Invoice Status', field: 'Invoice_Status', width: 120, valueFormatter: this.invoiceStatusFormatter },
  ];

  exportData() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'AccrualMonthlyDetails.csv' });
    }
  }
}
