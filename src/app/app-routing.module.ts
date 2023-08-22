import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { publicRouteGuardGuard } from './guards/public-route-guard.guard';
import { CitiesListComponent } from './cities/cities-list/cities-list.component';
import { privateRouteGuardGuard } from './guards/private-route-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [publicRouteGuardGuard],
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [publicRouteGuardGuard],
  },
  {
    path: 'cities',
    component: CitiesListComponent,
    canActivate: [privateRouteGuardGuard],
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
