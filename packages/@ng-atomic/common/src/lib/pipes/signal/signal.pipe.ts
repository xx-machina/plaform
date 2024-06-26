import { Pipe, Signal, isSignal, signal, PipeTransform } from '@angular/core';

export type SignalOrValue<T> = T | Signal<T>;

export function signalize<T = any>(valueOrSignal: T | Signal<T>): Signal<T> {
  return isSignal(valueOrSignal) ? valueOrSignal : signal(valueOrSignal);
}

export function wrapFactory<T>(valueOrSignalFactory: (...args: any[]) => T | Signal<T>): () => Signal<T> {
  return (...args: any[]) => signalize(valueOrSignalFactory(...args));
};

export function resolveSignal<T>(valueOrSignal: T | Signal<T>): T {
  return isSignal(valueOrSignal) ? valueOrSignal() : valueOrSignal;
}

@Pipe({standalone: true, name: 'signal', pure: false})
export class SignalPipe implements PipeTransform {
  transform<T>(obj: T | Signal<T>): T {
    return resolveSignal(obj);
  };
}
