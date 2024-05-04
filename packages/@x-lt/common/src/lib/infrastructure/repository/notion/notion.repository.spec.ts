import { NotionRepository } from "./notion.repository";
import { NotionModule } from "./notion.module";
import { TestBed } from "@nx-ddd/core/test-bed";
import { NOTION_ACCESS_TOKEN } from "@nx-ddd/notion/repository";

describe('NotionRepository', () => {
  let repository: NotionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotionModule],
      providers: [
        {
          provide: NOTION_ACCESS_TOKEN,
          useValue: '',
        },
      ]
    });
    repository = TestBed.inject(NotionRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });
});
