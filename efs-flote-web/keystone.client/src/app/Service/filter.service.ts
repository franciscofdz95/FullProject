import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SessionService } from './session.service';

export interface FilterOption {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private get baseUrl(): string {
    return environment.apiUrl || environment.hostApi || '';
  }

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  getAccountingYears(): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/AcctYear`);
  }

  getAccountingMonths(): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/AcctMonth`);
  }

  getDisplayCurrencies(locationCode: string = '', countryCode: string = ''): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/DisplayCurrency?locationCode=${locationCode}&countryCode=${countryCode}`);
  }

  getLocationTypes(): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/LocType`);
  }

  getLocationCodes(geoCode: string = '', geoId: string = '', locationCode: string = ''): Observable<FilterOption[]> {
    // Parity with old ExtJS LocCode/Origin/Destination combos: the geo context
    // (geoCode/geoId) was always taken from the user's session (PgAtt.getGeoCode()
    // / PgAtt.getGeoId()) in the store's beforeload listener. Default to the
    // session geo context here so every call site is scoped to the user's geo,
    // while still allowing an explicit override when needed.
    const effectiveGeoCode = geoCode || this.sessionService.geoCode;
    const effectiveGeoId = geoId || this.sessionService.geoId;

    const params = new HttpParams()
      .set('geoCode', effectiveGeoCode)
      .set('geoId', effectiveGeoId)
      .set('locationCode', locationCode);

    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/LocationCode`, { params });
  }

  getServiceCodes(): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/ServiceCode`);
  }

  // === ADVANCED FILTER API METHODS ===
  // Matches old ExtJS: api/WebAPIFilter/* endpoints

  /** Country codes - typeahead (old ExtJS: api/WebAPIFilter/Country, minChars: 2) */
  getCountryCodes(query: string = ''): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/Country?query=${query}`);
  }

  /** Company codes - typeahead (old ExtJS: api/WebAPIFilter/CompanyCode, minChars: 2) */
  getCompanyCodes(query: string = ''): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/CompanyCode?query=${query}`);
  }

  /** MBL Cost Basis (old ExtJS: api/WebAPIFilter/MBLCostBasis) */
  getMblCostBasis(): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/MBLCostBasis`);
  }

  /** MBL Numbers - typeahead (old ExtJS: api/WebAPIFilter/MBLNo, minChars: 3) */
  getMblNumbers(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/MBLNo?query=${query}`);
  }

  /** Container Numbers - typeahead (old ExtJS: api/WebAPIFilter/ContainerNo, minChars: 3) */
  getContainerNumbers(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/ContainerNo?query=${query}`);
  }

  /** Shipment Numbers - typeahead (old ExtJS: api/WebAPIFilter/ShipmentNo, minChars: 3) */
  getShipmentNumbers(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/ShipmentNo?query=${query}`);
  }

  /** Carrier BOL - typeahead (old ExtJS: api/WebAPIFilter/CarrierBOL, minChars: 3) */
  getCarrierBols(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/CarrierBOL?query=${query}`);
  }

  /** Vendor Codes - typeahead (old ExtJS: api/WebAPIFilter/VendorCode, minChars: 3) */
  getVendorCodes(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/VendorCode?query=${query}`);
  }

  /** Invoice Reference Numbers - typeahead (old ExtJS: api/WebAPIFilter/InvRefNo, minChars: 3) */
  getInvoiceRefNos(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/InvRefNo?query=${query}`);
  }

  /** Charge Codes - typeahead (old ExtJS: api/WebAPIFilter/ChargeCode, minChars: 2) */
  getChargeCodes(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/ChargeCode?query=${query}`);
  }

  /** Location Country - typeahead (old ExtJS: api/WebAPIFilter/LocCountry, minChars: 3) */
  getLocCountry(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/LocCountry?query=${query}`);
  }

  /** Location Region - dropdown (old ExtJS: api/WebAPIFilter/LocRegion, default 'All') */
  getLocRegion(): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/LocRegion`);
  }

  /** Reason (Paid Differently) - typeahead (old ExtJS: api/WebAPIFilter/Reason, minChars: 3) */
  getReasons(query: string): Observable<FilterOption[]> {
    return this.http.get<FilterOption[]>(`${this.baseUrl}/api/Filter/Reason?query=${query}`);
  }
}
