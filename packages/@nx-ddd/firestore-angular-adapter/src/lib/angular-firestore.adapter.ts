import { Injectable } from '@nx-ddd/core';
import { 
  doc, collection, collectionGroup,
  Timestamp, setDoc, getDoc, deleteDoc, getDocs, 
  onSnapshot, updateDoc, Firestore, runTransaction, writeBatch,
  limit, orderBy, query, where, QuerySnapshot, FieldPath, documentId, FieldValue, serverTimestamp
} from '@angular/fire/firestore';
import { FirestoreAdapter, QueryFn, WhereFilterOp } from '@nx-ddd/firestore/adapters/base';
import {
  DocumentSnapshot,
  FirestoreCollection,
  FirestoreCollectionGroup,
  FirestoreDocument
} from '@nx-ddd/firestore/interfaces';
import dayjs from 'dayjs';
import { Observable, map } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';


function asObservable<T = unknown>(
  ref: Parameters<typeof onSnapshot<T>>[0],
  _onSnapshot: typeof onSnapshot<T>,
): Observable<QuerySnapshot<T>> {
  return new Observable<QuerySnapshot<T>>((observer) => _onSnapshot(
    ref, 
    value => observer.next(value),
    error => observer.error(error),
    () => observer.complete()),
  );
}

export const FIREBASE_ADAPTER = new InjectionToken<AngularFirestoreAdapter>('ANGULAR_FIRESTORE_ADAPTER');
export function provideFirestoreAdapter(firestoreFactory = () => inject(Firestore)) {
  return [
    {
      provide: FIREBASE_ADAPTER,
      useFactory: () => new AngularFirestoreAdapter(firestoreFactory()),
    },
  ];
}

@Injectable()
export class AngularFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {

  constructor(public firestore: Firestore) { super() }

  get FieldValue() {
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

  protected convertDateToTimestamp(date: dayjs.Dayjs): Timestamp {
    return Timestamp.fromDate(date.toDate());
  }

  protected convertTimestampToDate(timestamp: Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate())
  }

  doc(path: string): FirestoreDocument<any> {
    const docRef = doc(this.firestore, path);
    return {
      __ref: docRef,
      exists: () => getDoc(docRef).then(snapshot => snapshot.exists()),
      set: (data) => setDoc(docRef, data),
      get: () => getDoc(docRef),
      update: (data) => updateDoc(docRef, data),
      delete: () => deleteDoc(docRef),
      stateChanges: () => {
        return new Observable<DocumentSnapshot<any>>((observer) => {
          return onSnapshot(docRef, value => observer.next(value), error => observer.error(error), () => observer.complete());
        }).pipe(
          map((snapshot) => ({id: snapshot.id, ref: snapshot.ref, data: () => snapshot.data()})),
        );
      },
    }
  }

  collection(path: string): FirestoreCollection<any> {
    const ref = collection(this.firestore, path);
    return {
      __ref: ref,
      stateChanges: () => asObservable<unknown>(ref, onSnapshot).pipe(
        map((snapshot) => snapshot.docChanges().map(change => ({
          type: change.type, payload: {doc: change.doc},
        }))),
      ),
      get: () => getDocs(ref),
    }
  }

  collectionGroup(collectionId: string): FirestoreCollectionGroup<any> {
    const ref = collectionGroup(this.firestore, collectionId);
    return  {
      __ref: ref,
      stateChanges: () => asObservable<unknown>(ref, onSnapshot).pipe(
        map((snapshot) => snapshot.docChanges().map(change => ({
          type: change.type, payload: {doc: change.doc},
        }))),
      ),
      get: () => getDocs(ref),
    }
  }

  runTransaction(fn: Parameters<typeof runTransaction>[1]) {
    return runTransaction(this.firestore, fn);
  }

  query<Data>(collection: FirestoreCollection<Data>, ...queryFnArray: QueryFn<Data>[]): any {
    const ref = query(collection.__ref, ...queryFnArray.map(queryFn => queryFn()));
    return  {
      __ref: ref,
      stateChanges: () => asObservable<unknown>(ref, onSnapshot).pipe(
        map((snapshot) => snapshot.docChanges().map(change => ({
          type: change.type, payload: {doc: change.doc},
        }))),
      ),
      get: () => getDocs(ref),
    }
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
  
  batch() {
    return writeBatch(this.firestore);
  }
}
