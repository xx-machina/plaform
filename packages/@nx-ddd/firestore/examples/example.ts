import 'reflect-metadata';
import '@angular/compiler';
import { inject, Injectable } from '@angular/core';
import { TransformToDayjs } from '@nx-ddd/common/domain/models';
import { IsDayjs } from 'class-validator-extended';
import dayjs from 'dayjs';
import { BaseFirestoreRepository, Firestore, injectConverter, pathBuilderFactory } from '@nx-ddd/firestore';
import { bootstrap } from '@nx-ddd/core';
import { FirestoreAdapter } from '../src/lib/adapters/base/base.adapter';
import { provideFirestoreAdapter } from '../src/lib/adapters/admin/admin.adapter';

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


bootstrap([
  provideFirestoreAdapter(),
]).then(async injector => {
  const repository = injector.get(UserRepository);
  await repository.create({
    id: '0001',
    name: 'test',
    createdAt: dayjs('2022-01-01'),
    updatedAt: dayjs('2022-01-01'),
  });
  const user = await repository.get({id: '0001'});
  console.debug('user:', user);
});
