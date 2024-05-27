import { Injectable } from '@angular/core';
import { Entity } from '@nx-ddd/common/domain/models';
import { Repository } from '@nx-ddd/common/domain/repository';
import { IndexedDbConverter } from '../converter';

@Injectable()
export abstract class IndexedDbRepository<E extends Entity> extends Repository<E> {
  constructor(
    protected converter: IndexedDbConverter<E>,
  ) {
    super();
  }

  list(): Promise<E[]> {
    throw new Error('Not implemented!');
  };

  get(params: {id: string}): Promise<E> {
    throw new Error('Not implemented!');
  }

  create(entity: Partial<E>): Promise<E> {
    throw new Error('Not implemented!');
  }

  update(entity: Partial<E>): Promise<void> {
    throw new Error('Not implemented!');
  }

  delete(entity: any): Promise<void> {
    throw new Error('Not implemented!');
  }
}

