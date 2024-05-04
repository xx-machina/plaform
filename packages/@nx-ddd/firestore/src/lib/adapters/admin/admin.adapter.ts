import dayjs from 'dayjs';
import { firestore } from 'firebase-admin';
import { DocumentReference, FirestoreCollection, FirestoreCollectionGroup } from '../../interfaces'
import { FirestoreAdapter, QueryFn, WhereFilterOp } from '../base';
import { Injectable, NxModule } from '@nx-ddd/core';

@Injectable()
export class AdminFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {
  protected firestore = firestore();

  get FieldValue(): typeof firestore.FieldValue {
    return firestore.FieldValue;  
  }

  get Timestamp(): typeof firestore.Timestamp {
    return firestore.Timestamp;  
  }

  get FieldPath(): typeof firestore.FieldPath {
    return firestore.FieldPath;
  }

  protected isTimestamp(v: any): v is firestore.Timestamp {
    return v instanceof this.Timestamp;
  }

  protected isFieldValue(v: any): v is firestore.FieldValue {
    return v instanceof this.FieldValue;
  }

  protected isDate(v: any): v is dayjs.Dayjs {
    return dayjs.isDayjs(v);
  }

  protected convertDateToTimestamp(date: dayjs.Dayjs): firestore.Timestamp {
    if (dayjs.isDayjs(date) && date.isValid()) {
      return firestore.Timestamp.fromDate(date.toDate());
    }
    throw new Error(`Invalid date: ${date}`);
  }

  protected convertTimestampToDate(timestamp: firestore.Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate())
  }

  doc(path: string): DocumentReference<any, firestore.DocumentReference> {
    const docRef = this.firestore.doc(path);
    return {
      __ref: docRef,
      exists: () => docRef.get().then(snapshot => snapshot.exists),
      set: (data, options?) => docRef.set(data, options),
      get: () => docRef.get(),
      update: (data) => docRef.update(data),
      delete: () => docRef.delete(),
    };
  }

  collection(path: string): FirestoreCollection<any, firestore.CollectionReference> {
    return this.firestore.collection(path);
  }

  collectionGroup(collectionId: string): FirestoreCollectionGroup<any> {
    return this.firestore.collectionGroup(collectionId);
  }
  
  runTransaction(fn: any) {
    return this.firestore.runTransaction(fn);
  }

  query<Data>(collection: FirestoreCollection<Data>, ...queryFnArray: QueryFn<Data>[]): any {
    return queryFnArray.reduce((collectionOrQuery, queryFn) => queryFn(collectionOrQuery), collection);
  }

  where<Data>(key: string, evaluation: WhereFilterOp, value: unknown): QueryFn<Data> {
    return (collection: firestore.CollectionReference<Data> | firestore.Query<Data>) => collection.where(key, evaluation, value);  
  }

  orderBy<Data>(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn<Data> {
    return (collection: firestore.CollectionReference<Data> | firestore.Query<Data>) => collection.orderBy(key, order);
  }

  limit<Data>(n: number): QueryFn<Data> {
    return (collection: firestore.CollectionReference<Data> | firestore.Query<Data>) => collection.limit(n);
  }

  batch() {
    return this.firestore.batch();
  }
}

@NxModule({
  providers: [
    { provide: FirestoreAdapter, useClass: AdminFirestoreAdapter },
  ],
})
export class AdminFirestoreModule { }
