import { ChangeDetectionStrategy, Component, Directive, Injectable, computed, effect, inject, input, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { LoadingBoxMoleculeStore } from '@ng-atomic/components/molecules/loading-box';
import { InjectableComponent, NgAtomicComponent, TokenizedType, _computed } from '@ng-atomic/core';
import { Appearance, StripeAddressElementChangeEvent, StripeAddressElementOptions, StripeElementsOptions, StripeLinkAuthenticationElement, StripeLinkAuthenticationElementChangeEvent, StripeLinkAuthenticationElementOptions, StripePaymentElementChangeEvent, StripePaymentElementOptions } from '@stripe/stripe-js';
import { StripeAddressComponent, StripeCardComponent, StripeElementsDirective, StripeLinkAuthenticationComponent, StripePaymentElementComponent, injectStripe } from 'ngx-stripe';
import { computedAsync } from 'ngxtension/computed-async';
import { map, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class StripeFormService {
  readonly fb = inject(FormBuilder);

  build() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        city: ['', []], // MEMO(@nontangent): 住所のオートコンプリートによってはここが入力されないので必須を外している。
        country: ['', [Validators.required]],
        line1: ['', [Validators.required]],
        line2: ['', []],
        postalCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
      }),
      name: ['', [Validators.required]],
      paymentMethodType: ['', [Validators.required]],
    });
  }
}

@TokenizedType()
@Directive({standalone: true, selector: 'organisms-stripe-input-section'})
export class StripeInputSectionOrganismStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    return () => ({
      form: inject(StripeFormService).build(),
      clientSecret: null as string | null,
      appearance: {
        theme: 'stripe',
        labels: 'above',
        variables: {
          colorPrimary: 'var(--accent-color)',
        },
      } as Appearance,
      linkOptions: {
        defaultValues: {
          email: ''
        },
      } as StripeLinkAuthenticationElementOptions,
      addressOptions: {
        mode: 'shipping',
        defaultValues: { }
      } as StripeAddressElementOptions,
      paymentOptions: {
        defaultValues: {
          billingDetails: {},
        },
        terms: {
          card: 'always',
          applePay: 'never',
        },
      } as StripePaymentElementOptions,
      elementsOptions: {
        locale: 'ja',
        language: 'ja',
        appearance: {
          theme: 'stripe',
          labels: 'above',
          variables: {
            colorPrimary: '#404040',
          },
        },
        loader: 'always',
      } as StripeElementsOptions,
    })
  }, ['components', 'organisms', 'organisms-stripe-input-section']);
  readonly config = StripeInputSectionOrganismStore.Config.inject();
  readonly form = input(_computed(() => this.config().form));
  readonly clientSecret = input(_computed(() => this.config()?.clientSecret));
  readonly ephemeralKey = input<{ ephemeralKey: { associated_objects: {id: string}[], secret: string} }>();
  readonly appearance = input(_computed(() => this.config().appearance));
  readonly linkOptions = input(_computed(() => this.config().linkOptions));
  readonly addressOptions = input(_computed(() => this.config().addressOptions));
  readonly paymentOptions = input(_computed(() => this.config().paymentOptions));
  readonly elementsOptions = input(_computed(() => this.config().elementsOptions));
  readonly _elementsOptions = computed(() => ({
    ...this.elementsOptions(),
    clientSecret: this.clientSecret(),
  }));
}

@Component({
  selector: 'organisms-stripe-input-section',
  standalone: true,
  imports: [
    StripeElementsDirective,
    StripeCardComponent,
    StripePaymentElementComponent,
    StripeLinkAuthenticationComponent,
    StripeAddressComponent,
    LoadingBoxMoleculeStore,
  ],
  template: `
  @if (store._elementsOptions()?.clientSecret) {
    <ngx-stripe-elements
      [stripe]="stripe"
      [elementsOptions]="store._elementsOptions()"
    >
      <ngx-stripe-link-authentication
        [options]="store.linkOptions()"
        (change)="onChangeAuthentication($event)"
        (load)="onLoad($event)"
      />
      <ngx-stripe-address
        [options]="store.addressOptions()"
        (change)="onChangeAddress($event)"
      />
      <ngx-stripe-payment
        [appearance]="store.appearance()"
        [elementsOptions]="store.elementsOptions()"
        [options]="store.paymentOptions()"
        (change)="onChangePayment($event)"
      />
    </ngx-stripe-elements>
  } @else { <molecules-loading-box [loadingMessage]="'支払いフォームを初期化中'" injectable/> }
  `,
  styleUrl: './stripe-input-section.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: StripeInputSectionOrganismStore,
      inputs: [
        'form',
        'clientSecret', 'ephemeralKey', 'appearance',
        'linkOptions', 'addressOptions', 'paymentOptions', 'elementsOptions'
      ],
    },
  ],
})
export class StripeInputSectionOrganism extends NgAtomicComponent {
  protected readonly store = inject(StripeInputSectionOrganismStore);
  readonly stripe = injectStripe();
  readonly linkAuthElement = viewChild(StripeLinkAuthenticationComponent);
  readonly paymentElement = viewChild(StripePaymentElementComponent);
  readonly addressElement = viewChild(StripeAddressComponent);

  readonly paymentElementLoaded = computedAsync(() => {
    if (this.paymentElement()) {
      return this.paymentElement()?.load.pipe(map(() => true));
    }
    return of(false);
  });
  readonly paymentElementLoaded$ = toObservable(this.paymentElementLoaded);

  constructor() {
    super();
    effect(() => {
      this.store.form().setAsyncValidators(() => {
        return this.paymentElementLoaded$.pipe(map((loaded) => loaded ? null : {stripeLoaded: true}));
      });
    });

    // effect(() => {
    //   this.linkAuthElement().
    // })
  }

  protected onLoad(event: StripeLinkAuthenticationElement) {
    // console.debug('onLoad:', event.);
  }
  
  protected onChangeAuthentication(event: StripeLinkAuthenticationElementChangeEvent) {
    console.debug('onChangeAuthentication', event);
    this.store.form().patchValue({email: event.value.email});
  }

  protected onChangeAddress(event: StripeAddressElementChangeEvent) {
    this.store.form().patchValue({
      address: {
        ...event.value.address,
        postalCode: event.value.address.postal_code,
      },
      name: event.value.name
    });
  }

  protected onChangePayment(event: StripePaymentElementChangeEvent) {
    this.store.form().patchValue({paymentMethodType: event.value.type});
  }
}
