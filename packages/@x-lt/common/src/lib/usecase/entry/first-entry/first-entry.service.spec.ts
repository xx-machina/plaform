import { DISCORD_ACCESS_TOKEN, DISCORD_CONFIG } from '@x-lt/common/infrastructure/external/discord';
import { TestBed } from '@nx-ddd/core/test-bed';
import { FirstEntryService, FIRST_ENTRY_TWEET_URL } from './first-entry.service';


describe('FirstEntryService', () => {
  let service: FirstEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DISCORD_CONFIG, useValue: {} },
        { provide: DISCORD_ACCESS_TOKEN, useValue: '' },
        { provide: FIRST_ENTRY_TWEET_URL, useValue: 'https://twitter.com/sfc_projects/status/1593589369629122561' },
      ],
    });
    service = TestBed.inject(FirstEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('observe()', async () => {
  //   await service.observe();
  // });

  it('createByTweet()', async () => {
    await service.createByTweet();
  });
});
