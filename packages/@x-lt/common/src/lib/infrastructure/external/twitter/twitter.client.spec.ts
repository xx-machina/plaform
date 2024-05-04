import { TwitterClient, TwitterOauth2Config, TwitterOauthConfig, TWITTER_OAUTH2_CONFIG, TWITTER_OAUTH_CONFIG } from './twitter.client';
import { TwitterModule } from './twitter.module';
import { TestBed } from '@nx-ddd/core/test-bed';
import twitterConfigJson from '../../../../../twitter.json';
import twitterAccessToken from '../../../../../twitter-access-token.json';

const OAUTH_CONFIG: TwitterOauthConfig = {
  consumer_key: twitterConfigJson.consumer_key,
  consumer_secret: twitterConfigJson.consumer_secret,
  access_token: twitterConfigJson.access_token,
  access_token_secret: twitterConfigJson.access_token_secret,
};

const OAUTH2_CONFIG: TwitterOauth2Config = {
  client_id: twitterConfigJson.OAuth2.client_id,
  client_secret: twitterConfigJson.OAuth2.client_secret,
  callback: '',
  scopes: [],
  token: twitterAccessToken.token,
};


describe('TwitterClient', () => {
  let client: TwitterClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TwitterModule,
      ],
      providers: [
        { provide: TWITTER_OAUTH_CONFIG, useValue: OAUTH_CONFIG },
        { provide: TWITTER_OAUTH2_CONFIG, useValue: OAUTH2_CONFIG },
      ],
    });
    client = TestBed.inject(TwitterClient);
  });


  it('should be created', () => {
    expect(client).toBeTruthy();
  });

  describe('searchTweets()', () => {
    it('should be succeeded', async () => {
      const URL = encodeURIComponent('https://twitter.com/sfc_projects/status/1549695631228227585');
      const query = `url: ${URL}`;
      const tweets = await client.searchTweets(query);
      expect(tweets?.length).toBeGreaterThan(1);
    });
  });

  describe('', () => {
    xit('', async () => {
      const URL = encodeURIComponent('https://twitter.com/sfc_projects/status/1549695631228227585');
      const query = `url: ${URL}`;
      const data = await client.searchTweets(query);
    });
  });
});
