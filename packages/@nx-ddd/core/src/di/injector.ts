import { Injector, Provider, ReflectiveInjector, ResolvedReflectiveProvider } from '@nx-ddd/injection-js';
import { ReflectiveInjector_ } from '@nx-ddd/injection-js/reflective_injector';
import { setCurrentInjector } from './injectable';
import { THROW_IF_NOT_FOUND, _NullInjector } from '@nx-ddd/injection-js/injector';
import { ReflectiveKey } from '@nx-ddd/injection-js/reflective_key';
export { Injector } from '@nx-ddd/injection-js';

export class MyNullInjector extends _NullInjector {
  get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
    notFoundValue = token['Θopt'] ? null : notFoundValue;
    if (token?.providedIn === 'root') {
      return super.get(ReflectiveKey.get(token), token['Θfac']());
    } {
      return super.get(ReflectiveKey.get(token), notFoundValue);
    }
  }
}

export class MyReflectiveInjector extends ReflectiveInjector_ {
  static resolveAndCreate(providers: Provider[], parent?: Injector): ReflectiveInjector {
    const ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
    return MyReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
  }

  static fromResolvedProviders(providers: ResolvedReflectiveProvider[], parent?: Injector): ReflectiveInjector {
    // tslint:disable-next-line:no-use-before-declare
    return new MyReflectiveInjector(providers, parent);
  }
  
  public _parent = new MyNullInjector();

  get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
    notFoundValue = token['Θopt'] ? null : notFoundValue;
    setCurrentInjector(this);
    if (this.parent === Injector.NULL && token?.providedIn === 'root') {
      return super.get(ReflectiveKey.get(token), token['Θfac']());
    } {
      return super.get(ReflectiveKey.get(token), notFoundValue);
    }
  }
}
