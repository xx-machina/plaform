import { InjectionToken, Injector } from "@angular/core";
import { StripeServiceImpl } from "./stripe.service.impl";
import { STRIPE_SERVICE } from "./stripe.service";

export interface StripeConfig {
  secretKey: string;
}

export const STRIPE_CONFIG = new InjectionToken<StripeConfig>('STRIPE_CONFIG');

export function provideStripe(configFactory: (injector: Injector) => StripeConfig) {
  return [
    { provide: STRIPE_SERVICE, useClass: StripeServiceImpl, deps: [STRIPE_CONFIG] },
    { provide: STRIPE_CONFIG, useFactory: configFactory, deps: [Injector] },
  ];
}
