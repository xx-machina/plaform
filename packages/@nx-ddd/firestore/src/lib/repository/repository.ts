import { Injectable } from '@angular/core';
import { PartialWithId, Repository } from '@nx-ddd/common/domain/repository';
import { toObject } from '@nx-ddd/common/utilities/to-object';
import { generateId } from '@nx-ddd/common/utilities';
import { FirestoreAdapter } from '../adapters/base';
import { IFirestoreConverter } from '../converter';
import { FirestorePathBuilder } from '../path-builder';
import { FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument } from '../interfaces';

const toPromise = callback => new Promise<ReturnType<typeof callback>>(async (resolve, reject) => {
  try { resolve(callback()); } catch (error) { reject(error); }
});

@Injectable()
export abstract class BaseFirestoreRepository<
  Entity extends { id: string }
> extends Repository<Entity> {
  protected abstract collectionPath: string;
  protected abstract converter: IFirestoreConverter<Entity>;
  protected pathBuilder: FirestorePathBuilder<Entity>;
  protected adapter: FirestoreAdapter;

  async list(paramMap?: Partial<Entity>, query: any = q => q): Promise<Entity[]> {
    const collection = paramMap ? this.collection(paramMap) : this.collectionGroup();
    return this._list(query(collection));
  }

  get(paramMap?: Partial<Entity>) {
    return this._get(this.doc(paramMap as any));
  }

  save(entity: Entity): Promise<[Entity, boolean]> {
    const docRef = this.doc({...entity, id: entity?.id || this.genId()});
    return this._save(docRef, entity);
  }

  create(entity: Partial<Entity>): Promise<Entity> {
    const obj = toObject(entity) as Entity;
    const id = obj?.id || this.genId();
    return toPromise(() => this.doc({...obj, id})).then(doc => this._create(doc, entity as Entity));
  }

  createMany(entities: Partial<Entity>[]): Promise<Entity[]> {
    return Promise.all(entities.map(entity => this.create(entity)));
  }

  async update(entity: PartialWithId<Entity>): Promise<void> {
    return this.doc(entity).update(this.adapter.flattenForUpdate({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(['updatedAt']),
    })).then(() => {}); 
  }

  delete(paramMap: Partial<Entity>): Promise<void> {
    return this.doc(paramMap as any).delete();
  }

  bulkWrite(entities: Entity[], timestamps: string[] = []): Promise<void> {
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.set(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(timestamps),
      });
    }, this.adapter.batch()).commit();
  }

  bulkCreate(entities: Entity[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.create(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(['createdAt', 'updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  bulkUpdate(entities: PartialWithId<Entity>[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.update(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  protected collection(paramMap?: Partial<Entity>): FirestoreCollection<object> {
    const path = this.pathBuilder.collection(paramMap)
    return this.adapter.collection<object>(path);
  }

  protected collectionGroup(): FirestoreCollectionGroup<object> {
    const path = this.pathBuilder.collectionGroup();
    return this.adapter.collectionGroup<object>(path);
  }

  protected doc(paramMap: PartialWithId<Entity>): FirestoreDocument<object> {
    const path = this.pathBuilder.doc(paramMap);
    return this.adapter.doc<object>(path);
  }

  protected genId = (): string => generateId();

  protected _list(collection: FirestoreCollection<object>) {
    const doesExist = (doc: any) => typeof doc.exists === 'function' ? doc.exists() : doc.exists;
    return collection.get().then(({docs}) => docs.map(doc => {
      if (!doesExist(doc)) return null;
      return this.converter.fromFirestore(doc);
    }));
  }

  protected _get(doc: FirestoreDocument<object>) {
    return doc.get().then((doc => {
      if (!doc.data()) return null;
      return this.converter.fromFirestore(doc)
    }));
  }

  protected async _save(doc: FirestoreDocument<object>, entity: Entity): Promise<[Entity, boolean]> {
    const exists = await doc.exists();
    if (exists) {
      return this._set(doc, entity).then(doc => [this.converter.fromFirestore(doc), false]);
    } else {
      return this._create(doc, entity).then(entity => [entity, true]);
    }
  }

  protected async _create(doc: FirestoreDocument<object>, entity: Entity): Promise<Entity> {
    const exists = await doc.exists();
    if (exists) throw new Error('Document already exists');
    return doc.set({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(['createdAt', 'updatedAt']),
    } as any).then(() => doc.get()).then(doc => this.converter.fromFirestore(doc)); ;
  }

  protected _set(doc: FirestoreDocument<object>, entity: Partial<Entity>, isUpdate = true) {
    return doc.set({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(isUpdate ? ['updatedAt'] : []),
    } as any, {merge: isUpdate}).then(() => doc.get());
  }

  protected buildServerTimestampObject(keys: string[] = ['createdAt', 'updatedAt']) {
    return keys.reduce((m, k) => ({...m, [k]: this.adapter.FieldValue.serverTimestamp()}), {});
  }

}
