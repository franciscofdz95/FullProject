import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import saveAs from 'file-saver';
import { UploadedFile } from '../../../Models/Upload.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  
  getReportResult(id: number, parameters: string | null): Observable<string> {
    const paramsList = parameters ? parameters.split(';;') : [];
    let params = new HttpParams().set('procedure', id).set('paramsStr', JSON.stringify(paramsList));

    return this.http.get<string>(`${this.baseUrl}/api/reports/GetSelectedReport`, {params});
  }

  downloadReport(id: number, parameters: string | null): void {
    const paramsList: string[] = [];
    if (parameters != null)
      paramsList.push(parameters);

    let params = new HttpParams().set('procedure', id).set('paramsStr', JSON.stringify(paramsList));

    const today = new Date();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const year = today.getFullYear().toString().slice(-2);
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);

    const formattedDate = `${month}-${day}-${year}_${hours}-${minutes}`;
    const filename = `SFABRA_Report_${formattedDate}.xlsx`;

    this.http.get(`${this.baseUrl}/api/reports/DownloadReport`, { params, responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, filename);
    });
  }

  uploadWriteOffFiles(formData: FormData, periodDate: string): Observable<UploadedFile[]> {
    const params = new HttpParams().set('periodDate', periodDate);
    return this.http.post<UploadedFile[]>(`${this.baseUrl}/api/reports/UploadWriteOffFiles`, formData, { params });
  }

  checkWriteOffFilesBeforeUpload(formData: FormData): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/reports/CheckWriteOffFilesBeforeUpload`, formData);
  }
}
