import { Entity } from '@nx-ddd/common/domain/models';
import { Url, Relation, RichText, Title, Date } from '@nx-ddd/notion/decorators';
import dayjs from 'dayjs';

export class FirstEntry extends Entity {
  @Title('タイトル')
  title: string;

  @Url('tweetURL')
  tweetURL: string;

  @RichText('tweetId')
  tweetId: string;

  @RichText('authorId')
  authorId: string;

  @RichText('userName')
  userName: string;

  @RichText('name')
  name: string;

  @Relation('応募')
  entryId: string;

  @Relation('scholarshipId')
  scholarshipId: string;

  @Date('tweetedAt')
  tweetedAt: dayjs.Dayjs;
}
