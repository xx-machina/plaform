import { Injectable, inject } from '@angular/core';
import { Type } from '@nx-ddd/common/domain/models';
import { distinctUntilChanged } from 'rxjs/operators';
import { Entity } from './task-composer';
import { EntityStore } from './entity-store';

export const distinctUntilChangedArray = <T>() => {
  return distinctUntilChanged<T>((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur));
};

@Injectable({providedIn: 'root'})
export class EntityStoreManager {
  protected storeMap = new Map<Type<Entity>, EntityStore<Entity>>();

  resolve<E extends Entity>(Entity: Type<E>): EntityStore<E> {
    if (!this.storeMap.has(Entity)) {
      this.storeMap.set(Entity, new EntityStore(Entity));
    }
    return this.storeMap.get(Entity) as EntityStore<E>;
  }
}

// export const ENTITY_STORE = new InjectionToken<{entity: Type<Entity>, factory: () => EntityStore<Entity>}[]>('ENTITY_STORE');

// export function provideEntityStore<E extends Entity>(
//   entity: Type<E>,
//   factory: () => EntityStore<E> = () => new EntityStore<E>(entity),
// ) {
//   return {
//     provide: ENTITY_STORE,
//     useFactory: () => ({ entity, factory }),
//     multi: true,
//   };
// }

export function injectEntityStore<E extends Entity>(Entity: Type<E>): EntityStore<E> {
  // const stores = inject(ENTITY_STORE, {optional: true}) ?? [];
  // const factory = stores.find(({Entity: _entity}) => _entity === Entity)?.factory;
  // if (factory) return factory() as EntityStore<E>;
  return inject(EntityStoreManager).resolve(Entity);
}
