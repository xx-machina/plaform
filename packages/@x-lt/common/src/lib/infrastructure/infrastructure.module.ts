import { NxModule } from "@nx-ddd/core/nx-module";
import { TWITTER_CLIENT_CONFIG, TwitterClientConfig } from "./external/twitter";
import { DISCORD_ACCESS_TOKEN } from "./external/discord";
import { NotionModule, NotionRepositoryConfig } from "./repository";
import { STRIPE_CONFIG, StripeConfig } from "./external/stripe";

export interface InfrastructureConfig {
  notion: NotionRepositoryConfig,
  twitter: TwitterClientConfig,
  discord: {
    accessToken: string,
  },
  stripe: StripeConfig,
  firebase: {
    serviceAccount: any;
    projectId?: string,
    storageBucket?: string,
  },
}

@NxModule({})
export class InfrastructureModule {
  static forRoot(config: InfrastructureConfig) {
    return {
      nxModule: InfrastructureModule,
      providers: [
        NotionModule.forRoot(config.notion).providers,
        { provide: DISCORD_ACCESS_TOKEN, useValue: config.discord.accessToken },
        { provide: TWITTER_CLIENT_CONFIG, useValue: config.twitter },
        { provide: STRIPE_CONFIG, useValue: config.stripe },
      ],
    }
  }
}
