import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { publicRouteGuardGuard } from './public-route-guard.guard';

describe('publicRouteGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => publicRouteGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
