import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { RoleService } from '../../Service/role.service';
import { FilterService, FilterOption } from '../../Service/filter.service';
import { Subject, takeUntil, distinctUntilChanged, debounceTime, switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Paramlist } from '../../Models/Paramlist.model';
import { ExecuteService } from '../../Service/execute.service';
import { LocalShipmentComponent } from '../../Modules/local-shipment/local-shipment.component';
import { LocalShipmentFilter } from '../../Modules/local-shipment/Service/local-shipment.service';

interface ViewInfo {
  type: 'tab' | 'subtab';
  mainTab: string;
  mainView: string;
  subTab?: string;
  component: string;
  breadcrumb: string;
}


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent implements AfterViewInit, OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Track user roles and access state
  userRoles: string[] = [];
  accessibleTabs: string[] = [];
  noAccessMessage: string = '';

  private suppressNextShownEvent = false;
  private cameFromEmailDeepLink = false;

  // Track the first accessible tab
  firstAccessibleTab: string | null = null;

  isModalActive: boolean = false;
  errorMessage: string | null = null;
  selectedDate: Date | null = null;

  // Variables for views control
  private enableViewTracking: boolean = true;
  private lastViewSignature: string | null = null;
  private trackingTimeout: any = null;

  
  activeTab: string = '';

  //parameters list

  paramsList: Paramlist = {
      //Main parameters
      accountingyearval: 0,
      accountingmonthval: 0,
      displaycurrentval: '',
      locationtypeval: '',
      inputadvval: '',
      origdestval: '',
      invoicestatval: '',
      accrualstatval: '',
      costtypeval: '',
      scandestval: '',
      paidstatusval: '',
      vendorcodeval: '',
      //Advanced filters
      countryval: '',
      companycodeval: '',
      locationcodeval: '',
      originval: '',
      destinationval: '',
      batchidval: '',
      startdateval: null,
      mblcostbasisval: '',
      mblnumberval: '',
      containernumberval: '',
      shipmentnumval: '',
      carrierbolval: '',
      chargecodeval: '',
      billstatusval: '',
      enddateval: null,
      paidstatusadvval: '',
      servicecodeval: '',
      chargestatusval: '',
      costtypeadvval: '',
      vendorcodeadvval: '',
      invoicerefnoval: '',
      origdestadvval: '',
      receiveddateval: null,
      e2kcarrierval: '',
      //Paid Differently
      paiddifferentlyval: '',
      loccountrypaidval: '',
      locationregval: '',
      shipmentOrigval: '',
      shipmentDestval: '',
      reasonval: '',
      serviceval: '',
      vendorNameval: '',
      masterbillval: ''
  };


  //#region Filters Catalog Flags
  accountingyeardis: boolean = false;
  //accountingyearhid: boolean = false;
  accountingmonthdis: boolean = false;
  //accountingmonthhid: boolean = false;
  displaycurrentdis: boolean = false;
  displaycurrenthid: boolean = true;
  locationtypedis: boolean = false;
  locationtypehid: boolean = true;
  inputadvdis: boolean = false;
  inputadvhid: boolean = true;
  origdestdis: boolean = false;
  origdesthid: boolean = true;
  invoicestatdis: boolean = false;
  invoicestathid: boolean = true;
  accrualstatdis: boolean = false;
  accrualtstathid: boolean = true;
  costtypedis: boolean = false;
  costtypehid: boolean = true;
  scandestdis: boolean = false;
  scandesthid: boolean = true;
  paidstatusdis: boolean = false;
  paidstatushid: boolean = true;
  vendorcodedis: boolean = false;
  vendorcodehid: boolean = true;
  //Advanced filters
  countrydis: boolean = false;
  countryhid: boolean = false;
  companycodedis: boolean = false;
  companycodehid: boolean = false;
  locationcodedis: boolean = false;
  locationcodehid: boolean = false;
  origindis: boolean = false;
  originhid: boolean = false;
  destinationdis: boolean = false;
  destinationhid: boolean = false;
  batchiddis: boolean = false;
  batchidhid: boolean = false;
  startdatedis: boolean = false;
  startdatehid: boolean = false;
  mblcostbasisdis: boolean = false;
  mblcostbasishid: boolean = false;
  mblnumberdis: boolean = false;
  mblnumberhid: boolean = false;
  containernumberdis: boolean = false;
  containernumberhid: boolean = false;
  shipmentnumdis: boolean = false;
  shipmentnumhid: boolean = false;
  carrierboldis: boolean = false;
  carrierbolhid: boolean = false;
  chargecodedis: boolean = false;
  chargecodehid: boolean = false;
  billstatusdis: boolean = false;
  billstatushid: boolean = false;
  enddatedis: boolean = false;
  enddatehid: boolean = false;
  paidstatusadvdis: boolean = false;
  paidstatusadvhid: boolean = false;
  servicecodedis: boolean = false;
  servicecodehid: boolean = false;
  chargestatusdis: boolean = false;
  chargestatushid: boolean = false;
  costtypeadvdis: boolean = false;
  costtypeadvhid: boolean = false;
  vendorcodeadvdis: boolean = false;
  vendorcodeadvhid: boolean = false;
  invoicerefnodis: boolean = false;
  invoicerefnohid: boolean = false;
  origdestadvdis: boolean = false;
  origdestadvhid: boolean = false;
  receiveddatedis: boolean = false;
  receiveddatehid: boolean = false;
  e2kcarrierdis: boolean = false;
  e2kcarrierhid: boolean = false;
  //Paid Differently
  paiddifferentlyhid: boolean = false;
  //#endregion Filters Catalog Flags

  // subtabs
  private readonly TABS_WITH_SUBVIEWS = new Set(['Bills', 'Accruals']);

  @ViewChild('tabWrapper', { static: false }) tabWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('tabList', { static: false }) tabList!: ElementRef<HTMLUListElement>;
  @ViewChild('mainTabContent', { static: false }) mainTabContent!: ElementRef<HTMLDivElement>;
  @ViewChild(LocalShipmentComponent) localShipmentComponent!: LocalShipmentComponent;

  // Filter model values for local shipment
  filterAcctYear: string = '';
  filterAcctMonth: string = '';
  filterDisplayCurr: string = '';
  filterLocType: string = 'DEP';
  filterLocCode: string = '';
  filterOrigDest: string = '';
  filterServiceCode: string = '';
  filterChargeStatus: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';

  // Filter dropdown data arrays
  accountingYearOptions: FilterOption[] = [];
  accountingMonthOptions: FilterOption[] = [];
  accountingMonthFilteredOptions: FilterOption[] = [];
  displayCurrencyOptions: FilterOption[] = [];
  locationTypeOptions: { value: string; text: string }[] = [
    { value: 'DEP', text: 'DEP' },
    { value: 'TP', text: 'TP' }
  ];
  locationCodeOptions: FilterOption[] = [];
  locationCodeTypeahead$ = new Subject<string>();
  locationCodeLoading = false;

  // === ADVANCED FILTER DROPDOWN OPTIONS (matching old ExtJS) ===
  // Static dropdowns (local data - no API call)
  advChargeStatusOptions = [
    { value: '', text: 'All' },
    { value: 'I', text: 'Invoiced' },
    { value: 'U', text: 'Unreleased' }
  ];
  advCostTypeOptions = [
    { value: '', text: 'All' },
    { value: 'L', text: 'Local' },
    { value: 'M', text: 'Manifested' }
  ];
  advOrigDestOptions = [
    { value: '', text: 'All' },
    { value: 'O', text: 'Origin' },
    { value: 'D', text: 'Destination' }
  ];
  advBillStatusOptions = [
    { value: 'All', text: 'All' },
    { value: 'Logged', text: 'Logged' },
    { value: 'Pending', text: 'Pending' },
    { value: 'Verified', text: 'Verified' },
    { value: 'Approved', text: 'Approved' },
    { value: 'Printed', text: 'Printed' },
    { value: 'Scanned', text: 'Scanned' },
    { value: 'Queued', text: 'Queued' },
    { value: 'Sent', text: 'Sent' },
    { value: 'Archived', text: 'Archived' }
  ];
  advPaidStatusOptions = [
    { value: 'All', text: 'All' },
    { value: 'Never Validated', text: 'Never Validated' },
    { value: 'Validated', text: 'Validated' },
    { value: 'Paid', text: 'Paid' },
    { value: 'Hold', text: 'Hold' },
    { value: 'Scheduled', text: 'Scheduled' }
  ];
  advMblCostBasisOptions: FilterOption[] = [];

  // Country typeahead (old ExtJS: api/WebAPIFilter/Country, minChars: 2 - remote search)
  advCountryOptions: FilterOption[] = [];
  advCountryTypeahead$ = new Subject<string>();
  advCountryLoading = false;

  // Company Code typeahead (old ExtJS: api/WebAPIFilter/CompanyCode, minChars: 2 - remote search)
  advCompanyCodeOptions: FilterOption[] = [];
  advCompanyCodeTypeahead$ = new Subject<string>();
  advCompanyCodeLoading = false;

  // API-loaded dropdowns
  advServiceCodeOptions: FilterOption[] = [];

  // Typeahead-based dropdowns (min 3 chars, API search)
  advMblNumberOptions: FilterOption[] = [];
  advMblNumberTypeahead$ = new Subject<string>();
  advMblNumberLoading = false;

  advContainerNumberOptions: FilterOption[] = [];
  advContainerTypeahead$ = new Subject<string>();
  advContainerLoading = false;

  advShipmentNumberOptions: FilterOption[] = [];
  advShipmentTypeahead$ = new Subject<string>();
  advShipmentLoading = false;

  advCarrierBolOptions: FilterOption[] = [];
  advCarrierBolTypeahead$ = new Subject<string>();
  advCarrierBolLoading = false;

  advVendorOptions: FilterOption[] = [];
  advVendorTypeahead$ = new Subject<string>();
  advVendorLoading = false;

  advInvoiceRefNoOptions: FilterOption[] = [];
  advInvoiceRefNoTypeahead$ = new Subject<string>();
  advInvoiceRefNoLoading = false;

  // Charge Code typeahead (old ExtJS: api/WebAPIFilter/ChargeCode, minChars: 2)
  advChargeCodeOptions: FilterOption[] = [];
  advChargeCodeTypeahead$ = new Subject<string>();
  advChargeCodeLoading = false;

  // Origin typeahead (old ExtJS: api/WebAPIFilter/LocationCode, minChars: 3)
  advOriginOptions: FilterOption[] = [];
  advOriginTypeahead$ = new Subject<string>();
  advOriginLoading = false;

  // Destination typeahead (old ExtJS: api/WebAPIFilter/LocationCode, minChars: 3)
  advDestinationOptions: FilterOption[] = [];
  advDestinationTypeahead$ = new Subject<string>();
  advDestinationLoading = false;

  // Location Country typeahead (old ExtJS: api/WebAPIFilter/LocCountry, minChars: 3)
  advLocCountryOptions: FilterOption[] = [];
  advLocCountryTypeahead$ = new Subject<string>();
  advLocCountryLoading = false;

  // Location Region dropdown (old ExtJS: api/WebAPIFilter/LocRegion, default 'All')
  advLocRegionOptions: FilterOption[] = [];

  // Reason (Paid Differently) typeahead (old ExtJS: api/WebAPIFilter/Reason, minChars: 3)
  advReasonOptions: FilterOption[] = [];
  advReasonTypeahead$ = new Subject<string>();
  advReasonLoading = false;

  hasHorizontalScroll = false;
  private resizeTimeout: any;
  isCollapsed = false;
  executeService:any
  private filterService: FilterService;
  constructor(private roleService: RoleService, private fb: FormBuilder, private _executeService: ExecuteService, _filterService: FilterService) {
    this.executeService = _executeService;
    this.filterService = _filterService;
  }

  ngOnInit(): void {

    const url = new URL(window.location.href);
    this.cameFromEmailDeepLink = url.searchParams.has('tab');

    // Load filter dropdown data with defaults (matching old ExtJS behavior)
    this.loadFilterDefaults();

    // Subscribe to role changes
    this.roleService.userRoles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(roles => {
        this.userRoles = roles;
       // this.accessibleTabs = this.roleService.getAccessibleTabs();
        this.noAccessMessage = this.roleService.getNoAccessMessage();

        // Set the first accessible tab
        this.setFirstAccessibleTab();

        this.activateTabFromUrlOrDefault();
      });
    //Activate filters for home
    this.homeFilters();
  }

  /**
   * Load all filter dropdown options and set default values.
   * Matches old ExtJS defaults:
   *   - AcctYear: current year (e.g., 2026)
   *   - AcctMonth: "All"
   *   - DisplayCurr: "USD"
   *   - LocType: "DEP"
   *   - LocCode: (empty, user types min 3 chars)
   */
  private loadFilterDefaults(): void {
    const currentYear = new Date().getFullYear().toString();

    // Seed the default year up-front so the month cascade has a year to filter
    // by regardless of which API (years vs months) resolves first.
    if (!this.filterAcctYear) {
      this.filterAcctYear = currentYear;
    }

    // Load Accounting Years
    this.filterService.getAccountingYears()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FilterOption[]) => {
          this.accountingYearOptions = data;
          // Default to current year (old ExtJS: year = new Date().getFullYear())
          this.filterAcctYear = currentYear;
          // Re-scope months now that the default year is confirmed (handles the
          // case where the months API resolved before this one).
          this.filterMonthsForYear(this.filterAcctYear);
        },
        error: (err: any) => {
          console.error('Error loading accounting years:', err);
          // Fallback: generate a reasonable list
          const years = [];
          for (let y = new Date().getFullYear(); y >= 2015; y--) {
            years.push({ Accounting_Year: y.toString() });
          }
          this.accountingYearOptions = years;
          this.filterAcctYear = currentYear;
          this.filterMonthsForYear(this.filterAcctYear);
        }
      });

    // Load Accounting Months
    this.filterService.getAccountingMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FilterOption[]) => {
          this.accountingMonthOptions = data;
          // Default to "All" (old ExtJS: value = new Date().getMonth() + 1, but screenshot shows "All")
          this.filterAcctMonth = 'All';
          // Apply the year cascade for the default year so the month list is
          // scoped from the start (matches ExtJS AcctMon store load filter).
          this.filterMonthsForYear(this.filterAcctYear);
        },
        error: (err: any) => {
          console.error('Error loading accounting months:', err);
          // Fallback
          const months: FilterOption[] = [{ Accounting_Month: 'All', Accounting_Year: '' }];
          for (let m = 1; m <= 12; m++) {
            months.push({ Accounting_Month: m.toString(), Accounting_Year: '' });
          }
          this.accountingMonthOptions = months;
          this.accountingMonthFilteredOptions = months;
          this.filterAcctMonth = 'All';
        }
      });

    // Load Display Currencies (pass current location code as the SP requires @location_code)
    this.loadDisplayCurrencies(this.filterLocCode);

    // Location Type: static (old ExtJS: value = 'DEP')
    this.filterLocType = 'DEP';

    // Location Code typeahead (autocomplete after 3 chars, matching old ExtJS minChars: 3)
    this.locationCodeTypeahead$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) {
          return of([]);
        }
        this.locationCodeLoading = true;
        return this.filterService.getLocationCodes('', '', term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => {
        this.locationCodeOptions = data;
        this.locationCodeLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading location codes:', err);
        this.locationCodeLoading = false;
      }
    });

    // === ADVANCED FILTER: Load API-based dropdown data ===
    this.loadAdvancedFilterData();

    // === ADVANCED FILTER: Setup typeahead subscriptions ===
    this.setupAdvancedTypeaheads();
  }

  /**
   * Called when the user selects or clears a Location Code.
   * Reloads display currencies for the new location, mirroring old ExtJS
   * PageAttributes.getCurrencyCodes(locCode, combo) which sent:
   *   query = locCode + ',' + PgAtt.getCountry_code()
   * ng-select (change) with bindValue fires with the raw bound value (string).
   */
  onLocationCodeChanged(selectedValue: any): void {
    const locCode = selectedValue ?? '';
    const countryCode = String(this.paramsList?.countryval ?? '');
    this.loadDisplayCurrencies(locCode, countryCode);
  }

  /**
   * Load (or reload) display currencies for the given location code + country code.
   * Mirrors old ExtJS PageAttributes.getCurrencyCodes() which called
   * api/WebAPIFilter/DisplayCurrency with query = "locCode,countryCode".
   * SP usp_GetCurrency_FV2 requires both @location_code and @country_code.
   * Default: prefer defaultCurrency==1, else 'USD'.
   */
  private loadDisplayCurrencies(locationCode: string = '', countryCode: string = ''): void {
    this.filterService.getDisplayCurrencies(locationCode, countryCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FilterOption[]) => {
          this.displayCurrencyOptions = data;
          // Keep existing selection if still valid in the new list
          const stillValid = data.some(d => d['currency_code'] === this.filterDisplayCurr);
          if (!stillValid) {
            // Mirror old ExtJS: prefer defaultCurrency==1, else 'USD'
            this.filterDisplayCurr =
              data.find(d => d['defaultCurrency'] === 1)?.['currency_code'] ?? 'USD';
          }
        },
        error: (err: any) => {
          console.error('Error loading display currencies:', err);
          this.displayCurrencyOptions = [
            { currency_code: 'USD' },
            { currency_code: 'EUR' },
            { currency_code: 'CNY' }
          ];
          this.filterDisplayCurr = 'USD';
        }
      });
  }

  private loadAdvancedFilterData(): void {
    // Service Codes (old ExtJS: api/WebAPIFilter/SeviceCode, default 'All')
    this.filterService.getServiceCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FilterOption[]) => {
          this.advServiceCodeOptions = [{ SERVICE_CODE: 'All', Service_Desc: 'All' }, ...data];
        },
        error: (err: any) => console.error('Error loading service codes:', err)
      });

    // NOTE: Country and Company Code are loaded on-demand via server-side
    // typeahead (see setupAdvancedTypeaheads), matching old ExtJS remote
    // combos with minChars: 2 that call api/WebAPIFilter/Country &
    // api/WebAPIFilter/CompanyCode as the user types. They are intentionally
    // NOT eager-loaded here.

    // MBL Cost Basis (old ExtJS: api/WebAPIFilter/MBLCostBasis, default 'All')
    this.filterService.getMblCostBasis()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FilterOption[]) => {
          this.advMblCostBasisOptions = [{ cost_basis_code: 'All', cost_basis_description: 'All' }, ...data];
        },
        error: (err: any) => console.error('Error loading MBL cost basis:', err)
      });

    // Location Region (old ExtJS: api/WebAPIFilter/LocRegion, default 'All')
    this.filterService.getLocRegion()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FilterOption[]) => {
          this.advLocRegionOptions = [{ Loc_Region: 'All' }, ...data];
        },
        error: (err: any) => console.error('Error loading location regions:', err)
      });
  }

  /**
   * Setup typeahead subscriptions for advanced filter fields.
   * Matches old ExtJS: minChars: 3 + remote API calls for autocomplete.
   */
  private setupAdvancedTypeaheads(): void {
    // Country typeahead (old ExtJS: api/WebAPIFilter/Country, minChars: 2 - remote search)
    this.advCountryTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 2) return of([]);
        this.advCountryLoading = true;
        return this.filterService.getCountryCodes(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advCountryOptions = data; this.advCountryLoading = false; },
      error: () => { this.advCountryLoading = false; }
    });

    // Company Code typeahead (old ExtJS: api/WebAPIFilter/CompanyCode, minChars: 2 - remote search)
    this.advCompanyCodeTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 2) return of([]);
        this.advCompanyCodeLoading = true;
        return this.filterService.getCompanyCodes(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advCompanyCodeOptions = data; this.advCompanyCodeLoading = false; },
      error: () => { this.advCompanyCodeLoading = false; }
    });

    // MBL Number typeahead (old ExtJS: api/WebAPIFilter/MBLNo, minChars: 3)
    this.advMblNumberTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advMblNumberLoading = true;
        return this.filterService.getMblNumbers(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advMblNumberOptions = data; this.advMblNumberLoading = false; },
      error: () => { this.advMblNumberLoading = false; }
    });

    // Container Number typeahead (old ExtJS: api/WebAPIFilter/ContainerNo, minChars: 3)
    this.advContainerTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advContainerLoading = true;
        return this.filterService.getContainerNumbers(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advContainerNumberOptions = data; this.advContainerLoading = false; },
      error: () => { this.advContainerLoading = false; }
    });

    // Shipment Number typeahead (old ExtJS: api/WebAPIFilter/ShipmentNo, minChars: 3)
    this.advShipmentTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advShipmentLoading = true;
        return this.filterService.getShipmentNumbers(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advShipmentNumberOptions = data; this.advShipmentLoading = false; },
      error: () => { this.advShipmentLoading = false; }
    });

    // Carrier BOL typeahead (old ExtJS: api/WebAPIFilter/CarrierBOL, minChars: 3)
    this.advCarrierBolTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advCarrierBolLoading = true;
        return this.filterService.getCarrierBols(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advCarrierBolOptions = data; this.advCarrierBolLoading = false; },
      error: () => { this.advCarrierBolLoading = false; }
    });

    // Vendor typeahead (old ExtJS: api/WebAPIFilter/VendorCode, minChars: 3)
    this.advVendorTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advVendorLoading = true;
        return this.filterService.getVendorCodes(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advVendorOptions = data; this.advVendorLoading = false; },
      error: () => { this.advVendorLoading = false; }
    });

    // Invoice Ref No typeahead (old ExtJS: api/WebAPIFilter/InvRefNo, minChars: 3)
    this.advInvoiceRefNoTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advInvoiceRefNoLoading = true;
        return this.filterService.getInvoiceRefNos(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advInvoiceRefNoOptions = data; this.advInvoiceRefNoLoading = false; },
      error: () => { this.advInvoiceRefNoLoading = false; }
    });

    // Charge Code typeahead (old ExtJS: api/WebAPIFilter/ChargeCode, minChars: 2)
    this.advChargeCodeTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 2) return of([]);
        this.advChargeCodeLoading = true;
        return this.filterService.getChargeCodes(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advChargeCodeOptions = data; this.advChargeCodeLoading = false; },
      error: () => { this.advChargeCodeLoading = false; }
    });

    // Origin typeahead (old ExtJS: api/WebAPIFilter/LocationCode, minChars: 3)
    this.advOriginTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advOriginLoading = true;
        return this.filterService.getLocationCodes('', '', term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advOriginOptions = data; this.advOriginLoading = false; },
      error: () => { this.advOriginLoading = false; }
    });

    // Destination typeahead (old ExtJS: api/WebAPIFilter/LocationCode, minChars: 3)
    this.advDestinationTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advDestinationLoading = true;
        return this.filterService.getLocationCodes('', '', term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advDestinationOptions = data; this.advDestinationLoading = false; },
      error: () => { this.advDestinationLoading = false; }
    });

    // Location Country typeahead (old ExtJS: api/WebAPIFilter/LocCountry, minChars: 3)
    this.advLocCountryTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advLocCountryLoading = true;
        return this.filterService.getLocCountry(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advLocCountryOptions = data; this.advLocCountryLoading = false; },
      error: () => { this.advLocCountryLoading = false; }
    });

    // Reason (Paid Differently) typeahead (old ExtJS: api/WebAPIFilter/Reason, minChars: 3)
    this.advReasonTypeahead$.pipe(
      takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300),
      switchMap((term: string) => {
        if (!term || term.length < 3) return of([]);
        this.advReasonLoading = true;
        return this.filterService.getReasons(term);
      })
    ).subscribe({
      next: (data: FilterOption[]) => { this.advReasonOptions = data; this.advReasonLoading = false; },
      error: () => { this.advReasonLoading = false; }
    });
  }

  /**
   * Clear all advanced filter fields.
   * Matches old ExtJS: btnClearAllAD click handler.
   */
  clearAllAdvancedFilters(): void {
    this.paramsList.countryval = '';
    this.paramsList.companycodeval = '';
    this.paramsList.locationcodeval = '';
    this.paramsList.originval = '';
    this.paramsList.destinationval = '';
    this.paramsList.batchidval = '';
    this.paramsList.mblnumberval = '';
    this.paramsList.containernumberval = '';
    this.paramsList.shipmentnumval = '';
    this.paramsList.carrierbolval = '';
    this.paramsList.chargecodeval = '';
    this.paramsList.servicecodeval = '';
    this.paramsList.chargestatusval = '';
    this.paramsList.costtypeadvval = '';
    this.paramsList.vendorcodeadvval = '';
    this.paramsList.invoicerefnoval = '';
    this.paramsList.billstatusval = '';
    this.paramsList.origdestadvval = '';
    this.paramsList.mblcostbasisval = '';
    this.paramsList.paidstatusadvval = '';
    this.paramsList.e2kcarrierval = '';
    // Date fields are blank by default (matches old ExtJS datefields:
    // allowBlank with no initial value). Never default them to "today",
    // otherwise the report is always filtered by today's date.
    this.paramsList.startdateval = null;
    this.paramsList.enddateval = null;
    this.paramsList.receiveddateval = null;
  }

  /**
   * Process advanced filters: close modal and trigger executeTab.
   * Matches old ExtJS: btnProcessAD click → applies filters and loads data.
   */
  processAdvancedFilters(): void {
    this.closeForm();
    this.executeTab();
  }

  /**
   * When the accounting year changes, filter the month dropdown
   * to show only months for that year (matching old ExtJS AcctMon store
   * load filter: rec.Accounting_Year === comboYear.getValue() || month == 'All').
   *
   * NOTE: ng-select's (change) emits the selected item OBJECT while
   * (ngModelChange) / [(ngModel)] use the bound value. We normalize here so
   * the handler is correct regardless of how it is wired, and so the year
   * stored in `filterAcctYear` is always the plain string value (otherwise
   * Number(filterAcctYear) becomes NaN and the API silently falls back to the
   * current year).
   */
  onAcctYearChange(value: any): void {
    // Normalize: accept a plain value ("2026") or an item object ({ Accounting_Year: "2026" }).
    const year = (value && typeof value === 'object')
      ? (value.Accounting_Year ?? '')
      : (value ?? '');

    this.filterAcctYear = year ? year.toString() : '';

    this.filterMonthsForYear(this.filterAcctYear);
  }

  /**
   * Scope the Accounting Month options to the given year, always keeping the
   * "All" entry (matches ExtJS AcctMon store load filter). If the currently
   * selected month no longer belongs to the year, reset it to "All".
   */
  private filterMonthsForYear(year: string): void {
    if (this.accountingMonthOptions && this.accountingMonthOptions.length > 0) {
      this.accountingMonthFilteredOptions = this.accountingMonthOptions.filter(
        (m: any) => String(m.Accounting_Year) === String(year) || m.Accounting_Month === 'All'
      );
    }

    const stillValid = this.accountingMonthFilteredOptions.some(
      (m: any) => m.Accounting_Month === this.filterAcctMonth
    );
    if (!stillValid) {
      this.filterAcctMonth = 'All';
    }
  }

  /**
   * When location code search text changes (min 3 chars), load matching locations.
   */
  onLocationCodeSearch(event: { term: string; items: any[] }): void {
    if (event.term && event.term.length >= 3) {
      this.filterService.getLocationCodes('', '', event.term)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: FilterOption[]) => {
            this.locationCodeOptions = data;
          },
          error: (err: any) => {
            console.error('Error loading location codes:', err);
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.checkScroll();

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.checkScroll(), 150);
    });

    this.bindClearParamsOnUserTabChange();

    // Initialize tracking
    this.initializeViewTracking();

    // Inittial log
    setTimeout(() => {
      this.trackCurrentView();
    }, 500);
  }

  ngOnDestroy(): void {
    // Clear timeouts
    if (this.trackingTimeout) {
      clearTimeout(this.trackingTimeout);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  // Check tab tracking
  private initializeViewTracking(): void {
    
    this.setupMainTabTracking();

    this.setupSubTabTracking();

  }

  private setupMainTabTracking(): void {
    const mainTabsContainer = document.querySelector('#mainTabs');
    
    if (!mainTabsContainer) return;

    // Event delegation: 1 listener 1 container
    mainTabsContainer.addEventListener('shown.bs.tab', (event: Event) => {
      if (!this.enableViewTracking) return;

      // Avoid multiple executions
      this.debouncedTrackView();
    });

  }

  private setupSubTabTracking(): void {
    const mainTabContent = document.querySelector('#mainTabContent');
    
    if (!mainTabContent) return;

    mainTabContent.addEventListener('click', (event: Event) => {
      if (!this.enableViewTracking) return;

      const target = event.target as HTMLElement;
      
      const navLink = target.closest('a.nav-link');
      
      if (navLink && this.isInSubTabContainer(navLink as HTMLElement)) {

        this.debouncedTrackView();
      }
    });

  }

  private isInSubTabContainer(element: HTMLElement): boolean {
    const navTabs = element.closest('.nav-tabs');
    return navTabs !== null && navTabs.id !== 'mainTabs';
  }

  private debouncedTrackView(): void {
    if (this.trackingTimeout) {
      clearTimeout(this.trackingTimeout);
    }

    this.trackingTimeout = setTimeout(() => {
      this.trackCurrentView();
    }, 150); 
  }

  private trackCurrentView(): void {
    if (!this.enableViewTracking) return;

    requestAnimationFrame(() => {
      const viewInfo = this.getCurrentViewInfo();
      
      if (!viewInfo) return;

      const signature = `${viewInfo.mainTab}:${viewInfo.component}`;
      if (this.lastViewSignature === signature) {
        return; 
      }

      this.lastViewSignature = signature;

      this.logViewInfo(viewInfo);
    });
  }

  private getCurrentViewInfo(): ViewInfo | null {
   
    const mainTab = document.querySelector('#mainTabs .nav-link.active') as HTMLElement;
    const mainPane = document.querySelector('#mainTabContent > .tab-pane.active') as HTMLElement;

    if (!mainTab || !mainPane) return null;

    const mainTabName = mainTab.textContent?.trim() || 'Unknown';
    const mainViewId = mainPane.id || 'Unknown';

    if (this.TABS_WITH_SUBVIEWS.has(mainTabName)) {
      const subViewInfo = this.getSubViewInfo(mainPane);
      
      if (subViewInfo) {
        return {
          type: 'subtab',
          mainTab: mainTabName,
          mainView: mainViewId,
          subTab: subViewInfo.name,
          component: subViewInfo.component,
          breadcrumb: `${mainTabName} → ${subViewInfo.name}`
        };
      }
    }

    // Tab without subtabs
    return {
      type: 'tab',
      mainTab: mainTabName,
      mainView: mainViewId,
      component: mainViewId,
      breadcrumb: mainTabName
    };
  }

  // Get subviews to get the active
  private getSubViewInfo(pane: HTMLElement): { name: string; component: string } | null {
    
    const activeNavLink = pane.querySelector('.nav-tabs .nav-link.active') as HTMLElement;
    if (activeNavLink) {
      const name = activeNavLink.textContent?.trim() || 'Unknown';
      
      const visibleComponent = pane.querySelector('[style*="display: block"]') as HTMLElement;
      const component = visibleComponent?.tagName.toLowerCase() || 'unknown';
      
      return { name, component };
    }

    const visibleElement = pane.querySelector('[style*="display: block"]') as HTMLElement;
    if (visibleElement) {
      const component = visibleElement.tagName.toLowerCase();
      const name = this.getDisplayNameFromTag(component);
      
      return { name, component };
    }

    return null;
  }

  private readonly tagNameCache = new Map<string, string>([
    ['app-logged', 'Logged'],
    ['app-pending', 'Pending'],
    ['app-verified', 'Verified'],
    ['app-approved', 'Approved'],
    ['app-printed', 'Printed'],
    ['app-scanned', 'Scanned'],
    ['app-queued', 'Queued'],
    ['app-sent', 'Sent'],
    ['app-archived', 'Archived'],
    ['app-payment-details', 'Payment Details']
  ]);

  private getDisplayNameFromTag(tagName: string): string {
    return this.tagNameCache.get(tagName) || tagName;
  }

  private logViewInfo(info: ViewInfo): void {
    //console.log(`📍 ${info.breadcrumb} | ${info.component} | ${new Date().toLocaleTimeString()}`);
    this.activeTab = info.component;
    this.activeMenus(this.activeTab);
  }

  // Toggle to activate or deactivate tracking
  public toggleViewTracking(enabled?: boolean): void {
    this.enableViewTracking = enabled !== undefined ? enabled : !this.enableViewTracking;
  }

  // Reset log
  public resetViewTracking(): void {
    this.lastViewSignature = null;
  }

  // Get current view
  public getCurrentView(): ViewInfo | null {
    return this.getCurrentViewInfo();
  }

  // Method to determine the first accessible tab based on display order
  private setFirstAccessibleTab(): void {
    // Define the tab order as they appear in the UI
    const tabOrder = [
      'Home',
      'Local Shipment',
      'Location OCEAN MBL',
      'Bills',
      'Location Vendor',
      'Vendor Shipment',
      'Vendors',
      'Accruals',
      'Vendor Statement Summary',
      'Invoice Processing',
      'Paid Differently',
      //ESE-1025-1,2
      'Reports',
      'Sys Admin Modules'
    ];

    this.firstAccessibleTab = 'Home';

  }

  /**
   * Check if user has access to a specific tab using centralized configuration
   */
  hasTabAccess(tabName: string): boolean {
    //return this.roleService.hasTabAccess(tabName);
    return true;
  }

  // Get the ID of the first accessible tab for UI activation
  getFirstAccessibleTabId(): string | null {
    if (!this.firstAccessibleTab) return null;

    const tabIdMap: { [key: string]: string } = {
      'Home': 'home-tab',
      'Local Shipment': 'local-shipment-tab',
      'Bills': 'bills-tab',
      'Location Vendor': 'location-vendor-tab',
      'Vendor Shipment': 'vendor-shipment-tab',
      'Vendors': 'vendors-tab',
      'Accruals': 'accruals-tab',
      'Vendor Statement Summary': 'vendor-statement-tab',
      'Invoice Processing': 'invoice-processing-tab',
      'Paid Differently': 'paid-differently-tab',
      //ESE-1025-1,2
      'Reports': 'sys-app-admin-modules-tab',
      'Sys Admin Modules': 'sys-app-admin-modules-tab'
    };

    return tabIdMap[this.firstAccessibleTab] || null;
  }

  // Get the pane ID of the first accessible tab
  getFirstAccessibleTabPaneId(): string | null {
    if (!this.firstAccessibleTab) return null;

    const tabPaneMap: { [key: string]: string } = {
      'Home': 'home-pane',
      'Local Shipment': 'local-shipment-pane',
      'Bills': 'bills-pane',
      'Location Vendor': 'location-vendor-pane',
      'Vendor Shipment': 'vendor-shipment-pane',
      'Vendors': 'vendors-pane',
      'Accruals': 'accruals-pane',
      'Vendor Statement Summary': 'vendor-statement-pane',
      'Invoice Processing': 'invoice-processing-pane',
      'Paid Differently': 'paid-differently-pane',
      //ESE-1025-1,2
      'Reports': 'sys-app-admin-modules-pane',
      'Sys Admin Modules': 'sys-app-admin-modules-pane'
    };

    return tabPaneMap[this.firstAccessibleTab] || null;
  }

  get hasViewAccess(): boolean {
    //return this.roleService.hasViewAccess();
    return true;
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
      'Home': { tabName: 'Home', tabId: 'home-tab' },
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

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
  //OnChange Events
  onChangeServiceCode(value: any): void {
  }

  onChangeChargeStatus(value: any): void {
  }

  onChangeCostType(value: any): void {
  }

  onChangeBillStatus(value: any): void {
  }

  onChangeDestination(value: any): void {
  }

  onChangePaidStatus(value: any): void {
  }

  closeForm(): void {
    this.isModalActive = false;
  }

  activeFilter(event: any) {
    // Re-apply the active tab's enable/disable rules every time the
    // advanced filter opens. Mirrors old ExtJS AdvanceFilterPanel
    // `beforerender -> showHideFilterAD`, which recomputed the disabled
    // state on each open. Without this, fields can show stale
    // enabled/disabled state (e.g. the dynamic AcctYear/AcctMonth and
    // Orig/Dest rules in localShipmentFilters() depend on current values).
    const activePane = this.activeTab
      || (document.querySelector('#mainTabContent > .tab-pane.active') as HTMLElement)?.id
      || '';
    if (activePane) {
      this.applyFilterFieldState(activePane);
    }
    this.isModalActive = true;
  }

  /**
   * Apply only the per-tab enable/disable rules for the filter fields,
   * WITHOUT triggering any data loads. Used when (re)opening the
   * advanced filter modal so the field state is always current.
   * (activeMenus() additionally performs data loads on tab switch,
   * which must not happen merely from opening the modal.)
   */
  private applyFilterFieldState(componentName: string): void {
    this.cleanFilters();
    switch (componentName) {
      case 'home-pane':
        this.homeFilters();
        break;
      case 'local-shipment-pane':
        this.localShipmentFilters();
        break;
      case 'location-oceanmbl-pane':
        this.locationOceanMBLFilters();
        break;
      case 'location-vendor-pane':
        this.locationVendorFilters();
        break;
      case 'app-logged':
        this.billsLoggedFilters();
        break;
      case 'app-pending':
        this.billsPendingFilters();
        break;
      case 'app-verified':
        this.billsVerifiedFilters();
        break;
      case 'app-approved':
        this.billsApprovedFilters();
        break;
      case 'app-printed':
        this.billsPrintedFilters();
        break;
      case 'app-scanned':
        this.billsScannedFilters();
        break;
      case 'app-queued':
        this.billsQueuedFilters();
        break;
      case 'app-sent':
        this.billsSentFilters();
        break;
      case 'app-archived':
        this.billsArchivedFilters();
        break;
      case 'app-payment-details':
        this.billsPaymentDetailsFilters();
        break;
      case 'app-accrual-accuracy-rep':
        this.accrualAccuracyRepFilter();
        break;
      case 'app-accrual-monthly-det':
        this.accrualMonthlyDetailDetFilter();
        break;
      case 'vendors-pane':
        this.vendorsFilter();
        break;
      case 'paid-differently-pane':
        this.paidDifferentlyFilter();
        break;
      case 'vendors-shipment-pane':
        this.vendorShipmentFilters();
        break;
      default:
        break;
    }
  }

  onGoClick(): void {
    // Determine current active pane: use tracked activeTab, or fall back to DOM query
    let activePane = this.activeTab;
    if (!activePane) {
      const activePaneEl = document.querySelector('#mainTabContent > .tab-pane.active') as HTMLElement;
      activePane = activePaneEl?.id || '';
    }
    console.log('Go clicked - activePane:', activePane);
    
    switch (activePane) {
      case 'local-shipment-pane':
        this.loadLocalShipment();
        break;
      default:
        console.log('Go clicked for unhandled pane:', activePane);
        break;
    }
  }

  private loadLocalShipment(): void {
    console.log('loadLocalShipment called');

    const filters: LocalShipmentFilter = {
      acctYear: this.filterAcctYear || new Date().getFullYear().toString(),
      acctMonth: this.filterAcctMonth || 'All',
      displayCurr: this.filterDisplayCurr || 'USD',
      loctype: this.filterLocType || 'DEP',
      locCode: this.filterLocCode || undefined,
      origDest: this.filterOrigDest || undefined,
      serviceCode: this.filterServiceCode || undefined,
      chargeStatus: this.filterChargeStatus || undefined,
      startDate: this.filterStartDate || undefined,
      endDate: this.filterEndDate || undefined,
    };

    // Use setTimeout to ensure ViewChild is resolved after view renders
    setTimeout(() => {
      console.log('localShipmentComponent available:', !!this.localShipmentComponent);
      if (this.localShipmentComponent) {
        this.localShipmentComponent.loadData(filters);
      } else {
        console.error('LocalShipmentComponent ViewChild is not available!');
      }
    }, 100);
  }


  onDateChange() {
    console.log('Date:', this.selectedDate);
  }

  private activeMenus(componentName: string): void {
    switch (componentName) {
      case 'home-pane':
        this.cleanFilters();
        this.homeFilters();
        break;
      case 'local-shipment-pane':
        this.cleanFilters();
        this.localShipmentFilters();
        this.loadLocalShipment();
        break;
      case 'location-oceanmbl-pane':
        this.cleanFilters();
        this.locationOceanMBLFilters();
        break;
      case 'location-vendor-pane':
        this.cleanFilters();
        this.locationVendorFilters();
        break;
      //bills
      case 'app-logged':
        this.cleanFilters();
        this.billsLoggedFilters();
        break;
      case 'app-pending':
        this.cleanFilters();
        this.billsPendingFilters();
        break;
      case 'app-verified':
        this.cleanFilters();
        this.billsVerifiedFilters();
        break;
      case 'app-approved':
        this.cleanFilters();
        this.billsApprovedFilters();
        break;
      case 'app-printed':
        this.cleanFilters();
        this.billsPrintedFilters();
        break;
      case 'app-scanned':
        this.cleanFilters();
        this.billsScannedFilters();
        break;
      case 'app-queued':
        this.cleanFilters();
        this.billsQueuedFilters();
        break;
      case 'app-sent':
        this.cleanFilters();
        this.billsSentFilters();
        break;
      case 'app-archived':
        this.cleanFilters();
        this.billsArchivedFilters();
        break;
      case 'app-payment-details':
        this.cleanFilters();
        this.billsPaymentDetailsFilters();
        break;
      case 'app-accrual-accuracy-rep':
        this.cleanFilters();
        this.accrualAccuracyRepFilter();
        break;
      case 'app-accrual-monthly-det':
        this.cleanFilters();
        this.accrualMonthlyDetailDetFilter();
        break;
      case 'vendors-pane':
        this.cleanFilters();
        this.vendorsFilter();
        break;
      case 'paid-differently-pane':
        this.cleanFilters();
        this.paidDifferentlyFilter();
        break;
      case 'vendors-shipment-pane':
        this.cleanFilters();
        this.vendorShipmentFilters();
        break;
      default:
        this.cleanFilters();
        break;
    }

  }

  //#region Controllers
  private cleanFilters(): void {
    this.accountingyeardis= true;
    this.accountingmonthdis= true;
    this.displaycurrentdis= true;
    this.displaycurrenthid= true;
    this.locationtypedis= true;
    this.locationtypehid= true;
    this.origdestdis = true;
    this.origdesthid = true;
    this.invoicestatdis = true;
    this.invoicestathid = true;
    this.accrualstatdis = true;
    this.accrualtstathid = true;
    this.costtypedis = true;
    this.costtypehid = true;
    this.scandestdis = true;
    this.scandesthid = true;
    this.paidstatusdis = true;
    this.paidstatushid = true;
    this.vendorcodedis = true;
    this.vendorcodehid = true;
    //Advanced filters
    this.countrydis= false;
    this.companycodedis= false;
    this.locationcodedis= false;
    this.origindis= false;
    this.destinationdis= false;
    this.batchiddis= false;
    this.startdatedis= false;
    this.mblcostbasisdis= false;
    this.mblnumberdis= false;
    this.containernumberdis= false;
    this.shipmentnumdis= false;
    this.carrierboldis= false;
    this.chargecodedis= false;
    this.billstatusdis= false;
    this.enddatedis= false;
    this.paidstatusadvdis= false;
    this.servicecodedis= false;
    this.chargestatusdis= false;
    this.costtypeadvdis= false;
    this.vendorcodeadvdis= false;
    this.invoicerefnodis= false;
    this.origdestadvdis= false;
    this. receiveddatedis= false;
    this.e2kcarrierdis= false;

    this.paiddifferentlyhid = true;
  }
  
  private homeFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;
    this.displaycurrentdis = false;
    this.locationtypedis = false;

    //Advanced filters
    this.countrydis = false;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = false;
    this.destinationdis = false;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = false;
    this.mblnumberdis = false;
    this.containernumberdis = false;
    this.shipmentnumdis = false;
    this.carrierboldis = false;
    this.chargecodedis = false;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = false;
    this.servicecodedis = false;
    this.chargestatusdis = false;
    this.costtypeadvdis = false;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = false;
    this.receiveddatedis = false;
    this.e2kcarrierdis = false;
  }

  private localShipmentFilters(): void {
    // Dynamic disable: AcctYear/AcctMonth disabled if shipment/mbl/carrier/container are set
    // Matches old ExtJS: if (PgAtt.getShipment_number() != '' || PgAtt.getMbl_number() != '' || ...)
    const hasSpecificSearch = !!(this.paramsList.shipmentnumval || this.paramsList.mblnumberval
      || this.paramsList.containernumberval || this.paramsList.carrierbolval);
    this.accountingyeardis = hasSpecificSearch;
    this.accountingmonthdis = hasSpecificSearch;
    this.displaycurrentdis = false;
    this.locationtypedis = false;

    // Orig/Dest disabled when LocType = 'DEP' (matches ExtJS)
    this.origdestadvdis = (this.filterLocType === 'DEP');

    //Advanced filters
    this.countrydis = false;
    this.companycodedis = true;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = true;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = false;
    this.containernumberdis = false;
    this.shipmentnumdis = false;
    this.carrierboldis = false;
    this.chargecodedis = true;
    this.billstatusdis = true;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = false;
    this.chargestatusdis = false;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = true;
    this.invoicerefnodis = true;
    this.receiveddatedis = false;
    this.e2kcarrierdis = true;
  }

  private locationOceanMBLFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;
    this.displaycurrentdis = false;
    this.locationtypedis = false;
    this.origdestdis = false;
    this.origdesthid = false;

    //Advanced filters
    this.countrydis = false;
    this.companycodedis = true;
    this.locationcodedis = false;
    this.origindis = false;
    this.destinationdis = false;
    this.batchiddis = true;
    this.startdatedis = false;
    this.mblcostbasisdis = false;
    this.mblnumberdis = false;
    this.containernumberdis = false;
    this.shipmentnumdis = false;
    this.carrierboldis = false;
    this.chargecodedis = true;
    this.billstatusdis = true;
    this.enddatedis = false;
    this.paidstatusadvdis = false;
    this.servicecodedis = true;
    this.chargestatusdis = false;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = true;
    this.invoicerefnodis = true;
    this.origdestadvdis = false;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private locationVendorFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;
    this.displaycurrentdis = true;
    this.locationtypedis = true;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = true;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = true;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = true;
    this.enddatedis = false;
    this.paidstatusadvdis = false;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = true;
    this.invoicerefnodis = true;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private vendorShipmentFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;
    this.displaycurrentdis = false;
    this.locationtypedis = false;
    this.accrualstatdis = false;
    this.accrualtstathid = false;
    this.costtypedis = false;
    this.costtypehid = false;

    //Advanced filters
    this.countrydis = false;
    this.companycodedis = true;
    this.locationcodedis = false;
    this.origindis = false;
    this.destinationdis = false;
    this.batchiddis = true;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = false;
    this.containernumberdis = false;
    this.shipmentnumdis = false;
    this.carrierboldis = false;
    this.chargecodedis = false;
    this.billstatusdis = true;
    this.enddatedis = false;
    this.paidstatusadvdis = false;
    this.servicecodedis = false;
    this.chargestatusdis = true;
    this.costtypeadvdis = false;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = true;
    this.origdestadvdis = true;
    this.receiveddatedis = false;
    this.e2kcarrierdis = true;
  }

  private vendorsFilter(): void {
    this.accountingyeardis = true;
    this.accountingmonthdis = true;
    this.displaycurrentdis = true;
    this.locationtypedis = true;

    //Advanced filters
    this.countrydis = false;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = true;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = true;
    this.enddatedis = true;
    this.paidstatusadvdis = false;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = true;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private paidDifferentlyFilter(): void {
    this.paiddifferentlyhid = false;
  }

  private accrualAccuracyRepFilter(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;
    this.displaycurrentdis = true;
    this.locationtypedis = true;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = true;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = true;
    this.startdatedis = true;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = true;
    this.enddatedis = true;
    this.paidstatusadvdis = false;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = true;
    this.invoicerefnodis = true;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private accrualMonthlyDetailDetFilter(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;
    this.displaycurrentdis = true;
    this.locationtypedis = true;

    //Advanced filters
    this.countrydis = false;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = true;
    this.startdatedis = true;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = false;
    this.carrierboldis = true;
    this.chargecodedis = false;
    this.billstatusdis = true;
    this.enddatedis = true;
    this.paidstatusadvdis = false;
    this.servicecodedis = false;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = true;
    this.invoicerefnodis = true;
    this.origdestadvdis = true;
    this.receiveddatedis = false;
    this.e2kcarrierdis = true;
  }

  private billsLoggedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsPendingFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsVerifiedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsApprovedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsPrintedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsScannedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;
    this.scandestdis = false;
    this.scandesthid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsQueuedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;
    this.scandestdis = false;
    this.scandesthid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsSentFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsArchivedFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = false;
    this.startdatedis = false;
    this.mblcostbasisdis = true;
    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = true;
    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }

  private billsPaymentDetailsFilters(): void {
    this.accountingyeardis = false;
    this.accountingmonthdis = false;

    this.invoicestatdis = false;
    this.invoicestathid = false;
    this.paidstatusdis = false;
    this.paidstatushid = false;

    //Advanced filters
    this.countrydis = true;
    this.companycodedis = false;
    this.locationcodedis = false;
    this.origindis = true;
    this.destinationdis = true;
    this.batchiddis = true;
    this.startdatedis = false;
    this.mblcostbasisdis = true;

    this.mblnumberdis = true;
    this.containernumberdis = true;
    this.shipmentnumdis = true;
    this.carrierboldis = true;
    this.chargecodedis = true;
    this.billstatusdis = false;
    this.enddatedis = false;
    this.paidstatusadvdis = false;

    this.servicecodedis = true;
    this.chargestatusdis = true;
    this.costtypeadvdis = true;
    this.vendorcodeadvdis = false;
    this.invoicerefnodis = false;
    this.origdestadvdis = true;
    this.receiveddatedis = true;
    this.e2kcarrierdis = true;
  }
  //#endregion

  async executeTab(): Promise<void> {
 
    // Sync the 5 filter criteria (sidebar) values into paramsList before triggering
    this.paramsList.accountingyearval = this.filterAcctYear ? Number(this.filterAcctYear) : new Date().getFullYear();
    this.paramsList.accountingmonthval = this.filterAcctMonth === 'All' ? 0 : Number(this.filterAcctMonth);
    this.paramsList.displaycurrentval = this.filterDisplayCurr || 'USD';
    this.paramsList.locationtypeval = this.filterLocType || 'DEP';
    this.paramsList.locationcodeval = this.filterLocCode || '';

    // Sync advanced filter values (these are already bound via [(ngModel)] to paramsList)
    // The following are already in paramsList via 2-way binding:
    // countryval, companycodeval, originval, destinationval, batchidval,
    // mblnumberval, containernumberval, shipmentnumval, carrierbolval,
    // chargecodeval, servicecodeval, chargestatusval, costtypeadvval,
    // vendorcodeadvval, invoicerefnoval, billstatusval, origdestadvval,
    // mblcostbasisval, paidstatusadvval, e2kcarrierval,
    // startdateval, enddateval, receiveddateval

    // Verify if is active
    const activeTab = this.getCurrentViewInfo();

    if (activeTab?.type === 'subtab' && activeTab.subTab) {
      this.executeService.triggerExecute(
        activeTab.mainTab,  
        this.paramsList,
        activeTab.subTab     
      );
    } else {
      this.executeService.triggerExecute(
        activeTab?.mainTab,
        this.paramsList
      );
    }
  }
}
