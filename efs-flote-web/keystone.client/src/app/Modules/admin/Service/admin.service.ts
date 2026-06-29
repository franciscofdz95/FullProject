import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vendor, Aircraft } from '../../../Models/Admin.model';
import { EmailConfig, EmailConfigPagination } from '../../../Models/EmailConfiguration.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAdminEmailConfiguration(configurationId: number): Observable<EmailConfig> {
    return this.http.get<EmailConfig>(`${this.baseUrl}/api/Admin/GetAdminEmailConfiguration/${configurationId}`);
  }

  getTableAdminEmailConfigurations(filters: EmailConfigPagination): Observable<EmailConfig[]> {
    let params = new HttpParams();

    for (const key of Object.keys(filters) as (keyof EmailConfigPagination)[]) {
      const value = filters[key];

      if (value !== null && value !== undefined) { // Check for null or undefined
        if (Array.isArray(value)) {
          // If the value is an array (from multi-select), append each item
          for (const item of value) {
            params = params.append(key, item);
          }
        } else {
          // If it's a single value (either a number 0 or a comma-separated string), append it directly
          params = params.append(key, value);
        }
      }
    }
    return this.http.get<EmailConfig[]>(`${this.baseUrl}/api/Admin/GetTableAdminEmailConfigurations`, { params });
  }

  getNotificationEmailConfig(emailConfigId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/Admin/GetNotificationEmailConfig/${emailConfigId}`);
  }

  deleteNotificationEmailConfig(notificationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/Admin/DeleteNotificationEmailConfig/${notificationId}`);
  }

  addNotificationEmailConfig(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Admin/AddNotificationEmailConfig`, payload);
  }

}
