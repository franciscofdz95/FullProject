import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface InvoiceProcessingLine {
  Invoice_detail_id: string;
  invoice_id: string;
  rcvd_at_dt: string;
  location_code: string;
  vendor_code: string;
  vendor_name: string;
  MBL_nbr: string;
  MBL_fk: string;
  mbl_iata_busid: string;
  shpmnt_nbr: string;
  shipment_dim_fk: string;
  mbl_chg_fk: string;
  rev_split: string;
  charge_code_txt: string;
  Charge_code: string;
  CHARGE_DESCRIPTION: string;
  sell_amt: string;
  sell_cid: string;
  buy_amt: string;
  buy_cid: string;
  invoice_cid: string;
  invoice_amt: string;
  invoicevat_id: string;
  invoicevat_amt: string;
  ConvRate: string;
  comment: string;
  PaidDifferentlyReason: string;
  frontCheck: string;
  backCheck: string;
  AccrualFlag: string;
  Reference_id: string;
  rowtype: string;
  old_amt: string;
  old_cid: string;
  man_tol_amt: string;
  loc_tol_amt: string;
  loc_tol_per: string;
}

export interface InvoiceChargesDetail {
  invoice_id: string;
  vendor_code: string;
  Vendor_Name_English: string;
  E2K_CARRIER_CODE: string;
  InvRefNo: string;
  Invoice_CID: string;
  Charges_Logged: string;
  Charges_Processed: string;
  Charges_Variance: string;
  VAT_Logged: string;
  VAT_Processed: string;
  VAT_Variance: string;
  TWH_Logged: string;
  TWH_Processed: string;
  TWH_Variance: string;
  OSOffset_Logged: string;
  OSOffset_Processed: string;
  OSOffset_Variance: string;
  Total_Logged: string;
  Total_Processed: string;
  Total_Variance: string;
}

export interface VatCode {
  vat_code: string;
  long_description: string;
  vat_percent: string;
  displayVat: string;
  invoicevat_id: string;
}

export interface InvoiceProcessingParams {
  invoiceId?: string;
  radioSelection?: string;
  columnNames?: string;
  locCode?: string;
  vendorCode?: string;
  chargeCode?: string;
  shipmentNumber?: string;
  companyCode?: string;
  displayCurr?: string;
  sort?: string;
  fromCID?: string;
  toCID?: string;
  fromRate?: number;
  toRate?: number;
  convRate?: number;
  invoiceDetId?: string;
  currencyCode?: string;
  shipmentDimFK?: string;
  mblFk?: string;
  chargeFk?: string;
  rowType?: string;
  invoiceVATId?: string;
  chargeAmt?: number;
  buyCID?: string;
  invoiceCID?: string;
  comments?: string;
  paidDifferentlyReason?: string;
  activeFlag?: number;
  vatAmt?: number;
  accrualFlag?: number;
  splitAmt?: number;
  userId?: string;
  vatCode?: string;
  description?: string;
  oraAccount?: string;
  revSplit?: string;
  twhCode?: string;
  invoiceStatusTo?: string;
  imageNumber?: string;
  canApprove?: number;
  e2kUserId?: string;
}

@Injectable({ providedIn: 'root' })
export class InvoiceProcessingService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  private post<T>(action: string, payload: InvoiceProcessingParams): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/api/InvoiceProcessing/${action}`, payload);
  }

  getInvoiceProcessingReport(payload: InvoiceProcessingParams): Observable<InvoiceProcessingLine[]> {
    return this.post('GetInvoiceProcessingReport', payload);
  }

  getInvoiceChargesDetails(payload: InvoiceProcessingParams): Observable<InvoiceChargesDetail> {
    return this.post('GetInvoiceChargesDetails', payload);
  }

  getNonE2kCost(payload: InvoiceProcessingParams): Observable<any[]> {
    return this.post('GetNonE2kCost', payload);
  }

  getTWHCodes(payload: InvoiceProcessingParams): Observable<any[]> {
    return this.post('GetTWHCodes', payload);
  }

  getValidateTWHEntry(payload: InvoiceProcessingParams): Observable<boolean> {
    return this.post('GetValidateTWHEntry', payload);
  }

  insertNonE2KCharge(payload: InvoiceProcessingParams): Observable<any> {
    return this.post('InsertNonE2KCharge', payload);
  }

  insertTaxWithholding(payload: InvoiceProcessingParams): Observable<any> {
    return this.post('InsertTaxWithholding', payload);
  }

  getVATCodesBP(payload: InvoiceProcessingParams): Observable<VatCode[]> {
    return this.post('GetVATCodesBP', payload);
  }

  getExchangeRateData(payload: InvoiceProcessingParams): Observable<any[]> {
    return this.post('GetExchangeRateData', payload);
  }

  postInvoiceCurrency(payload: InvoiceProcessingParams): Observable<any[]> {
    return this.post('PostInvoiceCurrency', payload);
  }

  postInvoiceLine(payload: InvoiceProcessingParams): Observable<any> {
    return this.post('PostInvoiceLine', payload);
  }

  checkValidCurrency(payload: InvoiceProcessingParams): Observable<boolean> {
    return this.post('CheckValidCurrency', payload);
  }

  getInvoiceChargeCountByVatId(payload: InvoiceProcessingParams): Observable<number> {
    return this.post('GetInvoiceChargeCountByVatId', payload);
  }

  updateInvoiceComment(payload: InvoiceProcessingParams): Observable<any> {
    return this.post('UpdateInvoiceComment', payload);
  }

  verifyInvoice(payload: InvoiceProcessingParams): Observable<any> {
    return this.post('VerifyInvoice', payload);
  }

  updateInvoiceVATId(payload: InvoiceProcessingParams): Observable<any> {
    return this.post('UpdateInvoiceVATId', payload);
  }

  getSplitRemainder(payload: InvoiceProcessingParams): Observable<{ remainder?: number;[key: string]: any }> {
    return this.post('GetSplitRemainder', payload);
  }

  getInvoiceLineCurrency(payload: InvoiceProcessingParams): Observable<{ ConvRate?: string;[key: string]: any }> {
    return this.post('GetInvoiceLineCurrency', payload);
  }

  checkInvoiceCurrency(payload: InvoiceProcessingParams): Observable<{ invoice_currency_id?: number; Invoice_CID?: string;[key: string]: any }> {
    return this.post('CheckInvoiceCurrency', payload);
  }

  loadPaidDifferentlyReasons(): Observable<any[]> {
    return this.post('LoadPaidDifferentlyReasons', {});
  }

  getSCACCode(payload: InvoiceProcessingParams): Observable<any[]> {
    return this.post('GetSCACCode', payload);
  }
}
