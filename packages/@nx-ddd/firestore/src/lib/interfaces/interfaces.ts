import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Observable } from 'rxjs';

export type DocumentData = {[field: string]: any};

export interface GetOptions {
  readonly source?: 'default' | 'server' | 'cache';
}

export interface DocumentChangeAction<T> {
  type: any;
  payload: {doc: DocumentSnapshot<T>};
}

export interface DocumentSnapshot<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> {
  id: string;
  ref: { path: string; };
  data: () => AppModelType | undefined;
  get: (fieldPath: string) => any;
  // exists?(): this is QueryDocumentSnapshot<AppModelType, DbModelType>;
  exists?: (() => boolean) | boolean;
}

export interface QuerySnapshot<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData
> {
  docs: Array<QueryDocumentSnapshot<AppModelType, DbModelType>>
};

export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
  isEqual(other: Timestamp): boolean;
  valueOf(): string;
}

export interface TimestampConstructor {
  new (seconds: number, nanoseconds: number): Timestamp;
  now(): Timestamp;
  fromDate(date: Date): Timestamp;
  fromMillis(milliseconds: number): Timestamp;
}

// TODO(nontangent): 実装
export type FieldValue = any;

// Memo(nontangent): FirestoreのData型に変換する
export type ToFirestoreData<Entity, Date> = {
  [K in keyof Entity]: Entity[K] extends Date ? Timestamp | FieldValue : Entity[K];
};

export interface DocumentReference<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
  Origin = any
> {
  __ref?: Origin,
  exists(): Promise<boolean>;
  set(data: AppModelType, options?: any): Promise<void | any>;
  get(): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
  update(data: AppModelType): Promise<void | any>;
  delete(): Promise<void | any>;
  stateChanges?: () => Observable<DocumentSnapshot<AppModelType, DbModelType>>;
}

export interface CollectionReference<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
  Origin = any
> extends Query<AppModelType, DbModelType, Origin> { }

export interface CollectionGroup<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
  Origin = any
> extends Query<AppModelType, DbModelType, Origin> { }

export interface Query<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
  Origin = any
> {
  __ref?: Origin;
  stateChanges?: () => Observable<DocumentChangeAction<DocumentData>[]>;
  get(options?: GetOptions): Promise<QuerySnapshot<AppModelType, DbModelType>>;
  onSnapshot?(
    onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void,
    onError?: (error: Error) => void
  ): () => void;
  count(): Promise<number>;
}

export type CollectionLike<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
  Origin = any
> = CollectionReference<AppModelType, DbModelType, Origin>
  | CollectionGroup<AppModelType, DbModelType, Origin>
  | Query<AppModelType, DbModelType, Origin>;
