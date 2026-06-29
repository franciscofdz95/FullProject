import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private dropdownRefreshSource = new Subject<void>();
  dropdownRefresh$ = this.dropdownRefreshSource.asObservable();

  triggerDropdownRefresh(): void {
    this.dropdownRefreshSource.next();
  }
}
