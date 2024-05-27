import { Firestore } from '@nx-ddd/firestore/decorators';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { TransformToDayjs } from '@nx-ddd/common/domain/models';
import { IsDayjs } from 'class-validator-extended';
import admin from 'firebase-admin';
import dayjs from 'dayjs';
import { FirestoreAdapter as BaseFirestoreAdapter, provideFirestoreAdapter, QueryFn, WhereFilterOp } from './base.adapter';
import type { FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument, Timestamp, FirestoreQuery, FieldValue } from '../../interfaces';

@Injectable()
export class FirestoreAdapter extends BaseFirestoreAdapter<dayjs.Dayjs> {
  protected isTimestamp(v: admin.firestore.Timestamp): v is Timestamp {
    return v instanceof admin.firestore.Timestamp;
  }
  protected isFieldValue(v: admin.firestore.FieldValue): v is FieldValue {
    return v instanceof admin.firestore.FieldValue;
  }
  protected isDate(v: any): v is dayjs.Dayjs {
    return dayjs.isDayjs(v);
  }
  convertTimestampToDate(timestamp: Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate());
  }
  convertDateToTimestamp(date: dayjs.Dayjs): Timestamp {
    return admin.firestore.Timestamp.fromDate(date.toDate());
  }

  get Timestamp(): any {
    throw new Error('Method not implemented.');
  }
  get FieldValue(): any {
    throw new Error('Method not implemented.');
  }
  get FieldPath(): any {
    throw new Error('Method not implemented.');
  }

  doc<Data>(path: string): FirestoreDocument<Data> {
    throw new Error('Method not implemented.');
  }

  collection<Data>(path: string): FirestoreCollection<Data> {
    throw new Error('Method not implemented.');
  }

  collectionGroup<Data>(collectionId: string): FirestoreCollectionGroup<Data> {
    throw new Error('Method not implemented.');
  }

  runTransaction(fn: any): any {
    throw new Error('Method not implemented.');
  }

  batch(): any {
    throw new Error('Method not implemented.');
  }

  query(collection: FirestoreCollection<any>, ...queryFnArray: QueryFn<any>[]): FirestoreQuery<any>{
    throw new Error('Method not implemented.');
  }

  where<Data>(key: string, evaluation: WhereFilterOp, value: unknown): QueryFn<Data> {
    throw new Error('Method not implemented.');
  }
  
  orderBy<Data>(key: string, order: 'asc' | 'desc'): QueryFn<Data> {
    throw new Error('Method not implemented.');
  }

  limit<Data>(n: number): QueryFn<Data> {
    throw new Error('Method not implemented.');
  }
}

class Profile {
  @Firestore.String() name: string;
  // @Firestore.String() email: string;
}

class User {
  @Firestore.ID() id: string;
  @Firestore.Map(() => Profile) profile: Profile;
  @Firestore.Array(() => String) tags: string[];
  @Firestore.Timestamp() @IsDayjs() @TransformToDayjs() createdAt: dayjs.Dayjs;
}

describe('BaseAdapter', () => {
  let adapter: BaseFirestoreAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirestoreAdapter(FirestoreAdapter)
      ],
    });
    adapter = TestBed.inject(BaseFirestoreAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('toFirestore()', () => {
    it('should be defined', () => {
      expect(adapter.toFirestore({
        id: 'id',
        profile: {
          name: 'name',
          email: 'email'
        },
        tags: ['user'],
        createdAt: dayjs('2023-11-01'),
      }, User)).toEqual({
        id: 'id',
        profile: {
          name: 'name',
        },
        tags: ['user'],
        createdAt: admin.firestore.Timestamp.fromDate(dayjs('2023-11-01').toDate()),
      });
    });
  });

  describe('fromFirestore()', () => {
    it('should be succeeded', () => {
      expect(adapter.fromFirestore({
        id: 'id',
        profile: {
          name: 'name',
          email: 'email'
        },
        tags: ['user'],
        createdAt: admin.firestore.Timestamp.fromDate(dayjs('2023-11-01').toDate()),
      }, User)).toEqual({
        id: 'id',
        profile: {
          name: 'name',
        },
        tags: ['user'],
        createdAt: dayjs('2023-11-01'),
      })
    });
  });

  describe('flattenForUpdate', () => {
    it('should be succeeded', () => {
      expect(adapter.flattenForUpdate({
        prop: {
          a: {
            b: 'test',
            c: admin.firestore.Timestamp.fromDate(dayjs('2023-11-01').toDate()),
          },
          d: admin.firestore.FieldValue.serverTimestamp(), 
        }
      })).toEqual({
        'prop.a.b': 'test',
        'prop.a.c': admin.firestore.Timestamp.fromDate(dayjs('2023-11-01').toDate()),
        'prop.d': admin.firestore.FieldValue.serverTimestamp(),
      })
    });
  });

});
