import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef, GridApi, GridReadyEvent, ValueFormatterParams, RowClassParams, CellClickedEvent } from 'ag-grid-community';
import { LocalShipmentService, LocalShipmentFilter } from './Service/local-shipment.service';
import { Paramlist } from '../../Models/Paramlist.model';
import { ExecuteService } from '../../Service/execute.service';
import { HttpClientModule } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { Subject, takeUntil } from 'rxjs';
import { ShipmentDetailComponent, ShipmentDetailDialogData } from '../shipment-detail/shipment-detail.component';

@Component({
  standalone: true,
  selector: 'app-local-shipment',
  templateUrl: './local-shipment.component.html',
  styleUrl: './local-shipment.component.css',
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
  providers: [LocalShipmentService]
})
export class LocalShipmentComponent implements OnInit, OnDestroy {

  private gridApi!: GridApi;
  private destroy$ = new Subject<void>();
  rowData: any[] = [];
  isLoading: boolean = false;
  totalRows: number = 0;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  displayFrom: number = 0;
  displayTo: number = 0;

  // Filter inputs that can be set from parent navigation
  @Input() filters: LocalShipmentFilter = {};

    constructor(
      private localShipmentService: LocalShipmentService,
      private executeService: ExecuteService,
      private dialog: MatDialog,
      private authService: MsalService
    ) {}

    ngOnInit(): void {
        //// Validate component name
        this.executeService.execute$
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                //console.log('tabs: ', event);
                if (event.mainTab === 'Local Shipment') {
                    this.executecall(event.params);
                }
            });
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    executecall(params: Paramlist): void {
        console.log('Execute call in Local Shipment with params:', params);

        // Build the LocalShipmentFilter from the generic Paramlist
        // Maps all 5 sidebar fields + relevant advanced filter fields
        const filters: LocalShipmentFilter = {
          // Primary filters (sidebar)
          acctYear: params.accountingyearval ? params.accountingyearval.toString() : new Date().getFullYear().toString(),
          acctMonth: params.accountingmonthval === 0 ? 'All' : params.accountingmonthval.toString(),
          displayCurr: params.displaycurrentval?.toString() || 'USD',
          loctype: params.locationtypeval?.toString() || 'DEP',
          locCode: params.locationcodeval?.toString() || '',
          // Advanced filters (from popup)
          locCountry: params.countryval?.toString() || '',
          serviceCode: params.servicecodeval?.toString() || '',
          chargeStatus: params.chargestatusval?.toString() || '',
          shipmentNumber: params.shipmentnumval?.toString() || '',
          rcvdAtDate: this.toIsoDate(params.receiveddateval),
          startDate: this.toIsoDate(params.startdateval),
          endDate: this.toIsoDate(params.enddateval),
          origDest: params.origdestadvval?.toString() || '',
          origin: params.originval?.toString() || '',
          destination: params.destinationval?.toString() || ''
        };

        // Call loadData with the built filter
        this.loadData(filters);
    }

    /**
     * Safely convert a (possibly null/blank) date filter value to an ISO
     * string. Date fields are blank by default (matching old ExtJS), so a
     * null/empty value must map to '' and never to today's date. Also tolerates
     * the datepicker emitting a Date, a moment-like object, or a string.
     */
    private toIsoDate(value: any): string {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        const d = value instanceof Date ? value : new Date(value);
        return isNaN(d.getTime()) ? '' : d.toISOString();
    }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    // Auto-size columns if data already loaded
    if (this.rowData && this.rowData.length > 0) {
      setTimeout(() => this.gridApi.autoSizeAllColumns(), 100);
    }
  }

  /**
   * Open the Shipment Detail modal when the Shipment Number hyperlink is clicked.
   * Mirrors old ExtJS LocationShipment Report.cnt.js 'colShpNbrLS' case which did:
   *   var win = Ext.widget('App-View-ShipmentSummary-Report'); win.rec = record; win.show();
   */
  onCellClicked(event: CellClickedEvent): void {
    if (event.colDef.field !== 'shpmnt_nbr') { return; }
    if (event.node.rowPinned) { return; } // ignore grand-total row
    const shpNbr = event.data?.shpmnt_nbr;
    if (!shpNbr) { return; }
    this.openShipmentDetail(event.data);
  }

  /** Launch the Shipment Detail modal for a given Local Shipment grid row. */
  private openShipmentDetail(record: any): void {
    const userName = this.authService.instance.getActiveAccount()?.username
      || this.authService.instance.getAllAccounts()[0]?.username
      || '';

    const data: ShipmentDetailDialogData = {
      record,
      displayCurrency: this.filters?.displayCurr || 'USD',
      locationCode: this.filters?.locCode || record?.location_code || '',
      countryCode: this.filters?.locCountry || '',
      userName
    };

    this.dialog.open(ShipmentDetailComponent, {
      data,
      width: '98vw',
      maxWidth: '98vw',
      height: '98vh',
      panelClass: 'shipment-detail-dialog',
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

  /**
   * Called from the navigation component when "Go" is clicked
   */
  loadData(filters?: LocalShipmentFilter): void {
    console.log('LocalShipmentComponent.loadData called with filters:', filters);
    if (filters) {
      this.filters = filters;
    }

    this.isLoading = true;
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }

    console.log('Calling localShipmentService.getLocalShipmentReport...');
    this.localShipmentService.getLocalShipmentReport(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Local shipment data received:', data?.length, 'rows');
          this.rowData = data;
          this.totalRows = data.length;
          this.isLoading = false;
          if (this.gridApi) {
            this.gridApi.hideOverlay();
            if (data.length === 0) {
              this.gridApi.showNoRowsOverlay();
            }
            // Pin grand total as bottom row (values in their respective columns)
            this.gridApi.setGridOption('pinnedBottomRowData', [this.calculateGrandTotal(data)]);
            // Auto-size columns to fit content
            setTimeout(() => this.gridApi.autoSizeAllColumns(), 100);
          }
        },
        error: (err) => {
          console.error('Error loading local shipment data:', err);
          this.isLoading = false;
          this.rowData = [];
          if (this.gridApi) {
            this.gridApi.showNoRowsOverlay();
          }
        }
      });
  }

  /** Calculate grand totals for numeric columns (pinned bottom row like old ExtJS) */
  private calculateGrandTotal(data: any[]): any {
    const sumFields = [
      'SHIPMENT_TEU', 'Cubic_mtrs', 'ChargeCount',
      'ManifestedSellAmtUSD', 'ManifestedBuyAmtUSD', 'Man_Diff',
      'UnManifestedSellAmtUSD', 'UnManifestedBuyAmtUSD', 'Loc_Diff',
      'Orig_Net', 'Dest_Net', 'Tot_Diff'
    ];

    const totals: any = { rcvd_at_dt: 'Grand Total' };
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
        fileName: 'LocalShipmentReport.csv'
      });
    }
  }

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

  /** Format date string to mm/dd/yyyy */
  dateFormatter(params: ValueFormatterParams): string {
    if (!params.value) return '';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /** Format numbers with commas and 2 decimals */
  numberFormatter(params: ValueFormatterParams): string {
    if (params.value == null || params.value === '') return '';
    const num = parseFloat(params.value);
    if (isNaN(num)) return params.value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** Highlight the pinned bottom (grand total) row */
  getRowClass = (params: RowClassParams): string => {
    if (params.node.rowPinned === 'bottom') {
      return 'grand-total-row';
    }
    return '';
  };

  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Rcvd at date', field: 'rcvd_at_dt', hide: false, valueFormatter: this.dateFormatter, width: 120 },
    { headerName: 'Location code', field: 'location_code', width: 100 },
    { headerName: 'Orig.', field: 'orig_tp', width: 70 },
    { headerName: 'Dest.', field: 'dest_tp', width: 70 },
    { headerName: 'Shipment Number', field: 'shpmnt_nbr', width: 120,
      cellClass: 'shipment-link-cell',
      cellRenderer: (params: any) => {
        if (params.node.rowPinned) { return params.value ?? ''; }
        const v = params.value ?? '';
        return v ? `<a class="shipment-link" href="javascript:void(0)">${v}</a>` : '';
      }
    },
    { headerName: 'O/D', field: 'OD_ind', width: 55 },
    { headerName: 'I/U', field: 'Charge_Status', width: 55 },
    { headerName: 'O/A', field: 'Invoice_Status', width: 55 },
    { headerName: 'Service', field: 'service_code', width: 80 },
    { headerName: 'Status', field: 'Status_Code', width: 80 },
    { headerName: 'Teu / Cont.', field: 'SHIPMENT_TEU', width: 90, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'M3', field: 'Cubic_mtrs', width: 80, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Customer Group', field: 'CUSTOMER_GROUP', minWidth: 150 },
    { headerName: 'Shipper', field: 'SHIPPER_NAME', minWidth: 200 },
    { headerName: 'Consignee', field: 'CONSIGNEE_NAME', minWidth: 200 },
    { headerName: 'Freight Payer', field: 'CUST_NAME', minWidth: 200 },
    { headerName: 'Charge Count', field: 'ChargeCount', width: 100, cellStyle: { textAlign: 'right' } },
    {
      headerName: 'Manifested (USD)',
      children: [
        { headerName: 'Sell Amt', field: 'ManifestedSellAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Buy Amt', field: 'ManifestedBuyAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Diff', field: 'Man_Diff', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
      ]
    },
    {
      headerName: 'Local (USD)',
      children: [
        { headerName: 'Sell Amt', field: 'UnManifestedSellAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Buy Amt', field: 'UnManifestedBuyAmtUSD', width: 120, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
        { headerName: 'Diff', field: 'Loc_Diff', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
      ]
    },
    { headerName: 'Orig. Net', field: 'Orig_Net', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Dest. Net', field: 'Dest_Net', width: 110, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
    { headerName: 'Total Diff Amt (USD)', field: 'Tot_Diff', width: 150, valueFormatter: this.numberFormatter, cellStyle: { textAlign: 'right' } },
  ];
}
