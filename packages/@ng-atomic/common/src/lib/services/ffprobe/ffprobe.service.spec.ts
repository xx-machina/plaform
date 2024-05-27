import { TestBed } from '@angular/core/testing';

import { FfprobeService } from './ffprobe.service';

describe('FfprobeService', () => {
  let service: FfprobeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfprobeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
