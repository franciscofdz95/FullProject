import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { EmailUserDialogComponent } from './email-user-dialog.component';

@Component({
  selector: 'app-edit-button-renderer',
  standalone: true,
  template: `
    <button class="btn btn-outline-secondary btn-sm"
    style="height: 25px;display: flex;align-items:
    center;justify-content: center; min-width: 70px !important;"
            (click)="openDialog()"
            title="Edit">
      <i class="fa fa-edit"></i>
    </button>
  `
})
export class EditButtonRendererComponent implements ICellRendererAngularComp {
  params: any;

  constructor(private dialog: MatDialog) { }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  openDialog(): void {
    const rowData = this.params.data;

    const dialogRef = this.dialog.open(EmailUserDialogComponent, {
      data: { ...rowData },
      width: '80vw',
      height: '70vh',
      autoFocus: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.params.api.purgeInfiniteCache();
      }
    });
  }
}
