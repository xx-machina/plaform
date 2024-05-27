import { InjectionToken, Injector, Pipe, Signal, inject, signal } from '@angular/core';
import { Entity, Type, getLangMap, getModelName, getProps } from '@nx-ddd/common/domain/models';
import { SignalOrValue, wrapFactory } from '@ng-atomic/common/pipes/signal';

export type DomainLangMap = Record<string, string>;
export const DOMAIN_MODEL = new InjectionToken<Type<{id: string}>>('Domain Model');
export const DOMAIN_LANG_MAP = new InjectionToken<DomainLangMap>('domain lang map');
export const DOMAIN_PROPS = new InjectionToken<Signal<string[]>>('Domain Props');
export const DOMAIN_MODEL_NAME = new InjectionToken<Signal<string>>('Domain Model Name');

@Pipe({standalone: true, name: 'domain', pure: true})
export class DomainPipe {
  protected map = inject(DOMAIN_LANG_MAP, {optional: true}) ?? {};

  transform(input: string, map: DomainLangMap = this.map) {
    return map[input] ?? input;
  }
}

export function provideLangMap(useFactory: () => DomainLangMap) {
  return { provide: DOMAIN_LANG_MAP, useFactory };
}

export function provideDomainLang<E>(domain: Type<E>, mergeObj: DomainLangMap = {}) {
  return provideLangMap(() => getLangMap(domain, mergeObj));
}

export function provideModel<E>(useFactory: () => Type<E>) {
  return { provide: DOMAIN_MODEL, useFactory};
}

export function injectModel<E = Entity>(): Type<E> {
  return inject(DOMAIN_MODEL, {optional: true}) as Type<E> ?? null;
}

export function provideProps(useFactory: () => SignalOrValue<string[]>) {
  return { provide: DOMAIN_PROPS, useFactory: wrapFactory(useFactory)}
}

export function provideModelName(useFactory: () => SignalOrValue<string>) {
  return { provide: DOMAIN_MODEL_NAME, useFactory: wrapFactory(useFactory)}
}

export function injectProps(): Signal<string[]> {
  return inject(DOMAIN_PROPS, {optional: true}) ?? signal([]);
}

export function injectModelName(injector?: Injector): Signal<string> {
  if (injector) return injector.get(DOMAIN_MODEL_NAME, null) ?? signal(null);
  return inject(DOMAIN_MODEL_NAME, {optional: true}) ?? signal(null);
}

export function provideDomain<E>(useFactory: () => Type<E>) {
  return [
    provideModel(useFactory),
    provideLangMap(() => getLangMap(useFactory())),
    provideProps(() => getProps(useFactory())),
    provideModelName(() => getModelName(useFactory()))
  ]
}
