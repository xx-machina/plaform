import dayjs, { Dayjs } from 'dayjs';
import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransformToDayjs } from '@nx-ddd/common/domain/models';
import { IsDayjs } from 'class-validator-extended';
import { IsOptional } from 'class-validator';
import { IFirestoreConverter, injectConverter } from './converter';
import { provideFirestoreAdapter } from '../adapters/admin';
import { timestampFactory, initializeTest } from '../testing';
import { Firestore } from '../decorators';

initializeTest();

class User {
  @Firestore.ID() id: string;
  // @Firestore.String() name: string;
  @Firestore.Timestamp() @IsOptional() @IsDayjs() @TransformToDayjs() dealAt: Dayjs;
  @Firestore.Timestamp() @IsOptional() @IsDayjs() @TransformToDayjs() createdAt: Dayjs;
  @Firestore.Timestamp() @IsOptional() @IsDayjs() @TransformToDayjs() updatedAt: dayjs.Dayjs;
}

const CONVERTER = new InjectionToken<IFirestoreConverter<User>>('CONVERTER');

describe('FirestoreConverter', () => {
  let converter: IFirestoreConverter<User>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirestoreAdapter(),
        { provide: CONVERTER, useFactory: () => injectConverter(User) },
      ],
    });
    converter = TestBed.inject(CONVERTER);
  })

  describe('fromFirestore', () => {
    it('should be succeeded', () => {
      expect(converter.fromFirestore({
        id: 'test-transaction-0001',
        ref: { path: 'tests/test-transaction-0001' },
        data: () => ({
          dealAt: timestampFactory(dayjs('2018-02-01')),
          createdAt: timestampFactory(dayjs('2022-01-01')),
          updatedAt: timestampFactory(dayjs('2022-01-01')),
        }),
      })).toEqual({
        id: 'test-transaction-0001',
        dealAt: dayjs('2018-02-01'),
        createdAt: dayjs('2022-01-01'),
        updatedAt: dayjs('2022-01-01'),
      });
    });
  });

  describe('toFirestore', () => {
    it('should be succeeded', () => {
      const data = converter.toFirestore({
        id: 'test-transaction-0001',
        dealAt: dayjs('2018-02-01'),
        createdAt: dayjs('2022-01-01'),
        updatedAt: dayjs('2022-01-01'),
      });
      expect(data).toEqual({
        id: 'test-transaction-0001',
        dealAt: timestampFactory(dayjs('2018-02-01')),
        createdAt: timestampFactory(dayjs('2022-01-01')),
        updatedAt: timestampFactory(dayjs('2022-01-01')),
      });
    });
  });
});
