import { Entity } from "../entity";

export namespace Twitter {
  export interface MessageEvent {
    id: string;
    type: 'message_create';
    createdTimestamp: string;
    messageCreate: {
      target: {
        recipientId: string
      };
      senderId: string;
      messageData: {
        text: string;
        entities: { hashtags: any[], symbols: any[], userMentions: any[], urls: any[] }
      };
    };
  }

  export class MessageEvent extends Entity {
    static fromObj(obj: Partial<MessageEvent>): MessageEvent {
      return super.fromObj(obj) as never as MessageEvent;
    }

    static fromSnap(snap, extra: object) {
      return MessageEvent.fromObj({...snap.data(), ...extra});
    }

    hasTwitterId(): boolean {
      return !!this.twitterId;
    }

    isMessageCreateEvent(): boolean {
      return this.type === 'message_create';
    }

    isSentBy(userId: string): boolean {
      return this?.messageCreate?.senderId !== userId;
    }

    set twitterId(twitterId: string) {
      this._twitterId = twitterId;
    }
    get twitterId(): string {
      return this._twitterId;
    };
    private _twitterId: string = null;

  }

  export const testMessageEvent = MessageEvent.fromObj({
    twitterId: null,
    id: '1528818574424305668',
    createdAt: null,
    updatedAt: null,
    type: 'message_create',
    createdTimestamp: '1653333726875',
    messageCreate: {
      target: {
        recipientId: '1059010414531334144'
      },
      senderId: '1176489922212970496',
      messageData: {
        text: 'これは開発用のメッセージです',
        entities: {
          hashtags: [],
          symbols: [],
          userMentions: [],
          urls: []
        }
      }
    }
  });

  export interface VerifyCredentials {
    id: number,
    idStr: string,
    name: string,
    screenName: string,
    location: string,
    description: string,
    url: string | null,
    entities: { description: { urls: [] } },
    protected: boolean,
    followersCount: number,
    friendsCount: number,
    listedCount: number,
    createdAt: string,
    favouritesCount: number,
    utcOffset: null,
    timeZone: null,
    geoEnabled: boolean,
    verified: boolean,
    statusesCount: number,
    lang: null,
    status: {
      createdAt: string,
      id: number,
      idStr: string,
      text: string,
      truncated: boolean,
      entities: { hashtags: [], symbols: [], userMentions: [], urls: [] },
      source: string,
      inReplyToStatusId: null,
      inReplyToStatusIdStr: null,
      inReplyToUserId: null,
      inReplyToUserIdStr: null,
      inReplyToScreenName: null,
      geo: null,
      coordinates: null,
      place: null,
      contributors: null,
      isQuoteStatus: boolean,
      retweetCount: number,
      favoriteCount: number,
      favorited: boolean,
      retweeted: boolean,
      lang: 'ja',
    },
    contributorsEnabled: boolean,
    isTranslator: boolean,
    isTranslationEnabled: boolean,
    profileBackgroundColor: string,
    profileBackgroundImageUrl: null,
    profileBackgroundImageUrlHttps: null,
    profileBackgroundTile: boolean,
    profileImageUrl: string,
    profileImageUrlHttps: string,
    profileBannerUrl: string,
    profileLinkColor: string,
    profileSidebarBorderColor: string,
    profileSidebarFillColor: string,
    profileTextColor: string,
    profileUseBackgroundImage: boolean,
    hasExtendedProfile: boolean,
    defaultProfile: boolean,
    defaultProfileImage: boolean,
    following: boolean,
    followRequestSent: boolean,
    notifications: boolean,
    translatorType: string,
    withheldInCountries: [],
    suspended: boolean,
    needsPhoneVerification: boolean
  }

  export class VerifyCredentials {

    static fromObj(obj: Partial<VerifyCredentials>): VerifyCredentials {
      return Object.assign(new VerifyCredentials(), obj) as never as VerifyCredentials;
    }
  }

  export interface UserShow {
    id: number,
    idStr: string,
    name: string,
    screenName: string,
    location: string,
    profileLocation: null,
    description: string,
    url: string,
    entities: { url: { urls: any[] }, description: { urls: [] } },
    protected: boolean,
    followersCount: number,
    friendsCount: number,
    listedCount: number,
    createdAt: string,
    favoritesCount: number,
    utcOffset: null,
    timeZone: null,
    geoEnabled: boolean,
    verified: boolean,
    statusesCount: number,
    lang: null,
    status: {
      createdAt: string,
      id: number,
      idStr: string,
      text: string,
      truncated: boolean,
      entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] },
      source: string,
      in_reply_to_status_id: null,
      in_reply_to_status_id_str: null,
      in_reply_to_user_id: null,
      in_reply_to_user_id_str: null,
      in_reply_to_screen_name: null,
      geo: null,
      coordinates: null,
      place: null,
      contributors: null,
      is_quote_status: boolean,
      retweet_count: number,
      favorite_count: number,
      favorited: boolean,
      retweeted: boolean,
      lang: 'ja'
    },
    contributors_enabled: boolean,
    is_translator: boolean,
    is_translation_enabled: boolean,
    profile_background_color: string,
    profile_background_image_url: null,
    profile_background_image_url_https: null,
    profile_background_tile: boolean,
    profile_image_url_https: string,
    profile_banner_url: string,
    profile_link_color: string,
    profile_sidebar_border_color: string,
    profile_sidebar_fill_color: string,
    profile_text_color: string,
    profile_use_background_image: boolean,
    profile_image_url: string,
    has_extended_profile: boolean,
    default_profile: boolean,
    default_profile_image: boolean,
    following: boolean,
    follow_request_sent: boolean,
    notifications: boolean,
    translator_type: string,
    withheld_in_countries: any[],
  }
  
}
