import { Entry, EntryStatus } from '@x-lt/common/domain/models/notion';
import { THUMBS_UPS } from '@x-lt/common/domain/discord';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import { DomainService } from '@x-lt/common/domain';
import { Injectable } from '@nx-ddd/core/di';
import { BaseService } from '../base';


@Injectable({providedIn: 'root'})
export class FirstService extends BaseService {
  constructor(
    infra: InfrastructureService,
    private domain: DomainService,
  ) { super(infra) }

  protected OBSERVE_STATUS = EntryStatus._202_一次選考中;
  
  async handle(entry: Entry) {
    if (!this.isSelecting(entry)) {
      await this.startSelection(entry); 
    } else {
      await this.judge(entry);
    }
  }

  async startSelection(entry: Entry) {
    await this.domain.entry.startFirstSelection(entry);
  }

  async judge(entry: Entry) {
    if(!await this.isApproval(entry)) return;

    entry = await this.infra.repo.notion.entry.update({
      id: entry.id,
      title: entry.title,
      status: EntryStatus._203_一次選考通過連絡中
    }) as any;
  }

  private async isApproval(entry: Entry): Promise<boolean> {
    const scholarship = await this.infra.repo.notion.scholarship.get({id: entry.scholarshipId});

    await this.infra.discord.login();
    const count = await this.infra.discord.getReactionsCount(
      entry.discordFirstSelectionChannelId, 
      entry.discordFirstSelectionMessageId, 
      THUMBS_UPS,
    );
    this.infra.discord.close();

    return count >= scholarship.approvalCount;
  }

  private isSelecting(entry: Entry): boolean {
    return !!(entry.discordFirstSelectionChannelId && entry.discordFirstSelectionMessageId)
  }
}
