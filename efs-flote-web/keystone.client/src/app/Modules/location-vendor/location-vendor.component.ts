import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef, ColGroupDef } from 'ag-grid-community';
import { Paramlist } from '../../Models/Paramlist.model';
import { Subject, takeUntil } from 'rxjs';
import { ExecuteService } from '../../Service/execute.service';

@Component({
  standalone: true,
  selector: 'app-location-vendor',
  templateUrl: './location-vendor.component.html',
  styleUrl: './location-vendor.component.css',
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
export class LocationVendorComponent implements OnInit, OnDestroy {

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
        if (event.mainTab === 'Location Vendor') {
          this.executecall(event.params);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Query in progress, please wait...
    </span>`;

  executecall(params: Paramlist): void {
    console.log('Execute call in Location Vendor');
    // Execute report logic here
  }

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Date (mm/dd/yyyy)', field: 'date', hide: false },
    { headerName: 'Location', field: 'location', width: 110 },
    {
      headerName: 'Vendor',
      field: 'vendor',
      width: 110
    },
    { headerName: 'Shipment Count', field: 'shipment_count', width: 110 },
    { headerName: 'Currency Code', field: 'currency_code', width: 110 },
    { headerName: 'Total Sell Amount', field: 'total_sellamt', width: 110 },
    { headerName: 'Total Buy Amount', field: 'total_buyamt', width: 110 },
    { headerName: 'Total Diff Amount', field: 'total_diffamt', width: 110 },
    
  ];

}
