import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Paramlist } from '../Models/Paramlist.model';

export interface ExecuteEvent {
  mainTab: string;     
  subTab?: string;  
  params: Paramlist;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ExecuteService {
  private executeSubject = new Subject<ExecuteEvent>();
  
  public execute$ = this.executeSubject.asObservable();

  triggerExecute(mainTab: string, params: Paramlist, subTab?: string): void {
    const event: ExecuteEvent = {
      mainTab: mainTab,
      subTab: subTab,
      params: params,
      timestamp: new Date()
    };
    
    this.executeSubject.next(event);
  }
}
