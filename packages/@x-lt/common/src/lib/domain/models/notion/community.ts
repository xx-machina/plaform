import { Entity } from "@nx-ddd/common/domain/models";
import { String, Map } from "@nx-ddd/firestore/decorators";
import { TwitterToken } from "@x-lt/common/infrastructure/external/twitter";

export class Community extends Entity {

  @String()
  name: string;

  @Map()
  twitter: {
    token: TwitterToken;
  };

  @Map()
  discord: {
    id: string;
    token: string;
    notifyChannelId: string;
    notifyChannelRoleId: string;
  }
}