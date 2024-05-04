import { Entity } from "@nx-ddd/common/domain/models";
import { Relation, RichText, Date, Title, Number } from "@nx-ddd/notion/decorators";
import dayjs from "dayjs";
import { Entry, EntryStatus } from "./entry";

export interface ScholarshipSatusCounter {
  応募者数: number;
  一次選考中: number;
  一次選考通過者数: number;
  二次選考中: number;
  二次選考通過者数: number;
}


export class Scholarship extends Entity {
  @Title('名前')
  name: string;

  @Relation('奨学金(pre)')
  preScholarshipId: string;

  @Relation('奨学金(next)')
  nextScholarshipId: string;

  @Relation('オーナー')
  ownerId: string;

  @RichText('discordSelectionChannelId')
  discordSelectionChannelId: string;

  @RichText('discordSelectionRoleId')
  discordSelectionRoleId: string;

  @RichText('discordOperationChannelId')
  discordOperationChannelId: string;

  @RichText('discordOperationRoleId')
  discordOperationRoleId: string;

  @Number('approvalCount')
  approvalCount: number;

  @Date('開始日時')
  startAt: dayjs.Dayjs;

  @Date('終了日時')
  endAt: dayjs.Dayjs;

  @RichText('tweetUrl')
  tweetUrl: string;

  entries?: Entry[];

  get statusCount(): ScholarshipSatusCounter {
    const counter = {
      応募者数: 0,
      一次選考中: 0,
      一次選考通過者数: 0,
      二次選考中: 0,
      二次選考通過者数: 0,
    };

    (this.entries ?? []).forEach(entry => {
      if(entry.isEntry) counter.応募者数++;
      if(entry.status === EntryStatus._202_一次選考中) counter.一次選考中++;
      if(entry.isPassedFirstSelection) counter.一次選考通過者数++;
      if(entry.isWorkInSecondSelection) counter.二次選考中++;
      if(entry.isPassedSecondSelection) counter.二次選考通過者数++;
    });
    return counter
  }
}
