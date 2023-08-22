import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/auth/login/login.service';
import { inject } from '@angular/core';

export const publicRouteGuardGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  let storageRefreshToken: string | null = localStorage.getItem("angular-refresh-token");
  if(storageRefreshToken != null){
    router.navigateByUrl("/");
  }
  return true;
};
