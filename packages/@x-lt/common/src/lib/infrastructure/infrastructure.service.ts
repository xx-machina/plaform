import { Injectable } from "@nx-ddd/core/di";
import { DiscordClient } from "./external/discord";
import { TwitterClient } from "./external/twitter";
import { RepositoryService } from "./repository";

@Injectable({providedIn: 'root'})
export class InfrastructureService {
  constructor(
    public discord: DiscordClient,
    public repo: RepositoryService,
    public twitter: TwitterClient,
  ) { }
}
