import dayjs from 'dayjs';
import { FirestoreAdapter } from '../adapters/base';
import { CollectionReference, CollectionGroup, DocumentReference, ToFirestoreData } from '../interfaces';
import { FirestorePathBuilder } from '../path-builder';


export abstract class FirestoreDAO<
  Entity extends {id: string}, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> {
  protected abstract pathBuilder: FirestorePathBuilder<Entity>;

  constructor(
    protected adapter: FirestoreAdapter,
  ) { }

  collection(paramMap?: Partial<Entity>): CollectionReference<FirestoreData> {
    const path = this.pathBuilder.collection(paramMap)
    return this.adapter.collection<FirestoreData>(path);
  }

  collectionGroup():CollectionGroup<FirestoreData> {
    const path = this.pathBuilder.collectionGroup();
    return this.adapter.collectionGroup<FirestoreData>(path);
  }

  doc(paramMap: Partial<Entity> & {id: string}): DocumentReference<FirestoreData> {
    const path = this.pathBuilder.doc(paramMap);
    return this.adapter.doc<FirestoreData>(path);
  }

  getCollection(paramMap?: Partial<Entity>) {
    return paramMap ? this.collection(paramMap) : this.collectionGroup();
  }
}
