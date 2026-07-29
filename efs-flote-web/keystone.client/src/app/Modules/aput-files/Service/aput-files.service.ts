import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FtpFolder, FtpFile, FtpFilePagination } from '../../../Models/FtpFiles.model';

@Injectable({
  providedIn: 'root'
})
export class AputFilesService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRootDirectories(): Observable<FtpFolder[]> {
    return this.http.get<FtpFolder[]>(`${this.baseUrl}/api/FtpFiles/GetRootDirectories`);
  }

  getFiles(pagination: FtpFilePagination): Observable<{ data: FtpFile[]; totalCount: number }> {
    let params = new HttpParams()
      .set('folder', pagination.folder)
      .set('pageNumber', pagination.pageNumber)
      .set('pageSize', pagination.pageSize);

    if (pagination.forceRefresh) {
      params = params.set('forceRefresh', pagination.forceRefresh);
    }

    return this.http.get<{ data: FtpFile[]; totalCount: number }>(`${this.baseUrl}/api/FtpFiles/GetFiles`, { params });
  }

  getDownloadUrl(folder: string, fileName: string): string {
    const params = new HttpParams().set('folder', folder).set('fileName', fileName);
    return `${this.baseUrl}/api/FtpFiles/DownloadFile?${params.toString()}`;
  }
}
