
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

interface MonthOption {
  key: string;   
  label: string; 
  date: Date;    
}

@Component({
  standalone: true,
  selector: 'app-custom-select-month',
  templateUrl: './custom-select-month.component.html',
  styleUrl: './custom-select-month.component.css',
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectMonthComponent),
      multi: true
    }
  ]
})
export class CustomSelectMonthComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() monthsBack = 18;
  @Input() locale: string = 'en-EN';
  @Input() startFrom?: Date;
  @Input() placeholder = 'Select a month…';
  @Input() clearable = true;
  months: MonthOption[] = [];
  selectedKey?: string;
  disabled = false;

  private onChange: (value: Date | null) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit(): void {
    this.buildMonths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthsBack'] || changes['startFrom'] || changes['locale']) {
      this.buildMonths();
      
      if (this.selectedKey && !this.months.some(m => m.key === this.selectedKey)) {
        
        this.selectedKey = undefined;
        this.onChange(null);
      }
    }
  }

  private buildMonths(): void {
    const total = Math.max(0, Math.floor(this.monthsBack || 0));
    const anchor = this.startFrom ? new Date(this.startFrom) : new Date();
  
    const current = new Date(anchor.getFullYear(), anchor.getMonth(), 1);

    const arr: MonthOption[] = [];
    for (let i = 0; i < total; i++) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const key = this.toKey(d); // 'YYYY-MM'
      const labelRaw = new Intl.DateTimeFormat(this.locale, {
        month: 'long',
        year: 'numeric'
      }).format(d);
      arr.push({
        key,
        label: this.capitalize(labelRaw),
        date: d
      });
    }
    this.months = arr;
  }

  private toKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private fromKey(key: string): Date | null {
 
    const m = /^(\d{4})-(\d{2})$/.exec(key);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1; 
    if (month < 0 || month > 11) return null;
    return new Date(year, month, 1, 0, 0, 0, 0);
  }

  private normalizeToMonthStart(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  }

  private capitalize(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  writeValue(value: Date | string | null): void {

    if (!value) {
      this.selectedKey = undefined;
      return;
    }

    let date: Date | null = null;

    if (value instanceof Date) {
      date = this.normalizeToMonthStart(value);
    } else if (typeof value === 'string') {
      // 'YYYY-MM'
      date = this.fromKey(value);
      if (!date) {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          date = this.normalizeToMonthStart(parsed);
        }
      }
    }

    if (date) {
      const key = this.toKey(date);
      this.selectedKey = key;

      if (!this.months.some(m => m.key === key)) {
      }
    } else {
      this.selectedKey = undefined;
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onKeyChange(key: string | null) {
    this.selectedKey = key ?? undefined;
    if (!key) {
      this.onChange(null);
      return;
    }
    const date = this.fromKey(key);

    this.onChange(date);
  }

  onBlur() {
    this.onTouched();
  }
}
