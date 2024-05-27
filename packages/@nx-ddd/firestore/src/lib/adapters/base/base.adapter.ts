import { Injectable } from '@angular/core';
import { getFirestoreAnnotations } from '../../decorators/decorators';
import { walkObj } from '@nx-ddd/core/util/walk-obj';
import { get } from 'lodash-es';
import type {
  CollectionReference,
  CollectionGroup,
  DocumentReference,
  ToFirestoreData,
  Timestamp,
  Query,
  FieldValue,
  DocumentData
} from '../../interfaces';

export type QueryFn<AppModelType, DbModelType, R> = (
  collection?: any
) => R;
export type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';


@Injectable()
export abstract class FirestoreAdapter<Date = any> {
  protected abstract isTimestamp(v: any): v is Timestamp;
  protected abstract isFieldValue(v: any): v is FieldValue;
  protected abstract isDate(v: any): v is Date;
  abstract convertTimestampToDate(timestamp: Timestamp): Date;
  abstract convertDateToTimestamp(date: Date): Timestamp;

  abstract get Timestamp(): any
  abstract get FieldValue(): any
  abstract get FieldPath(): any

  abstract doc<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(path: string): DocumentReference<AppModelType>;

  abstract collection<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(path: string): CollectionReference<AppModelType, DbModelType>;

  abstract collectionGroup<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(collectionId: string): CollectionGroup<AppModelType, DbModelType>;

  abstract query<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(
    collection: CollectionReference<AppModelType, DbModelType>,
    ...queryFnArray: QueryFn<AppModelType, DbModelType, any>[]
  ): Query<AppModelType, DbModelType>;

  abstract where<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(key: string, evaluation: WhereFilterOp, value: unknown): QueryFn<AppModelType, DbModelType, any>;

  abstract orderBy<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(key: string, order: 'asc' | 'desc'): QueryFn<AppModelType, DbModelType, any>;

  abstract limit<
    AppModelType = DocumentData,
    DbModelType extends DocumentData = DocumentData,
  >(n: number): QueryFn<AppModelType, DbModelType, any>;

  abstract runTransaction(fn: any): any;
  abstract batch(): any;

  //** @deprecated */
  toFirestoreData<Entity>(entity: Entity): ToFirestoreData<Entity, Date> {
    return Object.entries(entity).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isDate(v) ?  this.convertDateToTimestamp(v) : v,
    }), {} as ToFirestoreData<Entity, Date>);
  }

  //** @deprecated */
  fromFirestoreData<Entity>(data: ToFirestoreData<Entity, Date>): Entity {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isTimestamp(v) ? this.convertTimestampToDate(v) : v,
    }), {} as Entity);
  }

  toFirestore<T>(obj: object, Entity: new () => T): object {
    const newObj = {};
    for (const annotation of getFirestoreAnnotations(Entity)) {
      const _value = get(obj, annotation.propName);
      if (_value === null) {
        newObj[annotation.fieldName] = null;
        continue;
      }
      switch(annotation.type) {
        case 'id':
        case 'string':
        case 'number': 
        case 'boolean': {
          if (typeof _value === 'undefined') break;
          newObj[annotation.fieldName] = _value;
          break;
        }
        case 'timestamp': {
          if (typeof _value === 'undefined') break;
          if (!this.isDate(_value)) throw new Error(`Invalid Date Type: ${_value}`);
          newObj[annotation.fieldName] = this.convertDateToTimestamp(_value);
          break;
        }
        case 'array': {
          if (typeof annotation?.childType === 'undefined') {
            if (_value) newObj[annotation.fieldName] = _value;
          } else {
            const Type = (annotation as any).childType();
            if (typeof _value === 'undefined') break;
            const value = _value.map(v => {
              switch (Type) {
                case String:
                case Number:
                  return v
                default: 
                  return this.toFirestore(v, Type);
              }
            });
            if (value) newObj[annotation.fieldName] = value
          }
          break;
        }
        case 'map': {
          if (typeof _value === 'undefined') break;

          if (typeof (annotation as any)?.childType === 'undefined') {
            if (_value) newObj[annotation.fieldName] = _value;
          } else {
            const Type = (annotation as any).childType();
            const value = this.toFirestore(_value, Type);
            if (value) newObj[annotation.fieldName] = value;
          }
          break;
        }
      }
    }
    return newObj;
  }
  
  fromFirestore<T = any>(data: any, Entity: new() => T): T {
    const newObj = {};
    for (const annotation of getFirestoreAnnotations(Entity)) {
      const _value = data[annotation.fieldName];
      if (typeof _value === 'undefined') continue;
      if (_value === null) {
        newObj[annotation.propName] = null;
        continue;
      }

      switch(annotation.type) {
        case 'id':
        case 'string':
        case 'number':
        case 'boolean': {
          newObj[annotation.propName] = _value;
          break;
        }
        case 'timestamp': {
          try {
            newObj[annotation.propName] = this.convertTimestampToDate(_value);
          } catch (e) {
            newObj[annotation.propName] = _value;
          }
          break;
        }
        case 'array': {
          if (typeof annotation?.childType === 'undefined') {
            newObj[annotation.propName] = _value;
          } else {
            const Type = (annotation as any).childType();
            const value = _value.map(v => {
              switch (Type) {
                case String:
                case Number:
                  return v
                default:
                  return this.fromFirestore(v, Type);
              }
            });
            if (value) newObj[annotation.propName] = value
          }
          break;
        }
        case 'map': {
          if (typeof annotation?.childType === 'undefined') {
            newObj[annotation.propName] = _value;
          } else {
            const Type = (annotation as any).childType();
            const value = this.fromFirestore(_value, Type);
            if (value) newObj[annotation.propName] = value;
          }
          break;
        }
      }
    }
    return newObj as T;
  }

  /**
   * @description FirestoreのUpdateは通常のオブジェクトでは孫以下のプロパティが既存データとマージされないので、パスに変換する必要がある。
   */
  flattenForUpdate(obj: any): any {
    const newObj = {};
    walkObj(obj, {
      callback: (paths, value) => newObj[paths.join('.')] = value,
      overwrite: (_, value) => {
        if (Array.isArray(value)) return [true, value];
        if (this.isTimestamp(value)) return [true, value as any];
        if (this.isFieldValue(value)) return [true, value];
        return [false]
      }
    });
    return newObj;
  }
  
}

export function provideFirestoreAdapter(useClass: new () => FirestoreAdapter) {
  return { provide: FirestoreAdapter, useClass };
}
