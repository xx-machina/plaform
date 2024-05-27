import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransformToDayjs } from '@nx-ddd/common/domain/models';
import { IsDayjs } from 'class-validator-extended';
import dayjs, { isDayjs } from 'dayjs';
import { BaseFirestoreRepository } from './repository';
import { injectConverter } from '../converter';
import { Firestore } from '../decorators';
import { clearFirestoreData, initializeTest } from '../testing';
import { provideFirestoreAdapter } from '../adapters/admin';
import { pathBuilderFactory } from '../path-builder';
import { FirestoreAdapter } from '../adapters/base';
import { omit } from 'lodash-es';

initializeTest('x-x-machina');

export class User {
  @Firestore.ID() id: string;
  @Firestore.String() name: string;
  @Firestore.Timestamp() @IsDayjs() @TransformToDayjs() createdAt: dayjs.Dayjs;
  @Firestore.Timestamp() @IsDayjs() @TransformToDayjs() updatedAt: dayjs.Dayjs;
}

@Injectable({providedIn: 'root'})
export class UserRepository extends BaseFirestoreRepository<User> {
  protected collectionPath = `users/:id`;
  protected converter = injectConverter(User);
  protected pathBuilder = pathBuilderFactory(this.collectionPath);
  protected adapter = inject(FirestoreAdapter);
}

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    await clearFirestoreData('x-x-machina');
    TestBed.configureTestingModule({
      providers: [
        provideFirestoreAdapter(),
      ],
    });
  });

  afterEach(async () => {
    await clearFirestoreData('x-x-machina');
  });

  it('should be created', () => {
    repository = TestBed.inject(UserRepository);
    expect(repository).toBeTruthy();
  });

  describe('#create()', () => {
    it('should be succeeded', async () => {
      const data = await repository.create({
        id: '0001',
        name: 'test',
        createdAt: dayjs('2022-01-01'),
        updatedAt: dayjs('2022-01-01'),
      });
      expect(omit(data, ['createdAt', 'updatedAt'])).toEqual({
        id: '0001',
        name: 'test',
      });
      expect(isDayjs(data.createdAt)).toBeTruthy();
      expect(isDayjs(data.updatedAt)).toBeTruthy();
    });
  });

  describe('#get()', () => {
    it('should be succeeded', async () => {
      await repository.create({
        id: '0001',
        name: 'test',
        createdAt: dayjs('2022-01-01'),
        updatedAt: dayjs('2022-01-01'),
      });
      const data = await repository.get({id: '0001'});
      expect(omit(data, ['createdAt', 'updatedAt'])).toEqual({
        id: '0001',
        name: 'test',
      });
      expect(isDayjs(data.createdAt)).toBeTruthy();
      expect(isDayjs(data.updatedAt)).toBeTruthy();
    });
  });

});
