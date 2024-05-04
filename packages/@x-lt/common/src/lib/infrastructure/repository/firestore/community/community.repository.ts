import { Injectable } from "@nx-ddd/core";
import { FirestoreAdapter } from "@nx-ddd/firestore/adapters/base";
import { pathBuilderFactory } from "@nx-ddd/firestore/path-builder";
import { BaseFirestoreRepository } from "@nx-ddd/firestore/repository";
import { Community } from "@x-lt/common/domain/models/notion/community";
import { CommunityConverter } from "@x-lt/common/infrastructure/converters";

@Injectable({providedIn: 'root'})
export class CommunityRepository extends BaseFirestoreRepository<Community, any> {
  constructor(
    protected adapter: FirestoreAdapter,
  ) {
    super(adapter);
  }

  protected Entity = Community;
  protected collectionPath = 'communities/:id';
  protected converter = new CommunityConverter(); 
  protected pathBuilder = pathBuilderFactory(this.collectionPath);
}
