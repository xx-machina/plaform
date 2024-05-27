# @NxDDD/FirestoreAngularAdapter
`@nx-ddd/firestore-angular-adapter` is an Angular plugin for @nx-ddd/firestore.

## Install
```sh
$ npm i @nx-ddd/firestore-angular-adapter
```

## Usage 
```ts
// apps/app/src/app/main.ts
import 'reflect-metadata';
import '@angular/compiler';
import { provideFirestoreAdapter } from '@nx-ddd/firestore/adapters/firebase';
import { UserRepository } from 'libs/common/infrastructure/repositories/user.repository';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import dayjs from 'dayjs';

const app = initializeApp({...});

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => getFirestore()),
      BrowserModule,
      HttpClientModule,
      provideFirestoreAdapter(),
    ),
  ]
};

@Component({
  selector: 'app'
})
export class App {
  repository = injector.get(UserRepository);

  await repository.create({
    id: '0001',
    name: 'test',
    createdAt: dayjs('2022-01-01'),
    updatedAt: dayjs('2022-01-01'),
  });
  const user = await repository.get({id: '0001'});
  console.debug('user:', user);
}

bootstrapApplication(App, appConfig).catch((err) =>
  console.error(err)
);
```
