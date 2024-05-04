import { TwitterClient } from '@x-lt/common/infrastructure/external/twitter';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import { MessageEvent } from '@x-lt/common/domain/models/message-event';
import { Injectable } from '@nx-ddd/core';
import { FirestoreAdapter } from '@nx-ddd/firestore/adapters/base';
import dayjs from 'dayjs';


@Injectable({providedIn: 'root'})
export class MessageEventService {
  constructor (
    private adapter: FirestoreAdapter,
    private twitter: TwitterClient,
    private infra: InfrastructureService,
  ) { }

  async sync(communityId: string) {
    const community = await this.infra.repo.firestore.community.get({id: communityId});
    const client = await this.infra.twitter.getClientV2Next(community.twitter.token);
    const events = await this.twitter.getDirectMessageEventsList(client, {count: 50});
    const latest = await this.getLatestMessageEvent(communityId);
    const additionalEvents = events
      .filter(event => event.createdAt > (latest?.createdAt ?? dayjs('1970-01-01')))
      .map(event => ({...event, communityId: 'default'}));
    console.debug('additionalEvents:', additionalEvents);
    await Promise.all(additionalEvents.map(event => this.infra.repo.firestore.messageEvent.create(event)));
  }

  private async getLatestMessageEvent(communityId: string) {
    const query = (collection) => {
      return this.adapter.query(
        collection, 
        this.adapter.orderBy('createdAt', 'desc'),
        this.adapter.limit(1),
      );
    }
    const messageEvents = await this.infra.repo.firestore.messageEvent.list({communityId}, query);
    return messageEvents?.[0] ?? null;
  }

  async notifyMessageEvent(event: MessageEvent): Promise<void> {
    const community = await this.infra.repo.firestore.community.get({id: 'default'});
    const client = await this.infra.twitter.getClientV2Next(community.twitter.token);
    const builder = new MessageBuildServie();
    const sender = await this.infra.twitter.getUser(client, event.senderId);
    event.sender = sender;

    const message = builder.buildMessageEventCreatedMessage(event);
    await this.infra.discord.login();
    await this.infra.discord.sendMessage(
      community.discord.notifyChannelId,
      `<#${community.discord.notifyChannelRoleId}> ${message}`
    );
  }

}

export class MessageBuildServie {
  buildMessageEventCreatedMessage(event: MessageEvent): string {
    return `ダイレクトメッセージが届きました。\n`
    + `【送り主】\n`
    + `${event.sender.name}(@${event.sender.username})\n`
    + `【内容】\n`
    + `${event.text}\n`
    + `【URL】\n`
    + `https://twitter.com/${event.sender.username}\n`
  }
}
