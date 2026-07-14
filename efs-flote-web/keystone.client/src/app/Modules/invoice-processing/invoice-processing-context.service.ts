import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type InvoiceProcessingPageType = 'Bills' | 'CbolCC' | 'Containers';

export interface InvoiceProcessingRecDetails {
  invoice_id?: string;
  Invoice_CID?: string;
  Type?: 'CC' | 'HBL' | 'CBOL';
  pageType?: 'CbolCC' | 'Containers';
  shipment_number?: string;
  Containers?: string;
}

export interface VatListItem {
  vat_code: string;
  displayVat: string;
  vat_percent: string;
  long_description: string;
  invoicevat_id: string;
}

/**
 * Invoice-scoped, cross-component state for Invoice Processing.
 * Mirrors the old ExtJS session singleton App.Controller.InvoiceProcessing.IPSingleTonCls
 * (alias IProcessingSCls), the same way CbolContextService mirrors CBOLSinCls.
 */
@Injectable({ providedIn: 'root' })
export class InvoiceProcessingContextService {
  private readonly _invoiceId = new BehaviorSubject<string>('');
  private readonly _invoiceCID = new BehaviorSubject<string>('');
  private readonly _pageType = new BehaviorSubject<InvoiceProcessingPageType>('Bills');
  private readonly _recDetails = new BehaviorSubject<InvoiceProcessingRecDetails | null>(null);
  private readonly _fromCID = new BehaviorSubject<string>('');
  private readonly _toCID = new BehaviorSubject<string>('');
  private readonly _vatListCodes = new BehaviorSubject<VatListItem[]>([]);

  readonly invoiceId$ = this._invoiceId.asObservable();
  readonly recDetails$ = this._recDetails.asObservable();

  get invoiceId(): string { return this._invoiceId.value; }
  get invoiceCID(): string { return this._invoiceCID.value; }
  get pageType(): InvoiceProcessingPageType { return this._pageType.value; }
  get recDetails(): InvoiceProcessingRecDetails | null { return this._recDetails.value; }
  get fromCID(): string { return this._fromCID.value; }
  get toCID(): string { return this._toCID.value; }
  get vatListCodes(): VatListItem[] { return this._vatListCodes.value; }

  setFromCID(value: string): void { this._fromCID.next(value || ''); }
  setToCID(value: string): void { this._toCID.next(value || ''); }
  setVatListCodes(list: VatListItem[]): void { this._vatListCodes.next(list || []); }

  /** Mirrors getProcessingData(recDet, pageType) — the single entry point every hand-off calls. */
  load(invoiceId: string, pageType: InvoiceProcessingPageType, recDetails: InvoiceProcessingRecDetails | null = null): void {
    this._invoiceId.next(invoiceId || '');
    this._invoiceCID.next(recDetails?.Invoice_CID || '');
    this._pageType.next(pageType);
    this._recDetails.next(recDetails);
  }

  reset(): void {
    this._invoiceId.next('');
    this._invoiceCID.next('');
    this._pageType.next('Bills');
    this._recDetails.next(null);
    this._fromCID.next('');
    this._toCID.next('');
    this._vatListCodes.next([]);
  }
}
