import { Entry, EntryStatus } from '@x-lt/common/domain/models/notion';
import { THUMBS_UPS } from '@x-lt/common/domain/discord';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import { DomainService } from '@x-lt/common/domain';
import { Injectable } from '@nx-ddd/core/di';
import { BaseService } from '../base';


@Injectable({providedIn: 'root'})
export class SecondService extends BaseService {
  constructor(
    private domain: DomainService,
    infra: InfrastructureService,
  ) { super(infra) }

  protected OBSERVE_STATUS = EntryStatus._206_二次選考中;

  async handle(entry: Entry) {
    if (!this.isSelecting(entry)) {
      await this.startSelection(entry); 
    } else {
      await this.judge(entry);
    }
  }

  async startSelection(entry: Entry) {
    return this.domain.entry.startSecondSelection(entry);
  }

  async judge(entry: Entry) {
    if(!await this.isApproval(entry)) return;

    entry = await this.infra.repo.notion.entry.update({
      id: entry.id,
      title: entry.title,
      status: EntryStatus._207_二次選考通過連絡中,
    }) as any;

    await this.sendMessage(entry);
  }

  private async isApproval(entry: Entry): Promise<boolean> {
    const scholarship = await this.infra.repo.notion.scholarship.get({id: entry.scholarshipId});

    await this.infra.discord.login();
    const count = await this.infra.discord.getReactionsCount(
      entry.discordSecondSelectionChannelId, 
      entry.discordSecondSelectionMessageId, 
      THUMBS_UPS,
    );
    this.infra.discord.close();

    return count >= scholarship.approvalCount;
  }

  isSelecting(entry: Entry): boolean {
    return !!(entry.discordSecondSelectionChannelId && entry.discordSecondSelectionMessageId)
  }
}
