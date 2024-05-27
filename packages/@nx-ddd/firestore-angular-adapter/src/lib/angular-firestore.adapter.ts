import { inject, Injectable, Provider } from '@angular/core';
import { 
  doc, collection, collectionGroup,
  Timestamp, setDoc, getDoc, deleteDoc, getDocs, 
  onSnapshot, updateDoc, Firestore, runTransaction, writeBatch,
  limit, orderBy, query, where, QuerySnapshot, FieldPath, documentId, FieldValue, serverTimestamp,
  getCountFromServer
} from '@angular/fire/firestore';
import {
  FirestoreAdapter,
  QueryFn as _QueryFn,
  WhereFilterOp,
  provideFirestoreAdapter as _provideFirestoreAdapter,
} from '@nx-ddd/firestore/adapters/base';
import {
  DocumentSnapshot,
  CollectionReference as _CollectionReference,
  CollectionGroup as _CollectionGroup,
  Query as _Query,
  DocumentData,
  DocumentReference,
} from '@nx-ddd/firestore/interfaces';
import dayjs from 'dayjs';
import { Observable, map } from 'rxjs';
import type firestore from 'firebase/firestore';

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
  O extends firestore.Query<infer A, infer B> ? Query<A, B> :
  never;


function asObservable<T = unknown>(
  ref: Parameters<typeof onSnapshot>[0],
  _onSnapshot: typeof onSnapshot,
): Observable<QuerySnapshot<T>> {
  return new Observable<QuerySnapshot<T>>((observer) => _onSnapshot(
    ref, 
    (value: any) => observer.next(value),
    (error: any) => observer.error(error),
    () => observer.complete()),
  );
}

export function wrapDocumentReference<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(origin: firestore.DocumentReference<AppModelType, DbModelType>): DocumentReference<AppModelType, DbModelType> {
  return {
    __ref: origin,
    exists: () => getDoc(origin).then(snapshot => snapshot.exists()),
    set: (data) => setDoc(origin, data),
    get: () => getDoc(origin),
    update: (data) => updateDoc(origin, data as any),
    delete: () => deleteDoc(origin),
    stateChanges: () => {
      return new Observable<DocumentSnapshot<any>>((observer) => {
        return onSnapshot(origin, value => observer.next(value), error => observer.error(error), () => observer.complete());
      }).pipe(
        map((snapshot) => ({
          id: snapshot.id,
          ref: snapshot.ref,
          data: () => snapshot.data(),
          get: (fieldPath: string) => snapshot.get(fieldPath),
        })),
      );
    },
  }
}

export function wrapCollectionLike<
  O extends Origin,
>(origin: O): InferCollectionLike<O> {
  return {
    __ref: origin,
    stateChanges: () => asObservable<unknown>(origin, onSnapshot).pipe(
      map((snapshot) => snapshot.docChanges().map(change => ({
        type: change.type, payload: {doc: change.doc},
      }))),
    ),
    get: () => getDocs(origin),
    count: () => getCountFromServer(origin).then(count => count.data().count),
  } as never as InferCollectionLike<O>;
}

export function unwrapCollectionLike<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
>(
  collection: CollectionLike<AppModelType, DbModelType>
): Origin<AppModelType, DbModelType> {
  return collection.__ref!;
}

@Injectable()
export class AngularFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {
  protected readonly firestore = inject(Firestore);

  get FieldValue(): typeof FieldValue & {serverTimestamp: () => FieldValue} {
    return Object.assign(FieldValue, {serverTimestamp});
  }

  get Timestamp(): typeof Timestamp {
    return Timestamp;  
  }

  get FieldPath(): {documentId: () => FieldPath} {
    return {
      documentId: () => documentId(),
    };
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
    return dayjs(timestamp.toDate());
  }

  doc<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(path: string): DocumentReference<AppModelType, DbModelType> {
    const docRef = doc(this.firestore, path);
    return wrapDocumentReference(docRef) as DocumentReference<AppModelType, DbModelType>;
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
    return wrapCollectionLike(ref) as CollectionGroup<AppModelType, DbModelType>;
  }

  query<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(
    collection: CollectionReference<AppModelType, DbModelType>,
    ...queryFnArray: QueryFn[]
  ): Query<AppModelType, DbModelType> {
    const ref = unwrapCollectionLike(collection) as firestore.Query<DocumentData, DbModelType>;
    const _query = query(ref, ...queryFnArray.map(queryFn => queryFn()));
    return wrapCollectionLike(_query) as Query<AppModelType, DbModelType>;
  }

  where<Data>(fieldPath: string, opStr: WhereFilterOp, value: unknown): QueryFn<Data> {
    return () => where(fieldPath, opStr, value);
  }

  orderBy<Data>(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn<Data> {
    return () => orderBy(key, order);
  }

  limit<Data>(n: number): QueryFn<Data> {
    return () => limit(n);
  }

  runTransaction(fn: Parameters<typeof runTransaction>[1]) {
    return runTransaction(this.firestore, fn);
  }

  batch() {
    return writeBatch(this.firestore);
  }
}

/** @deprecated use `provideFirestoreAdapter()` instead. */
export function provideAngularFirestoreAdapter(): Provider {
  return { provide: FirestoreAdapter, useClass: AngularFirestoreAdapter };
}

export function provideFirestoreAdapter(): Provider {
  return _provideFirestoreAdapter(AngularFirestoreAdapter);
}
