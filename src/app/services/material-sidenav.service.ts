import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MaterialSidenavService {

  private  sidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  getSideNavOpen(): Observable<boolean>{
    return this.sidenavOpen;
  }

  toggleSideNav(){
    this.sidenavOpen.next(!this.sidenavOpen.getValue());
  }


}
