import { Entity } from '@nx-ddd/common/domain/models';
import { Relation, RichText, Title } from "@nx-ddd/notion/decorators";

export class BankAccount extends Entity<string> {
  @Title('氏名')
  fullName: string;

  @RichText('Twitter ID (応募時にご使用いただいたアカウント)')
  twitterScreenName: string;

  @RichText('口座名義')
  name: string;

  @RichText('口座番号')
  number: string;

  @RichText('支店名')
  branchName: string;

  @RichText('支店番号')
  branchCode: string;

  @RichText('金融機関名（銀行名）')
  bankName: string;

  @RichText('預金種別')
  type: string;

  @Relation('応募')
  entryId: string;

}

