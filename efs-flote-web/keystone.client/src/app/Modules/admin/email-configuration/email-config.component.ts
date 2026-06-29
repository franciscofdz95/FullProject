import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, IGetRowsParams } from 'ag-grid-community';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmailUserDialogComponent } from './email-user-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../Service/admin.service';
import { EmailConfigPagination } from '../../../Models/EmailConfiguration.model';
import { EditButtonRendererComponent } from './edit-button-renderer.component';

@Component({
  selector: 'app-email-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgGridAngular,
    MatDialogModule,
    MatButtonModule,
    EmailUserDialogComponent
  ],
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.css']
})
export class EmailConfigComponent implements OnInit {

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Loading email configurations, please wait...
    </span>`;

  public columnDefs: ColDef[] = [
    {
      headerName: 'Edit',
      width: 100,
      cellRenderer: EditButtonRendererComponent
    },
    { field: 'processOwner', headerName: 'Owner', width: 150 },
    { field: 'process_Name', headerName: 'Process', width: 220 },
    { field: 'process_Keyword', headerName: 'Keyword', width: 150 },
    { field: 'from_Email', headerName: 'From', width: 180 },
    { field: 'to_Email', headerName: 'To', width: 250 },
    { field: 'cC_Email', headerName: 'CC', width: 250 },
    { field: 'bcC_Email', headerName: 'BCC', width: 250 },
  ];

  public defaultColDef: ColDef = { resizable: true, sortable: true, filter: true };
  public paginationPageSize = 20;
  public dataSource: any = { data: [], totalCount: 0 };
  private gridApi!: GridApi;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.defineDataSource();    
  }

  defineDataSource(): void {
    this.dataSource = {
      getRows: (params: IGetRowsParams) => {
        this.gridApi.setGridOption('loading', true);

        const pagination: EmailConfigPagination = {
          pageNumber: this.gridApi.paginationGetCurrentPage() + 1,
          pageSize: this.gridApi.paginationGetPageSize()
        };
      
        this.adminService.getTableAdminEmailConfigurations(pagination).subscribe(
          (result: any) => {
            params.successCallback(result.data, result.totalCount);
            this.gridApi.setGridOption('loading', false);
          },
          error => {
            params.failCallback();
            this.gridApi.setGridOption('loading', false);
          }
        );
      }
    };

    this.gridApi.setGridOption('datasource', this.dataSource);

  }

  reloadGrid(): void {
    if (this.gridApi) {      
      this.gridApi.purgeInfiniteCache();
    }
  }

  openAddUserDialog(data: any): void {
    const dialogRef = this.dialog.open(EmailUserDialogComponent, {
      data: data,
      width: '80vw',
      height: '75vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.reloadGrid();
    });
  }

}
