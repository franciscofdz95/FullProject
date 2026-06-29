import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SfabraContextService {
  private _sfabraId$ = new BehaviorSubject<number | null>(null);
  sfabraId$ = this._sfabraId$.asObservable();

  setSfabraId(id: number | null) { this._sfabraId$.next(id); }

  removeSfraId() { { this._sfabraId$.next(null); } }
}
