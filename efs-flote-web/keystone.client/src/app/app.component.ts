import { Component, OnInit, Output, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser';
import { RoleService } from './Service/role.service';
import { EncryptionService } from './Service/encryption.service';
import { SessionService } from './Service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @Output() appCode = '';
  isAppReady: boolean = false;
  isStandAlonePage: boolean = false;
  private baseUrl = environment.apiUrl;
  isLoggedIn = false;
  public userName: string = '';
  public userAccount: string = '';
  userRoles: string[] = [];

  private readonly destroying$ = new Subject<void>();

  //Session Services
  private sessionService = inject(SessionService);
  private encryptionService = inject(EncryptionService);
  sessionSuscription !: Subscription;
  encryptionSubscription !: Subscription;
  //Session variable

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private roleService: RoleService // Inject RoleService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).
      subscribe((event) => {
        const navEnd = event as NavigationEnd;
        this.isStandAlonePage = navEnd.urlAfterRedirects === '/request-access'
      });
  }

  ngOnInit(): void {
    
    this.broadcastService.inProgress$
      .pipe(takeUntil(this.destroying$))
      .subscribe((status: InteractionStatus) => {
        if (status === InteractionStatus.None) {
          this.setActiveAccount();
        }
      });
  }

  clearAuthCache() {
    sessionStorage.clear();
  }

  setActiveAccount(): void {
    let activeAccount = this.authService.instance.getActiveAccount();

    //ESE-0326-2
    if (activeAccount?.username != null)
    this.loadUserID(activeAccount?.username);
    
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      activeAccount = this.authService.instance.getAllAccounts()[0];
      this.authService.instance.setActiveAccount(activeAccount);
    }

    if (activeAccount) {
      this.isLoggedIn = true;
      this.userAccount = activeAccount.username.split('@')[0];
      this.userName = activeAccount.name || '';
      this.userRoles = activeAccount.idTokenClaims?.roles || [];
      
      // Set roles in RoleService
      this.roleService.setUserRoles(this.userRoles);

      // Log all MSAL id-token claims so we can check if geoCode is already there.
      console.log('[GeoContext] MSAL idTokenClaims:', activeAccount.idTokenClaims);

      // usp_Get_User_Profile_FV2 expects @sysm = short Windows login (e.g. "ztb1yff"),
      // NOT the full UPN ("ztb1yff@ups.com") — strip the domain part first.
      const shortLogin = activeAccount.username.split('@')[0];
      this.loadGeoContext(shortLogin);
    } else {
      console.log('No active account found. User needs to log in.');
      this.authService.loginRedirect();
    }  }

  hasSupportedRole(): boolean {
    // return this.roleService.hasSupportedRole();
    return true;
  }

  get hasViewAccess(): boolean {
    return this.roleService.hasViewAccess();
  }

  get showNoAccessMessage(): boolean {
    return this.userRoles.length > 0 && !this.hasViewAccess;
  }

  login(): void {
    this.authService.loginRedirect();
  }

  logout(): void {
    this.authService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }

  title = 'keystone.client';

  /**
   * Seed the geo/security context by loading ALL user permissions and
   * selecting the active one by geoIndex (default 0, persisted in sessionStorage).
   *
   * Mirrors the old ExtJS startup chain exactly:
   *   BIACore.Security.User.onLoad() → api/user/User → permissions[]
   *   Viewport.cnt.js → geoCode = permissions[geoIndex].geoCode
   *                     geoId   = permissions[geoIndex].geoId
   *   PgAtt.setGeoCode / setGeoId
   *
   * Source DB: appObject.usp_Get_User_Profile_FV2 (@sysm = shortLogin).
   */
  private loadGeoContext(shortLogin: string): void {
    if (this.sessionService.geoCode) {
      console.log('[GeoContext] already set:', this.sessionService.geoCode);
      return;
    }
    console.log('[GeoContext] calling GetUserPermissions with shortLogin=', shortLogin);
    this.sessionService.getUserPermissions(shortLogin).subscribe({
      next: (perms) => {
        if (!perms || perms.length === 0) {
          console.warn('[GeoContext] no permission rows returned for shortLogin=', shortLogin,
            '— falling back to GetUserGeoContext');
          this.loadGeoContextFallback(shortLogin);
          return;
        }

        // Store full list so geo-switching is possible (like GeoSRSwitchCtrl)
        this.sessionService.permissions = perms;
        console.log('[GeoContext] permissions loaded:', perms.length, 'rows', perms);

        // Activate by geoIndex (mirrors Viewport.cnt.js geoIndex cookie)
        const idx = this.sessionService.geoIndex;
        const safeIdx = idx < perms.length ? idx : 0;
        this.sessionService.setGeoIndex(safeIdx);
        console.log('[GeoContext] ✓ active index=' + safeIdx
          + ' geoCode=' + perms[safeIdx].geoCode
          + ' geoId='   + perms[safeIdx].geoId);
      },
      error: (err) => {
        console.error('[GeoContext] GetUserPermissions failed, trying fallback:', err);
        this.loadGeoContextFallback(shortLogin);
      }
    });
  }

  /** Fallback: original single-row endpoint (debug helper). */
  private loadGeoContextFallback(shortLogin: string): void {
    this.sessionService.getUserGeoContext(shortLogin).subscribe({
      next: (ctx) => {
        console.log('[GeoContext] fallback raw response:', ctx);
        if (ctx.debug) {
          console.log('[GeoContext] SP columns:', Object.keys(ctx.debug));
        } else {
          console.warn('[GeoContext] debug=null — SP returned zero rows for shortLogin=', shortLogin);
        }
        if (ctx.geoCode) {
          this.sessionService.setGeoContext(ctx.geoCode, ctx.geoId);
          console.log('[GeoContext] ✓ fallback set geoCode=' + ctx.geoCode + ' geoId=' + ctx.geoId);
        } else {
          console.warn('[GeoContext] geoCode still empty — location typeaheads will not work.');
        }
      },
      error: (err) => console.error('[GeoContext] fallback API call failed:', err)
    });
  }

  //Load userID encrypted
  async loadUserID(currentAccount: string) {
    let sessionID = 0;
    /*this.sessionSuscription = await this.sessionService.getUserIDByUsername(currentAccount).subscribe({
      next: (response) => {

        sessionID = response;
        this.assignSessionID(sessionID);
      },
      error: (error) => {
        console.log('Error getting session ID', error);
      }
    });*/
    
  }

  async assignSessionID(sessionID: number) {
 
    const responseEncrypt = await this.encryptionService.encrypt(sessionID, environment.encryptionKey);

    this.sessionService.setCurrentBranch(responseEncrypt);

  }
}
