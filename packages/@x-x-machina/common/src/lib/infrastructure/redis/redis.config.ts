import { InjectionToken } from "injection-js";

export interface RedisConfig {
  url: string;
}

export const REDIS_CONFIG = new InjectionToken<RedisConfig>('[@nx-ddd/redis] Redis Config');
