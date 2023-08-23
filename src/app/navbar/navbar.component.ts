import { Component } from '@angular/core';
import { LoginService } from '../services/auth/login/login.service';
import { MaterialSidenavService } from '../services/material-sidenav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn?: Boolean;

  constructor(
    private loginService: LoginService,
    private sidenavService: MaterialSidenavService
  ) {}

  ngOnInit(): void {
    this.loginService
      .getLoggedIn()
      .subscribe((response) => (this.isLoggedIn = response));
  }

  logout() {
    this.loginService.localLogout();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
