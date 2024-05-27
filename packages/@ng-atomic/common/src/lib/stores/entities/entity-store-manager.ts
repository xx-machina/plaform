import { Injectable, inject } from '@angular/core';
import { Type } from '@nx-ddd/common/domain/models';
import { Entity } from './task-composer';
import { EntityStore } from './entity-store';
export { distinctUntilChangedArray } from './entity-store';

@Injectable({providedIn: 'root'})
export class EntityStoreService {
  protected storeMap = new Map<Type<Entity>, EntityStore<Entity>>();

  get<E extends Entity>(Entity: Type<E>): EntityStore<E> {
    if (!this.storeMap.has(Entity)) {
      this.storeMap.set(Entity, new EntityStore(Entity));
    }
    return this.storeMap.get(Entity) as EntityStore<E>;
  }
}

export function injectEntityStore<E extends Entity>(Entity: Type<E>): EntityStore<E> {
  return inject(EntityStoreService).get(Entity);
}
