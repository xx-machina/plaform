import { inject, InjectionToken } from '@angular/core';
import type { XServiceImpl } from './x.service.impl';

export const X_SERVICE = new InjectionToken<XServiceImpl>('[@nx-ddd/x] X Service');
export function injectXService(): XServiceImpl {
  return inject(X_SERVICE, {optional: true}) ?? {} as XServiceImpl;
}
