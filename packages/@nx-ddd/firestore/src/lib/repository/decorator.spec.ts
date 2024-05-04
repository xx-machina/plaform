import { createInjector, NxModule } from '@nx-ddd/core';
import { Entity } from '@nx-ddd/common/domain/models';
import { FirestoreAdapter } from '../adapters/base';
import { FirestoreConverter } from '../converter';
import { FirestoreRepository } from '../repository';

class Example extends Entity { }

@FirestoreRepository({
  Entity: Example,
  path: 'example',
})
class ExampleRepository { }

@NxModule({
  providers: [
    ExampleRepository,
    { provide: FirestoreAdapter, useValue: { collectionGroup: jest.fn()} },
    FirestoreConverter,
  ],
})
export class ExampleModule { }

describe('FirestoreDecorator', () => {
  const injector = createInjector(ExampleModule);
  
  it('should create repository', () => {
    const repository = injector.get(ExampleRepository);
    expect(repository).toBeTruthy();
  });
});
