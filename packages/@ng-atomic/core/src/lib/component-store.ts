import { DestroyRef, Directive, EventEmitter, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Action } from "./action";
import { InjectableComponent } from "./injectable-component";
import { EffectMap } from "./effect";
import { NgAtomicRootActionStore } from "./action-store";

@Directive({ standalone: true })
export class NgAtomicComponentStore {
  readonly action = new EventEmitter<Action>();
}

@Directive({ standalone: true })
export class NgAtomicComponent extends InjectableComponent {
  // @ts-ignore
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
      (this as any)[effect?.key](effect.props.accessor(action));
    }
    return effect;
  }
}
