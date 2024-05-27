import { Injectable } from '@angular/core';
import { Entity } from './models';

export type PartialWithId<E extends Entity> = Pick<E, 'id'> & Partial<E>;

@Injectable()
export abstract class Repository<E extends {id: string}> {
  list(): Promise<E[]> {
    throw new Error('is not implemented!');
  }

  get(entity: Pick<E, 'id'>): Promise<E> {
    throw new Error('is not implemented!');
  }

  create(entity: E): Promise<E> {
    throw new Error('is not implemented!');
  }

  update(entity: Pick<E, 'id'> & Partial<E>): Promise<void> {
    throw new Error('is not implemented!');
  }

  delete(entity: Pick<E, 'id'>): Promise<void> {
    throw new Error('is not implemented!');
  }
}
