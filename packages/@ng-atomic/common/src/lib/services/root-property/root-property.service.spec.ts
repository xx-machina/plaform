import { TestBed } from '@angular/core/testing';

import { RootPropertyService } from './root-property.service';

describe('RootPropertyService', () => {
  let service: RootPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
