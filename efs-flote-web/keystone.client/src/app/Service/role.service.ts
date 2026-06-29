import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface TabAccess {
  tabName: string;
  requiredRoles: string[];
}

interface ActionAccess {
  actionName: string;
  requiredRoles: string[];
}

/**
 * Centralized role and permission management service
 * Handles all tab access and action permissions in one place
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private userRolesSubject = new BehaviorSubject<string[]>([]);
  public userRoles$: Observable<string[]> = this.userRolesSubject.asObservable();

  private _userRoles: string[] = [];

  // IIQ - Permissions - Role Catalog
  /*
    ProcurementUser
    - Access to upload and view SFABRAs and related reports.
  
    AirlineFinanceAdminUser
    - Admin access for SFABRA processing (full processing / admin capabilities).
    
    AirlineFinanceSupportUser
    - Support-level access for SFABRA processing (operational support tasks).

    IEUser
    - Access to SFABRA reporting (report consumption / analytics).
    
    GatewayUser
     - Access to upload flight confirmations (Gateway uploads).
    
    FuelUser
    - Access to enter and maintain fuel information (fuel rates / fuel data).
    
   SystemAdminUser
    - Used by UTG staff for application support (broad access for support/admin tasks).
  */

  // Supported Roles
  private readonly supportedRoles = [
    'ProcurementUser',
    'AirlineFinanceAdminUser',
    'AirlineFinanceSupportUser',
    'IEUser',
    'GatewayUser',
    'FuelUser',
    'SystemAdminUser',
  ];

  // Tab Access Config (grouped by functional area, roles aligned to IIQ)
  private readonly tabAccessConfig: TabAccess[] = [
    { tabName: 'Upload SFABRA', requiredRoles: ['ProcurementUser', 'SystemAdminUser'] },
    { tabName: 'View SFABRA', requiredRoles: ['ProcurementUser', 'SystemAdminUser', 'AirlineFinanceAdminUser', 'AirlineFinanceSupportUser'] },
    { tabName: 'SFABRA Listing Report', requiredRoles: ['ProcurementUser', 'SystemAdminUser'] },
    { tabName: 'Admin Updates', requiredRoles: ['ProcurementUser', 'SystemAdminUser'] },
    { tabName: 'File Upload', requiredRoles: ['SystemAdminUser', 'AirlineFinanceAdminUser', 'AirlineFinanceSupportUser'] },
    { tabName: 'Upload Gateway', requiredRoles: ['SystemAdminUser',] },
    { tabName: 'Adhoc Upload', requiredRoles: ['SystemAdminUser'] },
    { tabName: 'Fuel Rate', requiredRoles: ['SystemAdminUser', 'AirlineFinanceAdminUser', 'AirlineFinanceSupportUser'] },
    { tabName: 'Uploaded Contracts', requiredRoles: ['SystemAdminUser'] },
    { tabName: 'Monthly Accrual Process - Status', requiredRoles: ['SystemAdminUser', 'AirlineFinanceAdminUser', 'AirlineFinanceSupportUser'] },
    { tabName: 'Validation Worksheet', requiredRoles: ['SystemAdminUser', 'AirlineFinanceAdminUser', 'AirlineFinanceSupportUser'] },
    { tabName: 'Admin Modules', requiredRoles: ['SystemAdminUser', 'AirlineFinanceAdminUser'] },
    { tabName: 'Reports', requiredRoles: ['SystemAdminUser', 'ProcurementUser'] },
    { tabName: 'Sys Admin Modules', requiredRoles: ['SystemAdminUser'] },
  ];

  // Define action-to-role mappings for specific actions
  private readonly actionAccessConfig: ActionAccess[] = [
    { actionName: 'Expire SFABRA', requiredRoles: ['ProcurementUser', 'SystemAdminUser'] },
  ];

  constructor() { }

  /**
   * Set the user roles (typically called after authentication)
   */
  setUserRoles(roles: string[]): void {
    this._userRoles = roles || [];
    this.userRolesSubject.next(this._userRoles);
  }

  /**
   * Get the current user roles
   */
  getUserRoles(): string[] {
    return this._userRoles;
  }

  /**
   * Get all supported roles
   */
  getSupportedRoles(): string[] {
    return [...this.supportedRoles];
  }

  /**
   * Check if the user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    if (!roles || roles.length === 0) {
      return true; // No roles required
    }
    if (!this._userRoles || this._userRoles.length === 0) {
      return false; // User has no roles
    }
    return roles.some(role => this._userRoles.includes(role));
  }

  /**
   * Check if the user has ALL of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    if (!roles || roles.length === 0) {
      return true;
    }
    if (!this._userRoles || this._userRoles.length === 0) {
      return false;
    }
    return roles.every(role => this._userRoles.includes(role));
  }

  /**
   * Check if the user has a specific role
   */
  hasRole(role: string): boolean {
    return this._userRoles.includes(role);
  }

  /**
   * Check if user has access to a specific tab by tab name
   */
  hasTabAccess(tabName: string): boolean {
    const tabConfig = this.tabAccessConfig.find(tab => tab.tabName === tabName);
    if (!tabConfig) {
      return false; // Tab not found in configuration
    }
    return this.hasAnyRole(tabConfig.requiredRoles);
  }

  // ✅ NEW: Check if user has access to a specific action by action name
  hasActionAccess(actionName: string): boolean {
    const actionConfig = this.actionAccessConfig.find(action => action.actionName === actionName);
    if (!actionConfig) {
      return false; // Action not found in configuration
    }
    return this.hasAnyRole(actionConfig.requiredRoles);
  }

  // ✅ NEW: Specific methods for common actions
  canExpireSfabra(): boolean {
    return this.hasActionAccess('Expire SFABRA');
  }

  /**
   * Check if user has view access to any tab
   */
  hasViewAccess(): boolean {
    return this.getAccessibleTabs().length > 0;
  }

  /**
   * Check if user has any supported role
   */
  hasSupportedRole(): boolean {
    return this.hasAnyRole(this.supportedRoles);
  }

  /**
   * Get list of tabs the user has access to
   */
  getAccessibleTabs(): string[] {
    return this.tabAccessConfig
      .filter(tab => this.hasAnyRole(tab.requiredRoles))
      .map(tab => tab.tabName);
  }

  // ✅ NEW: Get list of actions the user has access to
  getAccessibleActions(): string[] {
    return this.actionAccessConfig
      .filter(action => this.hasAnyRole(action.requiredRoles))
      .map(action => action.actionName);
  }

  /**
   * Get list of tabs the user does NOT have access to
   */
  getInaccessibleTabs(): string[] {
    return this.tabAccessConfig
      .filter(tab => !this.hasAnyRole(tab.requiredRoles))
      .map(tab => tab.tabName);
  }

  /**
   * Get detailed access information for all tabs
   */
  getTabAccessDetails(): { tabName: string; hasAccess: boolean; requiredRoles: string[] }[] {
    return this.tabAccessConfig.map(tab => ({
      tabName: tab.tabName,
      hasAccess: this.hasAnyRole(tab.requiredRoles),
      requiredRoles: tab.requiredRoles
    }));
  }

  // ✅ NEW: Get detailed access information for all actions
  getActionAccessDetails(): { actionName: string; hasAccess: boolean; requiredRoles: string[] }[] {
    return this.actionAccessConfig.map(action => ({
      actionName: action.actionName,
      hasAccess: this.hasAnyRole(action.requiredRoles),
      requiredRoles: action.requiredRoles
    }));
  }

  /**
   * Check if user should see no access message
   */
  shouldShowNoAccessMessage(): boolean {
    // Show message if user has roles but no access to any tabs
    return this._userRoles.length > 0 && !this.hasViewAccess();
  }

  /**
   * Get appropriate message for no access scenario
   */
  getNoAccessMessage(): string {
    const userRolesList = this._userRoles.join(', ');
    const accessibleTabs = this.getAccessibleTabs();

    if (this._userRoles.length === 0) {
      return 'You do not have any assigned roles. Please contact request access in SailPoint IIQ.';
    }

    if (accessibleTabs.length === 0) {
      return `Your current role(s) (${userRolesList}) do not have access to any tabs. Please request additional roles in SailPoint IIQ.`;
    }

    return 'Access denied.';
  }
}
