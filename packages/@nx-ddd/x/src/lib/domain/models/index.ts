export * from './message-event';
export * from './token';

export interface Twitter {
  id: string;
  accessToken: string;
  secret: string;
}

export const nullTwitter: Twitter = {
  id: null,
  accessToken: null,
  secret: null
};

export class Tweet {
  id: string;
  authorId: string;
  author?: TwitterUser;
  text: string;
  liked: boolean;
  createdAt: any;

  static from(obj: Partial<Tweet>) {
    return Object.assign(new Tweet(), obj);
  }
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description: string;
}
