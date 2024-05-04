import { Entity } from "@nx-ddd/common/domain/models";
import { String } from "@nx-ddd/firestore/decorators";

class User {
  id: string;
  name: string;
  username: string;
}

export class MessageEvent extends Entity {
  id: string;
  communityId?: string;

  @String()
  senderId: string;

  sender?: User;

  @String()
  eventType: 'MessageCreate';

  @String()
  dmConversationId: string;

  @String()
  text: string;

  static from(params: Partial<MessageEvent>): MessageEvent {
    return Object.assign(new MessageEvent(), params);
  }
}
