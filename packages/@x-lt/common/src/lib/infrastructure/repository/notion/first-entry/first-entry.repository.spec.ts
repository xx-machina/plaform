import { FirstEntry } from '@x-lt/common/domain/models/notion';
import { TestBed } from '@nx-ddd/core/test-bed';
import { NOTION_ACCESS_TOKEN } from '@nx-ddd/notion/repository';
import dayjs from 'dayjs';
import { FirstEntryRepository } from './first-entry.repository';

describe('FirstEntryRepository', () => {
  let repository: FirstEntryRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NOTION_ACCESS_TOKEN,
          useValue: 'secret',
        },
      ]
    });
    repository = TestBed.inject(FirstEntryRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('create()', () => {
    it('should be succeeded', async () => {
      const firstEntry = FirstEntry.from<FirstEntry>({
        title: 'テスト用',
        tweetURL: 'https://google.com',
        tweetId: 'tweetId',
        authorId: 'example-twitter-id',
        userName: 'Backlog',
        name: 'nontangent',
        entryIds: [],
        tweetedAt: dayjs(),
      });
      
      await repository.create(firstEntry);
    });
  });

  xit('', async () => {
    const firstEntries = await repository.listByEditedAtAfter(dayjs('2022-11-05'));
  });
});
