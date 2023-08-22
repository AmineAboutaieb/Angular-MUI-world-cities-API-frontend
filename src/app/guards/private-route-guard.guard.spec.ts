import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { privateRouteGuardGuard } from './private-route-guard.guard';

describe('privateRouteGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => privateRouteGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
