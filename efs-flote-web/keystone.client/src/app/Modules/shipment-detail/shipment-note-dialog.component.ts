import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ShipmentService } from './Service/shipment.service';

/** Data injected into the Shipment Note dialog. */
export interface ShipmentNoteDialogData {
  shipmentNumber: string;
  userName: string;
}

/**
 * Shipment Note dialog — Angular re-implementation of the legacy ExtJS
 * App.View.ShipmentSummary.Note.Shipment window. A textarea + Add / Close
 * buttons. On Add it calls AddShipmentNote then closes returning `true`
 * so the parent grid reloads.
 */
@Component({
  standalone: true,
  selector: 'app-shipment-note-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="ship-note-dialog">
      <div class="ship-note-title">Shipment Note</div>
      <div class="ship-note-body">
        <label class="ship-note-label">Shipment Note:</label>
        <textarea class="ship-note-text"
                  [(ngModel)]="noteText"
                  rows="6"
                  placeholder="Enter note..."></textarea>
        <div class="ship-note-actions">
          <button class="ship-note-btn" (click)="close()">Close</button>
          <button class="ship-note-btn" (click)="add()" [disabled]="!noteText.trim() || saving">Add</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ship-note-dialog { background:#D4CCBF; padding:0; border:2px solid #3D8BC8; box-sizing:border-box; }
    .ship-note-title  { background:#3D8BC8; color:#0d0d0c; font-weight:bold; font-size:13px; padding:6px 10px; }
    .ship-note-body   { background:#D4CCBF; padding:10px; display:flex; flex-direction:column; }
    .ship-note-label  { color:#fff; font-weight:bold; font-size:12px; margin-bottom:4px; }
    .ship-note-text   { width:100%; border:1px solid #fff; padding:6px; font-size:12px; box-sizing:border-box; resize:vertical; background:#f5f5f5; }
    .ship-note-actions{ margin-top:10px; display:flex; justify-content:center; gap:10px; }
    .ship-note-btn {
      background:#CEB303; color:#fff; font-weight:bold; border:1px solid #9c8602;
      border-radius:3px; padding:4px 18px; margin:0; min-width:64px; cursor:pointer; font-size:12px;
    }
    .ship-note-btn:disabled { opacity:.5; cursor:default; }
    .ship-note-btn:hover:not(:disabled) { background:#bda204; }
  `]
})
export class ShipmentNoteDialogComponent {
  noteText = '';
  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ShipmentNoteDialogData,
    private dialogRef: MatDialogRef<ShipmentNoteDialogComponent>,
    private shipmentService: ShipmentService
  ) { }

  add(): void {
    const text = this.noteText.trim();
    if (!text) { return; }
    this.saving = true;
    this.shipmentService.addShipmentNote(this.data.shipmentNumber, text, this.data.userName).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Error adding shipment note:', err);
        this.saving = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
