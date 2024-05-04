import { FirstEntry } from '@x-lt/common/domain/models/notion';
import { Inject, Injectable, InjectionToken } from '@nx-ddd/core/di';
import { createConverter, NotionConverter, NotionRepository, NOTION_ACCESS_TOKEN } from '@nx-ddd/notion';
import { Query } from '@nx-ddd/notion/query';
import dayjs from 'dayjs';

const { Filter, OrderBy } = Query(FirstEntry);

export const FIRST_ENTRY_DATABASE_ID = new InjectionToken<string>('[@x-lt/common] First Entry Database Id');

@Injectable({providedIn: 'root'})
export class FirstEntryRepository extends NotionRepository<FirstEntry> {

  constructor(
    @Inject(NOTION_ACCESS_TOKEN) token: string,
    @Inject(FIRST_ENTRY_DATABASE_ID) protected databaseId: string,
  ) { super(token); }
  
  protected converter: NotionConverter<FirstEntry> = createConverter(FirstEntry);

  async listByEditedAtAfter(datetime: dayjs.Dayjs): Promise<FirstEntry[]> {
    return this.query(Filter('last_edited_time', '>', datetime.format()));
  }

  async getLatestFirstEntry(): Promise<FirstEntry | null> {
    return (await this.query(OrderBy('tweetedAt', 'desc')))?.[0] ?? null;
  }
}
