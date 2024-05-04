import { TestBed } from '@nx-ddd/core';
import { SpecRepository, VECTOR_SIZE } from './spec.repository';
import { RedisModule } from '../../redis';

describe('SpecRepository', () => {
  let repository: SpecRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RedisModule.forRoot({
          config: { url: 'redis://localhost:6379' },
        }),
      ],
      providers: [
        { provide: VECTOR_SIZE, useValue: 3 },
      ]
    });
    repository = TestBed.inject(SpecRepository);
  });

  describe('search()', () => {
    it('should be succeeded', async () => {
      await repository.makeIndex();
      await repository.deleteAll();

      await repository.create({
        id: '1',
        operatorId: 'operator',
        input: 'test',
        output: 'test',
        embeddings: [0, 1, 1],
      });
      await repository.create({
        id: '2',
        operatorId: 'operator',
        input: 'example-02',
        output: 'test',
        embeddings: [0, 1, 2.3],
      });
      await repository.create({
        id: '3',
        operatorId: 'example',
        input: 'example-02',
        output: 'test',
        embeddings: [0, 1, 2],
      });
      const specs = await repository.search('operator', [0, 1, 2]);
      console.debug(specs);
    });
  });
});