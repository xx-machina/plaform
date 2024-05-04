import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

export type ProvideAuthorization = () => Promise<string | null> | Observable<string | null>;
export const PROVIDE_AUTHORIZATION = new InjectionToken<ProvideAuthorization>('PROVIDE_AUTHORIZATION');

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  private provide = inject(PROVIDE_AUTHORIZATION);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith('/api')) return next.handle(req);

    return from(this.provide())
      .pipe(take(1))
      .pipe(mergeMap(idToken => next.handle(idToken ? this.getRequestWithToken(req, idToken) : req)));
  }

  private getRequestWithToken(req: HttpRequest<unknown>, token: string) {
    return req.clone({ setHeaders: {Authorization: token} });
  }
}
