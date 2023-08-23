import { Component, ViewChild } from '@angular/core';
import { LoginService } from './services/auth/login/login.service';
import { BooleanInput } from '@angular/cdk/coercion';
import { MaterialSidenavService } from './services/material-sidenav.service';
import { ToastrService } from 'ngx-toastr';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav') public sidenav?: MatSidenav;
  title = 'angular-auth-app';

  loggedInUiLoading: Boolean = true;

  sidenavOpen: BooleanInput = false;

  isLoggedIn?: Boolean;

  constructor(
    private loginService: LoginService,
    private sideNavService: MaterialSidenavService,
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.sideNavService.sidenavOpen.subscribe(() => {
      this.sidenav?.toggle();
    });
    this.loginService
      .getLoggedInUi()
      .subscribe((response) => (this.loggedInUiLoading = response));
    this.loginService.onStartupSetState();
    // this.sideNavService.getSideNavOpen().subscribe({
    //   next: (response) => {
    //     this.sidenavOpen = response;
    //   },
    // });
    this.loginService
      .getLoggedIn()
      .subscribe((response) => (this.isLoggedIn = response));
  }

  logout() {
    this.tostr.success('Logged out successfully');
    this.loginService.localLogout();
  }
}
