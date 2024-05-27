
import { InjectionToken, Injector, inject } from '@angular/core';
import { Type } from '@nx-ddd/common/domain/models';
import { Observable } from 'rxjs';
import { Entity } from './task-composer';

export class EntityStoreAdapter<E extends Entity> {
  list?(): Observable<E[]> {
    throw new Error('not implemented');
  }

  create?(entity: E): Promise<E> {
    throw new Error('not implemented');
  }

  update?(entity: Partial<E> & {id: string}): Promise<void> {
    throw new Error('not implemented');
  }

  delete?(entity: Partial<E>  & {id: string}): Promise<void> {
    throw new Error('not implemented');
  }
}

export const ENTITY_STORE_ADAPTER = new InjectionToken<{
  entity: Type<Entity>,
  adapter: EntityStoreAdapter<Entity>
}[]>('ENTITY_STORE_ADAPTER');

export function provideEntityStoreAdapter<E extends Entity>(
  entity: Type<E>,
  adapterFactory: (injector: Injector) => EntityStoreAdapter<E>,
) {
  return {
    provide: ENTITY_STORE_ADAPTER,
    multi: true,
    useFactory: (injector: Injector) => {
      return { entity, adapter: adapterFactory(injector) };
    },
    deps: [Injector]
  };
}

export function injectEntityStoreAdapter<E extends Entity>(entity: Type<E>): EntityStoreAdapter<E> {
  const adapters = inject(ENTITY_STORE_ADAPTER, {optional: true}) ?? [];
  return adapters.find(adapter => adapter.entity === entity)?.adapter as EntityStoreAdapter<E>;
}
