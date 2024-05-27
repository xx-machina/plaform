import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ObservableInput, ObservedValueOf, OperatorFunction, Subject, of } from 'rxjs';
import { scan, map, distinctUntilChanged, delay, tap, shareReplay, switchMap } from 'rxjs/operators';

type LoadingMap = Map<string, boolean>;

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingEntries$ = new Subject<[string, boolean]>();
  readonly loadingMap$ = this.loadingEntries$.pipe(
    scan((map, [key, value]) => map.set(key, value), new Map()),
    map((map: LoadingMap) => new Map([...map.entries()].filter(([_, v]: [string, boolean]) => v))),
    distinctUntilChanged((pre, cur) => JSON.stringify([...pre.entries()]) === JSON.stringify([...cur.entries()])),
    shareReplay(1),
  );
  readonly loadingMap = toSignal(this.loadingMap$);

  readonly isLoading$ = this.loadingMap$.pipe(
    map((map) => !![...map.keys()].length),
    delay(0),
  );
  readonly isLoading = toSignal(this.isLoading$);

  start(key: string = randomStr(16)): string {
    this.loadingEntries$.next([key, true]);
    return key;
  }

  end(key: string): void {
    this.loadingEntries$.next([key, false]);
  }

  /** @deprecated: use start() instead */
  setKey(key: string): void {
    this.start(key);
  }

  /** @deprecated: use end() instead*/
  removeKey(key: string): void {
    this.end(key);
  }

  async await<T = any>(callback: (...args: any[]) => Promise<T>): Promise<T | void> {
    const key = this.start();
    const res = await callback().catch(error => {console.error(error);});
    this.end(key);
    return res;
  }

  switchMap<T, O extends ObservableInput<any>>(
    project: (value: T, index: number) => O
  ): OperatorFunction<T, ObservedValueOf<O>> {
    const key = randomStr(16);
    return (source) => source.pipe(
      tap(() => this.start(key)),
      switchMap(project),
      tap(() => this.end(key)),
    );
  }
}

@Injectable()
export class NoopLoadingService extends LoadingService {
  readonly isLoading$ = of(false);
}

export function provideNoopLoadingService() {
  return { provide: LoadingService, useClass: NoopLoadingService };
}

export function randomStr(n: number = 16): string {
  return Math.random().toString(36).substr(2, n);
}