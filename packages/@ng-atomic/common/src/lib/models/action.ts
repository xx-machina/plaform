export interface Action<T = any> {
  id: string;
  payload?: T;
  name?: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  children?: Action<T>[],
}

export type Actions = ((...args: any[]) => Action[]) | Action[];

export function resolveActions(actions: Actions, ...args: any[]) {
  if (typeof actions === 'function') {
    return actions(...args);
  }
  return actions;
}
