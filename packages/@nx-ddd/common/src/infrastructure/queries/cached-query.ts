import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { RepositorySynchronizer } from '../synchronizer';
import { debounceTime, map, Observable, switchMap, tap, throttleTime } from 'rxjs';

export function getLastUpdatedAt<T extends {updatedAt: dayjs.Dayjs}>(items: T[]) {
  return items.reduce((acc, facility) => {
    if (!facility?.updatedAt) return acc;
    return facility.updatedAt.isAfter(acc) ? facility.updatedAt : acc;
  }, dayjs('1997-01-01'));
}

interface SrcRepository<T extends {updatedAt: dayjs.Dayjs}> {
  count: () => Observable<number>;
  query: {
    listChangesAfter: (updatedAt: dayjs.Dayjs, {limit}: {limit?: number}) => Observable<T[]>;
  };
}

interface DestRepository<T extends {updatedAt: dayjs.Dayjs}> {
  listChanges: () => Observable<T[]>;
  saveMany: (items: T[]) => void;
  count: () => Observable<number>;
}

export class CachedQuery<T extends {updatedAt: dayjs.Dayjs}> {
  constructor(
    protected repository: SrcRepository<T>,
    protected indexedDb: DestRepository<T>,
    protected options: {
      debounceTime?: number,
      chunkSize?: number
    } = {
      debounceTime: 5_000,
      chunkSize: 100,
    },
  ) { }
  readonly synchronizer = new RepositorySynchronizer({
    lastUpdatedAtChanges: () => this.indexedDb.listChanges().pipe(map(getLastUpdatedAt)),
    saveMany: (items: T[]) => this.indexedDb.saveMany(items),
    listChangesAfter: (updatedAt) => this.repository.query.listChangesAfter(updatedAt, {limit: this.options.chunkSize}),
    srcCount: () => this.repository.count(),
    destCount: () => this.indexedDb.count(),
  });

  list() {
    return this.synchronizer.sync().pipe(
      switchMap(() => this.indexedDb.listChanges()),
      throttleTime(this.options.debounceTime),
      tap(() => console.debug('FLAG 0001'))
    );
  }
}

@Injectable({providedIn: 'root'})
export class CachedQueryFactory {
  create<T extends {updatedAt: dayjs.Dayjs}>(
    repository: SrcRepository<T>,
    indexedDb: DestRepository<T>,
  ): CachedQuery<T> {
    return new CachedQuery(repository, indexedDb);
  }
}