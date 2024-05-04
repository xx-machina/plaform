import { NxModule } from "@nx-ddd/core/nx-module";
import { TwitterOauth2Config, TwitterOauthConfig, TWITTER_OAUTH2_CONFIG, TWITTER_OAUTH_CONFIG } from "./external/twitter";
import { DISCORD_ACCESS_TOKEN } from "./external/discord";
import { NotionModule, NotionRepositoryConfig } from "./repository";
import { STRIPE_CONFIG, StripeConfig } from "./external/stripe";

export interface InfrastructureConfig {
  notion: NotionRepositoryConfig,
  twitter: {
    oauthConfig: TwitterOauthConfig,
    oauth2Config: TwitterOauth2Config,
  },
  discord: {
    accessToken: string,
  },
  stripe: StripeConfig,
}

@NxModule({})
export class InfrastructureModule {
  static forRoot(config: InfrastructureConfig) {
    return {
      nxModule: InfrastructureModule,
      providers: [
        NotionModule.forRoot(config.notion).providers,
        { provide: DISCORD_ACCESS_TOKEN, useValue: config.discord.accessToken },
        { provide: TWITTER_OAUTH_CONFIG, useValue: config.twitter.oauthConfig },
        { provide: TWITTER_OAUTH2_CONFIG, useValue: config.twitter.oauth2Config },
        { provide: STRIPE_CONFIG, useValue: config.stripe },
      ],
    }
  }
}
