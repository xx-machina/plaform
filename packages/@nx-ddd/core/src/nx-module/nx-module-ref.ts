import { Injector } from '@nx-ddd/injection-js';
import { createInjectorWithoutInjectorInstances } from '../di/create-injector';
import { Provider } from '../di/interface/provider';
import { NxModule } from './nx-module';

export type Type<T> = any;

export function bootstrap(moduleType: Type<any>, providers: Provider[] = []): NxModuleRef {
  return createNxModuleRef(NxModule({ imports: [moduleType], providers })(class BootstrapModule { }));
}

export function createNxModuleRef<T>(moduleType: Type<T>, injector?: Injector): NxModuleRef<T> {
  return new NxModuleRef(moduleType, injector ?? null);
}

export class NxModuleRef<T = any> {
  public injector: Injector;
  public instance: T;

  constructor(
    public nxModuleType: Type<T>,
    public _parent: Injector,
  ) {
    this.injector = createInjectorWithoutInjectorInstances(nxModuleType, _parent);
    this.instance = this.injector.get(nxModuleType);
  }
}

export class NxModuleFactory<T> {
  constructor(public moduleType: Type<T>) { }

  create(parentInjector: Injector|null): NxModuleRef<T> {
    return new NxModuleRef(this.moduleType, parentInjector);
  }
}
