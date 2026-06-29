import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { Paramlist } from '../../../Models/Paramlist.model';
import { ExecuteService } from '../../../Service/execute.service';

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
export class AccrualMonthlyDetComponent implements OnInit, OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;
  constructor(private executeService: ExecuteService) {

  }

  ngOnInit(): void {
    ////Filter subscription
    //this.executeService.execute$
    //  .pipe(takeUntil(this.destroy$))
    //  .subscribe(event => {
    //    console.log('Current tab: ', event.tabName);
    //    if (event.tabName === 'Accrual Monthly Details') {
    //      this.executecall(event.params);
    //    }
    //  });
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
       // console.log('accruals tabs:', event);
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
    console.log('Execute call in Accrual Monthly Details');
    // Execute report logic here
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
    { headerName: 'Rcvd At Date (mm-dd-yyyy)', field: 'rcvdatdate', hide: false, width: 110 },
    { headerName: 'Depart Date (mm-dd-yyyy)', field: 'departdate', hide: false, width: 110 },
    { headerName: 'Year', field: 'year', width: 110 },
    { headerName: 'Month', field: 'month', width: 110 },
    { headerName: 'Shipment Number', field: 'shipmentnumber', width: 110 },
    { headerName: 'Shipment Dim FK', field: 'shipmentdimfk', width: 110 },
    { headerName: 'Orig. Loc.', field: 'origloc', width: 110 },
    { headerName: 'Dest. Loc.', field: 'destloc', width: 110 },
    { headerName: 'Dest. CC', field: 'destcc', width: 110 },
    { headerName: 'Charge Code', field: 'chargecode', width: 110 },
    { headerName: 'Service Code', field: 'servicecode', width: 110 },
    { headerName: 'COMP.', field: 'comp', width: 110 },
    { headerName: 'JRNL Date (mm-dd-yyyy)', field: 'jrnldate', width: 110 },
    { headerName: 'ACC.', field: 'acc', hide: false, width: 110 },
    { headerName: 'PROD.', field: 'prod', width: 110 },
    { headerName: 'Center', field: 'center', width: 110 },
    { headerName: 'Oper.', field: 'oper', width: 110 },
    { headerName: 'RRDD', field: 'rrdd', width: 110 },
    { headerName: 'Captured Info', field: 'capturedinfo', width: 110 },
    { headerName: 'STAT EXP AMT', field: 'statexpamt', width: 110 },
    { headerName: 'Debit', field: 'debit', width: 110 },
    { headerName: 'Credit', field: 'credit', width: 110 },
    { headerName: 'CID', field: 'cid', width: 110 },
    { headerName: 'Rev Split', field: 'revsplit', width: 110 },
    { headerName: 'Cost Loc.', field: 'costloc', hide: false, width: 110 },
    { headerName: 'Rev Amt.', field: 'revamt', width: 110 },
    { headerName: 'Vendor Code', field: 'vendorcode', width: 110 },
    { headerName: 'Vendor Name', field: 'vendorname', width: 110 },
    { headerName: 'Carrier bold', field: 'carrierbold', width: 110 },
    { headerName: 'EPA LOC.', field: 'epaloc', width: 110 },
    { headerName: 'EPA CC.', field: 'epacc', width: 110 },
    { headerName: 'Notes', field: 'notes', width: 110 },
    { headerName: 'Charge Description', field: 'chargedesc', width: 110 },
    { headerName: 'Ship Period', field: 'shipperiod', width: 110 },
    { headerName: 'Invoice Status', field: 'invoicestatus', width: 110 },
  ];

  exportData() {
    console.log('Exporting data from Approved');
  }
}
