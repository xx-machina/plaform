import { Directive } from "@angular/core";
import { Action } from "@ng-atomic/common/models";

@Directive({ standalone: true })
export class NgAtomicComponentStore {
  protected _effectMap: Map<string, string>;

  dispatch(action: Action) {
    const handler = this._effectMap.get(action.id);
    if (handler) this[handler](action.payload);
  }
}

@Directive({ standalone: true })
export class NgAtomicComponent {
  protected _effectMap: Map<string, string>;

  dispatch(action: Action) {
    const handler = this._effectMap.get(action.id);
    if (handler) this[handler](action.payload);
  }
}

export function Effect(id: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.debug('target:', target);
    target['_effectMap'] ??= new Map<string, string>();
    target['_effectMap'].set(id, propertyKey);
  };
}
