import { Inject, Injectable, InjectionToken } from '@nx-ddd/core';
import { Client, TextChannel } from 'discord.js';

export const DISCORD_ACCESS_TOKEN = new InjectionToken('[@x-lt/common/infrastructure] Discord Access Token');

@Injectable({providedIn: 'root'})
export class DiscordClient {
  protected client = new Client({ intents: ['Guilds'] });

  constructor(
    @Inject(DISCORD_ACCESS_TOKEN) protected token: string,
  ) {
    this.client.on('ready', () => console.log(`Logged in as ${this.client.user.tag}!`));
  }

  async getTextChannel(channelId: string): Promise<TextChannel> {
    return await this.client.channels.fetch(channelId) as TextChannel;
  }

  async getMessage(channelId: string, messageId: string) {
    const channel = await this.getTextChannel(channelId);
    // MEMO(nontangent): キャッシュを削除しないとリアクションが取れない。
    channel.messages.cache.clear();
    return channel.messages.fetch(messageId);
  }

  async sendMessage(channelId: string, content: string) {
    const channel = await this.getTextChannel(channelId);
    const message = await channel.send(content);
    return message;
  }

  async getReactionsCount(channelId: string, messageId: string, reactions: string[]): Promise<number> {
    const message = await this.getMessage(channelId, messageId);
    return reactions.reduce((count, reaction) => count + (message.reactions.cache.get(reaction)?.count ?? 0), 0);
  }

  async getReactionCount(channelId: string, messageId: string, emoji: string = '👌'): Promise<number> {
    const message = await this.getMessage(channelId, messageId);
    return message.reactions.cache.get(emoji)?.count ?? 0;
  }

  async login() {
    console.debug('token:', this.token);
    await this.client.login(this.token);
  }

  close() {
    this.client.destroy();
  }
}
