import { APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './main-layout/footer/footer.component';
import { NavigationComponent } from './main-layout/navigation/navigation.component';
import { HeaderComponent } from './main-layout/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminComponent } from './Modules/admin/admin.component';
import { MsalModule, MsalService, MsalGuard, MsalBroadcastService, MsalRedirectComponent, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration,ProtectedResourceScopes, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, IPublicClientApplication } from '@azure/msal-browser';
import { AuthService } from './auth-service';
import { fetchEnvironmentConfig } from '../environments/environment';
import { getAzureAdConfig, getProtectedResources, getLoginRequest } from './auth-config';
import { ReportsComponent } from './Modules/reports/reports.component';
import { CustomInputMoneyComponent } from './CustomComponents/custom-input-money/custom-input-money.component';
import { CustomSelectMonthComponent } from './CustomComponents/custom-select-month/custom-select-month.component';
import { SysAdminModulesComponent } from './Modules/sys-admin-module/sys-admin-modules.component';
import { HomeComponent } from './Modules/home/home.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LocalShipmentComponent } from './Modules/local-shipment/local-shipment.component';
import { LocationOceanmblComponent } from './Modules/location-oceanmbl/location-oceanmbl.component';
import { BillsComponent } from './Modules/bills/bills.component';
import { LocationVendorComponent } from './Modules/location-vendor/location-vendor.component';
import { VendorShipmentComponent } from './Modules/vendor-shipment/vendor-shipment.component';
import { VendorsComponent } from './Modules/vendors/vendors.component';
import { AccrualsComponent } from './Modules/accruals/accruals.component';
import { VendorStatementSummaryComponent } from './Modules/vendor-statement-summary/vendor-statement-summary.component';
import { InvoiceProcessingComponent } from './Modules/invoice-processing/invoice-processing.component';
import { PaidDifferentlyComponent } from './Modules/paid-differently/paid-differently.component';
import { CommonModule } from '@angular/common';

// Initialize environment configuration before anything else
export function initializeEnvironment(): () => Promise<void> {
  return () => fetchEnvironmentConfig();
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(getAzureAdConfig());
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResources = getProtectedResources();
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();
  
  protectedResourceMap.set(protectedResources.userAPI.endpoint, [
    {
      httpMethod: 'GET',
      scopes: [...protectedResources.userAPI.scopes.read]
    },
    {
      httpMethod: 'POST',
      scopes: [...protectedResources.userAPI.scopes.create]
    },
    {
      httpMethod: 'PUT',
      scopes: [...protectedResources.userAPI.scopes.update]
    },
    {
      httpMethod: 'DELETE',
      scopes: [...protectedResources.userAPI.scopes.delete]
    }
  ]);

  protectedResourceMap.set('https://graph.microsoft.com/oidc/userinfo', ['profile']);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: getLoginRequest()
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavigationComponent,
    HeaderComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AgGridModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    AdminComponent,
    MsalModule,
    //ESE-1025-2
    ReportsComponent,
    //ESE-0326-2 Custom input for money
    CustomInputMoneyComponent,
    CustomSelectMonthComponent,
    SysAdminModulesComponent,
    HomeComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    LocalShipmentComponent,
    LocationOceanmblComponent,
    BillsComponent,
    LocationVendorComponent,
    VendorShipmentComponent,
    VendorsComponent,
    AccrualsComponent,
    VendorStatementSummaryComponent,
    InvoiceProcessingComponent,
    PaidDifferentlyComponent,
  ],
  providers: [
    // Initialize environment FIRST
    {
      provide: APP_INITIALIZER,
      useFactory: initializeEnvironment,
      multi: true
    },
    /*MSAL - configured after environment is loaded*/
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,
    AuthService,

    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
 
})
export class AppModule { }
