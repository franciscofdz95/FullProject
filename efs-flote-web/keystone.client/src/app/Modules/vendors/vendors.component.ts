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
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
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
export class VendorsComponent implements OnInit, OnDestroy {

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
        if (event.mainTab === 'Vendors') {
          this.executecall(event.params);
        }
      });
  }


  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    console.log('Execute call in Vendors');
    // Execute report logic here
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
    { headerName: 'Preferred', field: 'preferred', hide: false },
    { headerName: 'Vendor Code', field: 'vendorcode', width: 110 },
    { headerName: 'AP Vendor ID', field: 'apvendorid', width: 110 },
    { headerName: 'E2k Carrier Code', field: 'e2kCarrierCode', width: 110 },
    { headerName: 'Vendor Name', field: 'vendorname', width: 110 },
    { headerName: 'Vendor Legal Name', field: 'vendorlegalname', width: 110 },
    { headerName: 'AP Remit ID', field: 'apremitid', width: 110 },
    { headerName: 'Site Creation Code', field: 'sitecreationcode', width: 110 },
    { headerName: 'Term Id', field: 'termid', width: 110 },
    { headerName: 'Site Creation Date', field: 'sitecreationdate', width: 110 },
    { headerName: 'Pay Group', field: 'paygroup', width: 110 },
    { headerName: 'Site Payment Method', field: 'sitepaymentmethod', width: 110 },
    { headerName: 'Default Company Code', field: 'defaultcompanycode', width: 110 },
    { headerName: 'AP Company ID', field: 'apcompanyid', width: 110 },
    { headerName: 'Address', field: 'address', width: 110 },
    { headerName: 'Vendor City', field: 'vendorcity', width: 110 },
    { headerName: 'Country', field: 'country', width: 110 }
  ];

}
