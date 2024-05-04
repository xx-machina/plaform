import { Entity } from '@nx-ddd/common/domain/models';
import { CreatedTime, Formula, Relation, RichText, Rollup, Status, Title } from '@nx-ddd/notion/decorators';
import { Scholarship } from './scholarship';

export enum EntryStatus {
  _200_未着手 = '200_未着手',
  _201_受付連絡中 = '201_受付連絡中',
  _202_一次選考中 = '202_一次選考中',
  _203_一次選考通過連絡中 = '203_一次選考通過連絡中',
  _204_二次選考応募待ち = '204_二次選考応募待ち',
  _205_二次選考受付連絡中 = '205_二次選考受付連絡中',
  _206_二次選考中 = '206_二次選考中',
  _207_二次選考通過連絡中 = '207_二次選考通過連絡中',
  _208_採択_口座情報登録待ち_ = '208_採択(口座情報登録待ち)',
  _209_口座情報受付連絡中 = '209_口座情報受付連絡中',
  _210_採択_入金中_ = '210_採択(入金中)',
  _211_採択_公開設定中_ = '211_採択(公開設定中)',
  _212_採択_公開待ち_ = '212_採択(公開待ち)',
  _213_採択_公開済み_ = '213_採択(公開済み)',
  _400_不採択 = '400_不採択',
  _500_非エントリー = '500_非エントリー',
}

export class Entry extends Entity {

  @Title({name: 'タイトル'})
  title: string;

  @Formula({name: '表示名'})
  displayName: string;

  @Status({name: 'ステータス'})
  status: EntryStatus;

  @Relation({name: '一次選考'})
  firstEntryIds: string[];

  @Relation({name: '二次選考'})
  secondEntryIds: string[];

  @Formula({name: '受付連絡メッセージ(Twitter)'})
  firstSelectionStartMessage: string;

  @Formula({name: '一次選考通過メッセージ(Twitter)'})
  firstSelectionPassMessage: string;

  @Formula({name: '二次選考受付連絡メッセージ(Twitter)'})
  secondSelectionReceptionMessage: string;

  @Formula({name: '二次選考通過メッセージ(Twitter)'})
  secondSelectionPassMessage: string;

  @Formula({name: '口座情報受付連絡メッセージ(Twitter)'})
  bankAccountReceptionMessage: string;

  @Formula({name: '振込依頼メッセージ'})
  振込依頼メッセージ: string;

  @Formula({name: '送金後メッセージ'})
  postTransferMessage: string;

  @Formula({name: '一次選考開始文(Discord)'})
  discordFirstSelectionStartMessage: string;

  @Formula({name: '二次選考開始文(Discord)'})
  discordSecondSelectionStartMessage: string;
  
  @RichText({name: 'discordFirstSelectionChannelId'})
  discordFirstSelectionChannelId: string;

  @RichText({name: 'discordFirstSelectionMessageId'})
  discordFirstSelectionMessageId: string;

  @RichText({name: 'discordSecondSelectionChannelId'})
  discordSecondSelectionChannelId: string;

  @RichText({name: 'discordSecondSelectionMessageId'})
  discordSecondSelectionMessageId: string;

  @Relation({name: '奨学金'})
  scholarshipIds: string[];

  get scholarshipId(): string | null {
    return this.scholarshipIds?.[0] ?? null;
  }

  scholarship?: Scholarship;

  @Rollup({name: 'tweetId'})
  tweetIds: string[];

  get tweetId(): string {
    return this.tweetIds?.[0];
  }

  @Rollup({name: 'twitterId'})
  twitterIds: string[];

  get twitterId(): string | null {
    return this.twitterIds?.[0] ?? null;
  }

  @Rollup({name: 'twitterScreenName'})
  twitterScreenNames: string[];

  get twitterScreenName(): string | null {
    return this.twitterScreenNames?.[0] ?? null;
  }

  @Relation({name: '口座'})
  bankAccountIds: string[];

  @CreatedTime({name: '作成日時'})
  createdAt: any;

  get hasDiscordFirstSelection(): boolean {
    return !!this.discordFirstSelectionChannelId?.length && !!this.discordFirstSelectionMessageId?.length;
  }

  get hasDiscordSecondSelection(): boolean {
    return !!this.discordSecondSelectionChannelId && !!this.discordSecondSelectionMessageId;
  }

  get discordFirstSelectionUrl(): string {
    const BASE_URL = `https://discord.com/channels`;
    const channelId = this.discordFirstSelectionChannelId;
    const messageId = this.discordFirstSelectionMessageId;
    return `${BASE_URL}/634963224013438977/${channelId}/${messageId}`;
  }

  get discordSecondSelectionUrl(): string {
    const BASE_URL = `https://discord.com/channels`;
    const channelId = this.discordSecondSelectionChannelId;
    const messageId = this.discordSecondSelectionMessageId;
    return `${BASE_URL}/634963224013438977/${channelId}/${messageId}`;
  }

  get isEntry(): boolean {
    return ![
      EntryStatus._500_非エントリー
    ].includes(this.status);
  }

  get isPassedFirstSelection(): boolean {
    return [
      EntryStatus._203_一次選考通過連絡中,
      EntryStatus._204_二次選考応募待ち,
      EntryStatus._205_二次選考受付連絡中,
      EntryStatus._206_二次選考中,
      EntryStatus._207_二次選考通過連絡中,
      EntryStatus._208_採択_口座情報登録待ち_,
      EntryStatus._209_口座情報受付連絡中,
      EntryStatus._210_採択_入金中_,
      EntryStatus._212_採択_公開待ち_,
      EntryStatus._213_採択_公開済み_,
    ].includes(this.status);
  }

  get isWorkInSecondSelection() {
    return [
      EntryStatus._204_二次選考応募待ち,
      EntryStatus._205_二次選考受付連絡中,
      EntryStatus._206_二次選考中,
    ].includes(this.status);
  }

  get isPassedSecondSelection(): boolean {
    return [
      EntryStatus._207_二次選考通過連絡中,
      EntryStatus._208_採択_口座情報登録待ち_,
      EntryStatus._209_口座情報受付連絡中,
      EntryStatus._210_採択_入金中_,
      EntryStatus._212_採択_公開待ち_,
      EntryStatus._213_採択_公開済み_,
    ].includes(this.status);
  }

  get isInFirstSelecting(): boolean {
    return !!(this.discordFirstSelectionChannelId && this.discordFirstSelectionMessageId)
  }
}
