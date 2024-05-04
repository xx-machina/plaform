import { NxModule } from "@nx-ddd/core/nx-module";
import { AUTH_CONFIG, AuthConfig } from "./auth";

export interface UsecaseConfig {
  auth: AuthConfig,
}

@NxModule({})
export class UsecaseModule {
  static forRoot(config: UsecaseConfig) {
    return {
      nxModule: UsecaseModule,
      providers: [
        {provide: AUTH_CONFIG, useValue: config.auth},
      ],
    }
  }
}
