import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ValuePayLocationsAdminService } from './Service/value-pay-locations-admin.service';
import { ValuePayLocationRow } from '../../Models/ValuePayLocation.model';
import { ValuePayUpdateActionRendererComponent } from './value-pay-update-action-renderer.component';
import { NotificationService } from '../../Service/notification.service';

@Component({
  standalone: true,
  selector: 'app-value-pay-locations-admin',
  templateUrl: './value-pay-locations-admin.component.html',
  styleUrl: './value-pay-locations-admin.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    AgGridAngular
  ]
})
export class ValuePayLocationsAdminComponent {
  private gridApi!: GridApi;

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Loading Value Pay Locations, please wait...
    </span>`;

  defaultColDef: ColDef = { resizable: true, sortable: true };

  updateRow = (row: ValuePayLocationRow): void => {
    const reqLocation = (row.req_location || '').trim();
    const invoiceTypeCode = (row.invoice_type_code || '').trim();
    const valuePayLocation = (row.value_pay_location || '').trim();

    if (!reqLocation || !invoiceTypeCode || !valuePayLocation) {
      this.notificationService.error('Req Location, Invoice Type Code and Value Pay Location are required.');
      return;
    }

    this.valuePayLocationsAdminService.updateLocation({
      reqLocation,
      invoiceTypeCode,
      valuePayLocation
    }).subscribe({
      next: () => {
        this.notificationService.success(`Value Pay Location for "${reqLocation}" was updated.`);
      },
      error: (err) => {
        console.error('Error updating Value Pay Location:', err);
        this.notificationService.error(`Failed to update Value Pay Location for "${reqLocation}".`);
      }
    });
  };

  columnDefs: ColDef[] = [
    { headerName: 'Req Location', field: 'req_location', flex: 1, minWidth: 160, editable: true },
    { headerName: 'Invoice Type Code', field: 'invoice_type_code', flex: 1, minWidth: 160, editable: true },
    { headerName: 'Value Pay Location', field: 'value_pay_location', flex: 1, minWidth: 180, editable: true },
    {
      headerName: 'Action',
      width: 120,
      resizable: false,
      cellRenderer: ValuePayUpdateActionRendererComponent,
      cellRendererParams: {
        onUpdate: (row: ValuePayLocationRow) => this.updateRow(row)
      }
    }
  ];

  rowData: ValuePayLocationRow[] = [];

  constructor(
    private dialogRef: MatDialogRef<ValuePayLocationsAdminComponent>,
    private valuePayLocationsAdminService: ValuePayLocationsAdminService,
    private notificationService: NotificationService
  ) { }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.loadData();
  }

  loadData(): void {
    this.gridApi.setGridOption('loading', true);
    this.valuePayLocationsAdminService.getAll().subscribe({
      next: (rows) => {
        this.rowData = rows || [];
        this.gridApi.setGridOption('loading', false);
      },
      error: (err) => {
        console.error('Error loading Value Pay Locations:', err);
        this.gridApi.setGridOption('loading', false);
        this.notificationService.error('Failed to load Value Pay Locations.');
      }
    });
  }

  goHome(): void {
    this.dialogRef.close();
  }
}
