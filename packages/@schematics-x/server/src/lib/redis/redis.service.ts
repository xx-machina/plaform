import { Inject, Injectable, InjectionToken } from "@nx-ddd/core";
import { createClient, commandOptions, SchemaFieldTypes, VectorAlgorithms } from 'redis';
import { bufferFloat32, bufferFloat64, float32Buffer, float64Buffer } from "@machina/common/utils";
import { Context } from '@machina/common/domain/models';

export enum VectorSize {
  // TEST = 3,
  TEST = 1536,
  ADA = 1948,
}

export interface RedisConfig {
  url?: string;
}

export const REDIS_CONFIG = new InjectionToken<RedisConfig>('[@schematics-x/server] Redis Config');

@Injectable({providedIn: 'root'})
export class RedisService {
  private client = createClient({
    url: this.config.url,
  });

  constructor(
    @Inject(REDIS_CONFIG) protected config: RedisConfig
  ) {
    this.client.on('error', err => console.log('Redis Client Error', err));
  }

  async onInit(): Promise<void> {
    await this.client.connect();
    await this.client.ft.dropIndex('idx:contexts').catch(() => {});
    await this.client.ft.create('idx:contexts', {
      id: SchemaFieldTypes.TEXT,
      instructions: SchemaFieldTypes.TEXT,
      context: SchemaFieldTypes.TEXT,
      embedding: {
        type: SchemaFieldTypes.VECTOR,
        ALGORITHM: VectorAlgorithms.HNSW,
        TYPE: 'FLOAT32',
        // TYPE: 'FLOAT64',
        DIM: VectorSize.TEST,
        DISTANCE_METRIC: 'COSINE',
      }
    });
  }

  async onDestroy() {
    await this.client.disconnect();
  }

  async setContext(context: Context) {
    await this.client.hSet(`noderedis:contextes:${context.id}`, {
      ...context, embedding: this.toBuffer(context.embedding)
    });
  }
  
  async list() {
    const keys = await this.client.keys('noderedis:contextes:*')
      .then(keys => keys.map(key => key.replace('noderedis:contextes:', '')));
    return await Promise.all(keys.map(key => this.getContext(key)));
  }

  async getContext(id: string): Promise<Context> {
    const context = await this.client.hGetAll(`noderedis:contextes:${id}`);
    const {embedding} = await this.client.hGetAll(commandOptions({ returnBuffers: true }), `noderedis:contextes:${id}`);
    const em = this.fromBuffer(embedding);
    return {...context, embedding: em} as never as Context;
  }

  async existsContext(id: string): Promise<boolean> {
    return this.client.exists(`noderedis:contextes:${id}`).then(res => !!res);
  }

  async searchContexts(embedding: number[]): Promise<Context[]> {
    const results = await this.client.ft.search('idx:contexts', '*=>[KNN 1 @embedding $BLOB AS vector_score]', {
      PARAMS: { BLOB: this.toBuffer(embedding) },
      SORTBY: 'vector_score',
      DIALECT: 2,
      RETURN: ['vector_score']
    });
    return Promise.all(results.documents.map(doc => this.getContext(doc.id.split(':')[2])));
  }

  private toBuffer(embedding: number[]) {
    // return float64Buffer(embedding);
    return float32Buffer(embedding);
  }

  private fromBuffer(buffer: Buffer) {
    // return bufferFloat64(buffer);
    return bufferFloat32(buffer);
  }
}
