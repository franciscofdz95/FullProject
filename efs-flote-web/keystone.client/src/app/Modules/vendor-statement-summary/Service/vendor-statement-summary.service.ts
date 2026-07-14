import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CbolSummaryFilter {
  invoiceId?: string;
  carrierBol?: string;
  chargeCode?: string;
  hbl?: string;
  cbolStatus?: string;
  radioSelection?: string;
  sort?: string;
}

export interface CbolSummaryRow {
  Carrier_BOL: string;
  Containers: string;
  Status: string;
  Ver_Charge_Code: string;
  NonVer_charge_code: string;
  Processed_charge_code: string;
  Shipment_Count: string;
  Container_Count: string;
  Invoice_Amt: string;
  E2K_Buy_Amt: string;
  Buy_Cid_Orig: string;
  Diff_Amt: string;
  Sell_Amt: string;
  Net_Amt: string;
  Processed_Amt: string;
  Comment: string;
  ChargeUsed: string;
  TotalRows: string;
}

export interface CbolAggregate {
  All: string;
  Matched: string;
  NonMatched: string;
  Selected: string;
}

export interface CbolMatchPayload {
  invoiceId?: string;
  carrierBol?: string;
  chargeCode?: string;
  hbl?: string;
  comments?: string;
  userId?: string;
  radioSelection?: string;
}

@Injectable({ providedIn: 'root' })
export class VendorStatementSummaryService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  getCbolSummary(filters: CbolSummaryFilter): Observable<CbolSummaryRow[]> {
    return this.http.post<CbolSummaryRow[]>(`${this.baseUrl}/api/Cbol/GetCbolSummary`, filters);
  }

  getCbolAggregateData(invoiceId: string): Observable<CbolAggregate> {
    return this.http.post<CbolAggregate>(`${this.baseUrl}/api/Cbol/GetCbolAggregateData`, { invoiceId });
  }

  processExcelDataToFlote(payload: CbolMatchPayload): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/Cbol/ProcessExcelDataToFlote`, payload);
  }
}
