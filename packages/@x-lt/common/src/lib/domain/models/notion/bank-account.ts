import { Entity } from '@nx-ddd/common/domain/models';
import { Relation, RichText, Title } from "@nx-ddd/notion/decorators";

export class BankAccount extends Entity<string> {
  @Title({name: '氏名'})
  fullName: string;

  @RichText({name: 'Twitter ID (応募時にご使用いただいたアカウント)'})
  twitterScreenName: string;

  @RichText({name: '口座名義'})
  name: string;

  @RichText({name: '口座番号'})
  number: string;

  @RichText({name: '支店名'})
  branchName: string;

  @RichText({name: '支店番号'})
  branchCode: string;

  @RichText({name: '金融機関名（銀行名）'})
  bankName: string;

  @RichText({name: '預金種別'})
  type: string;

  @Relation({name: '応募'})
  entryIds: string[];

}

