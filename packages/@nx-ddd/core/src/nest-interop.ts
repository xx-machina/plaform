import { Injector } from '@angular/core';
import type { InjectionToken } from '@nestjs/common';

export const NG_INJECTOR: InjectionToken<Injector> = '[@nx-ddd/core] Ng Injector';
export function provideNgInjector(useFactory: () => Injector | Promise<Injector>): any {
  return { provide: NG_INJECTOR, useFactory };
}
