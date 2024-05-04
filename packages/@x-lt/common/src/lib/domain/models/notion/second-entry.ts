import { Entity } from '@nx-ddd/common/domain/models';
import { Relation, RichText, Title } from "@nx-ddd/notion/decorators";

export class SecondEntry extends Entity {
  @Title({name: 'タイトル'})
  title: string;

  @RichText({name: '氏名'})
  fullName: string;

  @Relation({name: '顧客'})
  customerIds: string[];

  @RichText({name: 'twitterId'})
  twitterId: string;

  @RichText({name: 'ハンドルネーム'})
  handleName: string;

  @RichText({name: '備考'})
  備考: string;

  @Relation({name: '応募'})
  entryIds: string[];
}
