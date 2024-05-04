import { Injectable } from '@nx-ddd/core';

export type PartialWithId<T> = {[P in keyof T]?: T[P]} & {id: string};

@Injectable()
export abstract class Repository<E extends {id: string}> {
  list(): Promise<E[]> {
    throw new Error('is not implemented!');
  };
  get(entity: PartialWithId<E>): Promise<E> {
    throw new Error('is not implemented!');
  };
  create(entity: Partial<E>): Promise<E> {
    throw new Error('is not implemented!');
  };
  update(entity: PartialWithId<E>): Promise<void> {
    throw new Error('is not implemented!');
  }
  delete(entity: PartialWithId<E>): Promise<void> {
    throw new Error('is not implemented!');
  };
}
