import { NxModule } from "@nx-ddd/core/nx-module";


export interface DomainConfig {
}

@NxModule({})
export class DomainModule {
  static forRoot(config: DomainConfig) {
    return {
      nxModule: DomainModule,
    }
  }
}
