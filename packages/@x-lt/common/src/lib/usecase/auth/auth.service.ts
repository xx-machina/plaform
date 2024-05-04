import { Inject, Injectable, InjectionToken } from "@nx-ddd/core";
import { InfrastructureService } from "@x-lt/common/infrastructure";
import dayjs from "dayjs";

export interface AuthConfig {
  twitter: {
    callbackUrl: string;
  };
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('[@x-lt-api/common/x-lt-api] Auth Config');

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    @Inject(AUTH_CONFIG) protected config: AuthConfig,
    protected infra: InfrastructureService,
  ) { }

  private codeVerifier: string;

  async generateLinkWithTwitterUrl(redirectUrl: string) {
    const client = this.infra.twitter.getCunsulerClient();
    
    const res = await client.generateOAuth2AuthLink(redirectUrl, {
      state: 'test',
      scope: ['offline.access', 'dm.read', 'tweet.write', 'users.read', 'dm.write', 'tweet.read'],
    });

    this.codeVerifier = res.codeVerifier;

    return res.url;
  }

  async linkWithTwitter(code: string) {
    try {
      const client = this.infra.twitter.getCunsulerClient();
      const res = await client.loginWithOAuth2({
        code, 
        redirectUri: this.config.twitter.callbackUrl,
        codeVerifier: this.codeVerifier,
      });
      const community = await this.infra.repo.firestore.community.get({id: 'default'});
      const token = {
        access_token: res.accessToken,
        refresh_token: res.refreshToken,
        expires_at: dayjs().unix() + res.expiresIn,
        scope: res.scope.join(' '),
        token_type: 'bearer',
      };
      await this.infra.repo.firestore.community.update({...community, twitter: {token}});
      return token;
    } catch (error) {
      console.log(error);
      return
    }
  }
}
