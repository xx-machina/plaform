import { NxModule } from "@nx-ddd/core";
import { REDIS_CONFIG } from "./redis";

export interface SchematicsXServerConfig {
  redisUrl?: string;
}

@NxModule({ })
export class SchematicsXServerModule {
  static forRoot(config: SchematicsXServerConfig) {
    return {
      nxModule: SchematicsXServerModule,
      providers: [
        { provide: REDIS_CONFIG, useValue: {url: config.redisUrl} },
      ],
    };
  }
}
