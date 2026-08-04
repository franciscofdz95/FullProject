import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ValuePayLocationRow, ValuePayLocationUpdateRequest } from '../../../Models/ValuePayLocation.model';

@Injectable({
  providedIn: 'root'
})
export class ValuePayLocationsAdminService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(reqLoc: string): Observable<ValuePayLocationRow[]> {
    return this.http.get<ValuePayLocationRow[]>(`${this.baseUrl}/api/ValuePayLocations/GetAll?reqLoc=${encodeURIComponent(reqLoc)}`);
  }

  updateLocation(request: ValuePayLocationUpdateRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/ValuePayLocations/Update`, request);
  }
}
