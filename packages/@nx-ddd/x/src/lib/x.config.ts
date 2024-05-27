import { InjectionToken } from "@angular/core";

export interface XOauth2Config {
  clientId: string;
  clientSecret: string;
  callback?: string;
  scopes?: string[];
  token: string;
}

export interface XOauthConfig {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface XConfig {
  oauth: XOauthConfig;
  oauth2: XOauth2Config;
}

export const X_CONFIG = new InjectionToken<XConfig>('[@nx-ddd/x] X Config');
