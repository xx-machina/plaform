import { Inject, Injectable } from '@angular/core';
import { STRIPE_CONFIG, StripeConfig } from './stripe.config';
import Stripe from "stripe";

@Injectable()
export class StripeServiceImpl extends Stripe {
  constructor(
    @Inject(STRIPE_CONFIG) config: StripeConfig,
  ) {
    super(config.secretKey);
  }
}

// @Injectable()
// export class StripeServiceImpl extends StripeService {
//   constructor(
//     @Inject(STRIPE_CONFIG) private config: StripeConfig,
//   ) {
//     super();
//   }

//   private stripe = new Stripe(this.config.secret, {apiVersion: '2022-11-15'});
 
//   createCard(card: Card): Promise<Stripe.Token> {
//     return this.stripe.tokens.create({
//       card: {
//         number: card.number,
//         exp_month: `${card.expMonth}`,
//         exp_year: `${card.expYear}`,
//         cvc: card.cvc,
//       }
//     }, {});
//   }

//   createCustomer(metadata: {userId: string}): Promise<Stripe.Response<Stripe.Customer>> {
//     return this.stripe.customers.create({metadata}, {});
//   }

//   createSource(customerId: string, source: string): Promise<Stripe.Response<Stripe.CustomerSource>> {
//     return this.stripe.customers.createSource(customerId, {source});
//   }
// }