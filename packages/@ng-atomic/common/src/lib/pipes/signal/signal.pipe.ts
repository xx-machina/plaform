import { Pipe, Signal, isSignal, signal } from '@angular/core';

export type SignalOrValue<T> = T | Signal<T>;

export function signalize<T = any>(valueOrSignal: T | Signal<T>): Signal<T> {
  return isSignal(valueOrSignal) ? valueOrSignal : signal(valueOrSignal);
}

export function resolveSignal<T>(valueOrSignal: T | Signal<T>): T {
  return isSignal(valueOrSignal) ? valueOrSignal() : valueOrSignal;
}

@Pipe({standalone: true, name: 'signal', pure: false})
export class SignalPipe {
  transform<T>(obj: T | Signal<T>): T {
    return resolveSignal(obj);
  };
}
