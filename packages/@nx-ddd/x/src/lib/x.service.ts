import { Injectable } from '@nx-ddd/core/di';
import { MessageEvent, TwitterToken } from './domain/models';
import { TwitterApi } from 'twitter-api-v2';
import { Tweet, TwitterUser } from './domain/models';

type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}` ?
  `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` : S

type CamelToSnake<T extends object> = {
  [K in keyof T as `${CamelToSnakeCase<string & K>}`]: T[K] extends object ? CamelToSnake<T[K]> : T[K]
}

@Injectable({providedIn: 'root'})
export abstract class XService {

  getClient(obj: any): any {
    throw new Error('Method not implemented.');
  }

  isExpired(token: TwitterToken): boolean {
    throw new Error('Method not implemented.');
  }

  async refreshToken(token: TwitterToken): Promise<TwitterToken> {
    throw new Error('Method not implemented.');
  }

  get consumerClient(): TwitterApi {
    throw new Error('Method not implemented.');
  }

  get consumerClientById(): TwitterApi {
    throw new Error('Method not implemented.');
  }

  get consumerClientByCredentials(): TwitterApi {
    throw new Error('Method not implemented.');
  }

  get consumerClientByToken(): TwitterApi {
    throw new Error('Method not implemented.');
  }

  getClientV2Next(token: TwitterToken): TwitterApi {
    throw new Error('Method not implemented.');
  }

  async getDirectMessageEventsList(
    client: TwitterApi, 
    options: {count?: number},
  ): Promise<MessageEvent[]> {
    throw new Error('Method not implemented.');
  }

  async getAccountVerifyCredentials(client: TwitterApi = this.consumerClient): Promise<{id: string}> {
    throw new Error('Method not implemented.');
  }

  generateOAuth2AuthLink(client: TwitterApi): {url: string, codeVerifier: string} {
    throw new Error('Method not implemented.');
  }

  loginWithOAuth2(client: TwitterApi, code: string, codeVerifier: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  // async getUserShow(options: {user_id?: string}): Promise<Twitter.UserShow> {
  //   // const {data} = await this.client.get('users/show', options) as any;
  //   // return camelize(data);
  //   return null;
  // }

  async getUser(client: TwitterApi = this.consumerClient, id: string): Promise<TwitterUser> {
    throw new Error('Method not implemented.');
  }

  async getUsers(client: TwitterApi = this.consumerClient, ids: string[]): Promise<TwitterUser[]> {
    throw new Error('Method not implemented.');
  }

  async sendDirectMessage(client: TwitterApi = this.consumerClient, recipientId: string, text: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async sendReply(client: TwitterApi = this.consumerClient, tweetId: string, text: string) {
    throw new Error('Method not implemented.');
  }

  async reply(client: TwitterApi = this.consumerClient, tweetId: string, text: string) {
    throw new Error('Method not implemented.');
  }

  async searchTweets(client: TwitterApi = this.consumerClient, query: string, sinceId?: string): Promise<Tweet[]> {
    throw new Error('Method not implemented.');
  }

  async searchPosts(client: TwitterApi = this.consumerClient, query: string, sinceId?: string) {
    throw new Error('Method not implemented.');
  }

  async deletePost(tweetId: string) {
    throw new Error('Method not implemented.');
  }

  async like(tweetId: string) {
    throw new Error('Method not implemented.');
  }
}
