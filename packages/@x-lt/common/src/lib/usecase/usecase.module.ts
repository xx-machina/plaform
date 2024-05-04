import { NxModule } from "@nx-ddd/core/nx-module";

export interface UsecaseConfig { }

@NxModule({})
export class UsecaseModule {
  static forRoot(config: UsecaseConfig) {
    return {
      nxModule: UsecaseModule,
      providers: [],
    }
  }
}
