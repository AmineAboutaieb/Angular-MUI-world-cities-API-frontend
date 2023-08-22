import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const privateRouteGuardGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  let storageRefreshToken: string | null = localStorage.getItem("angular-refresh-token");
  if(storageRefreshToken === null){
    router.navigateByUrl("/");
  }
  return true;
};
