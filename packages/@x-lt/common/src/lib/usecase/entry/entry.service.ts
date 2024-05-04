import { Entry, EntryStatus } from "@x-lt/common/domain/models/notion";
import { Injectable, InjectionToken } from "@nx-ddd/core";
import { InfrastructureService } from "@x-lt/common/infrastructure";
import { DomainService } from "@x-lt/common/domain";
import { BankAccountService } from "./bank-account";
import { FirstEntryService } from "./first-entry";
import { SecondEntryService } from './second-entry';
import { SelectionService } from "./selection";

export function Status(status: EntryStatus, props: {auto: boolean} = {auto: true}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const entry = await this.infra.repo.notion.entry.get({id: args[0].id});
      if (entry.status !== status) throw new Error(`Entry status is not ${status}.`);
      return originalMethod.apply(this, args);
    }
  }
}

@Injectable({providedIn: 'root'})
export class EntryService {

  constructor(
    public bankAccount: BankAccountService,
    public first: FirstEntryService,
    public second: SecondEntryService,
    public infra: InfrastructureService,
    public domain: DomainService,
    public selection: SelectionService,
  ) { }

  async get(id: string): Promise<Entry> {
    return this.infra.repo.notion.entry.get({id});
  }

  async list(): Promise<Entry[]> {
    return this.infra.repo.notion.entry.list();
  }

  async update(entry: Partial<Entry>) {
    return this.infra.repo.notion.entry.update(entry);
  }

  private async makeCommunityTwitterClient(id: string) {
    const community = await this.infra.repo.firestore.community.get({id});
    let token = community.twitter.token;
    if (this.infra.twitter.isExpired(token)) {
      token = await this.infra.twitter.refreshToken(token);
      await this.infra.repo.firestore.community.update({...community, twitter: {token}});
    }
    return this.infra.twitter.getClientV2Next(token);
  }

  @Status(EntryStatus._201_受付連絡中, {auto: false})
  async sendFirstSelectionStartMessage(entry: Partial<Entry>) {
    const client = await this.makeCommunityTwitterClient('default');
    await this.infra.twitter.sendReply(client, entry.tweetId, entry.firstSelectionStartMessage); 
    await this.updateStatus(entry, EntryStatus._202_一次選考中);
  }

  @Status(EntryStatus._202_一次選考中)
  async startFirstSelection(entry: Entry) {
    // TODO(nontangent): 選考開始待ちと選考結果待ちの2つに分ける
    if (!entry.isInFirstSelecting) {
      await this.selection.first.startSelection(entry);
    } else {
      await this.selection.first.judge(entry);
    }
  }

  @Status(EntryStatus._203_一次選考通過連絡中, {auto: false})
  async sendFirstSelectionPassMessage(entry: Partial<Entry>) {
    const client = await this.makeCommunityTwitterClient('default');
    await this.infra.twitter.sendDirectMessage(client, entry.twitterId, entry.firstSelectionPassMessage);
    await this.updateStatus(entry, EntryStatus._204_二次選考応募待ち);
  }

  @Status(EntryStatus._205_二次選考受付連絡中, {auto: false})
  async sendSecondSelectionStartMessage(entry: Partial<Entry>) {
    const client = await this.makeCommunityTwitterClient('default');
    await this.infra.twitter.sendDirectMessage(client, entry.twitterId, entry.secondSelectionReceptionMessage);
    await this.updateStatus(entry, EntryStatus._206_二次選考中);
  }

  @Status(EntryStatus._206_二次選考中)
  async startSecondSelection(entry: Entry) {
    // TODO(nontangent): 選考開始待ちと選考結果待ちの2つに分ける
    if (!this.selection.second.isSelecting(entry)) {
      await this.selection.second.startSelection(entry);
    } else {
      await this.selection.second.judge(entry);
    }
  }

  @Status(EntryStatus._207_二次選考通過連絡中, {auto: false})
  async sendSecondSelectionPassMessage(entry: Partial<Entry>) {
    const client = await this.makeCommunityTwitterClient('default');
    await this.infra.twitter.sendDirectMessage(client, entry.twitterId, entry.secondSelectionPassMessage);
    await this.updateStatus(entry, EntryStatus._208_採択_口座情報登録待ち_);
  }

  @Status(EntryStatus._209_口座情報受付連絡中, {auto: false})
  async sendBankAccountPassMessage(entry: Partial<Entry>) {
    const client = await this.makeCommunityTwitterClient('default');
    await this.infra.twitter.sendDirectMessage(client, entry.twitterId, entry.bankAccountReceptionMessage);
    await this.updateStatus(entry, EntryStatus._210_採択_入金中_);
  }

  @Status(EntryStatus._210_採択_入金中_)
  async 振り込み依頼する(entry: Partial<Entry>) {
    const scholarship = await this.infra.repo.notion.scholarship.get({id: entry.scholarshipId});
    await this.infra.discord.login();
    await this.infra.discord.sendMessage(
      scholarship.discordSelectionChannelId,
      `<@&${scholarship.discordSelectionRoleId}>\n${entry.振込依頼メッセージ}`,
    );
    this.infra.discord.close();
  }

  private async updateStatus(entry: Partial<Entry>, status: EntryStatus) {
    await this.infra.repo.notion.entry.update({id: entry.id, title: entry.title, status});
  }
  
}

