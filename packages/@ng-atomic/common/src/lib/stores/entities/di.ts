import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Signal, computed, inject } from '@angular/core';
import { Type } from '@nx-ddd/common/domain/models';
import { Resolver, getResolver, injectResolver$ } from '@ng-atomic/common/utils';
import { Observable, combineLatest, isObservable, of, filter, map, shareReplay, switchMap, tap, distinctUntilChanged } from 'rxjs';
import { Entity } from './task-composer';
import { EntityStore } from './entity-store';
import { injectEntityStore } from './entity-store-manager';
import { computedAsync } from 'ngxtension/computed-async';

export function injectOne$<T extends Entity>(
  Entity: Type<T>,
  params: Record<string | 'id', Observable<any>> = {},
  resolverType?: new (params: Record<string, Observable<any>>) => Resolver<T>
): Observable<T> {
  if (resolverType) {
    return combineLatest({
      resolver: injectResolver$(resolverType, params),
      Entity: injectEntityStore(Entity).mapToOne(params.id).pipe(
        filter((Entity) => !!Entity)
      ),
    }).pipe(
      map(({ resolver, Entity }) => resolver.resolve(Entity)),
      shareReplay(1),
      takeUntilDestroyed(),
    );
  }

  return injectEntityStore(Entity).mapToOne(params.id).pipe(
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

function signalMapToObs(map: Record<string, Signal<any>>): Record<string, Observable<any>> {
  return Object.entries(map).reduce((acc, [key, value]) => {
    acc[key] = toObservable(value);
    return acc;
  }, {});
}


export function injectOne<T extends Entity>(
  Entity: Type<T>,
  params: Record<string | 'id', Signal<any>> = {},
  resolverType?: new (params: Record<string, any>) => Resolver<T>
) {
  return toSignal(injectOne$(Entity, signalMapToObs(params), resolverType));
}

export function injectAll$<T extends Entity>(
  Entity: Type<T>,
  params: Record<string, Observable<any>> = {},
  resolverType?: new (params: Record<string, any>) => Resolver<T>
) {
  if (resolverType) {
    return combineLatest({
      resolver: injectResolver$(resolverType, params),
      entities: injectEntityStore(Entity).all$,
    }).pipe(
      map(({ resolver, entities }) => resolver.resolveMany(entities)),
      shareReplay(1),
      takeUntilDestroyed(),
    );
  }

  return injectEntityStore(Entity).entities$.pipe(
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export const callSignalMap = <T extends Record<string, Signal<any>>>(map: T): Signal<T> =>  {
  return computed(() => Object.entries(map).reduce((acc, [key, value]) => {
    return {...acc, [key]: value()};
  }, {} as T));
}

// export function injectAll<T extends Entity>(
//   Entity: Type<T>,
//   params: Record<string, Signal<any>> = {},
//   resolverType?: new (params: Record<string, any>) => Resolver<T>
// ) {
//   const store = injectEntityStore(Entity);
//   if (resolverType) {
//     return computed(() => {
//       const resolver = getResolver(resolverType, callSignalMap(params)());
//       const items = resolver.resolveMany(store.all());
//       return items;
//     });
//   }
//   return computed(() => store.all());
// }

export function injectAll<T extends Entity>(
  Entity: Type<T>,
  params: Record<string, Signal<any>> = {},
  resolverType?: new (params: Record<string, any>) => Resolver<T>
) {
  const $params = signalMapToObs(params);
  const all$ = injectAll$(Entity, $params, resolverType);
  return computedAsync(() => all$, {initialValue: []});
}

export type ValueOrObservable<T> = T | Observable<T>;

export function mapToOne$<T extends {id: string}>(
  storeType: new () => EntityStore<T>,
  keyOrKey$: ValueOrObservable<string>,
): Observable<T> {
  const store = inject<EntityStore<T>>(storeType, {});
  const key$ = isObservable(keyOrKey$) ? keyOrKey$ : of(keyOrKey$);
  return key$.pipe(switchMap(key => store.mapToOne(key)));
}
