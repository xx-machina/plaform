import { NxModule } from "@nx-ddd/core";
import { REDIS_CONFIG, RedisConfig } from "./redis.config";


@NxModule({})
export class RedisModule {
  static forRoot({config}: {config: RedisConfig}) {
    return {
      nxModule: RedisModule,
      providers: [
        { provide: REDIS_CONFIG, useValue: config },
      ],
    }
  }
}
