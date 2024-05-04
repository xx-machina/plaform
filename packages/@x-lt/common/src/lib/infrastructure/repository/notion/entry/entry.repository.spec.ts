import { Entry, EntryStatus } from "@x-lt/common/domain/models/notion";
import { TestBed } from "@nx-ddd/core/test-bed";
import { EntryRepository } from "./entry.repository";

const SCHOLARSHIP_ID = '32665f5f1edb46f0a03c4e319c37864b';

describe('EntryRepository', () => {
  let entryId = null;
  let repository: EntryRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    repository = TestBed.inject(EntryRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('listByStatus()', () => {
    it('should be succeeded', async () => {
      const entries = await repository.listByStatus(EntryStatus._200_未着手);
      expect(entries).toBeLessThan(1);
    });
  });

  describe('create()', () => {
    xit('should be succeeded', async () => {
      const entry = await repository.create(Entry.from<Entry>({
        title: 'spec',
        status: EntryStatus._200_未着手,
        firstEntryIds: [],
      }));
      entryId = entry.id;
      expect(entryId).toBeTruthy();
    });
  });

  describe('update()', () => {
    xit('should be succeeded', async () => {
      const entry = await repository.update(Entry.from<Entry>({
        id: entryId,
        title: 'spec(updated)',
        status: EntryStatus._202_一次選考中,
      }));
      expect(entry).toBeTruthy();
    });
  });

  describe('listByTwitterScreenName()', () => {
    xit('should be succeeded', async () => {
      const entries = await repository.listByTwitterScreenName('nontangent', SCHOLARSHIP_ID);
    });
  });
});