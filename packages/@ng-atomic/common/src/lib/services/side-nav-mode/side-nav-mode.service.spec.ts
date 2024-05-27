import { TestBed } from '@angular/core/testing';

import { SideNavModeService } from './side-nav-mode.service';

describe('SideNavModeService', () => {
  let service: SideNavModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideNavModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
