import { Injectable } from '@nx-ddd/core';
import { PartialWithId, Repository } from '@nx-ddd/common/domain/repository';
import { FirestoreAdapter } from '../adapters/base';
import { FirestoreConverter } from '../converter';
import { FirestorePathBuilder } from '../path-builder';
import { toObject } from '@nx-ddd/common/utilities/to-object';
import { FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument, ToFirestoreData } from '../interfaces';
import { Dayjs } from 'dayjs';
import { generateId } from '@nx-ddd/common/utilities';

const toPromise = callback => new Promise<ReturnType<typeof callback>>(async (resolve, reject) => {
  try { resolve(callback()); } catch (error) { reject(error); }
});

@Injectable()
export abstract class BaseFirestoreRepository<
  Entity extends { id: string },
  FirestoreData = ToFirestoreData<Entity, Dayjs>,
> extends Repository<Entity> {
  protected Entity: { new(): Entity };
  protected abstract collectionPath: string;
  protected abstract converter: FirestoreConverter;
  protected pathBuilder: FirestorePathBuilder<Entity>;

  constructor(
    protected adapter: FirestoreAdapter,
  ) { super(); }

  list(paramMap?: Partial<Entity>, query: any = q => q) {
    const collection = paramMap ? this.collection(paramMap) : this.collectionGroup();
    return this._list(query(collection));
  }

  get(paramMap?: Partial<Entity>) {
    return this._get(this.doc(paramMap as any));
  }

  save(entity: Entity): Promise<[Entity, boolean]> {
    // TODO(nontangent): なんでここの型定義でasがいるのか考える。
    return this._save(this.doc({id: entity?.id || this.genId()} as any), entity);
  }

  create(entity: Partial<Entity>): Promise<Entity> {
    const obj = toObject(entity) as Entity;
    const id = obj?.id || this.genId();
    return toPromise(() => this.doc({...obj, id})).then(doc => this._create(doc, entity as Entity));
  }

  update(entity: PartialWithId<Entity>): Promise<void> {
    return toPromise(() => this.doc(entity)).then(doc => this._update(doc, entity as Entity));
  }

  delete(paramMap: Partial<Entity>): Promise<void> {
    return this.doc(paramMap as any).delete();
  }

  bulkWrite(entities: Entity[], timestamps: string[] = []): Promise<void> {
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.set(doc, {
        ...this.converter.toRecord(entity),
        ...this.buildServerTimestampObject(timestamps),
      });
    }, this.adapter.batch()).commit();
  }

  bulkCreate(entities: Entity[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.create(doc, {
        ...this.converter.toRecord(entity),
        ...this.buildServerTimestampObject(['createdAt', 'updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  bulkUpdate(entities: PartialWithId<Entity>[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.update(doc, {
        ...this.converter.toRecord(entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  protected collection(paramMap?: Partial<Entity>): FirestoreCollection<FirestoreData> {
    const path = this.pathBuilder.collection(paramMap)
    return this.adapter.collection<FirestoreData>(path);
  }

  protected collectionGroup(): FirestoreCollectionGroup<FirestoreData> {
    const path = this.pathBuilder.collectionGroup();
    return this.adapter.collectionGroup<FirestoreData>(path);
  }

  protected doc(paramMap: PartialWithId<Entity>): FirestoreDocument<FirestoreData> {
    const path = this.pathBuilder.doc(paramMap);
    return this.adapter.doc<FirestoreData>(path);
  }

  protected genId = (): string => generateId();

  protected _list(collection: FirestoreCollection<FirestoreData>) {
    return collection.get().then(({docs}) => docs.map(doc => this.converter.fromRecord(doc)));
  }

  protected _get(doc: FirestoreDocument<FirestoreData>) {
    return doc.get().then((doc => this.converter.fromRecord(doc)));
  }

  protected _save(doc: FirestoreDocument<FirestoreData>, entity: Entity): Promise<[Entity, boolean]> {
    return this._set(doc, entity, !entity?.id)
      .then(doc => this.converter.fromRecord(doc)).then(e => [e, !!entity?.id]); 
  }

  protected _create(doc: FirestoreDocument<FirestoreData>, entity: Entity): Promise<Entity> {
    return doc.set({
      ...this.converter.toRecord(entity),
      ...this.buildServerTimestampObject(['createdAt', 'updatedAt']),
    } as any).then(() => doc.get()).then(doc => this.converter.fromRecord(doc)); ;
  }

  protected _update(doc: FirestoreDocument<FirestoreData>, entity: Partial<Entity>): Promise<void> {
    return doc.update({
      ...this.converter.toRecord(entity),
      ...this.buildServerTimestampObject(['updatedAt']),
    } as any).then(() => {}); 
  }

  protected _set(doc: FirestoreDocument<FirestoreData>, entity: Partial<Entity>, isUpdate = true) {
    return doc.set({
      ...this.converter.toRecord(entity),
      ...this.buildServerTimestampObject(isUpdate ? ['updatedAt'] : []),
    } as any, {merge: isUpdate}).then(() => doc.get());
  }

  protected buildServerTimestampObject(keys: string[] = ['createdAt', 'updatedAt']) {
    return keys.reduce((m, k) => ({...m, [k]: this.adapter.FieldValue.serverTimestamp()}), {});
  }

}
