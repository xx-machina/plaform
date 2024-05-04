import { Twitter } from '@x-lt/common/domain/twitter';
import Twit from 'twit';
import * as _ from 'lodash';
import camelize from 'camelcase-keys';
import { Client } from "twitter-api-sdk";
import { OAuth2User } from 'twitter-api-sdk/dist/OAuth2User';
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

export const TWITTER_OAUTH_CONFIG = new InjectionToken('[@x-lt/common] Twitter Oauth Config');
export const TWITTER_OAUTH2_CONFIG = new InjectionToken('[@x-lt/common] Twitter Oauth2 Config');

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
  callback: '';
  scopes: [];
  token: TwitterToken;
}

export interface TwitterOauthConfig {
  consumer_key: string;
  consumer_secret: string;
  access_token: string;
  access_token_secret: string;
}

@Injectable({providedIn: 'root'})
export class TwitterClient {
  constructor(
    @Inject(TWITTER_OAUTH_CONFIG) private config: TwitterOauthConfig,
    @Inject(TWITTER_OAUTH2_CONFIG) private oauth2Config: TwitterOauth2Config,
  ) { }

  private client = new Twit(this.config);

  getClientV2Next(token: TwitterToken): TwitterApi {
    return new TwitterApi(token.access_token);
  }

  getV2Client(token: TwitterToken): Client {
    const auth = new OAuth2User({...this.oauth2Config, token});
    return new Client(auth);
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
    const {data} = await this.client.get('users/show', options) as any;
    return camelize(data);
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

  async sendReply(client: Client, tweetId: string, text: string) {
    try {
      await client.tweets.createTweet({
        reply: { in_reply_to_tweet_id: tweetId },
        text,
      });
    } catch(error) {
      console.error('error:', error.error);
      throw error;
    }
  }

  async searchTweets(client: Client, query: string, sinceId?: string) {
    try {
      const res = await client.tweets.tweetsRecentSearch({
          query, since_id: sinceId,
          "tweet.fields": ["created_at", "lang", "conversation_id", 'author_id'],
          'user.fields': ['id', 'name', 'username'],
        expansions: ['author_id'],
      });

      if (!res?.data) return [];
      
      return res?.data?.map((tweet) => {
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
