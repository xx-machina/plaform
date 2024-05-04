import { Injectable, TestBed } from "@nx-ddd/core";
import { RedisRepository } from './redis.repository';
import { RedisModule } from './redis.module';

@Injectable({providedIn: 'root'})
class TestRepository extends RedisRepository {
  protected entityName = 'test';
}

const TEST = {
  id: '0001',
  message: 'This is test entity',
};

describe('RedisRepository', () => {
  let repository: TestRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RedisModule.forRoot({
          config: { url: 'redis://localhost:6379' },
        })
      ],
    });
    repository = TestBed.inject(TestRepository);
    await repository.init();
  });

  afterEach(async () => {
    await repository.deleteAll();
  });

  describe('get', () => {
    it('should be succeeded', async () => {
      await repository.create({...TEST});
      const test = await repository.get(TEST.id);
      expect(test).toEqual(TEST);
    });
  });

  describe('create', () => {
    it('should be succeeded', async () => {
      await repository.create({...TEST});
      expect(true).toBe(true);
    });
  });

  describe('update', () => {
    it('should be succeeded', async () => {
      await repository.create({...TEST});
      await repository.update({id: TEST.id, message: 'This is updated test entity'});
    });
  });

  describe('list', () => {
    it('should be succeeded', async () => {
      await repository.create({...TEST});
      const entities = await repository.list();
      console.debug(entities);
      expect(entities.length).toBeGreaterThan(0);
    });
  });

  describe('delete', () => {
    it('should be succeeded', async () => {
      await repository.create({...TEST});
      await repository.delete(TEST.id);
    });
  });
});
