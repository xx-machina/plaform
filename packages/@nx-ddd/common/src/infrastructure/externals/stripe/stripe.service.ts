import { InjectionToken, inject } from '@angular/core';
import type { Stripe } from 'stripe';

export const STRIPE_SERVICE = new InjectionToken<Stripe>('STRIPE_SERVICE');

export function injectStripe(): Stripe {
  return inject(STRIPE_SERVICE, {optional: true}) ?? {} as Stripe;
}
