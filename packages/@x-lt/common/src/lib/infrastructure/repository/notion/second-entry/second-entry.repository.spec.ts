import { TestBed } from "@nx-ddd/core/test-bed";
import { SecondEntryRepository } from "./second-entry.repository";

describe('SecondEntryRepository', () => {
  let repository: SecondEntryRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    repository = TestBed.inject(SecondEntryRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });
});
