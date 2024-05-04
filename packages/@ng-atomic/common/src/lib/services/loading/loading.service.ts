import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, map, distinctUntilChanged, delay, tap, shareReplay } from 'rxjs/operators';

type LoadingMap = Map<string, boolean>;

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingEntries$ = new Subject<[string, boolean]>();

  loadingMap: LoadingMap = new Map();
  loadingMap$ = this.loadingEntries$.pipe(
    scan((map, [key, value]) => map.set(key, value), new Map()),
    map((map: LoadingMap) => new Map([...map.entries()].filter(([_, v]: [string, boolean]) => v))),
    tap(m => console.debug('m:', m)),
    distinctUntilChanged((pre, cur) => JSON.stringify([...pre.entries()]) === JSON.stringify([...cur.entries()])),
    shareReplay(1),
  );

  isLoading$ = this.loadingMap$.pipe(
    map((map) => !![...map.keys()].length),
    delay(0),
  );

  constructor() {
    this.loadingMap$.subscribe((m) => {
      this.loadingMap = m;
    });
  }

  setKey(key: string): void {
    this.loadingEntries$.next([key, true]);
  }

  removeKey(key: string): void {
    this.loadingEntries$.next([key, false]);
  }

  start(callback: (done: any) => void, key: string = randomStr(16)) {
    this.setKey(key);
    callback(() => this.removeKey(key));
  }

  async await<T = any>(callback: (...args: any[]) => Promise<T>): Promise<T> {
    const key = randomStr(16);
    this.setKey(key);
    const res = await callback();
    this.removeKey(key);
    return res;
  }
}

export function randomStr(n: number = 16): string {
  return Math.random().toString(36).substr(2, n);
}