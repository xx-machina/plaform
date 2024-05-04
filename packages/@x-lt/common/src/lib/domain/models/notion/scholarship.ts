import { Entity } from "@nx-ddd/common/domain/models";
import { Relation, RichText, Date, Title, Number } from "@nx-ddd/notion/decorators";
import dayjs from "dayjs";
import { Entry } from "./entry";

export class Scholarship extends Entity {
  @Title({name: '名前'})
  name: string;

  @Relation({name: '奨学金(pre)'})
  preScholarshipIds: string[];

  @Relation({name: '奨学金(next)'})
  nextScholarshipIds: string[];

  @Relation({name: 'オーナー'})
  ownerIds: string;

  @RichText({name: 'discordSelectionChannelId'})
  discordSelectionChannelId: string;

  @RichText({name: 'discordSelectionRoleId'})
  discordSelectionRoleId: string;

  @RichText({name: 'discordOperationChannelId'})
  discordOperationChannelId: string;

  @RichText({name: 'discordOperationRoleId'})
  discordOperationRoleId: string;

  @Number({name: 'approvalCount'})
  approvalCount: number;

  @Date({name: '開始日時'})
  startAt: dayjs.Dayjs;

  @Date({name: '終了日時'})
  endAt: dayjs.Dayjs;

  @RichText({name: 'tweetUrl'})
  tweetUrl: string;

  get ownerId(): string | null {
    return this.ownerIds?.[0] ?? null;
  }

  entries?: Entry[];
}
