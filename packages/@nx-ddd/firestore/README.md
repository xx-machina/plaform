# @NxDDD/Firestore
`@nx-ddd/firestore` is a library that wraps Firestore in the Repository pattern. It uses the Adapter pattern to enable the same codebase to work with both FirebaseAdmin and Firebase.

## Install
```sh
$ npm i @nx-ddd/firestore
```

## Usage 

### Common

```ts
// libs/common/infrastructure/repositories/user.repository
import { inject, Injectable } from '@angular/core';
import { TransformToDayjs } from '@nx-ddd/common/domain/models';
import { bootstrap } from '@nx-ddd/core';
import { FirestoreRepository, Firestore, injectConverter } from '@nx-ddd/firestore';
import { IsDayjs } from 'class-validator-extended';
import dayjs from 'dayjs';

export class User {
  @Firestore.ID() id: string;
  @Firestore.String() name: string;
  @Firestore.Timestamp() @IsDayjs() @TransformToDayjs() createdAt: dayjs.Dayjs;
  @Firestore.Timestamp() @IsDayjs() @TransformToDayjs() updatedAt: dayjs.Dayjs;
}

@Injectable({providedIn: 'root'})
export class UserRepository extends FirestoreRepository<User> {
  readonly collectionPath = `users/:id`;
  protected converter = injectConverter(User);
}
```

### Firebase Admin (in NodeJS)
Use `UserRepository` in NodeJS.

```ts
// apps/api/src/app/main.ts
import 'reflect-metadata';
import '@angular/compiler';
import { provideFirestoreAdapter } from '@nx-ddd/firestore/adapters/admin';
import { UserRepository } from 'libs/common/infrastructure/repositories/user.repository';
import dayjs from 'dayjs';

import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

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
import 'reflect-metadata';
import '@angular/compiler';
import { provideFirestoreAdapter } from '@nx-ddd/firestore/adapters/firebase';
import { UserRepository } from 'libs/common/infrastructure/repositories/user.repository';
import { initializeApp } from "firebase/app";
import dayjs from 'dayjs';

const app = initializeApp({...});

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
