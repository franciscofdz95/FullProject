import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LocationOceanMBLFilter {
  acctYear?: string;
  acctMonth?: string;
  displayCurr?: string;
  loctype?: string;
  origDest?: string;
  locCode?: string;
  origin?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  mblCostBasis?: string;
  mblNumber?: string;
  containerNumber?: string;
  shipmentNumber?: string;
  carrierBol?: string;
  chargeStatus?: string;
  origDestAdv?: string;
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationOceanMBLService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  getLocationOceanMBLReport(filters: LocationOceanMBLFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/LocationOceanMBL/GetLocationOceanMBLReport`, filters);
  }
}
