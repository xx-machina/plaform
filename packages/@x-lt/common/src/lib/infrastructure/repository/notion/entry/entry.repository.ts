import { Entry, EntryStatus } from '@x-lt/common/domain/models/notion';
import { createConverter, NotionConverter, NotionRepository, NOTION_ACCESS_TOKEN } from '@nx-ddd/notion';
import { Query } from '@nx-ddd/notion/query';
import { Inject, Injectable, InjectionToken } from '@nx-ddd/core/di';
import dayjs from 'dayjs';

const { And, Filter, OrderBy } = Query(Entry);

export const ENTRY_DATABASE_ID = new InjectionToken<string>('[@x-lt/common] Entry Database Id');

@Injectable({providedIn: 'root'})
export class EntryRepository extends NotionRepository<Entry> {
  
  constructor(
    @Inject(NOTION_ACCESS_TOKEN) token: string,
    @Inject(ENTRY_DATABASE_ID) protected databaseId: string,
    ) { super(token); }

  protected converter: NotionConverter<Entry> = createConverter(Entry);
    
  listByEditedAtAfter(datetime: dayjs.Dayjs): Promise<Entry[]> {
    return this.query(Filter('last_edited_time', '>', datetime.format()));
  }

  listByTwitterId(twitterId: string): Promise<any> {
    return this.query(Filter('twitterId', '==', twitterId));
  }

  listByTwitterScreenName(screenName: string, scholarshipId: string): Promise<Entry[]> {
    return this.query(
      And(
        Filter('twitterScreenNames', 'in', screenName), 
        Filter('scholarshipIds', 'in', scholarshipId),
      ), 
      OrderBy('createdAt', 'desc')
    );
  }

  listByStatus(status: EntryStatus): Promise<Entry[]> {
    return this.query(Filter('status', '==', status));
  }
}