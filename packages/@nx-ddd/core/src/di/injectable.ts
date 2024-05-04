import 'reflect-metadata';
import { Injectable as _Injectable, Injector, ReflectiveKey } from '@nx-ddd/injection-js';

export function Injectable(params?: { providedIn: 'root'}) {
  return (target: any) => {
    if (params?.providedIn === 'root') {
      target.providedIn = 'root';      
      const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
      const params = Reflect.getMetadata("parameters", target);
      const deps = paramTypes.map((paramType, i) => params?.[i]?.[0]?.token || paramType);
      target['Θfac'] = compileFactory(target, deps);
    }
    return _Injectable()(target);
  }
}

let currentInjector: Injector;

export function setCurrentInjector(injector: Injector) {
  currentInjector = injector;
}

function inject(token) {
  return currentInjector.get(token);
}

function compileFactory(target, deps) {
  return () => target['Θins'] ??= new target(...deps.map(dep => inject(dep)));
}

export { Inject, Optional, InjectionToken } from '@nx-ddd/injection-js';

