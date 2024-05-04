import { NEVER, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import ResizeObserver from 'resize-observer-polyfill';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ElementRef } from '@angular/core';

export function fromResize(el: ElementRef<Element>): Observable<number> {
  if (!el) return NEVER;
  return new Observable<any>((observer) => {
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach((entry) => observer.next(entry));
    });
    resizeObserver.observe(el.nativeElement);
    return () => resizeObserver.disconnect();
  }).pipe(
    map((el) => el.contentRect?.width ?? 0),
    startWith(0),
    distinctUntilChanged(),
  );
}
