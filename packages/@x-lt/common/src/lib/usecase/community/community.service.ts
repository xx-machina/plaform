import { Injectable } from "@nx-ddd/core";
import { InfrastructureService } from "../../..";
import { Community } from "@x-lt/common/domain/models/notion/community";

@Injectable({providedIn: 'root'})
export class CommunityService {
  constructor(
    private infra: InfrastructureService,
  ) { }

  async get(communityId: string) {
    return this.infra.repo.firestore.community.get({id: communityId});
  }

  async update(community: Community) {
    return this.infra.repo.firestore.community.update(community);
  }
}
