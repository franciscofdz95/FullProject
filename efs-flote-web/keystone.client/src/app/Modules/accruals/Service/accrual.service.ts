import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AccrualFilter {
  acctYear?: string;
  acctMonth?: string;
  displayCurr?: string;
  locCode?: string;
}

@Injectable({ providedIn: 'root' })
export class AccrualService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  getAccrualMonthlyReport(filters: AccrualFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/Accrual/GetAccrualMonthlyReport`, filters);
  }

  getAccrualMonthlyDetailReport(filters: AccrualFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/Accrual/GetAccrualMonthlyDetailReport`, filters);
  }

  getAccrualAccuracyReport(filters: AccrualFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/Accrual/GetAccrualAccuracyReport`, filters);
  }
}
