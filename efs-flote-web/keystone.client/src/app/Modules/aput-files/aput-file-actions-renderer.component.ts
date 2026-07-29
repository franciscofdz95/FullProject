import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-aput-file-actions-renderer',
  standalone: true,
  host: { style: 'display: block; width: 100%; height: 100%;' },
  template: `
    <div style="display:flex; align-items:center; justify-content:center; gap: 10px; height: 25px;">
      <button class="btn btn-sm" style="border-color:#5cb85c; height: 24px; line-height:1; display:flex; align-items:center;" title="Download" (click)="onDownload()">
        <i class="fas fa-solid fa-circle-check" style="color:#5cb85c; font-size: 16px;"></i>
      </button>
    </div>
  `
})
export class AputFileActionsRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onDownload(): void {
    this.params.onDownload?.(this.params.data);
  }
}
