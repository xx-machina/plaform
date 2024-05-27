import { CreateComputedOptions, Pipe, Signal, computed, isSignal } from "@angular/core";

function call<T>(valueOrSignal: Signal<T> | T): T {
  return isSignal(valueOrSignal) ? call(valueOrSignal()) : valueOrSignal;
}

export function proxyFakeComputedInputValueFn(inputValueFn: any) {
  return new Proxy(inputValueFn, {
    apply: function (target, _, args) {
      return computeFake(target(...args));
    }
  });
}

export function computeFake(valueOrFakeComputed: any) {
  return isFakeComputed(valueOrFakeComputed) ? valueOrFakeComputed() : valueOrFakeComputed;
}

export function proxyFakeComputedInputs(target: any, inputs: string[]) {
  inputs.filter(input => isSignal(target[input])).forEach(input => {
    target[input] = proxyFakeComputedInputValueFn(target[input]);
  });
}

export const FAKE_COMPUTED = /* @__PURE__ */ Symbol('FAKE_COMPUTED');

export function compute(target: any, propName: string) {
  let inputValueFn: any;
  Object.defineProperty(target, propName, {
    get() {
      return new Proxy(inputValueFn, {
        apply: function (target, _, args) {
          const valueOrSignal: any = target(...args);
          return isSignal(valueOrSignal) ? valueOrSignal() : valueOrSignal;
        }
      });
    },
    set(value) {
      inputValueFn = value;
    },
  });
}

export function fakeComputed<T>(computation: () => T, options?: CreateComputedOptions<T>): T {
  const _computed = computed(computation, options) as never as T;
  _computed[FAKE_COMPUTED] = true;
  return _computed;
}

export function _computed<T>(computation: () => T, options?: CreateComputedOptions<T>): T {
  return fakeComputed(computation, options);
}

export function isFakeComputed(_computed: any): _computed is ReturnType<typeof computed> {
  return !!_computed?.[FAKE_COMPUTED];
}

@Pipe({ name: 'call', standalone: true, pure: true})
export class CallPipe {
  transform<T>(value: Signal<T> | T): T {
    return call(value);
  }
}
