import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { ExecuteService } from '../../../Service/execute.service';
import { Subject, takeUntil } from 'rxjs';
import { Paramlist } from '../../../Models/Paramlist.model';
import { AccrualService, AccrualFilter } from '../Service/accrual.service';

@Component({
  standalone: true,
  selector: 'app-accrual-accuracy-rep',
  templateUrl: './accrual-accuracy-rep.component.html',
  styleUrl: './accrual-accuracy-rep.component.css',
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AgGridAngular,
  ]
})
export class AccrualAccuracyRepComponent implements OnInit, OnDestroy {

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
        if (event.mainTab === 'Accruals' && event.subTab === 'Accrual Accuracy Report') {
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

    this.accrualService.getAccrualAccuracyReport(filters)
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
          console.error('Error loading Accrual Accuracy Report:', err);
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

  /** Drop fully-empty rows the stored procedure sometimes appends (all fields null/blank). */
  private removeBlankRows(data: any[]): any[] {
    return (data || []).filter(row => Object.values(row).some(v => v !== null && v !== undefined && v !== ''));
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

  columnDefs: ColDef[] = [
    { headerName: 'Year', field: 'acctg_per_year', width: 100 },
    { headerName: 'Month', field: 'acctg_per_month', width: 100 },
    { headerName: 'Region', field: 'Region', width: 110 },
    { headerName: 'District', field: 'District', width: 110 },
    { headerName: 'Location', field: 'Location_code', width: 110 },
    { headerName: 'Amount Paid', field: 'AmountPaid', width: 130, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Amount Accrued', field: 'AmountAccrued', width: 140, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Diff. Amount', field: 'DiffAmount', width: 130, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Overall % Accuracy', field: 'OverallPercentageAccuracy', width: 150, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'ABS Diff.', field: 'ABSDiff', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'ABS % Accuracy', field: 'ABSPercentageAccuracy', width: 140, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } }
  ];

  exportData() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'AccrualAccuracyReport.csv' });
    }
  }
}
