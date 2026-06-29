import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import saveAs from 'file-saver';
import { forkJoin } from 'rxjs';
import { FilterService, FilterOption } from '../../Service/filter.service';
import { SessionService } from '../../Service/session.service';
import { ShipmentService, ShipmentDetailFilter } from './Service/shipment.service';
import { ShipmentNoteDialogComponent } from './shipment-note-dialog.component';

/** Data injected when the modal is opened from the Local Shipment grid. */
export interface ShipmentDetailDialogData {
  /** The clicked grid row (carries shpmnt_nbr and other shipment fields). */
  record: any;
  /** Display currency currently selected on the Local Shipment filter (e.g. 'CNY'). */
  displayCurrency: string;
  /** Location code (used to load the currency dropdown, matches legacy). */
  locationCode?: string;
  /** Country code (used to load the currency dropdown, matches legacy). */
  countryCode?: string;
  /** Logged-in user name (note author). */
  userName?: string;
}

/** A logical charge group rendered as a collapsible section in the detail grid. */
interface ChargeGroup {
  type: string;          // 'Origin Charges' | 'Manifested' | 'Destination Charges'
  rank: number;          // ordering key (min rank of rows)
  rows: any[];
  collapsed: boolean;
  recordCount: number;
  sellTotal: number;     // Σ sell_usd
  buyTotal: number;      // Σ buy_usd
  marginTotal: number;   // Σ (sell_usd - buy_usd)
  marginPct: number;
}

/**
 * Shipment Detail modal — Angular re-implementation of the legacy ExtJS
 * App.View.ShipmentSummary.Report window (Report.js / Report.cnt.js).
 *
 * Layout (top → bottom), matching the legacy screen exactly:
 *   1. Collapsible header panel: olive title bar (Ship Nbr ... EPA) +
 *      Customer / Container Fact / MBL Fact info boxes.
 *   2. Charge grid toolbar: currency dropdown (right) + Excel export button.
 *   3. Charge grid: Origin Charges / Manifested / Destination Charges
 *      collapsible groups, each with a subtotal row, then a Grand Total row.
 *   4. Collapsible Shipment Notes panel: Add/View button + notes grid.
 *   5. Legend / instructions footer.
 */
@Component({
  standalone: true,
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrl: './shipment-detail.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatDialogModule]
})
export class ShipmentDetailComponent implements OnInit {

  // ----- identity -----
  shipmentNumber = '';
  displayCurrency = 'USD';

  // ----- footer -----
  year = new Date().getFullYear();

  // ----- collapsible panel state -----
  headerCollapsed = false;
  notesCollapsed = false;

  // ----- loading flags -----
  isLoading = false;

  // ----- header title fields (built from first detail row) -----
  headerTitleHtml = 'Shipment Detail';

  // ----- Customer info -----
  customer: any = {};
  shipperHtml = '';
  consigneeHtml = '';
  freightPayerHtml = '';

  // ----- Container Fact / MBL Fact -----
  containerRows: any[] = [];
  mblRows: any[] = [];

  // ----- Charge grid -----
  groups: ChargeGroup[] = [];
  grandSellTotal = 0;
  grandBuyTotal = 0;
  grandMarginTotal = 0;
  grandMarginPct = 0;
  noResults = false;

  // ----- Currency dropdown -----
  currencyOptions: FilterOption[] = [];

  // ----- Notes -----
  noteRows: any[] = [];
  canDeleteNotes = false; // permission gate (legacy EA_Invoice_ApproveUnApproveDelete)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ShipmentDetailDialogData,
    public dialogRef: MatDialogRef<ShipmentDetailComponent>,
    private shipmentService: ShipmentService,
    private filterService: FilterService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {
    this.shipmentNumber = data?.record?.shpmnt_nbr ?? data?.record?.['shpmnt_nbr'] ?? '';
    this.displayCurrency = data?.displayCurrency || 'USD';
  }

  ngOnInit(): void {
    this.setNoteDeletePermission();
    this.loadCurrencies();
    this.loadHeaderAndFacts();
    this.loadDetails();
    this.loadNotes();
  }

  /** Match ExtJS behavior: show note delete column only for delete-capable users. */
  private setNoteDeletePermission(): void {
    const permissions = this.sessionService.permissions || [];
    if (!permissions.length) {
      // If permissions are not hydrated yet, keep delete visible so the row action is available.
      this.canDeleteNotes = true;
      return;
    }

    const current = permissions[this.sessionService.geoIndex];
    const currentHasDelete = Number(current?.EA_Invoice_ApproveUnApproveDelete || 0) === 1;
    const anyHasDelete = permissions.some(p => Number(p?.EA_Invoice_ApproveUnApproveDelete || 0) === 1);
    this.canDeleteNotes = currentHasDelete || anyHasDelete;
  }

  // ============================================================
  //  Currency dropdown
  // ============================================================

  private loadCurrencies(): void {
    this.filterService.getDisplayCurrencies(this.data?.locationCode || '', this.data?.countryCode || '')
      .subscribe({
        next: (data) => {
          this.currencyOptions = data || [];
          // Ensure the active currency is present even if the SP omitted it
          if (this.displayCurrency &&
              !this.currencyOptions.some(c => c['currency_code'] === this.displayCurrency)) {
            this.currencyOptions = [{ currency_code: this.displayCurrency }, ...this.currencyOptions];
          }
        },
        error: () => {
          this.currencyOptions = [{ currency_code: this.displayCurrency || 'USD' }];
        }
      });
  }

  /** Currency change → reload the charge grid (legacy: store reload on currency combo change). */
  onCurrencyChanged(): void {
    this.loadDetails();
  }

  // ============================================================
  //  Header (Customer) + Container Fact + MBL Fact
  // ============================================================

  private loadHeaderAndFacts(): void {
    forkJoin({
      summary: this.shipmentService.getShipmentSummary(this.shipmentNumber),
      containers: this.shipmentService.getContainerSummary(this.shipmentNumber),
      mbls: this.shipmentService.getMBLSummary(this.shipmentNumber)
    }).subscribe({
      next: ({ summary, containers, mbls }) => {
        this.applyCustomer(summary || {});
        this.containerRows = containers || [];
        this.mblRows = mbls || [];
      },
      error: (err) => console.error('Error loading shipment header/facts:', err)
    });
  }

  /** Build the Customer info display strings (mirrors CustomerInfo.js loadValues). */
  private applyCustomer(j: any): void {
    this.customer = j || {};
    const v = (x: any) => (x === null || x === undefined ? '' : x);

    this.shipperHtml =
      `${v(j.SH_ACCOUNT_NBR)}-${v(j.SH_NAME)}<br/>${v(j.SH_ADDRESS_ONE)}<br/>` +
      `${v(j.SH_CITY)} , ${v(j.SH_STATE_CODE)} - ${v(j.SH_POSTAL_CODE)} , ${v(j.SH_COUNTRY_CODE)}`;

    this.consigneeHtml =
      `${v(j.CO_ACCOUNT_NBR)}-${v(j.CO_NAME)}<br/>${v(j.CO_ADDRESS_ONE)}<br/>` +
      `${v(j.CO_CITY)} , ${v(j.CO_STATE_CODE)} - ${v(j.CO_POSTAL_CODE)} , ${v(j.CO_COUNTRY_CODE)}`;

    this.freightPayerHtml =
      `${v(j.PAYOR_ACCOUNT_NBR)}-${v(j.PAYOR_NAME)}<br/>${v(j.FP_ADDRESS_ONE)}<br/>` +
      `${v(j.FP_CITY)} , ${v(j.FP_STATE_CODE)} - ${v(j.FP_POSTAL_CODE)} , ${v(j.FP_COUNTRY_CODE)}`;
  }

  // ============================================================
  //  Charge detail grid
  // ============================================================

  private loadDetails(): void {
    this.isLoading = true;
    const filter: ShipmentDetailFilter = {
      shipmentNumber: this.shipmentNumber,
      displayCurr: this.displayCurrency
    };

    this.shipmentService.getShipmentDetails(filter).subscribe({
      next: (rows) => {
        this.buildGroups(rows || []);
        this.buildHeaderTitle(rows || []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading shipment details:', err);
        this.groups = [];
        this.noResults = true;
        this.isLoading = false;
      }
    });
  }

  /** Group rows by `type`, computing per-group + grand totals (mirrors the ExtJS grouping/summary). */
  private buildGroups(rows: any[]): void {
    const detailRows = (rows || []).filter(r => {
      const typeText = (r?.type ?? r?.TYPE ?? '').toString().toLowerCase();
      return typeText.indexOf('grand total') < 0;
    });

    this.noResults = detailRows.length === 0;

    const map = new Map<string, ChargeGroup>();
    for (const r of detailRows) {
      const type = (r.type ?? r.TYPE ?? 'Charges').toString();
      if (!map.has(type)) {
        map.set(type, {
          type,
          rank: this.toNum(r.rank),
          rows: [],
          collapsed: false,
          recordCount: 0,
          sellTotal: 0,
          buyTotal: 0,
          marginTotal: 0,
          marginPct: 0
        });
      }
      const g = map.get(type)!;
      g.rows.push(r);
      g.rank = Math.min(g.rank, this.toNum(r.rank) || g.rank);
    }

    // Per-group totals (duplicate-flag aware, matching the legacy summaryType fns)
    let gSell = 0, gBuy = 0, gMargin = 0;
    for (const g of map.values()) {
      let sell = 0, buy = 0, margin = 0;
      for (const r of g.rows) {
        const isDup = (r.DuplicateFlag ?? r.duplicateflag) === 'Y';
        const sellUsd = this.toNum(r.sell_usd);
        const buyUsd = this.toNum(r.buy_usd);
        if (!isDup) { sell += sellUsd; margin += (sellUsd - buyUsd); }
        else { margin += (0 - buyUsd); }
        buy += buyUsd;
      }
      g.recordCount = g.rows.length;
      g.sellTotal = sell;
      g.buyTotal = buy;
      g.marginTotal = margin;
      g.marginPct = sell !== 0 ? (margin / sell) * 100 : 0;
      gSell += sell; gBuy += buy; gMargin += margin;
    }

    this.groups = Array.from(map.values()).sort((a, b) => a.rank - b.rank);
    this.grandSellTotal = gSell;
    this.grandBuyTotal = gBuy;
    this.grandMarginTotal = gMargin;
    this.grandMarginPct = gSell !== 0 ? (gMargin / gSell) * 100 : 0;
  }

  /** Build the olive header bar title (mirrors LoadShipmentDetails in Report.cnt.js). */
  private buildHeaderTitle(rows: any[]): void {
    if (!rows.length) {
      this.headerTitleHtml = `Shipment Details : ${this.shipmentNumber}`;
      return;
    }
    const r = rows[0];
    const cubic = this.formatNumber(this.toNum(r.Cubic_mtrs));
    const rcvd = this.formatDate(r.rcvd_at_dt);
    const dlv = r.status_code === 'DLV' ? this.formatDate(r.delivered_dt) : 'Pending';

    this.headerTitleHtml =
      `<b>Ship Nbr: ${this.val(r.shpmnt_nbr)}</b>&nbsp;&nbsp;(${this.val(r.orig_tp)} to ${this.val(r.dest_tp)})` +
      `&nbsp;&nbsp;&nbsp;<b>Svc</b>:${this.val(r.service_code)}&nbsp;&nbsp;<b>M3</b>:${cubic}` +
      `&nbsp;&nbsp;&nbsp;<b>Rcvd</b>:${rcvd}&nbsp;&nbsp;&nbsp;<b>DLV</b>: ${dlv}` +
      `&nbsp;&nbsp;&nbsp;<b>Status</b>:${this.val(r.status_code)}` +
      `&nbsp;&nbsp;&nbsp;<b>Shipper PA</b>:${this.val(r.pa_number)}` +
      `&nbsp;&nbsp;&nbsp;<b>EPA</b>:(${this.val(r.OrigDEP)}/${this.val(r.DestDEP)})`;
  }

  /** Toggle a charge group open/closed. */
  toggleGroup(g: ChargeGroup): void {
    g.collapsed = !g.collapsed;
  }

  /** Short subtotal label text shown in the first column (matches legacy ExtJS). */
  groupSubtotalLabel(type: string): string {
    const t = (type || '').toLowerCase();
    if (t.indexOf('origin') >= 0) { return 'Origin ...'; }
    if (t.indexOf('manifest') >= 0) { return 'Manife...'; }
    if (t.indexOf('destination') >= 0) { return 'Destin...'; }
    return 'Total ...';
  }

  // ----- per-row display helpers (duplicate-flag aware) -----

  /** Sell Amt in display currency for a row (0 when DuplicateFlag = 'Y'). */
  rowSell(r: any): number {
    return (r.DuplicateFlag ?? r.duplicateflag) === 'Y' ? 0 : this.toNum(r.sell_usd);
  }

  /** Buy Amt in display currency for a row. */
  rowBuy(r: any): number {
    return this.toNum(r.buy_usd);
  }

  /** Margin Amt in display currency for a row. */
  rowMargin(r: any): number {
    const isDup = (r.DuplicateFlag ?? r.duplicateflag) === 'Y';
    const sellUsd = isDup ? 0 : this.toNum(r.sell_usd);
    return sellUsd - this.toNum(r.buy_usd);
  }

  /** Margin Pct for a row. */
  rowMarginPct(r: any): number {
    const isDup = (r.DuplicateFlag ?? r.duplicateflag) === 'Y';
    const sellUsd = isDup ? 0 : this.toNum(r.sell_usd);
    return sellUsd !== 0 ? ((sellUsd - this.toNum(r.buy_usd)) / sellUsd) * 100 : 0;
  }

  /** True when a row's amounts come from the Master Bill (rendered italic). */
  isMasterBill(r: any): boolean {
    const rt = (r.rowtype ?? '').toString().toUpperCase();
    return rt.indexOf('MBL') >= 0;
  }

  /** True when a row has been Billed in Flote (rendered bold black). */
  isBilled(r: any): boolean {
    const st = (r.CHARGE_STATUS ?? r.charge_status ?? '').toString().toUpperCase();
    return st === 'BILLED' || st === 'BILL';
  }

  // ============================================================
  //  Excel export
  // ============================================================

  /** Export the charge grid to an Excel-compatible file (legacy btnShipDetailExport). */
  exportToExcel(): void {
    const cur = this.displayCurrency;
    const headers = [
      'Location', 'Row Type', 'Status', 'Vendor Code', 'MBL Number', 'Charge Code',
      'Charge Desc', 'Charge Split', 'Rev Top Ind', 'Sell Amount', 'Sell Curr.',
      `Sell Amt (${cur})`, 'Buy Amount', 'Buy Curr.', `Buy Amt (${cur})`,
      `Margin Amt (${cur})`, 'Margin Pct'
    ];

    let html = '<table border="1"><thead><tr>' +
      headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';

    for (const g of this.groups) {
      html += `<tr><td colspan="${headers.length}"><b>${g.type} - ${g.recordCount} Records</b></td></tr>`;
      for (const r of g.rows) {
        html += '<tr>' + [
          this.val(r.location_code), this.val(r.rowtype), this.val(r.CHARGE_STATUS),
          this.val(r.vendor_name), this.val(r.mbl_nbr), this.val(r.charge_code),
          this.val(r.CHARGE_DESCRIPTION), this.val(r.rev_split), this.val(r.intl_ahl_topline_ind),
          this.formatNumber(this.toNum(r.sell_amt)), this.val(r.sell_cid),
          this.formatNumber(this.rowSell(r)), this.formatNumber(this.toNum(r.buy_amt)),
          this.val(r.buy_cid), this.formatNumber(this.rowBuy(r)),
          this.formatNumber(this.rowMargin(r)), this.formatPercent(this.rowMarginPct(r))
        ].map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
      html += `<tr><td colspan="11"></td>` +
        `<td><b>${this.formatNumber(g.sellTotal)}</b></td><td colspan="2"></td>` +
        `<td><b>${this.formatNumber(g.buyTotal)}</b></td>` +
        `<td><b>${this.formatNumber(g.marginTotal)}</b></td>` +
        `<td><b>${this.formatPercent(g.marginPct)}</b></td></tr>`;
    }

    html += `<tr><td colspan="11"><b>Grand Total</b></td>` +
      `<td><b>${this.formatNumber(this.grandSellTotal)}</b></td><td colspan="2"></td>` +
      `<td><b>${this.formatNumber(this.grandBuyTotal)}</b></td>` +
      `<td><b>${this.formatNumber(this.grandMarginTotal)}</b></td>` +
      `<td><b>${this.formatPercent(this.grandMarginPct)}</b></td></tr>`;
    html += '</tbody></table>';

    const blob = new Blob(
      ['\ufeff<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'],
      { type: 'application/vnd.ms-excel' }
    );
    saveAs(blob, `ShipmentDetail_${this.shipmentNumber}.xls`);
  }

  // ============================================================
  //  Shipment Notes
  // ============================================================

  private loadNotes(): void {
    this.shipmentService.getShipmentNotes(this.shipmentNumber).subscribe({
      next: (rows) => this.noteRows = rows || [],
      error: (err) => console.error('Error loading shipment notes:', err)
    });
  }

  /** Open the Add/View Shipment Note dialog (legacy ShowShipmentNoteW). */
  openAddNote(): void {
    const ref = this.dialog.open(ShipmentNoteDialogComponent, {
      width: '35%',
      data: {
        shipmentNumber: this.shipmentNumber,
        userName: this.data?.userName || ''
      }
    });

    ref.afterClosed().subscribe((added: boolean) => {
      if (added) {
        this.loadNotes(); // refresh the grid after a note is inserted
      }
    });
  }

  /** Delete (hide) a note (legacy DeleteShipmentNoteByNoteId). */
  deleteNote(row: any): void {
    const id = this.toNum(row.frn_id);
    if (!id) { return; }
    this.shipmentService.deleteShipmentNote(id).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Error deleting note:', err)
    });
  }

  // ============================================================
  //  Misc
  // ============================================================

  close(): void {
    this.dialogRef.close();
  }

  // ----- formatting helpers -----

  private toNum(v: any): number {
    if (v === null || v === undefined || v === '') { return 0; }
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  private val(v: any): string {
    return v === null || v === undefined ? '' : String(v);
  }

  formatNumber(v: number): string {
    return (v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatPercent(v: number): string {
    return (v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  }

  formatDate(v: any): string {
    if (!v) { return ''; }
    const d = new Date(v);
    if (isNaN(d.getTime())) { return String(v); }
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
