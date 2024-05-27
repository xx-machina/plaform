import { ElementRef, InjectionToken, Injector, Provider, ProviderToken, Signal, computed, effect, inject, isSignal, runInInjectionContext, signal } from "@angular/core";
import { UIContext, UiService } from "./ui.service";
import { get, set } from "lodash-es";
import { Action } from "@ng-atomic/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, shareReplay, startWith } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { computedAsync } from "ngxtension/computed-async";
import { NavigationHistoryService } from "@ng-atomic/common/services/navigation-history";

export function scoped<T extends object, TKey extends keyof T>(source: Signal<T>, path: TKey | [TKey]): Signal<T[TKey]> {
  const scopedSignal = signal<T[TKey]>(get(source(), path));
  effect(() => {
    scopedSignal.set(get(source(), path, source()) as T[TKey]);
  }, {allowSignalWrites: true});
  return computed(() => scopedSignal());
}

export function injectBreakpoint() {
  return inject(UiService).breakpoint.breakpoint;
}

export function injectIsMobile() {
  const breakpoint = injectBreakpoint();
  return computed(() =>  ['xSmall', 'small'].includes(breakpoint()));
}

export enum NavActionId {
  TOGGLE_SIDE_NAV = '[@ng-atomic/common/services/ui] TOGGLE_SIDE_NAV',
  BACK = '[@ng-atomic/common/services/ui] BACK',
}

export function injectIsRootPage$() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  return router.events.pipe(
    startWith(null),
    map(() => {
      const components = [];
      let route_ = route; 
      while(route_) {
        if (!route_.parent) break;
        route_ = route_.parent;
        if (route_.component) {
          components.push(route_.component);
        }
      }
      return !!(components?.length === 1);
    }),
    map((route) => !!route),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectIsRootPage() {
  const isRootPage$ = injectIsRootPage$();
  const injector = inject(Injector);
  return computedAsync(() => isRootPage$, {injector});
}

export function injectNavStartActions(
  isRootPage: Signal<boolean> = signal<boolean>(false),
): Signal<Action[]> {
  const context = injectUiContext();
  const navigationHistory = inject(NavigationHistoryService);
  return computed(() => {
    switch(context().breakpoint) {
      case 'xLarge':
      case 'large':
      case 'medium':
      case 'small': {
        if (isRootPage()) {
          return [];
        } else {
          if (navigationHistory.isInitial()) {
            return [];
          } else {
            return [{ id: NavActionId.BACK, name: 'BACK', icon: 'arrow_back' }];
          }
        }
      }
      case 'xSmall': {
        if (isRootPage()) {
          return [{ id: NavActionId.TOGGLE_SIDE_NAV, name: 'メニュー', icon: 'menu' }];
        } else {
          if (navigationHistory.isInitial()) {
            return [{ id: NavActionId.TOGGLE_SIDE_NAV, name: 'メニュー', icon: 'menu' }]
          } else {
            return [{ id: NavActionId.BACK, name: 'BACK', icon: 'arrow_back' }];
          }
        }
      }
      default: {
        if (isRootPage()) return [];
        return [{ id: NavActionId.BACK, name: 'BACK', icon: 'arrow_back' }];
      }
    }
  });
}

export function injectUiContext(): Signal<UIContext> {
  return inject(UiService).uiContext;
}

export type UiConfigReducer<T extends object | string, C extends UIContext = any> = (config: T, context: C) => T;
export const UI_CONFIG_REDUCER = new InjectionToken<UiConfigReducer<any>>('UI_CONFIG_REDUCER');
export type ReducerFactory<T extends object | string, K extends T = any> 
  = (injector: Injector, hostInjector: Injector) => (config: K, context: UIContext) => T;

export function call<T>(signalOrValue: Signal<T> | T): T {
  return isSignal(signalOrValue) ? signalOrValue() : signalOrValue;
}

function setReducerPath(reducer: Function, path: string[]) {
  Object.defineProperty(reducer, 'path', { value: path, configurable: true });
  return reducer;
}

function getReducerPath(reducer: Function) {
  return reducer['path'];
}

export function provideUiConfig<T extends object | string>(
  reducerFactory: ReducerFactory<T>,
  path: string[] = [],
  name = 'name',
): Provider {
  return {
    provide: UI_CONFIG_REDUCER,
    useFactory: (injector: Injector) => {
      function _reducerFactory(hostInjector: Injector) {
        const reducer = reducerFactory(injector, hostInjector); 
        return (config: T, context: any) => {
          if (path.length === 0) return  reducer(config, context);
          return set(config as object, path, reducer(get<any, any>(config, path), context));
        }
      };
      Object.defineProperty(_reducerFactory, 'name', { value: name, configurable: true });
      setReducerPath(_reducerFactory, path);
      return _reducerFactory;
    },
    deps: [Injector],
    multi: true,
  };
}

export function injectRootConfig<T extends object>(paths: string[] = []): Signal<T> {
  const uiContext = injectUiContext();
  const factories = injectReducerFactoiries(paths);
  const hostInjector = inject(Injector);
  const reducers = factories.map(factory => {
    return runInInjectionContext(hostInjector, () => factory(hostInjector));
  });
  if (!reducers) return undefined;
  const rootConfig = computed(() => {
    const context = uiContext();
    return reducers.reduce((acc, reducer) => {
      return runInInjectionContext(hostInjector, () => reducer(acc, context));
    }, {} as T);
  });
  return rootConfig;
}

// TODO(@nontangent): itemsなどの取得が全てのコンポーネントで行われるので計算を最適化する。
export function injectUiConfig<T extends object>(paths: string[] = []): Signal<T> {
  const rootConfig = injectRootConfig<T>(paths);
  return scoped(rootConfig, paths as any);
}

export function makeConfig<T extends object>(defaultUseFactory: ReducerFactory<T>, path: string[]) {
  return {
    provide: function provideConfig(useFactory?: ReducerFactory<T>, label = useFactory ? 'custom' : 'default') {
      useFactory ??= defaultUseFactory;
      return provideUiConfig<T>(useFactory, path, `[${path.join('.')}] ${label}`);
    },
    inject: function injectConfig() {
      return injectUiConfig<T>(path);
    },
  }
}

function injectReducers(): ((hostInjector: Injector) => UiConfigReducer<any>)[] {
  return injectDeepMulti<(hostInjector: Injector) => UiConfigReducer<any>>(UI_CONFIG_REDUCER);
}

function injectReducerFactoiries(path: string[] = []): ((hostInjector: Injector) => UiConfigReducer<any>)[] {
  return injectReducers().filter(factory => {
    return getReducerPath(factory).every((p, i) => path[i] === p);
  });
}

export function injectDeepMulti<T>(token: ProviderToken<T>, injector: Injector = inject(Injector)): T[] {
  const valueOrArray = injector.get(token as ProviderToken<T[]>, [], {optional: true});
  const items = Array.isArray(valueOrArray) ? valueOrArray : [valueOrArray];
  const parentInjector = injector.get(Injector, null, {skipSelf: true});
  if (!parentInjector) return items;
  return [...new Set([...injectDeepMulti(token, parentInjector), ...items])];
}

export function debugInjector(injector: Injector | null = inject(Injector)) {
      const getParent = (injector: Injector, n = 0): Injector | null => {
      while (injector && n-- > 0) {
        injector = injector.get(Injector, null, { skipSelf: true });
      }
      return injector;
    }

    const getInjectorName = (injector: Injector): string => {
      const name = injector.get(ElementRef, null)?.nativeElement?.tagName?.toLowerCase();
      if (name) return `<${name}>`;
      return `${injector['source']}`;
    }

    const isNodeInjector = (injector: Injector): boolean => {
      return injector.get(ElementRef, null) !== null;
    }

    const mapToNames = (reducers: any) => (reducers ?? []).map(reducer => reducer.name);

    for (let i = 0; i < 20; i++) {
      injector = getParent(injector, i);
      if (injector === Injector.NULL) break;
    }
}
