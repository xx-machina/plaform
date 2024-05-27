import { Injectable, NgModule } from '@angular/core';
import dayjs from 'dayjs';
import admin from 'firebase-admin';
import { DocumentReference, FirestoreCollection, FirestoreCollectionGroup } from '../../interfaces'
import { FirestoreAdapter, QueryFn, WhereFilterOp, provideFirestoreAdapter as _provideFirestoreAdapter } from '../base';

@Injectable()
export class AdminFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {
  protected firestore = admin.firestore();

  get FieldValue(): typeof admin.firestore.FieldValue {
    return admin.firestore.FieldValue;  
  }

  get Timestamp(): typeof admin.firestore.Timestamp {
    return admin.firestore.Timestamp;  
  }

  get FieldPath(): typeof admin.firestore.FieldPath {
    return admin.firestore.FieldPath;
  }

  protected isTimestamp(v: any): v is admin.firestore.Timestamp {
    return v instanceof this.Timestamp;
  }

  protected isFieldValue(v: any): v is admin.firestore.FieldValue {
    return v instanceof this.FieldValue;
  }

  protected isDate(v: any): v is dayjs.Dayjs {
    return dayjs.isDayjs(v);
  }

  convertDateToTimestamp(date: dayjs.Dayjs): admin.firestore.Timestamp {
    if (dayjs.isDayjs(date) && date.isValid()) {
      return admin.firestore.Timestamp.fromDate(date.toDate());
    }
    throw new Error(`Invalid date: ${date}`);
  }

  convertTimestampToDate(timestamp: admin.firestore.Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate())
  }

  doc(path: string): DocumentReference<any, admin.firestore.DocumentReference> {
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

  collection(path: string): FirestoreCollection<any, admin.firestore.CollectionReference> {
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
    return (collection: admin.firestore.CollectionReference<Data> | admin.firestore.Query<Data>) => collection.where(key, evaluation, value);  
  }

  orderBy<Data>(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn<Data> {
    return (collection: admin.firestore.CollectionReference<Data> | admin.firestore.Query<Data>) => collection.orderBy(key, order);
  }

  limit<Data>(n: number): QueryFn<Data> {
    return (collection: admin.firestore.CollectionReference<Data> | admin.firestore.Query<Data>) => collection.limit(n);
  }

  batch() {
    return this.firestore.batch();
  }
}

@NgModule({
  providers: [
    { provide: FirestoreAdapter, useClass: AdminFirestoreAdapter },
  ],
})
export class AdminFirestoreModule { }

export function provideFirestoreAdapter() {
  return _provideFirestoreAdapter(AdminFirestoreAdapter);
}
