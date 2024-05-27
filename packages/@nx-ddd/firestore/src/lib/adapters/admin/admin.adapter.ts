import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import admin from 'firebase-admin';
import { Subject } from 'rxjs';
import { DocumentData, Transaction } from 'firebase-admin/firestore';
import {
  DocumentChangeAction,
  DocumentReference,
  CollectionReference as _CollectionReference,
  CollectionGroup as _CollectionGroup,
  Query as _Query } from '../../interfaces'
import { FirestoreAdapter, QueryFn as _QueryFn, WhereFilterOp, provideFirestoreAdapter as _provideFirestoreAdapter } from '../base';

type CollectionReference<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
> = _CollectionReference<AppModelType, DbModelType, admin.firestore.CollectionReference<AppModelType, DbModelType>>;

type CollectionGroup<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> = _CollectionGroup<AppModelType, DbModelType, admin.firestore.CollectionGroup<AppModelType, DbModelType>>;

type Query<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> = _Query<AppModelType, DbModelType, admin.firestore.Query<AppModelType, DbModelType>>;

type QueryFn<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> = _QueryFn<AppModelType, DbModelType, admin.firestore.Query>

type Origin<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
> = admin.firestore.CollectionReference<AppModelType, DbModelType>
  | admin.firestore.CollectionGroup<AppModelType, DbModelType>
  | admin.firestore.Query<AppModelType, DbModelType>;

type CollectionLike<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
> = CollectionReference<AppModelType, DbModelType> 
  | CollectionGroup<AppModelType, DbModelType>
  | Query<AppModelType, DbModelType>;

// Utility type to map Origin to CollectionLike
type InferCollectionLike<O extends Origin> = 
  O extends admin.firestore.CollectionReference<infer A, infer B> ? CollectionReference<A, B> :
  O extends admin.firestore.CollectionGroup<infer A, infer B> ? CollectionGroup<A, B> :
  O extends admin.firestore.Query<infer A, infer B> ? Query<A, B> :
  never;

export function wrapCollectionLike<O extends Origin>(origin: O): InferCollectionLike<O> {
  return {
    __ref: origin,
    stateChanges: () => {
      const subject = new Subject<DocumentChangeAction<any>[]>();
      origin.onSnapshot(snapshot => {
        const actions = snapshot.docChanges().map(change => ({
          type: change.type, payload: {doc: change.doc},
        }));
        subject.next(actions);
      });
      return subject.asObservable();
    },
    get: () => origin.get(),
    count: () => origin.get().then(snapshot => snapshot.size),
  } as never as InferCollectionLike<O>;
}

export function unwrapCollectionLike<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  collection: CollectionLike<AppModelType, DbModelType>
): Origin<AppModelType, DbModelType> {
  return collection.__ref;
}

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

  collection<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(path: string): CollectionReference<AppModelType, DbModelType> {
    const collectionRef = this.firestore.collection(path);
    return wrapCollectionLike(collectionRef) as CollectionReference<AppModelType, DbModelType>;
  }

  collectionGroup<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(collectionId: string): CollectionGroup<AppModelType, DbModelType> {
    const collectionRef = this.firestore.collectionGroup(collectionId);
    return wrapCollectionLike(collectionRef) as CollectionGroup<AppModelType, DbModelType>;
  }
  
  runTransaction<T>(updateFunction: (transaction: Transaction) => Promise<T>) {
    return this.firestore.runTransaction(updateFunction);
  }

  query<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(
    collection: CollectionLike<AppModelType, DbModelType>,
    ...queryFnArray: QueryFn<AppModelType, DbModelType>[]
  ): Query<AppModelType, DbModelType> {
    const ref = unwrapCollectionLike<AppModelType, DbModelType>(collection);
    const query = queryFnArray.reduce((_ref, queryFn) => queryFn(_ref), ref);
    return wrapCollectionLike(query) as Query<AppModelType, DbModelType>;
  }

  where<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(key: string, evaluation: WhereFilterOp, value: unknown): QueryFn<AppModelType, DbModelType> {
    return (collection: Origin<AppModelType, DbModelType>) => collection.where(key, evaluation, value);  
  }

  orderBy<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn<AppModelType, DbModelType> {
    return (collection: Origin<AppModelType, DbModelType>) => collection.orderBy(key, order);
  }

  limit<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(n: number): QueryFn<AppModelType, DbModelType> {
    return (collection: Origin<AppModelType, DbModelType>) => collection.limit(n);
  }

  batch() {
    return this.firestore.batch();
  }
}

export function provideFirestoreAdapter() {
  return _provideFirestoreAdapter(AdminFirestoreAdapter);
}
