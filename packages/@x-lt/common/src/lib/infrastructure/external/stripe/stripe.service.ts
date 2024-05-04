import { Inject, Injectable, InjectionToken } from '@nx-ddd/core';
import { Card } from '@x-lt/common/domain/models';
import { Stripe } from 'stripe';

export interface StripeConfig {
  secret: string;
}

export const STRIPE_CONFIG = new InjectionToken<StripeConfig>('Stripe Config');

@Injectable({providedIn: 'root'})
export class StripeClient {
  constructor(@Inject(STRIPE_CONFIG) private config: StripeConfig) { }

  private stripe = new Stripe(this.config.secret, {apiVersion: '2022-11-15'});
 
  createCard(card: Card): Promise<Stripe.Token> {
    return this.stripe.tokens.create({
      card: {
        number: card.number,
        exp_month: `${card.expMonth}`,
        exp_year: `${card.expYear}`,
        cvc: card.cvc,
      }
    }, {});
  }

  createCustomer(metadata: {userId: string}) {
    return this.stripe.customers.create({metadata}, {});
  }

  createSource(customerId: string, source: string) {
    return this.stripe.customers.createSource(customerId, {source});
  }
}