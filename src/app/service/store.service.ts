import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private store$: BehaviorSubject<any> = new BehaviorSubject(null);

  getStore() {
    return this.store$;
  }

  setStore(value: any) {
      this.store$.next(value);
  }
  constructor() { }
}
