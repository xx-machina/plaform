import { Injectable, Injector, Signal, computed, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Router } from "@angular/router";
import { NEVER, Observable, combineLatest, filter, map, of, shareReplay, startWith, switchMap } from "rxjs";
import { toSignal } from '@angular/core/rxjs-interop';
import { Type } from "@nx-ddd/common/domain/models";
import { get } from "lodash-es";

export function injectRouterParam$(key: string): Observable<string> {
  return inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get(key)),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

/** @deprecated */
export function injectRouterParam(key: string): Signal<string> {
  return toSignal(injectRouterParam$(key));
}

export function injectRouteParam$(key: string): Observable<string> {
  return inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get(key)),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectRouteQueryParam$<T extends string = string>(key: string): Observable<T> {
  return inject(ActivatedRoute).queryParamMap.pipe(
    map((params) => params.get(key) as T),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectRouteQueryParam(key: string): Signal<string> {
  return toSignal(injectRouteQueryParam$(key));
}

export function injectRouteParam(key: string, injector?: Injector): Signal<string> {
  return toSignal(injectRouteParam$(key), {injector});
}

export function injectRouteParamMap$(): Observable<ParamMap> {
  return inject(ActivatedRoute).paramMap.pipe(
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectRouteParamMap(): Signal<ParamMap> {
  return toSignal(injectRouteParamMap$());
}

export function injectRouteParams$(): Observable<Record<string, string>> {
  return inject(ActivatedRoute).paramMap.pipe(
    map((params) => {
      const result = {};
      params.keys.forEach(key => result[key] = params.get(key));
      return result;
    }),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectRouteParams(): Signal<Record<string, string>> {
  return toSignal(injectRouteParams$());
}

export function injectChildRouteParam$(key: string, initial: Observable<Map<string, string>> = NEVER): Observable<string> {
  const route = inject(ActivatedRoute);
  const router = inject(Router);
  return router.events.pipe(
    switchMap(() => route?.firstChild ? route.firstChild.paramMap : initial),
    map((params) => params.get(key)),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectChildRouteParam(key: string): Signal<string> {
  return toSignal(injectChildRouteParam$(key));
}

export function injectChildRoute$() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  return router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => route?.firstChild?.firstChild),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectChildRoute(): Signal<ActivatedRoute> {
  return toSignal(injectChildRoute$());
}

export function injectHasNext$() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  return router.events.pipe(
    startWith(null),
    map(() => !!route?.firstChild?.firstChild),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectHasNext() {
  return toSignal(injectHasNext$());
}

export function injectRouterQueryParam$(key: string): Observable<string> {
  return inject(ActivatedRoute).queryParamMap.pipe(
    map((params) => params.get(key)),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectRouterQueryParam(key: string): Signal<string> {
  return toSignal(injectRouterQueryParam$(key));
}

export function injectRouteData$<T>(path: string): Observable<T> {
  return inject(ActivatedRoute).data.pipe(map(data => get(data, path) as T));
}

export function injectRouteData<T>(key: string): Signal<T> {
  return toSignal(injectRouteData$(key));
}

export function injectActivatedComponents(injector: Injector = inject(Injector)): any[] {
  const components = [];
  let route = injector.get(ActivatedRoute, {optional: true}) ?? null;
  while(route) {
    if (route.component) components.push(route.component);
    route = route.parent;
  }
  return components;
}



export interface Resolver<T> {
  resolve(entry: T): T;
  resolveMany(entities: T[]): T[];
}

export function provideResolver(
  Entity: Type<{id: string}>,
  ResolverType: new (params: Record<string, Observable<any>>) => Resolver<any>,
) {
  return {
    provide: Entity,
    // useFactory: () => new ResolverType(params),
    deps: [],
    multi: true,
  };
}

@Injectable({providedIn: 'root'})
export class ResolverManager {
  protected map = new Map<string, Resolver<any>>();

  get(Entity: Type<{id: string}>) {
    if (!this.map.has(Entity.name)) {
      // return this.map.set()
    }
    return this.map.get(Entity.name);
  }
}

export function injectResolver$<T>(
  ResolverType: new (params: Record<string, any>) => Resolver<T>,
  params: Record<string, Observable<any>>,
): Observable<Resolver<T>> {
  return combineLatest(params).pipe(
    map((params) => new ResolverType(params)),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function getResolver<T>(
  ResolverType: new (params: Record<string, any>) => Resolver<T>,
  params: Record<string, any>,
): Resolver<T> {
  return new ResolverType(params);
}
