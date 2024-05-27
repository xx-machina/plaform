import { inject, Injectable } from '@angular/core';
import { Repository } from '@nx-ddd/common/domain/repository';
import { toObject } from '@nx-ddd/common/utilities/to-object';
import { generateId } from '@nx-ddd/common/utilities';
import { FirestoreAdapter } from '../adapters/base';
import { IFirestoreConverter } from '../converter';
import { ExtractParams, FirestorePathBuilder, pathBuilderFactory } from '../path-builder';
import { CollectionReference, CollectionGroup, DocumentReference, DocumentSnapshot } from '../interfaces';

const toPromise = callback => new Promise<ReturnType<typeof callback>>(async (resolve, reject) => {
  try { resolve(callback()); } catch (error) { reject(error); }
});

function doesExist(doc: DocumentSnapshot): boolean {
  if (typeof doc.exists === 'function') {
    return doc.exists();
  }
  return doc.exists;
}

// FirestoreRepositoryからEnriryを取得するinfer
type ExtractEntity<T extends FirestoreRepository<any>> = T extends FirestoreRepository<infer Entity> ? Entity : never;

type ColParam<T extends FirestoreRepository<any>> = Omit<ExtractParams<T['collectionPath']>, 'id'>;
type DocParam<T extends FirestoreRepository<any>> = ColParam<T> & {id: string}; 

@Injectable()
export abstract class FirestoreRepository<
  Entity extends { id: string },
> extends Repository<Entity> {
  abstract readonly collectionPath: string;

  protected abstract converter: IFirestoreConverter<Entity>;
  // protected pathBuilder: FirestorePathBuilder<Entity, typeof this.collectionPath>;
  get pathBuilder(): FirestorePathBuilder<Entity, typeof this.collectionPath> {
    return pathBuilderFactory(this.collectionPath);
  }

  // protected adapter: FirestoreAdapter;
  protected adapter = inject(FirestoreAdapter);

  async list(paramMap?: ColParam<this>, query: any = q => q): Promise<Entity[]> {
    const collection = paramMap ? this.collection(paramMap) : this.collectionGroup();
    return this._list(query(collection));
  }

  async count(paramMap?: ColParam<this>): Promise<number> {
    return this.collection(paramMap).count();
  }

  get(paramMap?: DocParam<this>) {
    return this._get(this.doc(paramMap as any));
  }

  save(entity: DocParam<this> & Entity): Promise<[Entity, boolean]> {
    const docRef = this.doc({...entity, id: entity?.id || this.genId()});
    return this._save(docRef, entity);
  }

  create(entity: DocParam<this> & Entity): Promise<Entity> {
    const obj = toObject(entity) as DocParam<this> & Entity;
    const id = obj?.id || this.genId();
    return toPromise(() => this.doc({...obj, id})).then(doc => this._create(doc, entity));
  }

  createMany(entities: (DocParam<this> & Entity)[]): Promise<Entity[]> {
    return Promise.all(entities.map(entity => this.create(entity)));
  }

  async update(entity: DocParam<this> & Partial<Entity>): Promise<void> {
    return this.doc(entity).update(this.adapter.flattenForUpdate({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(['updatedAt']),
    })).then(() => {}); 
  }

  delete(paramMap: DocParam<this>): Promise<void> {
    return this.doc(paramMap as any).delete();
  }

  bulkWrite(entities: (DocParam<this> & Entity)[], timestamps: string[] = []): Promise<void> {
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.set(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(timestamps),
      });
    }, this.adapter.batch()).commit();
  }

  bulkCreate(entities: (DocParam<this> & Entity)[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.create(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(['createdAt', 'updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  bulkUpdate(entities: (DocParam<this> & Partial<Entity>)[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.update(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  protected collection(paramMap?: Omit<ExtractParams<typeof this.collectionPath>, 'id'>): CollectionReference<object> {
    const path = this.pathBuilder.collection(paramMap)
    return this.adapter.collection<object>(path);
  }

  protected collectionGroup(): CollectionGroup<object> {
    const path = this.pathBuilder.collectionGroup();
    return this.adapter.collectionGroup<object>(path);
  }

  protected doc(paramMap: DocParam<this>): DocumentReference<object> {
    const path = this.pathBuilder.doc(paramMap as any);
    return this.adapter.doc<object>(path);
  }

  protected genId = (): string => generateId();

  protected _list(collection: CollectionReference<object>) {
    return collection.get().then(({docs}) => docs.map(doc => {
      if (!doesExist(doc)) return null;
      return this.converter.fromFirestore(doc);
    }));
  }

  protected _get(doc: DocumentReference<object>) {
    return doc.get().then((doc => {
      if (!doc.data()) return null;
      return this.converter.fromFirestore(doc)
    }));
  }

  protected async _save(doc: DocumentReference<object>, entity: Entity): Promise<[Entity, boolean]> {
    const exists = await doc.exists();
    if (exists) {
      return this._set(doc, entity).then(doc => [this.converter.fromFirestore(doc), false]);
    } else {
      return this._create(doc, entity).then(entity => [entity, true]);
    }
  }

  protected async _create(doc: DocumentReference<object>, entity: Entity): Promise<Entity> {
    const exists = await doc.exists().catch((error) => {
      // MEMO(@nontangent): bunで実行するときだけこのエラーがでるかもしれない。
      if (`${error}`.startsWith('Error: Did not receive document for')) return false;
      throw error;
    });
    if (exists) throw new Error('Document already exists');
    return doc.set({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(['createdAt', 'updatedAt']),
    } as any).then(() => doc.get()).then(doc => this.converter.fromFirestore(doc));
  }

  protected _set(doc: DocumentReference<object>, entity: Partial<Entity>, isUpdate = true) {
    return doc.set({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(isUpdate ? ['updatedAt'] : []),
    } as any, {merge: isUpdate}).then(() => doc.get());
  }

  protected buildServerTimestampObject(keys: string[] = ['createdAt', 'updatedAt']) {
    return keys.reduce((m, k) => ({...m, [k]: this.adapter.FieldValue.serverTimestamp()}), {});
  }

}

/** @deprecated use FirebaseRepository instaed. */
@Injectable()
export abstract class BaseFirestoreRepository<Entity extends { id: string }> extends FirestoreRepository<Entity> { }
