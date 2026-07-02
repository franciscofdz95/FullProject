import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import saveAs from 'file-saver';
import { FilterService, FilterOption } from '../../Service/filter.service';
import { LocationOceanMBLFilter } from '../../Service/location-oceanmbl.service';
import { OceanMBLService } from './Service/ocean-mbl.service';

/** Data injected when the modal is opened from the Location Ocean MBL grid. */
export interface OceanMBLDetailDialogData {
  /** The clicked grid row (carries mbl_nbr and other MBL fields). */
  record: any;
  /** Display currency currently selected on the main filter (e.g. 'USD'). */
  displayCurrency: string;
  /** All active filter params from the parent grid (mirrors ExtJS filter.GetParameters()). */
  filters: LocationOceanMBLFilter;
  /** Location code used to load the currency dropdown. */
  locationCode?: string;
  /** Country code used to load the currency dropdown. */
  countryCode?: string;
}

/** A logical charge group rendered as a collapsible section in the detail table. */
interface ChargeGroup {
  type: string;
  rank: number;
  rows: any[];
  collapsed: boolean;
  recordCount: number;
  sellTotal: number;
  buyTotal: number;
  marginTotal: number;
  marginPct: number;
}

/**
 * Ocean MBL Detail modal — Angular re-implementation of the legacy ExtJS
 * App.View.LocationMBL.OceanMBL.Report window (Report.js / Report.cnt.js / Grid.js).
 *
 * Layout (top → bottom), matching the legacy screen exactly:
 *   1. Modal title bar (blue).
 *   2. TBar: MBL Number label + location label + spacer + currency dropdown + Excel export.
 *   3. Charge grid: collapsible groups per type, subtotal rows, grand total.
 *   4. Legend / footer note.
 */
@Component({
  standalone: true,
  selector: 'app-ocean-mbl-detail',
  templateUrl: './ocean-mbl-detail.component.html',
  styleUrl: './ocean-mbl-detail.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatDialogModule]
})
export class OceanMBLDetailComponent implements OnInit {

  mblNumber = '';
  displayCurrency = 'USD';

  isLoading = false;
  noResults = false;

  locationLabel = '';
  year = new Date().getFullYear();

  groups: ChargeGroup[] = [];
  grandSellTotal = 0;
  grandBuyTotal = 0;
  grandMarginTotal = 0;
  grandMarginPct = 0;

  currencyOptions: FilterOption[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OceanMBLDetailDialogData,
    public dialogRef: MatDialogRef<OceanMBLDetailComponent>,
    private oceanMBLService: OceanMBLService,
    private filterService: FilterService
  ) {
    this.mblNumber = data?.record?.mbl_nbr ?? '';
    this.displayCurrency = data?.displayCurrency || 'USD';
  }

  ngOnInit(): void {
    this.loadCurrencies();
    this.loadDetails();
  }

  // ============================================================
  //  Currency dropdown (mirrors ExtJS App.View.LocationMBL.OceanMBL.Currency)
  // ============================================================

  private loadCurrencies(): void {
    this.filterService.getDisplayCurrencies(this.data?.locationCode || '', this.data?.countryCode || '')
      .subscribe({
        next: (data) => {
          this.currencyOptions = data || [];
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

  /** Currency change → reload the charge grid (mirrors the legacy combo 'select' listener). */
  onCurrencyChanged(): void {
    this.loadDetails();
  }

  // ============================================================
  //  Charge detail grid
  // ============================================================

  private loadDetails(): void {
    this.isLoading = true;

    const filters = {
      ...this.data.filters,
      mblNumber: this.mblNumber,
      displayCurr: this.displayCurrency
    };

    this.oceanMBLService.getOceanMBLSummary(filters).subscribe({
      next: (rows) => {
        this.buildGroups(rows || []);
        this.buildLocationLabel(rows || []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading Ocean MBL detail:', err);
        this.groups = [];
        this.noResults = true;
        this.isLoading = false;
      }
    });
  }

  /**
   * Build the location label from the first record (mirrors loadGridColumns in Report.cnt.js):
   * "(orig_tp to dest_tp)   service_code"
   */
  private buildLocationLabel(rows: any[]): void {
    if (!rows.length) { this.locationLabel = ''; return; }
    const r = rows[0];
    this.locationLabel = `( ${this.val(r.orig_tp)} to ${this.val(r.dest_tp)} )   ${this.val(r.service_code)}`;
  }

  /**
   * Process rows and build collapsible groups.
   * Mirrors the store `load` listener in Grid.js:
   *   - consecutive rows with the same charge_code get sell_amt/sell_usd/margin_amt zeroed
   *   - PTotal Freight Charge rows are excluded from display but used for total computation
   *   - grand totals are computed on sell_usd / buy_usd (excluding PTotal rows)
   */
  private buildGroups(rawRows: any[]): void {
    const rows = this.processDuplicates(rawRows);
    const displayRows = rows.filter(r => (r.type ?? '').toString() !== 'PTotal Freight Charge');

    this.noResults = displayRows.length === 0;

    const map = new Map<string, ChargeGroup>();
    for (const r of displayRows) {
      const type = (r.type ?? 'Charges').toString();
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

    // Per-group totals (mirrors groupingsummary summaryType in Grid.js)
    let gSell = 0, gBuy = 0, gMargin = 0;
    for (const g of map.values()) {
      let sell = 0, buy = 0;
      for (const r of g.rows) {
        sell += this.toNum(r._sellUsd);
        buy += this.toNum(r.buy_usd);
      }
      const margin = sell - buy;
      g.recordCount = g.rows.length;
      g.sellTotal = sell;
      g.buyTotal = buy;
      g.marginTotal = margin;
      g.marginPct = sell !== 0 ? (margin / sell) * 100 : 0;
      gSell += sell;
      gBuy += buy;
    }

    this.groups = Array.from(map.values()).sort((a, b) => a.rank - b.rank);
    gMargin = gSell - gBuy;
    this.grandSellTotal = gSell;
    this.grandBuyTotal = gBuy;
    this.grandMarginTotal = gMargin;
    this.grandMarginPct = gSell !== 0 ? (gMargin / gSell) * 100 : 0;
  }

  /**
   * Apply duplicate charge_code logic matching the ExtJS Grid.js store load listener:
   * - Iterates rows in sequence; when charge_code equals the previous row's, zeroes
   *   sell_amt, sell_usd, and margin_amt on that row (marked with _isDuplicate).
   * - Adds _isFromMasterBill flag when mbl_fk is numeric and != 0.
   * - Stores processed sell_usd as _sellUsd for summary calculations.
   */
  private processDuplicates(rows: any[]): any[] {
    let lastChg = '';
    return rows.map(r => {
      const chargeCode = (r.charge_code ?? '').toString();
      const isDuplicate = chargeCode !== '' && chargeCode === lastChg;
      const mblFk = parseFloat(r.mbl_fk);
      const isFromMasterBill = !isNaN(mblFk) && mblFk !== 0;

      const sellUsd = isDuplicate ? 0 : this.toNum(r.sell_usd);
      const marginAmt = isDuplicate ? 0 : this.toNum(r.margin_amt);

      if ((r.type ?? '').toString() !== 'PTotal Freight Charge') {
        lastChg = chargeCode;
      }

      return {
        ...r,
        _isDuplicate: isDuplicate,
        _isFromMasterBill: isFromMasterBill,
        _sellUsd: sellUsd,
        _marginAmt: marginAmt
      };
    });
  }

  /** Toggle a charge group open/closed. */
  toggleGroup(g: ChargeGroup): void {
    g.collapsed = !g.collapsed;
  }

  // ============================================================
  //  Row display helpers (mirrors column renderers in Grid.js)
  // ============================================================

  rowSellAmt(r: any): string {
    if (r._isDuplicate) { return this.formatNumber(0) + '-'; }
    return this.formatNumber(this.toNum(r.sell_amt));
  }

  rowSellUsd(r: any): string {
    if (r._isDuplicate) { return this.formatNumber(0) + '-'; }
    return this.formatNumber(this.toNum(r.sell_usd));
  }

  rowBuyAmt(r: any): string {
    const str = r._isFromMasterBill ? '*' : '';
    return this.formatNumber(this.toNum(r.buy_amt)) + (str ? ' ' + str : '');
  }

  rowMarginAmt(r: any): string {
    if (r._isDuplicate) { return this.formatNumber(0) + '-'; }
    return this.formatNumber(this.toNum(r.margin_amt));
  }

  rowMarginPct(r: any): number {
    const sellUsd = this.toNum(r._sellUsd);
    if (r._isDuplicate || sellUsd === 0) { return 0; }
    return ((sellUsd - this.toNum(r.buy_usd)) / sellUsd) * 100;
  }

  // ============================================================
  //  Excel export (mirrors OceanMBLExcelExport in Report.cnt.js)
  // ============================================================

  exportToExcel(): void {
    const cur = this.displayCurrency;
    const headers = [
      'Update Date', 'Location', 'Charge Split', 'Type M/L', 'Vendor Code',
      'Charge Code', 'Charge Desc',
      'Sell Amount', 'Sell Curr.',
      `Sell Amt (${cur})`,
      'Buy Amount', 'Buy Curr.',
      `Buy Amt (${cur})`,
      `Margin Amt (${cur})`,
      `Margin Pct (${cur})`
    ];

    let html = '<table border="1"><thead><tr>' +
      headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';

    for (const g of this.groups) {
      html += `<tr><td colspan="${headers.length}"><b>${g.type} - ${g.recordCount} Records</b></td></tr>`;
      for (const r of g.rows) {
        html += '<tr>' + [
          this.val(r.acctg_per_year),
          this.val(r.location_code),
          this.val(r.rev_split),
          this.val(r.MANIFESTED_IND),
          this.val(r.vendor_name),
          this.val(r.charge_code),
          this.val(r.CHARGE_DESCRIPTION),
          this.rowSellAmt(r),
          this.val(r.sell_cid),
          this.rowSellUsd(r),
          this.rowBuyAmt(r),
          this.val(r.buy_cid),
          this.formatNumber(this.toNum(r.buy_usd)),
          this.rowMarginAmt(r),
          this.formatPercent(this.rowMarginPct(r))
        ].map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
      html += `<tr>` +
        `<td colspan="9"></td>` +
        `<td><b>${this.formatNumber(g.sellTotal)}</b></td>` +
        `<td colspan="2"></td>` +
        `<td><b>${this.formatNumber(g.buyTotal)}</b></td>` +
        `<td><b>${this.formatNumber(g.marginTotal)}</b></td>` +
        `<td><b>${this.formatPercentSummary(g.marginPct)}</b></td></tr>`;
    }

    html += `<tr><td colspan="9"><b>Grand Total</b></td>` +
      `<td><b>${this.formatNumber(this.grandSellTotal)}</b></td>` +
      `<td colspan="2"></td>` +
      `<td><b>${this.formatNumber(this.grandBuyTotal)}</b></td>` +
      `<td><b>${this.formatNumber(this.grandMarginTotal)}</b></td>` +
      `<td><b>${this.formatPercentSummary(this.grandMarginPct)}</b></td></tr>`;
    html += '</tbody></table>';

    const blob = new Blob(
      ['﻿<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'],
      { type: 'application/vnd.ms-excel' }
    );
    saveAs(blob, `OceanMBLDetail_${this.mblNumber}.xls`);
  }

  // ============================================================
  //  Misc
  // ============================================================

  close(): void { this.dialogRef.close(); }

  private toNum(v: any): number {
    if (v === null || v === undefined || v === '') { return 0; }
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  private val(v: any): string {
    return v === null || v === undefined ? '' : String(v);
  }

  formatNumber(v: number): string {
    const n = v ?? 0;
    const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n < 0 ? `(${abs})` : abs;
  }

  /** Row-level margin pct: 1 decimal (NumFormat_Percent_1Decimals). */
  formatPercent(v: number): string {
    return (v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  }

  /** Group / grand-total margin pct: 2 decimals (NumFormat_Percent_2Decimals). */
  formatPercentSummary(v: number): string {
    return (v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  }
}
