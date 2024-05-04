import { Injector, Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { ReflectiveInjector_ as _ReflectiveInjector_ } from 'injection-js/reflective_injector';
import { setCurrentInjector } from './injectable';
export { Injector } from 'injection-js';


export function resolveAndCreate(providers, parent = Injector.NULL) {
  const injector = ReflectiveInjector.resolveAndCreate(providers, parent);
  const originalGet = injector.get;
  injector.get = function(token: any, notFoundValue?: any): any {
    notFoundValue = token['Θopt'] ? null : notFoundValue;

    setCurrentInjector(this);
    if(this.parent === Injector.NULL && token?.providedIn === 'root') {
      return originalGet.apply(injector, [token, token['Θfac']()]);
    } else {
      return originalGet.apply(injector, [token, notFoundValue]);
    }
  }
  return injector;
}
