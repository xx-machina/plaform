import { Injectable } from "@nx-ddd/core";
import { FirestoreAdapter } from "@nx-ddd/firestore/adapters/base";
import { FirestoreConverter } from "@nx-ddd/firestore/converter";
import { DocumentSnapshot } from "@nx-ddd/firestore/interfaces";
import { MessageEvent } from "@x-lt/common/domain/models/message-event";

@Injectable({providedIn: 'root'})
export class MessageEventConverter extends FirestoreConverter<MessageEvent, any> {
  constructor(
    protected adapter: FirestoreAdapter,
  ) {
    super();
  }

  Entity = MessageEvent;

  fromFirestore(doc: DocumentSnapshot<any>): MessageEvent {
    return MessageEvent.from({
      ...super.fromFirestore(doc),
      communityId: doc.ref.path.split('/')?.[1],
    });
  }
}

