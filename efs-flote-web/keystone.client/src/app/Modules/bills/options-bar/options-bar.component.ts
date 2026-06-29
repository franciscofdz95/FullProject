import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { BillsTParams } from '../../../Models/BillsTParams';
import { BillsService } from '../Services/bills.service';
import { Paramlist } from '../../../Models/Paramlist.model';
import { HttpClient } from '@angular/common/http';
import { ExecuteService } from '../../../Service/execute.service';

@Component({
  standalone: true,
  selector: 'app-options-bar',
  templateUrl: './options-bar.component.html',
  styleUrl: './options-bar.component.css',
  imports: [
    CommonModule,
  ]
})
export class OptionsBarComponent implements OnInit, OnDestroy {
  
  @Output() toggle = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  //@Input() isPayment:boolean = false;
  _isPayment: boolean = false;
  @Input()
  set isPayment(value: boolean | undefined) {
    this._isPayment = value ?? false;
  }
  get isPayment(): boolean {
    return this._isPayment;
  }
  incInvoices: number = 0;

  constructor(private http: HttpClient, private executeService: ExecuteService) { }

  private destroy$ = new Subject<void>();
  errorMessage: string = '';
  selectedDate: Date | null = null;
  filters: BillsTParams = {
    View: '',
    AcctYear: new Date().getFullYear().toString(),
    AcctMonth: (new Date().getMonth() + 1).toString(),
    DisplayCurrency: '',
    LocCode: 'LAX',
    InvoiceStatus: '',
    ScanDest: ''
  }
  billsSubscription !: Subscription;
  private billsService = inject(BillsService);
  companyName: string = '';

  ngOnInit(): void {
    this.openSubscription();
    this.setIncompletedInvoices();
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  executecall(params: Paramlist): void {

    // Execute report logic here
    this.filters = {
      AcctYear: params.accountingyearval ? params.accountingyearval.toString() : new Date().getFullYear().toString(),
      AcctMonth: params.accountingmonthval ? params.accountingmonthval.toString() : (new Date().getMonth() + 1).toString(),
      DisplayCurrency: params.displaycurrentval?.toString() || '',
      LocCode: params.locationcodeval?.toString() || 'LAX',
      InvoiceStatus: params.invoicestatval?.toString() || '',
      ScanDest: params.scandestval.toString() || ''
    };

    this.companyName = params.companycodeval?.toString() || '';
    this.setIncompletedInvoices();
  }


  openSubscription(): void {
    //Filter subscription
      this.executeService.execute$
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {

          if (event.mainTab === 'Bills') {
            this.executecall(event.params);
          }
        });
    
  }

  setIncompletedInvoices() {
    if (this.filters.LocCode == undefined) {
      this.filters.LocCode = 'LAX';
    }
    if (this.filters.AcctYear == undefined) {
      this.filters.AcctYear = new Date().getFullYear().toString();
    }
    this.billsSubscription = this.billsService.getIncompletedBills(this.filters.LocCode.toString(), this.companyName, this.filters.AcctYear).subscribe({
      next: (response) => {
        this.incInvoices = response;
      },
      error: (error) => {
        console.error('Error loading Incompleted Invoices:', error);
        this.errorMessage = 'There is a problem loading data.';
      }
    });

  }


}
