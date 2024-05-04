import { NxModule } from "@nx-ddd/core";
import { AI_CONFIG } from '@schematics-x/core/ai';

export interface SchematicsXServerConfig {
  token: string;
}

@NxModule({ })
export class SchematicsXServerModule {
  static forRoot(config: SchematicsXServerConfig) {
    return {
      nxModule: SchematicsXServerModule,
      providers: [
        { provide: AI_CONFIG, useValue: {token: config.token} },
      ],
    };
  }
}
