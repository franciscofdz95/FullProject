import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
