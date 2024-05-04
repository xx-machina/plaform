import { DISCORD_ACCESS_TOKEN, DISCORD_CONFIG } from '@x-lt/common/infrastructure/external/discord';
import { TestBed } from '@nx-ddd/core/test-bed';
import { EntryService } from './entry.service';

describe('EntryService', () => {
  let service: EntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DISCORD_CONFIG, useValue: {} },
        { provide: DISCORD_ACCESS_TOKEN, useValue: '' },
      ],
    });
    service = TestBed.inject(EntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
