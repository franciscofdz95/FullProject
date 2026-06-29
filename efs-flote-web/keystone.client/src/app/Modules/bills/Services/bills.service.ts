import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LocalShipmentFilter } from '../../local-shipment/Service/local-shipment.service';
import { BillsTParams } from '../../../Models/BillsTParams';
import { billsPaymentsResultModel, billsResultModel } from '../../../Models/BillsResult.model';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  getBillsReport(filters: BillsTParams): Observable<billsResultModel[]> {
    
    var httpParams = new HttpParams()
      .set('View', filters.View ? filters.View : '')
      .set('AcctYear', filters.AcctYear ? filters.AcctYear : new Date().getFullYear().toString())
      .set('AcctMonth', filters.AcctMonth ? filters.AcctMonth : (new Date().getMonth() + 1).toString())
      .set('DisplayCurrency', filters.DisplayCurrency ? filters.DisplayCurrency : '')
      .set('LocCode', filters.LocCode ? filters.LocCode : 'LAX')
      .set('InvoiceStatus', filters.InvoiceStatus ? filters.InvoiceStatus : '');

    return this.http.get<billsResultModel[]>(`${this.baseUrl}/api/Bills/GetBills`, { params: httpParams });
  }

  getBillPaymentsReport(filters: BillsTParams): Observable<billsPaymentsResultModel[]> {
    
    var httpParams = new HttpParams()
      .set('View', filters.View ? filters.View : '')
      .set('AcctYear', filters.AcctYear ? filters.AcctYear : new Date().getFullYear().toString())
      .set('AcctMonth', filters.AcctMonth ? filters.AcctMonth : (new Date().getMonth() + 1).toString())
      .set('LocCode', filters.LocCode ? filters.LocCode : 'LAX')
      .set('PaidStatus', filters.PaidStatus ? filters.PaidStatus : '')
      .set('InvoiceStatus', filters.InvoiceStatus ? filters.InvoiceStatus : '');

    return this.http.get<billsPaymentsResultModel[]>(`${this.baseUrl}/api/Bills/GetBillsPayments`, { params: httpParams });
  }

  getIncompletedBills(location_code: string, company_code: string, AcctYear: string): Observable<number> {
    
    var httpParams = new HttpParams()
      .set('location_code', location_code ? location_code : 'LAX')
      .set('company_code', company_code ? company_code : '')
      .set('Acct_Year', AcctYear ? AcctYear : new Date().getFullYear().toString());
      

    return this.http.get<number>(`${this.baseUrl}/api/Bills/GetIncompletedBills`, { params: httpParams });
  }

  getBillsHeaderCount(filters: BillsTParams): Observable<number[]> {
    
    var httpParams = new HttpParams()
      .set('AcctYear', filters.AcctYear ? filters.AcctYear : new Date().getFullYear().toString())
      .set('AcctMonth', filters.AcctMonth ? filters.AcctMonth : (new Date().getMonth() + 1).toString())
      .set('DisplayCurrency', filters.DisplayCurrency ? filters.DisplayCurrency : '')
      .set('LocCode', filters.LocCode ? filters.LocCode : 'LAX')
      .set('InvoiceStatus', filters.InvoiceStatus ? filters.InvoiceStatus : '')
      .set('ScanDest', filters.ScanDest ? filters.ScanDest : '');

    return this.http.get<number[]>(`${this.baseUrl}/api/Bills/GetBillsHeaderCount`, { params: httpParams });
  }
}
