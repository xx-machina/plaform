import { Injectable } from "@nx-ddd/core";
import { DiscordClient } from "./discord";
import { TwitterClient } from "./twitter";
import { StripeClient } from "./stripe";

@Injectable({providedIn: 'root'})
export class ExternalService {
  constructor(
    public discord: DiscordClient,
    public stripe: StripeClient,
    public twitter: TwitterClient,
  ) { }
}
