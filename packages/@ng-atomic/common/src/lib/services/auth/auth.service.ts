import { Injectable, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, authState, signInWithCustomToken, GoogleAuthProvider, TwitterAuthProvider, signInWithPopup, signOut, UserCredential } from '@angular/fire/auth';
import { Observable, distinctUntilChanged, map, of, shareReplay, switchMap } from 'rxjs';

export interface TwitterCredential {
  context: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  expiresIn: string;
  federatedId: string;
  fullName: string;
  idToken: string;
  kind: 'identitytoolkit#VerifyAssertionResponse';
  localId: string;
  oauthAccessToken: string;
  oauthTokenSecret: string;
  photoUrl: string;
  providerId: 'twitter.com';
  rawUserInfo: string;
  refreshToken: string;
  screenName: string;
}

export type Result = UserCredential & {_tokenResponse: TwitterCredential};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #auth = inject(Auth);
  auth$ = authState(this.#auth);
  auth = toSignal(this.auth$);

  signInWithTwitter(): Promise<Result> {
    const provider = new TwitterAuthProvider();
    return signInWithPopup(this.#auth, provider) as Promise<Result>
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.#auth, provider);
  }

  signInWithCustomToken(customToken: string): Promise<Result> {
    return signInWithCustomToken(this.#auth, customToken) as Promise<Result>;
  }

  signOut() {
    return signOut(this.#auth);
  }
}

export function injectAuthState$() {
  return inject(AuthService).auth$;
}

export function injectAuthState() {
  return toSignal(injectAuthState$());
}

export function injectUserId$(): Observable<string | null> {
  return inject(AuthService).auth$.pipe(
    map(auth => auth?.uid ?? null),
    distinctUntilChanged(),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectTwitterId$() {
  return inject(AuthService).auth$.pipe(
    map(auth => auth?.providerData?.[0]?.uid ?? null),
    distinctUntilChanged(),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export function injectClaim$<T = string>(claim: string): Observable<T> {
  return inject(AuthService).auth$.pipe(
    switchMap(auth => auth ? auth?.getIdTokenResult() : of(null)),
    map(token => token?.claims?.[claim] ?? false),
    distinctUntilChanged(),
    shareReplay(1),
    takeUntilDestroyed(),
  ) as any;
}