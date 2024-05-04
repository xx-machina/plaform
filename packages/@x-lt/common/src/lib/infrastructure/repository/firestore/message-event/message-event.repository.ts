import { BaseFirestoreRepository } from '@nx-ddd/firestore/repository';
import { Injectable } from '@nx-ddd/core';
import { FirestoreAdapter } from '@nx-ddd/firestore/adapters/base';
import { MessageEventConverter } from '@x-lt/common/infrastructure/converters';
import { pathBuilderFactory } from '@nx-ddd/firestore/path-builder';
import { MessageEvent } from '@x-lt/common/domain/models/message-event';


@Injectable({providedIn: 'root'})
export class MessageEventRepository extends BaseFirestoreRepository<MessageEvent> {
  constructor(
    protected adapter: FirestoreAdapter,
    protected converter: MessageEventConverter,
  ) {
    super(adapter);
  }

  protected Entity = MessageEvent;
  protected collectionPath = 'communities/:communityId/messageEvents/:id';
  protected pathBuilder = pathBuilderFactory(this.collectionPath);
}
