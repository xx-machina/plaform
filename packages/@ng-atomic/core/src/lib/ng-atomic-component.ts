import { DestroyRef, Directive, ElementRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Action } from "./action";
import { InjectableComponent } from "./injectable-component";
import { EffectMap, injectEffectEntries, injectEffectReducer } from "./effect";
import { NgAtomicRootActionStore } from "./action-store";
import { DebugDirective } from './debug';

@Directive({
  standalone: true,
  hostDirectives: [
    DebugDirective,
  ],
})
export class NgAtomicComponent<T = any> extends InjectableComponent<T> {
  protected effectEntries = injectEffectEntries();
  protected reducer = injectEffectReducer();
  protected _effectMap: EffectMap;
  protected root = inject(NgAtomicRootActionStore);
  #destroyRef = inject(DestroyRef);
  #el = inject(ElementRef);

  constructor() {
    super();
    this.root.actions$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(action => {
      this.#effect(action, 'root');
    });
  }

  async dispatch(action: Action, scope = 'default', componentId: string | number | null = null) {
    const selector = this.#el.nativeElement.tagName.toLowerCase();
    const _action = {...action, meta: {componentId, selector}};

    const props = await this.reducer(_action);
    if (props?.dispatch === false) return;

    const effect = this.#effect(_action, scope);
    this.root.log(_action, scope);

    if (scope === 'root' && (!effect?.props || effect?.props?.dispatch)) {
      this.root.actions$.emit(_action);
    } else if (!effect?.props || effect?.props?.dispatch) {
      super.dispatch(_action);
    }
  }

  #effect(action: Action, scope = 'default') {
    const effect = (this._effectMap ?? new EffectMap()).get(action.id, scope);
    if (effect?.key && effect?.props?.scope === scope) {
      this[effect.key](effect.props.accessor(action));
    }
    return effect;
  }
}
