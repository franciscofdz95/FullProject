import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef, ColGroupDef, ValueFormatterParams, RowClassParams, CellClickedEvent } from 'ag-grid-community';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { Paramlist } from '../../Models/Paramlist.model';
import { ExecuteService } from '../../Service/execute.service';
import { LocationOceanMBLService, LocationOceanMBLFilter } from '../../Service/location-oceanmbl.service';
import { OceanMBLDetailComponent, OceanMBLDetailDialogData } from '../ocean-mbl-detail/ocean-mbl-detail.component';

@Component({
  standalone: true,
  selector: 'app-location-oceanmbl',
  templateUrl: './location-oceanmbl.component.html',
  styleUrl: './location-oceanmbl.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AgGridAngular,
    HttpClientModule
  ],
  providers: [LocationOceanMBLService]
})
export class LocationOceanmblComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi;
  private destroy$ = new Subject<void>();

  rowData: any[] = [];
  isLoading: boolean = false;
  totalRows: number = 0;

  /** Stores the most recent filter used so the detail popup can pass them through. */
  private currentFilters: LocationOceanMBLFilter = {};

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  displayFrom: number = 0;
  displayTo: number = 0;

  constructor(
    private locationOceanMBLService: LocationOceanMBLService,
    private executeService: ExecuteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(1);
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.mainTab === 'Location OCEAN MBL') {
          this.executecall(event.params);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    const filters: LocationOceanMBLFilter = {
      acctYear: params.accountingyearval ? params.accountingyearval.toString() : new Date().getFullYear().toString(),
      acctMonth: params.accountingmonthval === 0 ? 'All' : params.accountingmonthval.toString(),
      displayCurr: params.displaycurrentval?.toString() || 'USD',
      loctype: params.locationtypeval?.toString() || 'DEP',
      origDest: params.origdestval?.toString() || '',
      locCode: params.locationcodeval?.toString() || '',
      origin: params.originval?.toString() || '',
      destination: params.destinationval?.toString() || '',
      startDate: params.startdateval ? new Date(params.startdateval).toISOString() : '',
      endDate: params.enddateval ? new Date(params.enddateval).toISOString() : '',
      mblCostBasis: params.mblcostbasisval?.toString() || '',
      mblNumber: params.mblnumberval?.toString() || '',
      containerNumber: params.containernumberval?.toString() || '',
      shipmentNumber: params.shipmentnumval?.toString() || '',
      carrierBol: params.carrierbolval?.toString() || '',
      chargeStatus: params.chargestatusval?.toString() || '',
      origDestAdv: params.origdestadvval?.toString() || '',
      country: params.countryval?.toString() || ''
    };

    this.loadData(filters);
  }

  loadData(filters?: LocationOceanMBLFilter): void {
    this.isLoading = true;
    this.currentFilters = filters || {};

    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }

    this.locationOceanMBLService.getLocationOceanMBLReport(filters || {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.rowData = data;
          this.totalRows = data.length;
          this.isLoading = false;
          if (this.gridApi) {
            this.gridApi.hideOverlay();
            if (data.length === 0) {
              this.gridApi.showNoRowsOverlay();
            }
            this.gridApi.setGridOption('pinnedBottomRowData', [this.calculateGrandTotal(data)]);
            setTimeout(() => this.gridApi.autoSizeAllColumns(), 100);
          }
        },
        error: (err) => {
          console.error('Error loading Location OCEAN MBL data:', err);
          this.isLoading = false;
          this.rowData = [];
          if (this.gridApi) {
            this.gridApi.showNoRowsOverlay();
          }
        }
      });
  }

  private calculateGrandTotal(data: any[]): any {
    const sumFields = [
      'ShipmentCount',
      'ManifestedSellAmtUSD', 'ManifestedBuyAmtUSD', 'Man_Diff',
      'UnManifestedSellAmtUSD', 'UnManifestedBuyAmtUSD', 'Loc_Diff',
      'BalanceSheetAmtUSD', 'Tot_Diff'
    ];

    const totals: any = { mbl_depart_date: 'Grand Total' };
    sumFields.forEach(field => {
      totals[field] = data.reduce((sum, row) => {
        const val = parseFloat(row[field]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    });
    return totals;
  }

  exportToExcel(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: 'LocationOceanMBLReport.csv'
      });
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.rowData && this.rowData.length > 0) {
      setTimeout(() => this.gridApi.autoSizeAllColumns(), 100);
    }
  }

  /**
   * Open the Ocean MBL Detail modal when the MBL Number hyperlink is clicked.
   * Mirrors ExtJS LocationMBL Report.cnt.js 'colMblNbr' case which did:
   *   var win = Ext.widget('App-View-LocationMBL-OceanMBL-Report');
   *   win.record = record; win.show();
   */
  onCellClicked(event: CellClickedEvent): void {
    if (event.colDef.field !== 'mbl_nbr') { return; }
    if (event.node.rowPinned) { return; }
    const mblNbr = event.data?.mbl_nbr;
    if (!mblNbr) { return; }
    this.openOceanMBLDetail(event.data);
  }

  /** Launch the Ocean MBL Detail modal for the clicked row. */
  private openOceanMBLDetail(record: any): void {
    const data: OceanMBLDetailDialogData = {
      record,
      displayCurrency: this.currentFilters?.displayCurr || 'USD',
      filters: this.currentFilters,
      locationCode: this.currentFilters?.locCode || record?.location_code || '',
      countryCode: this.currentFilters?.country || ''
    };

    this.dialog.open(OceanMBLDetailComponent, {
      data,
      width: '98vw',
      maxWidth: '98vw',
      height: '98vh',
      panelClass: 'ocean-mbl-detail-dialog',
      autoFocus: false
    });
  }

  onPaginationChanged(): void {
    if (this.gridApi) {
      this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      this.totalPages = this.gridApi.paginationGetTotalPages();
      this.pageSize = this.gridApi.paginationGetPageSize();
      this.displayFrom = (this.currentPage - 1) * this.pageSize + 1;
      this.displayTo = Math.min(this.currentPage * this.pageSize, this.totalRows);
    }
  }

  dateFormatter(params: ValueFormatterParams): string {
    if (!params.value) return '';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  numberFormatter(params: ValueFormatterParams): string {
    if (params.value == null || params.value === '') return '';
    const num = parseFloat(params.value);
    if (isNaN(num)) return params.value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getRowClass = (params: RowClassParams): string => {
    if (params.node.rowPinned === 'bottom') {
      return 'grand-total-row';
    }
    return '';
  };

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Query in progress, please wait...
    </span>`;

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    wrapText: false,
    autoHeight: false,
    minWidth: 60,
    cellStyle: { 'white-space': 'nowrap', 'overflow': 'visible', 'text-overflow': 'unset' }
  };

  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'MBL Depart Date', field: 'mbl_depart_date', valueFormatter: this.dateFormatter, width: 140 },
    { headerName: 'Location', field: 'location_code', width: 110 },
    { headerName: 'MBL Origin Port', field: 'mbl_orig_port', width: 130 },
    { headerName: 'MBL Destination Port', field: 'mbl_dest_port', width: 150 },
    {
      headerName: 'MBL Number',
      field: 'mbl_nbr',
      width: 140,
      cellStyle: { color: '#1D598E', textDecoration: 'underline', cursor: 'pointer', 'white-space': 'nowrap' }
    },
    { headerName: 'O/D', field: 'OD_ind', width: 70 },
    { headerName: 'Charge Status', field: 'Charge_Status', width: 110 },
    { headerName: 'Invoice Status', field: 'Invoice_Status', width: 110 },
    { headerName: 'Cost Basis', field: 'mbl_cost_basis', width: 110 },
    { headerName: 'Shipment Count', field: 'ShipmentCount', width: 120, cellStyle: { textAlign: 'right' } },
    {
      headerName: 'Manifested (USD)',
      children: [
        { headerName: 'Sell Amt', field: 'ManifestedSellAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Buy Amt', field: 'ManifestedBuyAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Diff', field: 'Man_Diff', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
      ]
    },
    {
      headerName: 'Un-Manifested (USD)',
      children: [
        { headerName: 'Sell Amt', field: 'UnManifestedSellAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Buy Amt', field: 'UnManifestedBuyAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Diff', field: 'Loc_Diff', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
      ]
    },
    { headerName: 'Balance Sheet (USD)', field: 'BalanceSheetAmtUSD', width: 140, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Total Diff (USD)', field: 'Tot_Diff', width: 130, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
  ];
}
