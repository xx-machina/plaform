import { IFirestoreConverter } from "@nx-ddd/firestore/converter";
import { DocumentSnapshot } from "@nx-ddd/firestore/interfaces";
import { Community } from "@x-lt/common/domain/models/notion/community";

export class CommunityConverter implements IFirestoreConverter<Community, any> {
  fromFirestore<Data>(doc: DocumentSnapshot<Data>): Community {
    return doc.data() as Community;
  }

  toFirestore<Entity>(entity: Entity) {
    return entity;
  }
}