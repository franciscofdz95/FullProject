import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LocalShipmentFilter {
  acctYear?: string;
  acctMonth?: string;
  displayCurr?: string;
  locCode?: string;
  loctype?: string;
  locCountry?: string;
  locRegion?: string;
  origDest?: string;
  origin?: string;
  destination?: string;
  serviceCode?: string;
  chargeStatus?: string;
  startDate?: string;
  endDate?: string;
  shipmentNumber?: string;
  rcvdAtDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalShipmentService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  getLocalShipmentReport(filters: LocalShipmentFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/LocalShipment/GetLocalShipmentReport`, filters);
  }
}
