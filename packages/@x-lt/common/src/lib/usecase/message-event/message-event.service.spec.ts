import { TestBed } from "@nx-ddd/core";
import { MessageEventService } from "./message-event.service";
import { InfrastructureModule } from '@x-lt/common/infrastructure';
import { environment } from 'apps/x-lt-api/src/environments/environment';
import { FirestoreAdapter } from "@nx-ddd/firestore/adapters/base";
import { FirestoreAdminAdapter } from "@nx-ddd/firestore/adapters/admin";
import serviceAccount from '.secret/service-account.prod.json';
import admin from 'firebase-admin';

jest.setTimeout(3 * 60 * 1000);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any)
});

describe('MessageEventService', () => {
  let service: MessageEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfrastructureModule.forRoot(environment.infrastructure),
      ],
      providers: [
        { provide: FirestoreAdapter, useClass: FirestoreAdminAdapter },
      ],
    });
    service = TestBed.inject(MessageEventService);
  });

  it('sync', async () => {
    await service.sync();
  });

  fit('DiscordチャンネルにMessageEventを通知する', async () => {
    await service.notifyMessageEvent({
      id: 'test',
      dmConversationId: '1059010414531334144-1652111952657915904',
      senderId: '1652111952657915904',
      eventType: 'MessageCreate',
      text: '😁🍎アマゾンのアルバイト. 定員は10名のみ 。paypay＋携帯電話＝報酬です。💴15分20,000円～50,000円の報酬を得ること日本からの参加者のみ募集。☎興味ありLINE: pplt0015🍜🍁🍸',
      communityId: 'default',
      createdAt: null,
      updatedAt: null,
    });
  });

});
