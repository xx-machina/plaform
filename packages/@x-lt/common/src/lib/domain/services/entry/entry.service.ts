import { InfrastructureService } from "@x-lt/common/infrastructure";
import { Injectable } from '@nx-ddd/core';
import { Entry, EntryStatus } from "../../models/notion";

@Injectable({providedIn: 'root'})
export class EntryService {
  constructor (
    private infra: InfrastructureService,
  ) { }

  async startFirstSelection(entry: Entry) {
    if (entry.status !== EntryStatus._202_一次選考中) return;
    if (entry.hasDiscordFirstSelection) throw new Error('First Selection is Already Started.');

    const scholarship = await this.infra.repo.notion.scholarship.get({id: entry.scholarshipId});

    await this.infra.discord.login();
    const {channelId, id} = await this.infra.discord.sendMessage(
      scholarship.discordSelectionChannelId,
      `<@&${scholarship.discordSelectionRoleId}>\n${entry.discordFirstSelectionStartMessage}`
    );
    this.infra.discord.close();

    // MEMO(nontangent): タイトルが無いと上手く行かない
    await this.infra.repo.notion.entry.update(Entry.from<Entry>({
      id: entry.id,
      title: entry.title,
      discordFirstSelectionChannelId: channelId,
      discordFirstSelectionMessageId: id,
    }));
  }

  async startSecondSelection(entry: Entry) {
    if (entry.status !== EntryStatus._206_二次選考中) return;
    if (entry.hasDiscordSecondSelection) throw new Error('Second Selection is Already Started.');

    const scholarship = await this.infra.repo.notion.scholarship.get({id: entry.scholarshipId});

    await this.infra.discord.login();
    const {channelId, id} = await this.infra.discord.sendMessage(
      scholarship.discordSelectionChannelId,
      `<@&${scholarship.discordSelectionRoleId}>\n${entry.discordSecondSelectionStartMessage}`
    );
    this.infra.discord.close();

    await this.infra.repo.notion.entry.update(Entry.from<Entry>({
      id: entry.id,
      title: entry.title,
      discordSecondSelectionChannelId: channelId,
      discordSecondSelectionMessageId: id,
    }));
  }
}