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
import { billsPaymentsResultModel, billsResultModel } from '../../../Models/BillsResult.model';
import { BillsTParams } from '../../../Models/BillsTParams';
import { BillsService } from '../Services/bills.service';

@Component({
  standalone: true,
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css',
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
export class PaymentDetailsComponent implements OnInit, OnDestroy {
  @Output() toggleModal = new EventEmitter<void>();
  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;
  billsSubscription !: Subscription;
  private billsService = inject(BillsService);
  errorMessage: string = '';
  isLoading: boolean = false;
  billsList: billsPaymentsResultModel[] = [];
  filters: BillsTParams = {
    View: '',
    AcctYear: new Date().getFullYear().toString(),
    AcctMonth: (new Date().getMonth() + 1).toString(),
    DisplayCurrency: '',
    LocCode: '',
    InvoiceStatus: 'All',
    PaidStatus: 'All'
  }
  constructor(private executeService: ExecuteService) {

  }

  ngOnInit(): void {
    ////Filter subscription
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        //console.log('tabs: ', event);
        if (event.mainTab === 'Bills' && event.subTab === 'Payment Details') {
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
    console.log('Execute call in Bills - Payments');
    // Execute report logic here
    this.filters = {
      AcctYear: params.accountingyearval ? params.accountingyearval.toString() : new Date().getFullYear().toString(),
      AcctMonth: params.accountingmonthval ? params.accountingmonthval.toString() : (new Date().getMonth() + 1).toString(),
      DisplayCurrency: params.displaycurrentval?.toString() || '',
      LocCode: params.locationcodeval?.toString() || '',
      InvoiceStatus: params.invoicestatval?.toString() || '',
      PaidStatus: params.paidstatusval?.toString() || 'All'
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
    { headerName: 'Location Code', field: 'location_Code', width: 110 },
    { headerName: 'Bill Ref Number', field: 'invRefNo', width: 110 },
    { headerName: 'Bill ID', field: 'invoice_Id', width: 110 },
    { headerName: 'Invoice Status', field: 'invoice_Status', width: 110 },
    { headerName: 'Supplier Num', field: 'vendor_Num', width: 110 },
    { headerName: 'Supplier Name', field: 'vendor_Name', width: 110 },

    { headerName: 'Supplier Site', field: 'site_Code', width: 110 },
    { headerName: 'Document Image ID', field: 'invoice_Image_Num', width: 110 },
    { headerName: 'Payment Status', field: 'payment_Status', width: 110 },
    {
      headerName: 'Payment Date', field: 'check_Date', width: 110,
      valueFormatter: (params) => {
        const value = params.value;
        return value === '0001-01-01' || value === '0001-01-01T00:00:00'
          ? ''
          : value;
      }
    },

    { headerName: 'Amount Paid', field: 'payment_Amount', width: 110 },
    { headerName: 'Payment Currency', field: 'check_Currency_Code', width: 110 },
    { headerName: 'Payment Method', field: 'payment_Method', width: 110 },
    { headerName: 'Document Number', field: 'check_Num', width: 110 },
    {
      headerName: 'Scheduled Date', field: 'payment_Due_Date', width: 110,
      valueFormatter: (params) => {
        const value = params.value;
        return value === '0001-01-01' || value === '0001-01-01T00:00:00'
          ? ''
          : value;
      }
  }
  ];

  exportData() {
    console.log('Exporting data from Payment');
  }

  loadData(filters: BillsTParams): void {
    

    this.billsSubscription = this.billsService.getBillPaymentsReport(filters).subscribe({
      next: (response) => {
        const dataArray: billsPaymentsResultModel[] = Array.isArray(response)
          ? response
          : Array.isArray(response)
            ? response
            : [];
        
        this.billsList = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Paid Bills:', error);
        this.errorMessage = 'There is a problem loading data.';
        this.billsList = [];
        this.isLoading = false;
      }
    });
  }
}
