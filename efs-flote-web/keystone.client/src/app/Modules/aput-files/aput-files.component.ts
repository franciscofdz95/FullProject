import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, IGetRowsParams } from 'ag-grid-community';
import { AputFilesService } from './Service/aput-files.service';
import { FtpFolder, FtpFile, FtpFilePagination } from '../../Models/FtpFiles.model';
import { AputFileActionsRendererComponent } from './aput-file-actions-renderer.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../Service/notification.service';

@Component({
  standalone: true,
  selector: 'app-aput-files',
  templateUrl: './aput-files.component.html',
  styleUrl: './aput-files.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    AgGridAngular
  ]
})
export class AputFilesComponent implements OnInit {
  private gridApi!: GridApi;
  private pendingForceRefresh = false;

  folders: FtpFolder[] = [];
  selectedFolder = '';
  isLoadingFolders = false;

  totalRows = 0;
  currentPage = 1;
  totalPages = 1;
  pageSize = 50;
  displayFrom = 0;
  displayTo = 0;
  pageInput = 1;

  public overlayLoadingTemplate = `
    <span class="ag-overlay-loading-center">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
      <br/>Loading FTP files, please wait...
    </span>`;

  defaultColDef: ColDef = { resizable: true, sortable: true };

  confirmDelete = (row: FtpFile): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      autoFocus: false,
      data: {
        title: 'Delete FTP File',
        message: `Are you sure you want to delete "${row.fileName}"? This action cannot be undone.`,
        confirmLabel: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteFile(row);
      }
    });
  };

  downloadFile = (row: FtpFile): void => {
    const url = this.aputFilesService.getDownloadUrl(this.selectedFolder, row.fileName);
    const link = document.createElement('a');
    link.href = url;
    link.download = row.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notificationService.success(`Download started for "${row.fileName}".`);
  };

  columnDefs: ColDef[] = [
    { headerName: 'File Name', field: 'fileName', flex: 2 },
    {
      headerName: 'Action',
      flex: 1,
      maxWidth: 120,
      cellRenderer: AputFileActionsRendererComponent,
      cellRendererParams: {
        onDelete: (row: FtpFile) => this.confirmDelete(row),
        onDownload: (row: FtpFile) => this.downloadFile(row)
      }
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<AputFilesComponent>,
    private dialog: MatDialog,
    private aputFilesService: AputFilesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.isLoadingFolders = true;
    this.aputFilesService.getRootDirectories().subscribe({
      next: (folders) => {
        this.folders = folders || [];
        this.isLoadingFolders = false;
        if (this.folders.length > 0) {
          this.selectedFolder = this.folders[0].name;
          this.tryInitDataSource();
        }
      },
      error: (err) => {
        console.error('Error loading APUT FTP root directories:', err);
        this.isLoadingFolders = false;
        this.notificationService.error('Failed to load FTP root directories.');
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.tryInitDataSource();
  }

  private tryInitDataSource(): void {
    if (this.gridApi && this.selectedFolder) {
      this.defineDataSource();
    }
  }

  onFolderChange(): void {
    if (this.gridApi) {
      this.defineDataSource();
    }
  }

  private defineDataSource(): void {
    this.gridApi.setGridOption('datasource', {
      getRows: (params: IGetRowsParams) => {
        this.gridApi.setGridOption('loading', true);

        const pagination: FtpFilePagination = {
          folder: this.selectedFolder,
          pageNumber: this.gridApi.paginationGetCurrentPage() + 1,
          pageSize: this.gridApi.paginationGetPageSize(),
          forceRefresh: this.pendingForceRefresh
        };
        this.pendingForceRefresh = false;

        this.aputFilesService.getFiles(pagination).subscribe({
          next: (result) => {
            this.totalRows = result.totalCount;
            params.successCallback(result.data, result.totalCount);
            this.gridApi.setGridOption('loading', false);
          },
          error: (err) => {
            console.error('Error loading APUT FTP files:', err);
            params.failCallback();
            this.gridApi.setGridOption('loading', false);
            this.notificationService.error('Failed to load FTP files.');
          }
        });
      }
    });
  }

  private deleteFile(row: FtpFile): void {
    this.aputFilesService.deleteFile(this.selectedFolder, row.fileName).subscribe({
      next: () => {
        this.notificationService.success(`"${row.fileName}" was deleted.`);
        this.gridApi.purgeInfiniteCache();
      },
      error: (err) => {
        console.error('Error deleting APUT FTP file:', err);
        this.notificationService.error(`Failed to delete "${row.fileName}".`);
      }
    });
  }

  onPaginationChanged(): void {
    if (!this.gridApi) { return; }
    this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    this.totalPages = Math.max(this.gridApi.paginationGetTotalPages(), 1);
    this.pageSize = this.gridApi.paginationGetPageSize();
    this.displayFrom = this.totalRows === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    this.displayTo = Math.min(this.currentPage * this.pageSize, this.totalRows);
    this.pageInput = this.currentPage;
  }

  goToFirstPage(): void { this.gridApi?.paginationGoToFirstPage(); }
  goToPreviousPage(): void { this.gridApi?.paginationGoToPreviousPage(); }
  goToNextPage(): void { this.gridApi?.paginationGoToNextPage(); }
  goToLastPage(): void { this.gridApi?.paginationGoToLastPage(); }

  goToPage(): void {
    if (!this.gridApi) { return; }
    const page = Math.min(Math.max(this.pageInput || 1, 1), this.totalPages);
    this.gridApi.paginationGoToPage(page - 1);
  }

  refresh(): void {
    if (!this.gridApi) { return; }
    this.pendingForceRefresh = true;
    this.gridApi.purgeInfiniteCache();
  }

  close(): void {
    this.dialogRef.close();
  }
}
