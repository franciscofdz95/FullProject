import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Filter sent to the Shipment Detail grid endpoint (legacy ShipmentRpt).
 * Only ShipmentNumber + DisplayCurr are used by the modal.
 */
export interface ShipmentDetailFilter {
  shipmentNumber?: string;
  displayCurr?: string;
}

/**
 * ShipmentService — Angular counterpart of the legacy ExtJS
 * WebApiReportController (Shipment.cs). One method per legacy endpoint.
 */
@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient) { }

  /** Charge-level detail grid (Origin / Manifested / Destination groups). */
  getShipmentDetails(filter: ShipmentDetailFilter): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/api/Shipment/GetShipmentDetails`, filter);
  }

  /** Single-row customer info (shipper / consignee / freight payer / customer group). */
  getShipmentSummary(shipmentNumber: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/Shipment/GetShipmentSummary?shipmentNumber=${encodeURIComponent(shipmentNumber)}`);
  }

  /** Container Fact rows. */
  getContainerSummary(shipmentNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Shipment/GetContainerSummary?shipmentNumber=${encodeURIComponent(shipmentNumber)}`);
  }

  /** MBL Fact rows. */
  getMBLSummary(shipmentNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Shipment/GetMBLSummary?shipmentNumber=${encodeURIComponent(shipmentNumber)}`);
  }

  /** Reference notes (type 'SHP') for the shipment. */
  getShipmentNotes(shipmentNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Shipment/GetShipmentNotes?shipmentNumber=${encodeURIComponent(shipmentNumber)}`);
  }

  /** Add a reference note (type 'SHP'). */
  addShipmentNote(shipmentNumber: string, notes: string, userName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Shipment/AddShipmentNote`, {
      shipmentNumber,
      notes,
      userName
    });
  }

  /** Hide (soft-delete) a shipment note by frn_id. */
  deleteShipmentNote(noteId: number): Observable<any> {
    // Try legacy ExtJS route name first, then fallback to currently deployed route.
    return this.http.post<any>(`${this.baseUrl}/api/Shipment/DeleteShipmentNoteByNoteId`, { NoteId: noteId }).pipe(
      catchError(() => this.http.post<any>(`${this.baseUrl}/api/Shipment/DeleteShipmentNote`, { NoteId: noteId }))
    );
  }
}
