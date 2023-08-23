import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaterialSidenavService {
  public sidenavOpen: BehaviorSubject<any> = new BehaviorSubject(null);

  toggleSideNav() {
    this.sidenavOpen.next(!this.sidenavOpen.getValue());
  }

  public toggle() {
    return this.sidenavOpen.next(null);
  }
}
