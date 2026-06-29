
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-input-money',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input
      [id]="inputId"
      type="text"
      [value]="text"
      (input)="handleInput($event)"
      (blur)="handleBlur()"
      (focus)="handleFocus()"
      [disabled]="disabled"
      [attr.inputmode]="'decimal'"
      [attr.placeholder]="placeholder || placeholderText"
      [attr.aria-label]="ariaLabel"
      autocomplete="off"
      class="form-control"
    />
  `,
  styles: [`
    :host { display: inline-block; width: 100%; }
    input { width: 100%; box-sizing: border-box; }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CustomInputMoneyComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomInputMoneyComponent implements ControlValueAccessor {

  @Input() currency: string = 'USD';
  @Input() locale: string = 'en-US';
  @Input() fractionDigits = 2;
  @Input() allowNegative = true;
  @Input() placeholder?: string;
  @Input() inputId?: string;
  @Input() ariaLabel: string = 'Monto';

  disabled = false;
  text = '';                 
  placeholderText = '';      
  private valueNum: number | null = null; 

  onChange: (val: number | null) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: number | null): void {
    this.valueNum = (typeof value === 'number' && isFinite(value)) ? value : null;
    this.text = this.valueNum != null ? this.format(this.valueNum) : '';
    if (!this.placeholderText) this.placeholderText = this.format(0);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }


  get nf(): Intl.NumberFormat {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: this.fractionDigits,
      maximumFractionDigits: this.fractionDigits
    });
  }

  private format(n: number): string {
    return this.nf.format(n);
  }

  private parse(str: string): number | null {
    if (!str) return null;

    const parts = new Intl.NumberFormat(this.locale).formatToParts(12345.6);
    const groupSym = parts.find(p => p.type === 'group')?.value || ',';
    const decSym = parts.find(p => p.type === 'decimal')?.value || '.';

    let normalized = str
      .replace(new RegExp('\\' + groupSym, 'g'), '')
      .replace(new RegExp('\\' + decSym), '.')
      .replace(/[^\d.-]/g, '');

    if (!this.allowNegative) {
      normalized = normalized.replace(/-/g, '');
    }

    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  //  Handlers 
  handleInput(e: Event) {
    const t = (e.target as HTMLInputElement).value;
    this.text = t; 
    const n = this.parse(t);
    this.valueNum = n;
    this.onChange(n);
  }

  handleBlur() {
    this.onTouched();
    if (this.valueNum != null) {
      this.valueNum = Number(this.valueNum.toFixed(this.fractionDigits)); 
      this.text = this.format(this.valueNum); 
    } else {
      this.text = '';
    }
    this.onChange(this.valueNum);
    if (!this.placeholderText) this.placeholderText = this.format(0);
  }

  handleFocus() {
    this.text = this.valueNum != null ? String(this.valueNum) : '';
  }
}
