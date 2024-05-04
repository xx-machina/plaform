import { Inject, Injectable } from "@nx-ddd/core";
import { createClient } from 'redis';
import { REDIS_CONFIG, RedisConfig } from "./redis.config";
import { omit } from 'lodash';

export class Converter<E, R> {
  fromRedis(record: R): E {
    return {...record} as never as E; 
  }

  toRedis(entity: E): R {
    return {...entity} as never as R;
  }
}

@Injectable({ providedIn: 'root' })
export abstract class RedisRepository<E extends {id: string} = any, R extends object = object> {
  protected abstract entityName: string;
  protected converter: Converter<E, R> = new Converter();

  protected client = createClient({
    url: this.config.url,
  });

  constructor(
    @Inject(REDIS_CONFIG) private config: RedisConfig,
  ) { }

  async init() {
    if (!this.client.isOpen) await this.client.connect();
  }

  async list() {
    await this.init();
    const keys = await this.client.keys(`${this.entityName}:*`)
      .then((keys) => keys.map(key => key.slice(this.entityName.length + 1)));
    const entities = await Promise.all(keys.map(key => this.get(key)));
    return entities;
  }

  async get(id: string): Promise<E> {
    await this.init();
    const key = this.getKey(id);
    const entity = await this.client.hGetAll(key);
    return this.converter.fromRedis({...entity, id} as any);
  }

  async create(entity: E): Promise<E> {
    await this.init();
    const key = this.getKey(entity.id);
    if (await this.client.exists(key)) throw new Error(`Entity ${key} already exists`);
    const record = omit(this.converter.toRedis(entity), 'id') as {};
    console.debug('create', key, record);
    await this.client.hSet(key, record);
    return entity;
  }

  async update(entity: any): Promise<void> {
    await this.init();
    const key = this.getKey(entity.id);
    if (!await this.client.exists(key)) throw new Error(`Entity ${key} does not exist`);
    await this.client.hSet(key, omit(this.converter.toRedis(entity), 'id') as {});
  }

  async delete(id: string): Promise<void> {
    await this.init();
    const key = this.getKey(id);
    if (!await this.client.exists(key)) throw new Error(`Entity ${id} does not exist`);
    await this.client.del(key);
  }

  async deleteAll(): Promise<void> {
    await this.init();
    const keys = await this.client.keys(`${this.entityName}:*`);
    await Promise.all(keys.map(key => this.client.del(key)));
  }

  getKey(id: string): string {
    return `${this.entityName}:${id}`;
  }
}
