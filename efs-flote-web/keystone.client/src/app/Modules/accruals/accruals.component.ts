import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccrualMonthlyDetComponent } from './accrual-monthly-det/accrual-monthly-det.component';
import { AccrualAccuracyRepComponent } from './accrual-accuracy-rep/accrual-accuracy-rep.component';
import { Subject, takeUntil } from 'rxjs';
import { RoleService } from '../../Service/role.service';
import { ExecuteService } from '../../Service/execute.service';
import { Paramlist } from '../../Models/Paramlist.model';

@Component({
  standalone: true,
  selector: 'app-accruals',
  templateUrl: './accruals.component.html',
  styleUrl: './accruals.component.css',
  imports: [
    AccrualMonthlyDetComponent,
    AccrualAccuracyRepComponent
  ]
})
export class AccrualsComponent implements AfterViewInit, OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Track user roles and access state
  userRoles: string[] = [];
  accessibleTabs: string[] = [];
  noAccessMessage: string = '';
  activeTab: string = 'accrual-accuracy-report'; // Default active tab

  private suppressNextShownEvent = false;
  private cameFromEmailDeepLink = false;

  // Track the first accessible tab
  firstAccessibleTab: string | null = null;

  isModalActive: boolean = false;
  errorMessage: string | null = null;
  selectedDate: Date | null = null;
  constructor(private roleService: RoleService, private executeService: ExecuteService) { }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  ngOnInit(): void {
    const url = new URL(window.location.href);
    this.cameFromEmailDeepLink = url.searchParams.has('tab');

    // Subscribe to role changes
    this.roleService.userRoles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(roles => {
        this.userRoles = roles;
        this.accessibleTabs = this.roleService.getAccessibleTabs();
        this.noAccessMessage = this.roleService.getNoAccessMessage();

        // Set the first accessible tab
        this.setFirstAccessibleTab();

        this.activateTabFromUrlOrDefault();
      });
    //Filter subscription
    /*this.executeService.execute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {

        if (event.mainTab === 'Accruals' && event.subTab === 'Approved') {
          this.executecall(event.params);
        }
      });*/
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Method to determine the first accessible tab based on display order
  private setFirstAccessibleTab(): void {
    // Define the tab order as they appear in the UI
    const tabOrder = [
      'Accrual Monthly Details',
      'Accrual Accuracy Report',
    ];

    this.firstAccessibleTab = 'Accrual Accuracy Report';


  }

  /**
   * Check if user has access to a specific tab using centralized configuration
   */
  hasTabAccess(tabName: string): boolean {
    return this.roleService.hasTabAccess(tabName);
  }

  // Get the ID of the first accessible tab for UI activation
  getFirstAccessibleTabId(): string | null {
    if (!this.firstAccessibleTab) return null;

    const tabIdMap: { [key: string]: string } = {
      'Accrual Monthly Details': 'accrual-monthly-details',
      'Accrual Accuracy Report': 'accrual-accuracy-report',
    };

    return tabIdMap[this.firstAccessibleTab] || null;
  }

  // Get the pane ID of the first accessible tab
  getFirstAccessibleTabPaneId(): string | null {
    if (!this.firstAccessibleTab) return null;

    const tabPaneMap: { [key: string]: string } = {
      'Accrual Monthly Details': 'accrual-monthly-details-pane',
      'Accrual Accuracy Report': 'accrual-accuracy-report-pane',
    };

    return tabPaneMap[this.firstAccessibleTab] || null;
  }

  get hasViewAccess(): boolean {
    return this.roleService.hasViewAccess();
  }

  get showNoAccessMessage(): boolean {
    return this.roleService.shouldShowNoAccessMessage();
  }

  /**
   * Get formatted list of user's current roles
   */
  get formattedUserRoles(): string {
    return this.userRoles.join(', ');
  }

  /**
   * Get count of accessible tabs
   */
  get accessibleTabCount(): number {
    return this.accessibleTabs.length;
  }

  @ViewChild('tabWrapper', { static: false }) tabWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('tabList', { static: false }) tabList!: ElementRef<HTMLUListElement>;
  @ViewChild('mainTabContent', { static: false }) mainTabContent!: ElementRef<HTMLDivElement>;

  hasHorizontalScroll = false;
  private resizeTimeout: any;

  ngAfterViewInit() {
    this.checkScroll();

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.checkScroll(), 150);
    });

    this.bindClearParamsOnUserTabChange();
  }

  private checkScroll() {
    if (!this.tabList?.nativeElement || !this.tabWrapper?.nativeElement || !this.mainTabContent?.nativeElement) {
      return;
    }

    const listEl = this.tabList.nativeElement;
    const wrapperEl = this.tabWrapper.nativeElement;
    const mainTabContent = this.mainTabContent.nativeElement;

    const hasScroll = listEl.scrollWidth > listEl.clientWidth;
    this.hasHorizontalScroll = hasScroll;

    listEl.classList.toggle('has-scroll', hasScroll);
    wrapperEl.classList.toggle('has-scroll', hasScroll);
    mainTabContent.classList.toggle('has-scroll', hasScroll);
  }

  private activateTabFromUrlOrDefault(): void {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');


    if (!tab) return;

    const tabIdByParam: Record<string, { tabName: string; tabId: string }> = {
      'Home': { tabName: 'Accrual Accuracy Report', tabId: 'accrual-accuracy-report' },
    };

    const target = tabIdByParam[tab];
    if (!target) return;
    if (!this.hasTabAccess(target.tabName)) return;

    this.suppressNextShownEvent = true;

    setTimeout(() => {
      const el = document.getElementById(target.tabId) as HTMLElement | null;
      el?.click();
    }, 0);
  }

  private bindClearParamsOnUserTabChange() {
    const tabs = document.querySelectorAll('#mainTabs a[data-bs-toggle="tab"]');

    tabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', () => {
        if (!this.cameFromEmailDeepLink) return;

        if (this.suppressNextShownEvent) {
          this.suppressNextShownEvent = false;
          return;
        }

        const url = new URL(window.location.href);
        if (url.search) {
          url.search = '';
          history.replaceState(null, '', url.toString());
        }

        this.cameFromEmailDeepLink = false;
      });
    });
  }

  executecall(params: Paramlist): void {
    console.log('Execute call in Location OCEAN MBL');
    // Execute report logic here
  }

}

