import { InjectionToken } from "@angular/core";

export const NG_ATOMIC_DEBUG = new InjectionToken<boolean>('NG_ATOMIC_DEBUG');
export function withNgAtomicDebug() {
  return {provide: NG_ATOMIC_DEBUG, useValue: true};
}
