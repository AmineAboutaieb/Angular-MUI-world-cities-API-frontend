import { TestBed } from '@angular/core/testing';

import { MaterialSidenavService } from './material-sidenav.service';

describe('MaterialSidenavService', () => {
  let service: MaterialSidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialSidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
