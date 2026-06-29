import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef, ColGroupDef } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { Paramlist } from '../../Models/Paramlist.model';
import { ExecuteService } from '../../Service/execute.service';

@Component({
  standalone: true,
  selector: 'app-paid-differently',
  templateUrl: './paid-differently.component.html',
  styleUrl: './paid-differently.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    AgGridAngular
  ]
})
export class PaidDifferentlyComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;
  constructor(private executeService: ExecuteService) {

  }

  ngOnInit(): void {
    ////Filter subscription
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        //console.log('tabs: ', event);
        if (event.mainTab === 'Paid Differently') {
          this.executecall(event.params);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    console.log('Execute call in Paid Differently');
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

  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Location Code', field: 'locationcode', hide: false, width: 110 },
    { headerName: 'Location Country', field: 'locationcountry', width: 110 },
    { headerName: 'Location Region', field: 'locationregion', width: 110 },
    { headerName: 'EPA Origin', field: 'epaorigin', width: 110 },
    { headerName: 'EPA Destination', field: 'epadestination', width: 110 },
    { headerName: 'Shipment Origin', field: 'shipmentorig', width: 110 },
    { headerName: 'Shipment Destination', field: 'shipmentdest', width: 110 },
    { headerName: 'Service Level', field: 'servicelevel', width: 110 },
    { headerName: 'Vendor Name', field: 'vendorname', width: 110 },
    { headerName: 'Reason', field: 'reason', width: 110 },
    { headerName: 'Comment', field: 'comment', width: 110 },
    { headerName: 'Last Invoice Modified Date', field: 'lastinvmodifdate', width: 110 },
    { headerName: 'Shipment Number', field: 'shipmentnumber', width: 110 },
    { headerName: 'Invoice Number', field: 'invoicenumber', width: 110 },
    { headerName: 'Invoice Paid Date', field: 'invoicepaiddate', width: 110 },
    { headerName: 'Mode', field: 'mode', width: 110 },
    { headerName: 'Master Bill', field: 'masterbill', width: 110 },
    { headerName: 'Charge Co', field: 'chargeco', width: 110 },
    { headerName: 'Charge Description', field: 'chargedesc', width: 110 },
    { headerName: 'E2K Sell Local', field: 'ekselllocal', width: 110 },
    { headerName: 'E2K Sell Currency', field: 'eksellcurrency', width: 110 },
    { headerName: 'E2K Buy Local', field: 'ekbuylocal', width: 110 },
    { headerName: 'E2K Buy Currency', field: 'ekbuycurrency', width: 110 },
    { headerName: 'E2K Sell USD', field: 'eksellusd', width: 110 },
    { headerName: 'E2K Buy USD', field: 'ekbuyusd', width: 110 },
    { headerName: 'FLOTE Inv Amount USD', field: 'floteinvamtusd', width: 110 },
    { headerName: 'Paid Diff Amount USD', field: 'paiddiffamtusd', width: 110 }
  ];

}
