import { isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, OnDestroy, InjectionToken, Pipe, PipeTransform, inject, PLATFORM_ID } from '@angular/core';
import { Observable, timer, Unsubscribable } from 'rxjs';
import { endWith, map, mapTo, scan, takeWhile, finalize } from 'rxjs/operators';

export const COUNTY_PIPE_FRAME = new InjectionToken<number>('[pipes/county] frame');
export const COUNTY_PIPE_DURATION = new InjectionToken<number>('[pipes/county] duration');

@Pipe({ standalone: true, name: 'county', pure: false })
export class CountyPipe implements PipeTransform, OnDestroy {
  private preInput: number;
  private latestValue = 0;
  private subscription: Unsubscribable | null = null;
  private platformId = inject(PLATFORM_ID);

  protected readonly frame = inject(COUNTY_PIPE_FRAME, {optional: true}) ?? 40;
  protected readonly duration = inject(COUNTY_PIPE_DURATION, {optional: true}) ?? 3_000;
  private cd = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  transform(input: number): number {
    if (isPlatformServer(this.platformId)) return input;

    if (this.isChanged(input)) {
      this.unsubscribe();
      const county$ = this.getCounty$(this.latestValue, input);
      this.subscribe(county$);
    }
    
    return this.latestValue;
  }

  private isChanged(input: number): boolean {
    return this.preInput !== input ? (this.preInput = input, true) : false;
  }

  private subscribe(county$): void {
    this.subscription = county$.subscribe(value => (this.latestValue = value, this.cd.markForCheck()));
  }

  private getCounty$(start: number, end: number): Observable<number> {
    return getCounty$(start, end, this.duration, this.frame).pipe(finalize(() => this.latestValue = end));
  }

  private unsubscribe(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }
}

const getCounty$ = (current: number, end: number, duration: number, frame: number) => {
  const interval = calcInterval(current, end, duration);
  const threshold = frame / interval;
  return timer(0, frame).pipe(
    mapTo(end > current ? 1 : -1),
    scan((acc, cur) => acc + cur * threshold, current),
    map(num => Math.floor(num)),
    takeWhile(takeUntilFunc(end, current)),
    endWith(end),
  );
}

const calcInterval = (start: number, end: number, range: number): number => {
  const delta = Math.abs(end - start);
  return delta ? range / delta : 0;
}

const takeUntilFunc = (end: number, cur: number): (v: number) => boolean => {
  return end > cur ? (v: number) => v <= end : (v: number) => v >= end;
}