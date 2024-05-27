# @NxDDD/Firestroe
`@nx-ddd/firestore` is a library that wraps Firestore in the Repository pattern. It uses the Adapter pattern to enable the same codebase to work with both FirebaseAdmin and Firebase.

## Install
```sh
$ npm i @nx-ddd/firestore
```

## Usage 

### Common

```ts
// libs/common/infrastructure/repositories/user.repository
import 'reflect-metadata';
import '@angular/compiler';
import { inject, Injectable } from '@angular/core';
import { TransformToDayjs } from '@nx-ddd/common/domain/models';
import { IsDayjs } from 'class-validator-extended';
import dayjs from 'dayjs';
import { BaseFirestoreRepository, Firestore, injectConverter, pathBuilderFactory } from '@nx-ddd/firestore';
import { FirestoreAdapter } from '@nx-ddd/firestore/adapters/base';
import { bootstrap } from '@nx-ddd/core/v2';

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
```

### Firebase Admin (in NodeJS)
Use `UserRepository` in NodeJS.

```ts
// apps/api/src/app/main.ts
import { provideFirestoreAdapter } from '@nx-ddd/firestore/adapters/admin';
import { UserRepository } from 'libs/common/infrastructure/repositories/user.repository';

bootstrap([
  provideFirestoreAdapter(),
]).then(async (injector) => {
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
```


### Firebase (in Browser)
Use `UserRepository` in browser.

```ts
// apps/app/src/app/main.ts
import { provideFirestoreAdapter } from '@nx-ddd/firestore/adapters/firebase';
import { UserRepository } from 'libs/common/infrastructure/repositories/user.repository';

bootstrap([
  provideFirestoreAdapter(),
]).then(async (injector) => {
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
```
