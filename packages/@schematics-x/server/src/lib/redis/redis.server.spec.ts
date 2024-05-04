import { TestBed } from '@nx-ddd/core';
import { RedisService, VectorSize } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedisService);
    await service.onInit();
  });

  it('', async () => {
    expect(service).toBeTruthy();
    await service.setContext({
      id: '1',
      instructions: 'Create user directory',
      context: 'context 1',
      // embedding: [0.1, 0.2, 0.3],
      embedding: [0.1, 0.2, 0.3, ...[...Array(VectorSize.TEST - 3)].map(() => 0.)],
    });
    await service.setContext({
      id: '2',
      instructions: 'Hello World',
      context: 'context 1',
      // embedding: [0.1, 0, 0],
      embedding: [...[...Array(VectorSize.TEST)].map(() => 0.0)],
    });
    await service.setContext({
      id: '3',
      instructions: 'Hey guys!',
      context: 'context 1',
      // embedding: [0.1, 0, 0],
      embedding: [...[...Array(VectorSize.TEST)].map(() => 0.0)],
    });
    const context = await service.getContext('1');
    console.debug('context:', context);

    const results = await service.searchContexts([0.1, 0.2, 0.3, ...[...Array(VectorSize.TEST - 3)].map(() => 0.0)]);
    console.debug('results:', results);
  });
});
