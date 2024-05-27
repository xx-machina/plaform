export interface Action<T = any> {
  id: string;
  payload?: T;
  name?: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  children?: Action<T>[],
  meta?: {componentId?: string | number | null} | any;
}

export type ActionsFactory<T = any> = (...args: any[]) => Action<T>[];

export type Actions = ActionsFactory | Action[];

export function resolveActions(actions: Actions, ...args: any[]) {
  if (typeof actions === 'function') {
    return actions(...args);
  }
  return actions;
}

export function wrapActions(actions: Actions): ActionsFactory {
  return typeof actions === 'function' ? actions : () => actions;
}
