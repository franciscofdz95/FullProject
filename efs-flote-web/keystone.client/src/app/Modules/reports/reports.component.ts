import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { reportMessageObject, reportModel } from '../../Models/ReportModel';
import { ReportsService } from './Service/reports.service';
import { Subscription } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, Column} from 'ag-grid-community';
import { DropdownTextModel } from '../../Models/Dropdown.model';

@Component({
  standalone: true,
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  imports: [
    CommonModule,
    FormsModule
    , MatDatepickerModule
    , MatFormFieldModule
    , MatInputModule
    , MatNativeDateModule
    , BrowserAnimationsModule
    , NgSelectModule
    , AgGridAngular
  ]
})
export class ReportsComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder) {
  }

  private reportService = inject(ReportsService);
  private reportSubscription: Subscription | null = null;
  //NG Table variables
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  }

  public pagination = true;
  public paginationPageSize = 20;
  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Loading documents, please wait...
    </span>`;
  dataSource: any[] = [];
  private reportsGridApi!: GridApi;
  //NG Table variables-----
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
  ngOnInit(): void {
    //ESE-0226-2
    this.availablePeriods = this.buildPreviousMonths();
    this.selectedPeriod = this.availablePeriods[0].value;
    }

  objResult: reportMessageObject | null = null;
  reportList: DropdownTextModel[] = [];
  selectedReportID: number | null = null;
  reportDate: Date | null = null;
  data: string[][] = [[]];
  headers: string[] = [];
  
  selectedRegionID: string | null = null;
  //ESE-0226-2
  availablePeriods: { label: string; value: string }[] = [];
  selectedPeriod!: string;


  onDateChange(event: any):void {

  }

  executeReport() {
    
    if (this.selectedReportID != null) {
      const parameters = this.selectedPeriod + ';;' + this.selectedRegionID;
      this.reportSubscription = this.reportService.getReportResult(this.selectedReportID, parameters).subscribe(
        {
          next: (data) => {
            this.objResult = reportMessageObject.fromJson(data);
            if (this.objResult != null) {
              this.data = this.objResult.data;
              this.headers = this.objResult.headers;
            }

          },
          error: (error) => {
            console.error('Error loading SFABRA reports:', JSON.stringify(error));
          }
        });

      //Fill NG Table
      this.fillGridHeaders();
    }
    
  }

  downloadReport() {
    if (this.selectedReportID != null) {
      if (this.selectedRegionID != null) {
        this.reportService.downloadReport(this.selectedReportID, this.selectedRegionID);
      } else {
        this.reportService.downloadReport(this.selectedReportID, null);
      }
    }
      
  }

  defineGridDataSource() {
    this.dataSource = this.data.map((row: string[]) => {
      const obj: any = {};
      this.headers.forEach((header: string, index: number) => {
        obj[this.normalize(header)] = row[index] ?? '';
      });
      return obj;
    });
  }

  reloadGrid(): void {
    if (this.reportsGridApi)
      this.reportsGridApi.purgeInfiniteCache();
  }

  onReportsGridReady(params: GridReadyEvent): void {
    this.reportsGridApi = params.api;
    this.fillGridHeaders();
  }

  normalize = (str: string) => str.replace(/\s+/g, '_').toLowerCase()
  fillGridHeaders() {
    
    this.columnDefs = this.headers.map(h => ({
      headerName: h,
      field: this.normalize(h),
      sortable: true,
      filter: true
    }));
    
    //End Fill---
    this.defineGridDataSource();
  }
  

  rowData: any[] = [];

  loadData() {
    if (this.selectedReportID != null) {
      const parameters = this.selectedPeriod + ';;' + this.selectedRegionID;
      this.reportService.getReportResult(this.selectedReportID, parameters).subscribe(response => {
        const normalize = (str: string) => str.replace(/\s+/g, '_').toLowerCase();

        /////////////////////////////////////
        this.objResult = reportMessageObject.fromJson(response);
        if (this.objResult != null) {
          this.data = this.objResult.data;
          this.headers = this.objResult.headers;
        }
        /////////////////////////////////////

        // Generar columnas dinámicas
        this.columnDefs = this.headers.map(h => ({
          headerName: h,
          field: normalize(h),
          sortable: true,
          filter: true
        }));

        // Generar filas dinámicas
        this.rowData = this.data.map(row => {
          const obj: any = {};
          this.headers.forEach((header, index) => {
            obj[normalize(header)] = row[index] ?? '';
          });
          return obj;
        });

      });
    }

    this.refreshGrid();
  }


  private gridApi!: GridApi;
  private gridColumnApi!: Column;

  onGridReady(params: any) {
    this.reportsGridApi = params.api;          // Aquí obtienes el GridApi
    this.gridColumnApi = params.columnApi;

    // Ejemplo: ajustar columnas al ancho del grid
    this.reportsGridApi.sizeColumnsToFit();
  }

  refreshGrid() {
    this.reportsGridApi.sizeColumnsToFit();
  }
  //ESE-0226-2
  private buildPreviousMonths(): { label: string; value: string }[] {
    const result: { label: string; value: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const label = d.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}`;

      result.push({ label, value });
    }

    return result;
  }

  onMonthChange(value: string) {
    this.selectedPeriod = value;
  }

  selectReport(selectedItem: DropdownTextModel | null): void {
    console.log("Selected report: " + selectedItem?.value + " " + selectedItem?.value);
    if (selectedItem != null) {
      this.selectedReportID = Number(selectedItem?.value);
    }

  }

  //////////////////////////////////////////////////////
}
