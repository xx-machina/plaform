import { inject } from '@angular/core';
import { plainToInstanceWithValid } from '@nx-ddd/core/util';
import { FirestoreAdapter } from '../adapters/base';
import { DocumentSnapshot } from '../interfaces';

export interface IFirestoreConverter<Entity extends {id: string}> {
  fromFirestore(doc: DocumentSnapshot<object>): Entity;
  toFirestore(entity: Partial<Entity>): object;
}

class BasicConverter<E extends {id: string}> {
  constructor(
    protected readonly Entity: new () => E,
    protected readonly adapter: FirestoreAdapter,
  ) { }

  fromFirestore(doc: DocumentSnapshot<any>): E {
    const data = this.adapter.fromFirestore({
      ...doc.data(),
      id: doc.id
    }, this.Entity);
    return plainToInstanceWithValid(this.Entity, data);
  }

  toFirestore(entity: E): object {
    return this.adapter.toFirestore(entity as any, this.Entity);
  }
}

export function injectConverter<Entity extends {id: string}>(
  Entity: new () => Entity,
) {
  const adapter = inject(FirestoreAdapter);
  return new BasicConverter(Entity, adapter);
}
