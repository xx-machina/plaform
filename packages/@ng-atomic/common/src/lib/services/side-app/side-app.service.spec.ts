import { TestBed } from '@angular/core/testing';

import { SideAppService } from './side-app.service';

describe('SideAppService', () => {
  let service: SideAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
