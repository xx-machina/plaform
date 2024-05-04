import { DISCORD_ACCESS_TOKEN, DISCORD_CONFIG } from "@x-lt/common/infrastructure/external/discord";
import { TestBed } from "@nx-ddd/core/test-bed";
import { SecondEntryService } from "./second-entry.service";

describe('SecondEntryService', () => {
  let service: SecondEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DISCORD_CONFIG, useValue: {} },
        { provide: DISCORD_ACCESS_TOKEN, useValue: '' },
      ],
    });
    service = TestBed.inject(SecondEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
