import { Injectable } from '@nx-ddd/core';
import { getFirestoreAnnotations } from "@nx-ddd/firestore/decorators";
import type {
  FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument,
  ToFirestoreData, Timestamp, FirestoreQuery, FieldValue
} from '../../interfaces';
import get from 'lodash.get';
import { set } from 'lodash-es';
import { walkObj } from '@nx-ddd/core/util/walk-obj';

export type QueryFn<Data> = (collection?: any) => any;
export type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';

@Injectable()
export abstract class FirestoreAdapter<Date = any> {
  protected abstract isTimestamp(v: any): v is Timestamp;
  protected abstract isFieldValue(v: any): v is FieldValue;
  protected abstract isDate(v: any): v is Date;
  protected abstract convertTimestampToDate(timestamp: Timestamp): Date;
  protected abstract convertDateToTimestamp(date: Date): Timestamp;

  abstract get Timestamp(): any
  abstract get FieldValue(): any
  abstract get FieldPath(): any

  abstract doc<Data>(path: string): FirestoreDocument<Data>;
  abstract collection<Data>(path: string): FirestoreCollection<Data>;
  abstract collectionGroup<Data>(collectionId: string): FirestoreCollectionGroup<Data>;
  abstract runTransaction(fn: any): any;
  abstract batch(): any;

  abstract query<Data>(collection: FirestoreCollection<Data>, ...queryFnArray: QueryFn<Data>[]): FirestoreQuery<Data>;
  abstract where<Data>(key: string, evaluation: WhereFilterOp, value: unknown): QueryFn<Data>;
  abstract orderBy<Data>(key: string, order: 'asc' | 'desc'): QueryFn<Data>;
  abstract limit<Data>(n: number): QueryFn<Data>;

  toFirestoreData<Entity>(entity: Entity): ToFirestoreData<Entity, Date> {
    return Object.entries(entity).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isDate(v) ?  this.convertDateToTimestamp(v) : v,
    }), {} as ToFirestoreData<Entity, Date>);
  }

  fromFirestoreData<Entity>(data: ToFirestoreData<Entity, Date>): Entity {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isTimestamp(v) ? this.convertTimestampToDate(v) : v,
    }), {} as Entity);
  }

  toFirestore(obj: object, Entity: any) {
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
        case 'number': {
          if (typeof _value === 'undefined') break;
          newObj[annotation.fieldName] = _value;
          break;
        }
        case 'timestamp': {
          if (typeof _value === 'undefined') break;
          newObj[annotation.fieldName] = this.convertDateToTimestamp(_value);
          break;
        }
        case 'array': {
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
          break;
        }
        case 'map': {
          const Type = (annotation as any).childType();
          if (typeof _value === 'undefined') break;
          const value = this.toFirestore(_value, Type);
          if (value) newObj[annotation.fieldName] = value;
          break;
        }
      }
    }
    return newObj;
  }
  
  fromFirestore(data: any, Entity: any) {
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
        case 'number': {
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
          break;
        }
        case 'map': {
          const Type = (annotation as any).childType();
          const value = this.fromFirestore(_value, Type);
          if (value) newObj[annotation.propName] = value;
          break;
        }
      }
    }
    return newObj;
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
