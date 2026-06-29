import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { ExecuteService } from '../../../Service/execute.service';
import { Subject, takeUntil } from 'rxjs';
import { Paramlist } from '../../../Models/Paramlist.model';

@Component({
  standalone: true,
  selector: 'app-accrual-accuracy-rep',
  templateUrl: './accrual-accuracy-rep.component.html',
  styleUrl: './accrual-accuracy-rep.component.css',
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AgGridAngular,
  ]
})
export class AccrualAccuracyRepComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;
  constructor(private executeService: ExecuteService) {

  }

  ngOnInit(): void {
    //// Execute subscription
    this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        //console.log('accruals tabs:', event);
        if (event.mainTab === 'Accruals' && event.subTab === 'Accrual Accuracy Report') {
          this.executecall(event.params);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  executecall(params: Paramlist): void {
    console.log('Execute call in Accrual Accuracy Report');
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
    { headerName: 'Year', field: 'year', hide: false, width: 110 },
    { headerName: 'Month', field: 'month', width: 110 },
    { headerName: 'Region', field: 'region', width: 110 },
    { headerName: 'District', field: 'district', width: 110 },
    { headerName: 'Location', field: 'location', width: 110 },
    { headerName: 'Amount Paid', field: 'amountpaid', width: 110 },
    { headerName: 'Amount Accrued', field: 'amountaccrued', width: 110 },
    { headerName: 'Diff. Amount', field: 'diffamount', width: 110 },
    { headerName: 'Overall % Accuracy', field: 'overallaccuracy', width: 110 },
    { headerName: 'ABS Diff.', field: 'absdiff', width: 110 },
    { headerName: 'ABS % Accuracy', field: 'absaccuracy', width: 110 }
  ];

  exportData() {
    console.log('Exporting data from Approved');
  }
}
