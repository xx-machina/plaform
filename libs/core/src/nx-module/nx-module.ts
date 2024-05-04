import { NG_INJ_DEF } from '../di/interface/defs';
import { Provider } from '../di/interface/provider';

export interface NxModule {
  imports?: any[],
  providers?: Provider[],
}

export function NxModule(nxModule: NxModule) {
  return function (target) {
    target[NG_INJ_DEF] = {
      imports: [...(nxModule.imports ?? [])],
      providers: [...(nxModule.providers ?? [])],
    };
    return target;
  };
}
