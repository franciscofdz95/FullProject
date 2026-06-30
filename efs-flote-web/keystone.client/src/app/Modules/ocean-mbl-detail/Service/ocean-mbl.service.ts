import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LocationOceanMBLFilter } from '../../../Service/location-oceanmbl.service';

export type OceanMBLDetailFilter = LocationOceanMBLFilter;

@Injectable({ providedIn: 'root' })
export class OceanMBLService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  getOceanMBLSummary(filters: OceanMBLDetailFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/OceanMBL/GetOceanMBLSummary`, filters);
  }
}
