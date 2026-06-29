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
  selector: 'app-vendor-shipment',
  templateUrl: './vendor-shipment.component.html',
  styleUrl: './vendor-shipment.component.css',
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
export class VendorShipmentComponent implements OnInit, OnDestroy {

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
        if (event.mainTab === 'Vendors Shipment') {
          this.executecall(event.params);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    console.log('Execute call in Vendor Shipment');
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
    { headerName: '*', field: 'rcvdatdate', hide: false, width: 110 },
    { headerName: 'Rcvd at date', field: 'rcvdatdate', hide: false, width: 110 },
    { headerName: 'Location code', field: 'locationcode', width: 110 },
    { headerName: 'Vendor Carrier Name', field: 'vendor-carriername', width: 110 },
    { headerName: 'MBL Number', field: 'mbl-number', width: 110 },
    {
      headerName: 'CBOL',
      field: 'cbol',
      width: 110
    },
    { headerName: 'Shipment Number', field: 'shipmentNumber', hide: true },
    { headerName: 'Charge Split', field: 'chargesplit', hide: true },
    {
      headerName: 'Charge',
      children: [
        {
          headerName: 'Code Type',
          field: 'codeType',
          width: 110
        },
        {
          headerName: 'Description',
          field: 'description',
          width: 110
        }
      ]
    },
    {
      headerName: 'Sell',
      children: [
        {
          headerName: 'Amount',
          field: 'sellamount',
          width: 110
        },
        {
          headerName: 'Current',
          field: 'sellcurrent',
          width: 110
        },
        {
          headerName: 'Amount (USD)',
          field: 'sellamountusd',
          width: 110
        },
      ]
    },
    {
      headerName: 'Buy',
      children: [
        {
          headerName: 'Buy Amt',
          field: 'buyamount',
          width: 110
        },
        {
          headerName: 'Current',
          field: 'buycurrent',
          width: 110
        },
        {
          headerName: 'Amount (USD)',
          field: 'buyamountusd',
          width: 110
        },
      ]
    },
    { headerName: 'Diff Amount (USD)', field: 'diffamountusd', width: 110 },
    { headerName: 'Margin %', field: 'marginperc', width: 110 },
    { headerName: 'A', field: 'lastvalue', width: 110 },
  ];

}

