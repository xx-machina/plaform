import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, finalize, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
class IcedCacheService {
  cache = {};

  has(key: string): boolean {
    return !!this.cache?.[key];
  }

  get(key: string): Subject<HttpEvent<unknown>> {
    return this.cache[key];
  }

  set(key: string, value: Subject<HttpEvent<unknown>>): void {
    this.cache[key] = value;
    this.removeAfter(key, 10 * 1000);
  }

  removeAfter(key: string, ms: number = 1000) {
    setTimeout(() => this.remove(key), ms);
  }

  remove(key: string) {
    delete this.cache?.[key];
  }
}

@Injectable()
export class ThrottleInterceptor implements HttpInterceptor {

  constructor(private cache: IcedCacheService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.test(req)) return next.handle(req);

    const key = this.buildKey(req);

    if (!this.cache.has(key)) {
      const subject = new ReplaySubject<HttpEvent<unknown>>(1);
      next.handle(req).pipe(
        tap(event => subject.next(event)),
        catchError((error) => (subject.error(error), throwError(error))),
        finalize(() => subject.complete()),
      ).subscribe(() => {});
      this.cache.set(key, subject);
    }

    return this.cache.get(key);
  }

  protected test(req: HttpRequest<unknown>): boolean {
    if (req.method !== 'GET') return false;
    return req.url.startsWith('/api');
  }

  private buildKey(req: HttpRequest<unknown>): string {
    return `${req.url}`;
  }
}
