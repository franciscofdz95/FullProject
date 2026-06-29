import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'myapp.currentBranch';

// Geo/security context keys. These mirror the old ExtJS PgAtt session
// attributes (geoCode / geoId) that scoped Location Code lookups per user.
const GEO_CODE_KEY    = 'myapp.geoCode';
const GEO_ID_KEY      = 'myapp.geoId';
const GEO_INDEX_KEY   = 'myapp.geoIndex';   // mirrors Ext.util.Cookies "geoIndex"

/**
 * One element of BIACore.Security.User.permissions[].
 * Field names match the exact JSON keys from the BIASecurity api/user/User endpoint.
 * Observed on Alpha:
 *   { BIA_ID, geoCode, geoId, userId, securityLevel, businessUnitId, RoleId, LevelId,
 *     EA_ProfileId, EA_ProfileName, EA_Invoice_View, EA_APUT_Rejection, ... }
 */
export interface UserPermission {
  geoCode:        string;
  geoId:          string;
  userId:         string;
  securityLevel:  string;
  businessUnitId: string;
  RoleId?:        string;
  LevelId?:       string;
  BIA_ID?:        string;
  EA_ProfileId?:  number;
  EA_ProfileName?: string;
  EA_Invoice_View?:                   number;
  EA_Invoice_Verify?:                 number;
  EA_Invoice_ApproveUnApproveDelete?: number;
  EA_Invoice_DeleteUnapproveOnly?:    number;
  EA_Invoice_LogProcess?:             number;
  EA_APUT_Rejection?:                 number;
  EA_APUT_RejectionScanned?:          number;
  EA_APUT_ViewNSubmitApproval?:       number;
  EA_CreateModifyUsersAccess?:        number;
  appCode?:       string;
  active?:        number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly baseUrl = environment.apiUrl;

  private readonly _currentBranch = new BehaviorSubject<string | null>(null);
  readonly currentBranch$: Observable<string | null> = this._currentBranch.asObservable();

  // === Geo/security context (parity with old ExtJS PgAtt.geoCode / PgAtt.geoId) ===
  private readonly _geoCode = new BehaviorSubject<string>('');
  private readonly _geoId   = new BehaviorSubject<string>('');
  /** Observable geo context for reactive consumers. */
  readonly geoCode$: Observable<string> = this._geoCode.asObservable();
  readonly geoId$:   Observable<string> = this._geoId.asObservable();

  /**
   * Full permissions list — mirrors BIACore.Security.User.permissions[].
   * Populated by loadUserPermissions(); switch active geo with setGeoIndex().
   */
  permissions: UserPermission[] = [];

  /** Index into permissions[] — mirrors the old "geoIndex" cookie. */
  private _geoIndex = 0;

  constructor(private http: HttpClient) {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    this._currentBranch.next(saved || null);

    // Restore geo context from sessionStorage (matches PgAtt session persistence)
    this._geoCode.next(sessionStorage.getItem(GEO_CODE_KEY) || '');
    this._geoId.next(sessionStorage.getItem(GEO_ID_KEY)     || '');
    this._geoIndex = parseInt(sessionStorage.getItem(GEO_INDEX_KEY) || '0', 10);

    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.storageArea !== sessionStorage) return;
      if (e.key === STORAGE_KEY)       this._currentBranch.next(e.newValue ?? null);
      else if (e.key === GEO_CODE_KEY) this._geoCode.next(e.newValue ?? '');
      else if (e.key === GEO_ID_KEY)   this._geoId.next(e.newValue ?? '');
      else if (e.key === GEO_INDEX_KEY) this._geoIndex = parseInt(e.newValue || '0', 10);
    });
  }

  getUserIDByUsername(userName: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/Session/GetUserIDByUserName?userName=${userName}`);
  }

  /**
   * Returns ALL geo-permission rows for the user.
   * Equivalent to BIACore.Security.User.permissions[] in the old ExtJS app.
   * Call this once on login, then use setGeoIndex() to switch the active context
   * — mirroring Viewport.cnt.js which read permissions[geoIndex].geoCode/geoId.
   *
   * Source: appObject.usp_Get_User_Profile_FV2  (@sysm = short AD login).
   */
  getUserPermissions(userName: string): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(
      `${this.baseUrl}/api/Session/GetUserPermissions?userName=${encodeURIComponent(userName)}`
    );
  }

  /**
   * Fetches the user's geoCode and geoId from the Flote user profile (first row only).
   * Use getUserPermissions() for the full list.
   */
  getUserGeoContext(userName: string): Observable<{ geoCode: string; geoId: string; debug?: any }> {
    return this.http.get<{ geoCode: string; geoId: string; debug?: any }>(
      `${this.baseUrl}/api/Session/GetUserGeoContext?userName=${encodeURIComponent(userName)}`
    );
  }

  // === currentBranch ===
  get currentBranch(): string | null { return this._currentBranch.value; }
  setCurrentBranch(branch: string | null): void {
    this._currentBranch.next(branch);
    branch == null
      ? sessionStorage.removeItem(STORAGE_KEY)
      : sessionStorage.setItem(STORAGE_KEY, branch);
  }

  // === Geo/security context accessors (parity with old ExtJS PgAtt) ===

  /** Synchronous read — PgAtt.getGeoCode() equivalent. */
  get geoCode(): string { return this._geoCode.value; }

  /** Synchronous read — PgAtt.getGeoId() equivalent. */
  get geoId(): string   { return this._geoId.value; }

  /** Current geoIndex — mirrors the old "geoIndex" cookie. */
  get geoIndex(): number { return this._geoIndex; }

  /**
   * Switch the active geo by index into permissions[].
   * Mirrors GeoSRSwitchCtrl.cnt.js:
   *   PgAtt.setGeoCode(permissions[c.autoEl.itemId].geoCode)
   *   PgAtt.setGeoId  (permissions[c.autoEl.itemId].geoId)
   */
  setGeoIndex(index: number): void {
    if (index < 0 || index >= this.permissions.length) return;
    this._geoIndex = index;
    sessionStorage.setItem(GEO_INDEX_KEY, String(index));
    const p = this.permissions[index];
    this.setGeoContext(p.geoCode, p.geoId);
  }

  /**
   * Persist the user's geo/security context for the session.
   * Mirrors PgAtt.setGeoCode / PgAtt.setGeoId from the old ExtJS app.
   */
  setGeoContext(geoCode: string | null | undefined, geoId: string | null | undefined): void {
    const code = geoCode ?? '';
    const id   = geoId   ?? '';
    this._geoCode.next(code);
    this._geoId.next(id);
    code ? sessionStorage.setItem(GEO_CODE_KEY, code) : sessionStorage.removeItem(GEO_CODE_KEY);
    id   ? sessionStorage.setItem(GEO_ID_KEY,   id)   : sessionStorage.removeItem(GEO_ID_KEY);
  }

  /** Clear on logout. */
  clear(): void {
    this._currentBranch.next(null);
    sessionStorage.removeItem(STORAGE_KEY);
    this._geoCode.next('');
    this._geoId.next('');
    this.permissions = [];
    this._geoIndex = 0;
    sessionStorage.removeItem(GEO_CODE_KEY);
    sessionStorage.removeItem(GEO_ID_KEY);
    sessionStorage.removeItem(GEO_INDEX_KEY);
  }
}


