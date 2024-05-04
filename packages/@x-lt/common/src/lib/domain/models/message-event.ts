import { Entity } from "@nx-ddd/common/domain/models";
import { String } from "@nx-ddd/firestore/decorators";

export class MessageEvent extends Entity {
  id: string;
  communityId?: string;

  @String()
  senderId: string;

  sender?: {id: string, name: string, username: string};

  @String()
  eventType: 'MessageCreate';

  @String()
  dmConversationId: string;

  @String()
  text: string;
}
