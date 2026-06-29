import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef, ColGroupDef } from 'ag-grid-community';
import { OptionsBarComponent } from '../options-bar/options-bar.component';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Paramlist } from '../../../Models/Paramlist.model';
import { ExecuteService } from '../../../Service/execute.service';
import { billsResultModel } from '../../../Models/BillsResult.model';
import { BillsTParams } from '../../../Models/BillsTParams';
import { BillsService } from '../Services/bills.service';

@Component({
  standalone: true,
  selector: 'app-queued',
  templateUrl: './queued.component.html',
  styleUrl: './queued.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    AgGridAngular,
    OptionsBarComponent,
  ]
})
export class QueuedComponent implements OnInit, OnDestroy {
  @Output() toggleModal = new EventEmitter<void>();
  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;
  billsSubscription !: Subscription;
  private billsService = inject(BillsService);
  errorMessage: string = '';
  isLoading: boolean = false;
  billsList: billsResultModel[] = [];
  filters: BillsTParams = {
    View: '',
    AcctYear: new Date().getFullYear().toString(),
    AcctMonth: (new Date().getMonth() + 1).toString(),
    DisplayCurrency: '',
    LocCode: '',
    InvoiceStatus: 'Queued',
  }
  constructor(private executeService: ExecuteService) {

  }

  ngOnInit(): void {
    //Filter subscription
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        //console.log('tabs: ', event);
        if (event.mainTab === 'Bills' && event.subTab === 'Queued') {
          this.executecall(event.params);
        }
      });

    this.loadData(this.filters);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    console.log('Execute call in Queued');
    // Execute report logic here
    this.filters = {
      AcctYear: params.accountingyearval ? params.accountingyearval.toString() : new Date().getFullYear().toString(),
      AcctMonth: params.accountingmonthval?.toString() || (new Date().getMonth() + 1).toString(),
      DisplayCurrency: params.displaycurrentval?.toString() || '',
      LocCode: params.locationcodeval?.toString() || '',
      InvoiceStatus: params.invoicestatval?.toString() || '',
    };

    // Call loadData with the built filter
    this.loadData(this.filters);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
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

  columnDefs: ColDef[] = [
    { headerName: '', field: 'check', hide: false, width: 110 },
    { headerName: '', field: 'noname' },
    { headerName: 'View', field: 'view', width: 110 },
    { headerName: 'Edit / Scan', field: 'editscan', width: 110 },
    { headerName: 'Bill ID', field: 'invoice_id', width: 110 },
    { headerName: 'Bill Ref Number', field: 'invRefNo', width: 110 },
    { headerName: 'Charge Count', field: 'reference_id', width: 110 },
    { headerName: 'Location Code', field: 'location_Code', width: 110 },
    { headerName: 'Vendor / (Legal) Name', field: 'vendor_name_english', width: 110 },
    { headerName: 'Scan Destination', field: 'scan_dest', width: 110 },
    { headerName: 'Document Image ID', field: 'imageNumber', width: 110 },
    { headerName: 'Modified Date EST (mm/dd/yyyy)', field: 'modifiedDT', width: 110 },
    { headerName: 'Bill Total Amount (Local)', field: 'invoice_amt', width: 110 },
    { headerName: 'Bill Currency', field: 'invoice_CID', width: 110 },
  ];

  exportData() {
    console.log('Exporting data from Queued');
  }

  loadData(filters: BillsTParams): void {
    
    filters.InvoiceStatus = 'Queued';
    this.billsSubscription = this.billsService.getBillsReport(filters).subscribe({
      next: (response) => {
        const dataArray: billsResultModel[] = Array.isArray(response)
          ? response
          : Array.isArray(response)
            ? response
            : [];

        this.billsList = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Queued Bills:', error);
        this.errorMessage = 'There is a problem loading data.';
        this.billsList = [];
        this.isLoading = false;
      }
    });

  }
}
