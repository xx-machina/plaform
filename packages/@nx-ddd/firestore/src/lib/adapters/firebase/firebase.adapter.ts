import { doc, collection, collectionGroup, FieldValue, Timestamp, setDoc, getDoc, getDocs, getFirestore, onSnapshot, deleteDoc, writeBatch, query, orderBy, limit, updateDoc, where, FieldPath, getCountFromServer } from 'firebase/firestore';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { FirestoreAdapter, QueryFn as _QueryFn, WhereFilterOp } from '../base';
import type firestore from 'firebase/firestore';
import {
  DocumentChangeAction,
  DocumentSnapshot,
  CollectionReference as _CollectionReference,
  CollectionGroup as _CollectionGroup,
  Query as _Query,
  DocumentReference,
  DocumentData
} from '../../interfaces';
import { Injectable } from '@angular/core';

type CollectionReference<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
> = _CollectionReference<AppModelType, DbModelType, firestore.CollectionReference<AppModelType, DbModelType>>;

type CollectionGroup<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> = _CollectionGroup<AppModelType, DbModelType, firestore.Query<AppModelType, DbModelType>>;

type Query<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> = _Query<AppModelType, DbModelType, firestore.Query<AppModelType, DbModelType>>;

type QueryFn<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> = _QueryFn<AppModelType, DbModelType, firestore.QueryConstraint>

type Origin<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
> = firestore.CollectionReference<AppModelType, DbModelType>
  | firestore.Query<AppModelType, DbModelType>
  | firestore.Query<AppModelType, DbModelType>;

type CollectionLike<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
> = CollectionReference<AppModelType, DbModelType> 
  | CollectionGroup<AppModelType, DbModelType>
  | Query<AppModelType, DbModelType>;

// Utility type to map Origin to CollectionLike
type InferCollectionLike<O extends Origin> = 
  O extends firestore.CollectionReference<infer A, infer B> ? CollectionReference<A, B> :
  O extends firestore.Query<infer A, infer B> ? CollectionGroup<A, B> :
  O extends firestore.Query<infer A, infer B> ? Query<A, B> :
  never;

export function wrapCollectionLike<O extends Origin>(origin: O): InferCollectionLike<O> {
  return {
    __ref: origin,
    stateChanges: () => {
      const subject = new Subject<DocumentChangeAction<any>[]>();
      onSnapshot(origin, (snapshot) => subject.next(snapshot.docChanges().map(change => ({
        type: change.type,
        payload: {
          doc: change.doc
        },
      }))));
      return subject.asObservable();
    },
    get: () => getDocs(origin),
    count: () => getDocs(origin).then(snapshot => snapshot.size),
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
export class FirebaseFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {

  constructor(public firestore = getFirestore()) { super() }

  get FieldValue(): typeof FieldValue {
    return FieldValue;  
  }

  get Timestamp(): typeof Timestamp {
    return Timestamp;  
  }

  get FieldPath(): FieldPath {
    return new FieldPath();
  }

  protected isTimestamp(v: any): v is Timestamp {
    return v instanceof Timestamp;
  }

  protected isFieldValue(v: any): v is FieldValue {
    return v instanceof this.FieldValue;
  }
  
  protected isDate(v: any): v is dayjs.Dayjs {
    return dayjs.isDayjs(v);
  }

  convertDateToTimestamp(date: dayjs.Dayjs): Timestamp {
    return Timestamp.fromDate(date.toDate());
  }

  convertTimestampToDate(timestamp: Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate())
  }

  doc(path: string): DocumentReference<any> {
    const docRef = doc(this.firestore, path);
    return {
      __ref: docRef,
      exists: () => getDoc(docRef).then(doc => doc.exists()),
      set: (data) => setDoc(docRef, data),
      get: () => getDoc(docRef),
      update: (data) => updateDoc(docRef, data),
      delete: () => deleteDoc(docRef),
      stateChanges: () => {
        const subject = new Subject<DocumentSnapshot<any>>();
        onSnapshot(docRef, (doc) => subject.next({
          id: doc.id,
          ref: doc.ref,
          data: () => doc.data(),
          get: (fieldPath: string) => doc.get(fieldPath),
        }));
        return subject.asObservable();
      },
    }
  }

  collection<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(path: string): CollectionReference<AppModelType, DbModelType> {
    const ref = collection(this.firestore, path);
    return wrapCollectionLike(ref) as CollectionReference<AppModelType, DbModelType>;
  }

  collectionGroup<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(collectionId: string): CollectionGroup<AppModelType, DbModelType> {
    const ref = collectionGroup(this.firestore, collectionId);
    return wrapCollectionLike(ref) as CollectionReference<AppModelType, DbModelType>;
  }

  query<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(
    collection: CollectionReference<AppModelType, DbModelType>,
    ...queryFnArray: QueryFn[]
  ): Query<AppModelType, DbModelType> {
    const ref = unwrapCollectionLike(collection);
    return wrapCollectionLike(query(ref, ...queryFnArray.map(queryFn => queryFn())));
  }

  where<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(fieldPath: string, opStr: WhereFilterOp, value: unknown): QueryFn {
    return () => where(fieldPath, opStr, value);
  }

  orderBy<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn {
    return () => orderBy(key, order);
  }

  limit<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(n: number): QueryFn {
    return () => limit(n);
  }

  runTransaction() {
    throw new Error('FirebaseFirestoreAdapter#runTransaction is not implemented');
  }

  batch() {
    return writeBatch(this.firestore);
  }
}