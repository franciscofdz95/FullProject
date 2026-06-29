import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, PopupRequest, EventMessage, EventType, InteractionStatus, RedirectRequest, InteractionType } from '@azure/msal-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { filter, Observable, takeUntil, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  loggedIn = false;
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.initializeAuth();
  }

  initializeAuth() {
    this.authService.instance.handleRedirectPromise().then(() => {
      this.attemptSilentLogin();
    });

    this.authService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.checkoutAccount();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.checkoutAccount();
        this.checkAndSetActiveAccount();
      });
  }

  private attemptSilentLogin() {
    // If an account is already in cache, set it and return
    if (this.authService.instance.getAllAccounts().length > 0) {
      this.checkAndSetActiveAccount();
      return;
    }

    // Attempt to sign in silently with the existing browser session
    this.authService.instance.ssoSilent({
      scopes: ['openid', 'profile'],
    }).then(result => {
      this.authService.instance.setActiveAccount(result.account);
      this.checkoutAccount();
    }).catch(error => {
      // Silent login failed. The user will need to log in interactively.
      console.log('Silent login failed:', error);
    });
  }

  checkoutAccount() {
    this.loggedIn = !!this.authService.instance.getActiveAccount();
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    this.checkoutAccount(); // Update loggedIn status
  }

  getUserDetails() {
    const profileData = this.authService.instance.getActiveAccount() || this.authService.instance.getAllAccounts()[0];
    const displayName = profileData?.name || 'User';
    const mail = profileData?.username || '';
    const userPrincipalName = profileData?.username.split("@")[0] || '';

    return {
      displayName,
      mail,
      userPrincipalName
    };
  }

  async logIn() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.instance.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.instance.loginRedirect();
      }
    }
  }

  logOut() {
    const activeAccount = this.authService.instance.getActiveAccount() || this.authService.instance.getAllAccounts()[0];

    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        account: activeAccount,
      });
    } else {
      this.authService.logoutRedirect({
        account: activeAccount,
      });
    }
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }
}


