import { Injectable, InjectionToken, Injector, Provider, inject, runInInjectionContext } from "@angular/core";
import { Action } from "./action";

export interface EffectProps {
  dispatch: boolean;
  scope: string;
  accessor: (action: Action) => any;
}

export class EffectMap extends Map<string, {key: string, props: EffectProps}> {
  override get(key: string, scope = 'default'): { key: string; props: EffectProps; } {
    return super.get(this.makeKey(key, scope))!; 
  }

  override set(key: string, value: { key: string; props: EffectProps; }): this {
    return super.set(this.makeKey(key, value.props.scope), value);
  }

  override has(key: string, scope = 'default'): boolean {
    return super.has(this.makeKey(key, scope));
  }

  private makeKey(key: string, scope = 'default') {
    return `[${scope}]#${key}`;
  }
}

export function Effect(id: string, {
  dispatch = false,
  scope = 'default',
  accessor = (action: Action) => action.payload,
}: Partial<EffectProps> = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target['effectMap'] ??= new EffectMap();
    target['effectMap'].set(id, {key: propertyKey, props: {dispatch, scope, accessor}});
  };
}

export interface EffectFunctionOptions {
  dispatch?: boolean;
}

export interface EffectContext {
  injector?: Injector;
}

export type EffectFunction = (payload?: any, context?: EffectContext) => any | Promise<any>;
export type EffectFunctionFactory = (hostInjector?: Injector) => EffectFunction;

export interface EffectEntry {
	actionIds: string | string[];
  effectFactory?: EffectFunctionFactory;
  options?: EffectFunctionOptions;
}

export const EFFECT_ENTRY = new InjectionToken<EffectEntry>('EFFECT_ENTRY');

export function provideEffect(
  ActionIds: string[] | string,
  _effectFactory: (injector: Injector) => EffectFunction,
  options: EffectFunctionOptions = {dispatch: false},
): Provider {
	return {
		provide: EFFECT_ENTRY,
		useFactory: (injector: Injector) => {
      const effectFactory = (hostInjector: Injector) => {
        return runInInjectionContext(hostInjector, () => _effectFactory(injector));
      };
      return { actionIds: ActionIds, effectFactory, options };
    },
		multi: true,
		deps: [Injector]
	};
}

export function injectEffectEntries(): EffectEntry[] {
	return inject<EffectEntry[]>(EFFECT_ENTRY, {optional: true}) ?? [];
}

function buildEffectEntryMap(injector: Injector, effectEntries: EffectEntry[]) {
  const effectEntryMap = new Map<string, {effect: EffectFunction, options: EffectFunctionOptions}>();

  for (const entry of effectEntries) {
    const ids = Array.isArray(entry.actionIds) ? entry.actionIds : [entry.actionIds];
    for (const id of ids) {
      const effect = () => entry.effectFactory(injector);
      effectEntryMap.set(id, { effect, options: entry.options });
    }
  }

  return effectEntryMap;
}

@Injectable()
export class EffectReducer {
  readonly injector = inject(Injector);
	readonly effectEntries = injectEffectEntries();
  readonly effectEntryMap = buildEffectEntryMap(this.injector, this.effectEntries);

	async reduce(action: Action): Promise<EffectFunctionOptions> {
    const entry = this.effectEntryMap.get(action.id);
    if (entry) {
      await runInInjectionContext(this.injector, () => {
        return entry?.effect()(action.payload, {injector: this.injector});
      });
      return this.effectEntryMap.get(action.id)?.options ?? {dispatch: false};
    }
    return {dispatch: true};
	}
}

export function injectEffectReducer() {
  const injector = inject(Injector);
	const effectEntries = injectEffectEntries();
  const effectEntryMap = buildEffectEntryMap(injector, effectEntries);

  return async (action: Action) => {
    const entry = effectEntryMap.get(action.id);
    if (entry) {
      await runInInjectionContext(injector, () => {
        return entry?.effect()(action.payload, {injector: injector});
      });
      return effectEntryMap.get(action.id)?.options ?? {dispatch: false};
    }
    return {dispatch: true};
	}
}
