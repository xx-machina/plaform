# NxDDD Core
`@nx-ddd/core` is a wrapper library that allows the use of Angular's hierarchical injector in backend or CLI environments.

## Usage

```ts
import '@angular/compiler';
import { Injectable } from '@angular/core';
import { bootstrap } from './index';

@Injectable()
export abstract class Repository {
  abstract name: string;
}

@Injectable()
export class RepositoryImpl extends Repository {
  name = 'RepositoryImpl.name';
}

@Injectable({providedIn: 'root'})
export class AppService {
  constructor(public repository: Repository) { }
}

async function main() {
  const injector = await bootstrap([
    // Inject RepositoryImpl
    { provide: Repository, useClass: RepositoryImpl},
  ]);
  const app = injector.get(AppService);
  console.debug('app.repository.name:', app.repository.name);
}
```

## LISENCE
MIT
