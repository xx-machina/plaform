import { EntryStatus } from '@x-lt/common/domain/models/notion';
import { BankAccount } from '@x-lt/common/domain/models/notion/bank-account';
import { Injectable } from '@nx-ddd/core/di';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import dayjs from 'dayjs';

@Injectable({providedIn: 'root'})
export class BankAccountService {
  constructor(
    private infra: InfrastructureService,
  ) { }

  protected lastUpdatedAt: dayjs.Dayjs = dayjs('2022-11-04');

  async observe() {
    // 最終観察時刻以降に変更があったデータを取得
    const results = await this.infra.repo.notion.bankAccount.listByEditedAtAfter(this.lastUpdatedAt);

    // 取得した各データに対して処理を実行
    for (const result of results) {
      await this.handle(result);
    }
  }

  async handle(bankAccount: BankAccount) {
    if (isAlreadyLinkWithEntry(bankAccount)) return;
    await this.linkWithEntry(bankAccount);
  }

  private async linkWithEntry(bankAccount: BankAccount) {
    // TODO(nontangent): ハードコードをやめる
    const scholarship = await this.infra.repo.notion.scholarship.get({id: 'd51c97fe-6fda-451c-9f04-9f60257d101b'});
    const entries = await this.infra.repo.notion.entry.listByTwitterScreenName(
      bankAccount.twitterScreenName, scholarship.id
    );

    if (!entries.length) return;
    const entry = entries[0];

    if (entry.status !== EntryStatus._208_採択_口座情報登録待ち_) return;
    
    await this.infra.repo.notion.entry.update({
      id: entry.id,
      title: entry.title,
      bankAccountIds: [bankAccount.id],
      status: EntryStatus._209_口座情報受付連絡中,
    });
  }

}

function isAlreadyLinkWithEntry(bankAccount: BankAccount): boolean {
  return !!bankAccount.entryId;
}

