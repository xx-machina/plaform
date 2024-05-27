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

describe('bootstrap', () => {
  it('should work', async () => {
    const injector = await bootstrap([
      { provide: Repository, useClass: RepositoryImpl},
    ]);
    const app = injector.get(AppService);
    expect(app.repository.name).toBe('RepositoryImpl.name');
  });
});
