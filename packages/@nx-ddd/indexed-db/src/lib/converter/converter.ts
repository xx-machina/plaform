import { Entity } from '@nx-ddd/common/domain/models';

export interface IndexedDbConverter<E extends Entity> {
  fromIndexedDb(): E;
  toIndexedDb(): object;
}
