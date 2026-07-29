import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-value-pay-update-action-renderer',
  standalone: true,
  host: { style: 'display: block; width: 100%; height: 100%;' },
  template: `
    <div style="display:flex; align-items:center; justify-content:center; height: 25px;">
      <button class="btn btn-sm value-pay-update-btn" title="Update" (click)="onUpdate()">
        Update
      </button>
    </div>
  `,
  styles: [`
    .value-pay-update-btn {
      background-color: #CEB303;
      color: #fff;
      font-weight: bold;
      border: 1px solid #9c8602;
      border-radius: 3px;
      height: 24px;
      line-height: 1;
      padding: 0 12px;
    }
  `]
})
export class ValuePayUpdateActionRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onUpdate(): void {
    this.params.onUpdate?.(this.params.data);
  }
}
