import { TestBed } from "@nx-ddd/core/test-bed";
import { Repositories } from "./repositories";
import { RepositoriesModule } from './repositories.module';

describe('Repositories', () => {
  let repositories: Repositories;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RepositoriesModule,
      ],
    });
    repositories = TestBed.inject(Repositories);
  });

  it('should be created', () => {
    expect(repositories).toBeTruthy();
  });
});
