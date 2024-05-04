import { Inject, Injectable, InjectionToken, Optional } from "@nx-ddd/core";
import { REDIS_CONFIG, RedisConfig, RedisRepository } from "../../redis";
import { SchemaFieldTypes, VectorAlgorithms } from "redis";
import { bufferFloat32, float32Buffer } from "@x-x-machina/common/utils";
import { Spec } from "@x-x-machina/common/domain/models";

export const VECTOR_SIZE = new InjectionToken('[@x-x-machina/common] VECTOR_SIZE');
// MEMO(nontangent): Optionalデコレーターが動かないので、ここで初期化する。
VECTOR_SIZE['Θopt'] = true;

@Injectable({providedIn: 'root'})
export class SpecRepository extends RedisRepository<Spec> {

  constructor(
    @Inject(REDIS_CONFIG) config: RedisConfig,
    @Optional() @Inject(VECTOR_SIZE) private vectorSize: number,
  ) {
    super(config);
    this.vectorSize ??= 1536;
  }

  protected entityName = 'spec';

  async create(spec: Spec): Promise<Spec> {
    return super.create({...spec, embeddings: this.toBuffer(spec.embeddings) as any});
  }

  async get(id: string): Promise<Spec> {
    return super.get(id).then(spec => ({...spec, embeddings: this.fromBuffer(spec.embeddings as any)}));
  }

  async update(spec: Partial<Spec>): Promise<void> {
    return super.update({...spec, embeddings: this.toBuffer(spec.embeddings) as any});
  }

  get indexName() {
    return `index:${this.entityName}`;
  }

  async makeIndex() {
    await this.init();
    await this.client.ft.dropIndex(this.indexName).catch(() => {});
    await this.client.ft.create(this.indexName, {
      id: SchemaFieldTypes.TEXT,
      operatorId: SchemaFieldTypes.TEXT,
      embeddings: {
        type: SchemaFieldTypes.VECTOR,
        ALGORITHM: VectorAlgorithms.HNSW,
        TYPE: 'FLOAT32',
        DIM: this.vectorSize,
        DISTANCE_METRIC: 'COSINE',
      },
    });
  }

  async search(operatorId: string, embeddings: number[], n = 3): Promise<Spec[]> {
    const query = `(@operatorId:$OPERATOR_ID)=>[KNN $N @embeddings $BLOB AS score]`;
    const results = await this.client.ft.search(this.indexName, query, {
      PARAMS: {
        BLOB: this.toBuffer(embeddings),
        N: n,
        OPERATOR_ID: operatorId,
      },
      SORTBY: 'score',
      DIALECT: 2,
      RETURN: ['score']
    });
    return Promise.all(results.documents.map(doc => this.get(doc.id.slice(this.entityName.length + 1))));
  }

  private toBuffer(embedding: number[]) {
    return float32Buffer(embedding);
  }

  private fromBuffer(buffer: Buffer) {
    return bufferFloat32(buffer);
  }

}
