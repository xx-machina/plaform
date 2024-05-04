import { Entity } from '@nx-ddd/common/domain/models';
import { Url, Relation, RichText, Title, Date } from '@nx-ddd/notion/decorators';
import dayjs from 'dayjs';

export class FirstEntry extends Entity {
  @Title({name: 'タイトル'})
  title: string;

  @Url({name: 'tweetURL'})
  tweetURL: string;

  @RichText({name: 'tweetId'})
  tweetId: string;

  @RichText({name: 'authorId'})
  authorId: string;

  @RichText({name: 'userName'})
  userName: string;

  @RichText({name: 'name'})
  name: string;

  @Relation({name:'応募'})
  entryIds: string[];

  @Relation({name: 'scholarshipIds'})
  scholarshipIds: string[];

  get entryId(): string | null {
    return this.entryIds?.[0] ?? null;
  }

  get scholarshipId(): string | null {
    return this.scholarshipIds?.[0] ?? null;
  }

  @Date({name: 'tweetedAt'})
  tweetedAt: dayjs.Dayjs;
}
