import { Injectable } from '@angular/core';
import { Auth, authState, signInWithPopup, signOut } from '@angular/fire/auth';
import { GoogleAuthProvider, TwitterAuthProvider, UserCredential } from 'firebase/auth';

export interface TwitterCredential {
  _tokenResponse: {
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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth$ = authState(this.auth);

  constructor(private auth: Auth) { }

  signInWithTwitter() {
    const provider = new TwitterAuthProvider();
    return signInWithPopup(this.auth, provider).then((credential: UserCredential & TwitterCredential) => {
      const twitter = {
        token: credential._tokenResponse.oauthAccessToken,
        secret: credential._tokenResponse.oauthTokenSecret,
      };
    });
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  signOut() {
    return signOut(this.auth);
  }
}
