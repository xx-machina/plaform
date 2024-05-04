export interface Twitter {
  id: string;
  accessToken: string;
  secret: string;
}

export interface Tweet {
  id: string;
  user: TwitterUser;
  text: string;
  favorited: boolean;

  createdAt: any;
}

export interface TwitterUser {
  id: string;
  name: string;
  screenName: string;
  description: string;
}
