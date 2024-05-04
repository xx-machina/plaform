import { Twitter } from '@x-lt/common/domain/twitter';
import * as _ from 'lodash';
import { TwitterApi } from 'twitter-api-v2';
import { Inject, Injectable, InjectionToken } from '@nx-ddd/core/di';
import dayjs from 'dayjs';
import { MessageEvent } from '@x-lt/common/domain/models/message-event';

type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}` ?
  `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` : S

type CamelToSnake<T extends object> = {
  [K in keyof T as `${CamelToSnakeCase<string & K>}`]: T[K] extends object ? CamelToSnake<T[K]> : T[K]
}

export interface TwitterToken {
  token_type: string;
  access_token: string;
  scope: string;
  refresh_token: string;
  expires_at: number;
}

export interface TwitterOauth2Config {
  client_id: string;
  client_secret: string;
  callback: string;
  scopes: [];
  token: string;
}

export interface TwitterOauthConfig {
  consumer_key: string;
  consumer_secret: string;
  access_token: string;
  access_token_secret: string;
}

export interface TwitterClientConfig {
  oauth: TwitterOauthConfig;
  oauth2: TwitterOauth2Config;
}

export const TWITTER_CLIENT_CONFIG = new InjectionToken<TwitterClientConfig>('[@x-lt/common/infrastructure] Twitter Client Config');

@Injectable({providedIn: 'root'})
export class TwitterClient {
  constructor(
    @Inject(TWITTER_CLIENT_CONFIG) private config: TwitterClientConfig,
  ) { }

  isExpired(token: TwitterToken): boolean {
    return dayjs().isBefore(dayjs.unix(token.expires_at).add(-5, 'minutes'));
  }

  async refreshToken(token: TwitterToken): Promise<TwitterToken> {
    const client = this.getCunsulerClient();
    const data = await client.refreshOAuth2Token(token.refresh_token);
    return {
      token_type: 'bearer',
      access_token: data.accessToken,
      scope: data.scope.join(' '),
      refresh_token: data.refreshToken,
      expires_at: (dayjs().unix() + data.expiresIn),
    }
  }

  getCunsulerClient() {
    return new TwitterApi({
      clientId: this.config.oauth2.client_id,
      clientSecret: this.config.oauth2.client_secret,
    });    
  }

  getClientV2Next(token: TwitterToken): TwitterApi {
    return new TwitterApi(token.access_token);
  }

  async getDirectMessageEventsList(
    client: TwitterApi, 
    options: {count?: number},
  ): Promise<MessageEvent[]> {
    try {
      const events = await client.v2.listDmEvents({
        'dm_event.fields': [
          'attachments', 'created_at', 'dm_conversation_id',
          'event_type', 'id', 'participant_ids',
          'referenced_tweets', 'sender_id', 'text',
        ] as any,
        expansions: ['sender_id', 'participant_ids'],
        event_types: ['MessageCreate'],
        max_results: options.count,
        'user.fields': [
          'created_at', 'description', 'entities', 'id', 'location', 'name',
          'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics',
          'url', 'username', 'verified', 'verified_type', 'withheld'
        ],
      });
      return events.data.data.map(data => ({
        id: data.id,
        senderId: data.sender_id,
        eventType: 'MessageCreate',
        dmConversationId: data.dm_conversation_id,
        text: (data as any).text,
        createdAt: dayjs(data.created_at),
        updatedAt: null,
      }));
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  async getAccountVerifyCredentials(client: TwitterApi): Promise<{id: string}> {
    const data = await client.v2.me();
    return {id: data.data.id};
  }

  async getUserShow(options: {user_id?: string}): Promise<Twitter.UserShow> {
    // const {data} = await this.client.get('users/show', options) as any;
    // return camelize(data);
    return null;
  }

  async getUser(client: TwitterApi, id: string) {
    try {
      const {data} = await client.v2.user(id, {
        'user.fields': [
          'created_at', 'description', 'entities', 'id', 'location',
          'name', 'pinned_tweet_id', 'profile_image_url', 'protected',
          'public_metrics', 'url', 'username', 'verified', 'verified_type', 'withheld'
        ],
      });
      return data;
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  }

  async sendDirectMessage(client: TwitterApi, recipientId: string, text: string) {
    try {
      const result = await client.v2.sendDmToParticipant(recipientId, {text});
      return result;
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  }

  async sendReply(client: TwitterApi, tweetId: string, text: string) {
    try {
      await client.v2.reply(text, tweetId);
    } catch(error) {
      console.error('error:', error.error);
      throw error;
    }
  }

  async searchTweets(client: TwitterApi, query: string, sinceId?: string) {
    try {
      const res = await client.v2.search({
        query, since_id: sinceId,
        "tweet.fields": ["created_at", "lang", "conversation_id", 'author_id'],
        'user.fields': ['id', 'name', 'username'],
        expansions: ['author_id'],
      });

      if (!res?.data?.data) return [];
      
      return res?.data?.data.map((tweet) => {
        const author = res.includes.users.find(user => user.id === tweet.author_id);
        return {
          id: tweet.id,
          text: tweet.text,
          authorId: tweet.author_id,
          author: {
            id: author.id,
            name: author.name,
            username: author.username,
          },
          createdAt: dayjs(tweet.created_at),
        }
      });
    } catch(error) {
      console.error(error.error);
      throw error;
    } finally {
      // MEMO(nontangent): なぜか失敗した場合にtokenを保存していた。
      // this.saveToken(this.authClient.token);
    }
  }
}
