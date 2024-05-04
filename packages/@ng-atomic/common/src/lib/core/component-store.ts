import { DestroyRef, Directive, EventEmitter, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Action } from "@ng-atomic/common/models";
import { InjectableComponent } from "./injectable-component";

@Directive({ standalone: true })
export class NgAtomicComponentStore {
  readonly action = new EventEmitter<Action>();
}

interface EffectProps {
  dispatch: boolean;
  scope: string;
  accessor: <T = any>(action: Action) => T;
}

class EffectMap extends Map<string, {key: string, props: EffectProps}> {
  get(key: string, scope = 'default'): { key: string; props: EffectProps; } {
    return super.get(this.makeKey(key, scope)); 
  }

  set(key: string, value: { key: string; props: EffectProps; }): this {
    return super.set(this.makeKey(key, value.props.scope), value);
  }

  has(key: string, scope = 'default'): boolean {
    return super.has(this.makeKey(key, scope));
  }

  private makeKey(key: string, scope = 'default') {
    return `[${scope}]#${key}`;
  }
}

@Injectable({providedIn: 'root'})
export class NgAtomicRootActionStore {
  readonly actions$ = new EventEmitter<Action>();

  constructor() {
    this.actions$.subscribe(action => this.log(action, 'root'));
  }

  dispatch(action: Action) {
    this.actions$.emit(action);
  }

  log(action: Action, scope: string = 'default') {
    console.debug(action, scope);
  }
}

@Directive({ standalone: true })
export class NgAtomicComponent extends InjectableComponent {
  protected _effectMap: EffectMap;
  protected root = inject(NgAtomicRootActionStore);
  #destroy$ = inject(DestroyRef);

  constructor() {
    super();
    this.root.actions$.pipe(
      takeUntilDestroyed(this.#destroy$),
    ).subscribe(action => this.#effect(action, 'root'));
  }

  dispatch(action: Action, scope = 'default') {
    this.root.log(action, scope);
    const effect = this.#effect(action, scope);
    if (scope === 'root' && (!effect?.props || effect?.props?.dispatch)) {
      this.root.actions$.emit(action);
    } else if (!effect?.props || effect?.props?.dispatch) {
      this.action.emit(action);
    }
  }

  #effect(action: Action, scope = 'default') {
    const effect = (this._effectMap ?? new EffectMap()).get(action.id, scope);
    if (effect?.key && effect?.props?.scope === scope) {
      this[effect?.key](effect.props.accessor(action));
    }
    return effect;
  }
}

export function Effect(id: string, {
  dispatch = false,
  scope = 'default',
  accessor = (action: Action) => action.payload,
}: Partial<EffectProps> = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target['_effectMap'] ??= new EffectMap();
    target['_effectMap'].set(id, {key: propertyKey, props: {dispatch, scope, accessor}});
  };
}
