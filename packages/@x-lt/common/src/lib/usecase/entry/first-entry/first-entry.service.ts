import { Entry, EntryStatus, FirstEntry } from '@x-lt/common/domain/models/notion';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import { Injectable } from '@nx-ddd/core/di';
import dayjs from 'dayjs';

@Injectable({providedIn: 'root'})
export class FirstEntryService {
  constructor(
    protected infra: InfrastructureService,
  ) { }

  protected lastUpdatedAt: dayjs.Dayjs = dayjs('2022-11-04');

  async observe() {
    // 最終観察時刻以降に変更があったデータを取得
    const results = await this.infra.repo.notion.firstEntry.listByEditedAtAfter(this.lastUpdatedAt);

    // 取得した各データに対して処理を実行
    for (const result of results) await this.handle(result);
  }

  async handle(firstEntry: FirstEntry) {
    // 一次選考のデータが応募とすでに紐付いていたら処理をしない
    if (firstEntry.entryId) return;

    await this.createEntry(firstEntry);
  }

  async createEntry(firstEntry: FirstEntry) {
    // 一次選考と紐づく応募を作成する
    await this.infra.repo.notion.entry.create(Entry.from<Entry>({
      title: firstEntry.title,
      status: EntryStatus._201_受付連絡中,
      firstEntryId: firstEntry.id,
      scholarshipId: firstEntry.scholarshipId,
    }));
  }
}

