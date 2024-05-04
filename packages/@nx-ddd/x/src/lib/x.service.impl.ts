import { Inject, Injectable } from '@nx-ddd/core';
import { MessageEvent, TwitterToken } from '@nx-ddd/x/domain/models';
import dayjs from 'dayjs';
import { XConfig, X_CONFIG } from './x.config';
import { XService } from './x.service';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterUser } from './domain/models';

@Injectable()
export class XServiceImpl extends XService {
  constructor(
    @Inject(X_CONFIG) private config: XConfig,
  ) {
    super();
  }

  isExpired(token: TwitterToken): boolean {
    return dayjs().isAfter(token.expires_at.add(-5, 'minutes'));
  }

  async refreshToken(token: TwitterToken): Promise<TwitterToken> {
    const client = this.consumerClientById;
    const data = await client.refreshOAuth2Token(token.refresh_token);
    return {
      token_type: 'bearer',
      access_token: data.accessToken,
      scope: data.scope.join(' '),
      refresh_token: data.refreshToken,
      expires_at: dayjs().add(data.expiresIn, 'seconds'),
    };
  }

  get consumerClient() {
    // return this.consumerClientByCredentials;
    return this.consumerClientByToken;
  }

  get consumerClientByCredentials(): TwitterApi {
    return new TwitterApi({
      appKey: this.config.oauth.consumerKey,
      appSecret: this.config.oauth.consumerSecret,
      accessToken: this.config.oauth.accessToken,
      accessSecret: this.config.oauth.accessTokenSecret,
    });
  }

  get consumerClientById(): TwitterApi {
    return new TwitterApi({
      clientId: this.config.oauth2.clientId,
      clientSecret: this.config.oauth2.clientSecret,
    });
  }

  get consumerClientByToken(): TwitterApi {
    return new TwitterApi(this.config.oauth2.token);
  }

  getClientV2Next(token: TwitterToken): TwitterApi {
    return new TwitterApi(token.access_token);
  }

  getClient(props: {accessToken: string, accessTokenSecret: string}): TwitterApi {
    return new TwitterApi({
      appKey: this.config.oauth.consumerKey,
      appSecret: this.config.oauth.consumerSecret,
      accessToken: props.accessToken,
      accessSecret: props.accessTokenSecret,
    });
  }

  generateOAuth2AuthLink(client: TwitterApi) {
    return client.generateOAuth2AuthLink(this.config.oauth2.callback, {
      state: 'test',
      scope: ['offline.access', 'dm.read', 'tweet.write', 'users.read', 'dm.write', 'tweet.read'],
    });
  }

  loginWithOAuth2(client: TwitterApi, code: string, codeVerifier: string): Promise<any> {
    return client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: this.config.oauth2.callback,
    });
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
      })) as any;
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  async getAccountVerifyCredentials(client: TwitterApi = this.consumerClient): Promise<{id: string}> {
    const data = await client.v2.me();
    return {id: data.data.id};
  }

  // async getUserShow(options: {user_id?: string}): Promise<Twitter.UserShow> {
  //   // const {data} = await this.client.get('users/show', options) as any;
  //   // return camelize(data);
  //   return null;
  // }

  async getUser(client: TwitterApi = this.consumerClient, id: string): Promise<TwitterUser> {
    try {
      const {data} = await client.v2.user(id, {
        'user.fields': [
          'created_at', 'description', 'entities', 'id', 'location',
          'name', 'pinned_tweet_id', 'profile_image_url', 'protected',
          'public_metrics', 'url', 'username', 'verified', 'verified_type', 'withheld'
        ],
      });
      return data as TwitterUser;
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  }

  async getUsers(client: TwitterApi = this.consumerClient, ids: string[]): Promise<TwitterUser[]> {
    try {
      const {data} = await client.v2.users(ids, {
        'user.fields': [
          'created_at',
          'description',
          'entities',
          'id',
          'location',
          'name',
          'pinned_tweet_id',
          'profile_image_url',
          'protected',
          'public_metrics',
          'url',
          'username',
        ],
      });
      return data as TwitterUser[];
    } catch(err) {
      console.error(err);
      throw err;    
    }
  }

  async sendDirectMessage(client: TwitterApi = this.consumerClient, recipientId: string, text: string) {
    return client.v2.sendDmToParticipant(recipientId, {text});
  }

  async sendReply(client: TwitterApi = this.consumerClient, tweetId: string, text: string) {
    return this.reply(client, tweetId, text);
  }

  async reply(client: TwitterApi = this.consumerClient, tweetId: string, text: string) {
    try {
      await client.v2.reply(text, tweetId);
    } catch(error) {
      console.error('sendReply Error');
      console.error('error:', error);
      throw error;
    }
  }

  async searchTweets(client: TwitterApi = this.consumerClient, query: string, sinceId?: string): Promise<any> {
    return this.searchPosts(client, query, sinceId);
  }

  async searchPosts(client: TwitterApi = this.consumerClient, query: string, sinceId?: string): Promise<any> {
    try {
      const res = await client.v2.search({
        query,
        since_id: sinceId,
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
      console.error(error);
      throw error;
    }
  }

  async deletePost(tweetId: string) {
    throw new Error('Method not implemented.');
  }

  async like(tweetId: string) {
    throw new Error('Method not implemented.');
  }
}

export const X_SERVICE_PROVIDER = [
  {
    provide: XService,
    useClass: XServiceImpl,
  }
]
