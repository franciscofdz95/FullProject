import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CbolRadioType = 'ByCarrierBol' | 'ByHBL' | 'ByChargeCode';
export type CbolPageType = 'CBOL' | 'CC';
export type CbolStatus = 'All' | 'Matched' | 'NonMatched' | 'Selected';

export interface CbolDrillDownRecord {
  Carrier_BOL?: string;
  Containers?: string;
  Type?: 'CC' | 'HBL' | 'CBOL';
  pageType?: 'CbolCC' | 'Containers';
  shipment_number?: string;
}

/**
 * Holds the invoice-scoped, cross-tab CBOL state that the old ExtJS
 * CBOLSinCls singleton (App.Controller.Cbol.SingletonCls) used to keep in memory.
 * Neither ExecuteService/Paramlist (no invoice_id) nor SessionService (geo context
 * only) cover this, so a dedicated service is needed.
 */
@Injectable({ providedIn: 'root' })
export class CbolContextService {
  private readonly _invoiceId = new BehaviorSubject<string>('');
  private readonly _radioType = new BehaviorSubject<CbolRadioType>('ByCarrierBol');
  private readonly _pageType = new BehaviorSubject<CbolPageType>('CBOL');
  private readonly _carrierBol = new BehaviorSubject<string>('');
  private readonly _chargeCode = new BehaviorSubject<string>('');
  private readonly _hbl = new BehaviorSubject<string>('');
  private readonly _recDetails = new BehaviorSubject<CbolDrillDownRecord | null>(null);

  readonly invoiceId$ = this._invoiceId.asObservable();
  readonly radioType$ = this._radioType.asObservable();
  readonly pageType$ = this._pageType.asObservable();
  readonly recDetails$ = this._recDetails.asObservable();

  get invoiceId(): string { return this._invoiceId.value; }
  setInvoiceId(value: string): void { this._invoiceId.next(value || ''); }

  get radioType(): CbolRadioType { return this._radioType.value; }
  setRadioType(value: CbolRadioType): void { this._radioType.next(value); }

  get pageType(): CbolPageType { return this._pageType.value; }
  setPageType(value: CbolPageType): void { this._pageType.next(value); }

  get carrierBol(): string { return this._carrierBol.value; }
  get chargeCode(): string { return this._chargeCode.value; }
  get hbl(): string { return this._hbl.value; }

  get recDetails(): CbolDrillDownRecord | null { return this._recDetails.value; }
  setRecDetails(rec: CbolDrillDownRecord | null): void { this._recDetails.next(rec); }

  /**
   * Sets the drill-down filter value on the field that matches the active radio
   * type, mirroring ReportTabActivate's CarrierCBOL/Hbl/ChargeCode extraParam wiring.
   */
  setDrillDownValue(value: string): void {
    switch (this._radioType.value) {
      case 'ByCarrierBol':
        this._carrierBol.next(value || '');
        this._chargeCode.next('');
        this._hbl.next('');
        break;
      case 'ByHBL':
        this._hbl.next(value || '');
        this._carrierBol.next('');
        this._chargeCode.next('');
        break;
      case 'ByChargeCode':
        this._chargeCode.next(value || '');
        this._carrierBol.next('');
        this._hbl.next('');
        break;
    }
  }

  clearDrillDown(): void {
    this._carrierBol.next('');
    this._chargeCode.next('');
    this._hbl.next('');
    this._recDetails.next(null);
    this._pageType.next('CBOL');
  }

  /** Resets everything — called when loading a different invoice. */
  reset(invoiceId: string): void {
    this._invoiceId.next(invoiceId || '');
    this._radioType.next('ByCarrierBol');
    this._pageType.next('CBOL');
    this._carrierBol.next('');
    this._chargeCode.next('');
    this._hbl.next('');
    this._recDetails.next(null);
  }
}
