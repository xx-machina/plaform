import dayjs from 'dayjs';
import { catchError, combineLatest, map, NEVER, Observable, of, retry, shareReplay, switchMap, tap } from 'rxjs';

interface RepositorySynchronizerConfig<T> {
  listChangesAfter: (updatedAt: dayjs.Dayjs) => Observable<T[]>;
  lastUpdatedAtChanges: () => Observable<dayjs.Dayjs>;
  saveMany: (entities: T[]) => void;
  srcCount: () => Observable<number>;
  destCount: () => Observable<number>;
}

export class RepositorySynchronizer<T> {
  constructor(private config: RepositorySynchronizerConfig<T>) { }

  readonly progress$ = combineLatest({
    srcCount: of(null).pipe(switchMap(() => this.config.srcCount())),
    destCount: of(null).pipe(switchMap(() => this.config.destCount())),
  }).pipe(
    map(({srcCount, destCount}) => destCount / srcCount),
    shareReplay(1),
  );

  sync(): Observable<any[]> {
    return this.config.lastUpdatedAtChanges().pipe(
      switchMap((lastUpdatedAt) => this.config.listChangesAfter(lastUpdatedAt).pipe(
        retry(3),
        tap((updated) => this.config.saveMany(updated)),
        catchError((error) => (console.error(error), NEVER)),
      )),
    );
  }
}
