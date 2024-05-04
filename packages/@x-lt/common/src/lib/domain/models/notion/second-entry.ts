import { Entity } from '@nx-ddd/common/domain/models';
import { Relation, RichText, Title } from "@nx-ddd/notion/decorators";

export class SecondEntry extends Entity {
  @Title('タイトル')
  title: string;

  @RichText('氏名')
  fullName: string;

  @Relation('顧客')
  customerId: string;

  @RichText('twitterId')
  twitterId: string;

  @RichText('ハンドルネーム')
  handleName: string;

  @RichText('備考')
  備考: string;

  @Relation('応募')
  entryId: string;
}
