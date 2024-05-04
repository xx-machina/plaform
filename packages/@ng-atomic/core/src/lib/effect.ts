import { Action } from "./action";

export interface EffectProps {
  dispatch: boolean;
  scope: string;
  accessor: <T = any>(action: Action) => T;
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
    target['_effectMap'] ??= new EffectMap();
    target['_effectMap'].set(id, {key: propertyKey, props: {dispatch, scope, accessor}});
  };
}
