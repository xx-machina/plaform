import { NxModule } from '@nx-ddd/core';
import { XConfig, X_CONFIG } from './x.config';

@NxModule({})
export class XModule {
  static forRoot(config: XConfig) {
    return {
      nxModule: XModule,
      providers: [
        {
          provide: X_CONFIG,
          useValue: config,
        }
      ],
    };
  }
}
