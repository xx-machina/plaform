import { SecondEntry } from '@x-lt/common/domain/models/notion';
import { Inject, Injectable, InjectionToken } from '@nx-ddd/core/di';
import { createConverter, NotionConverter, NotionRepository, NOTION_ACCESS_TOKEN } from '@nx-ddd/notion';
import { Query } from '@nx-ddd/notion/query';
import dayjs from 'dayjs';

const { Filter } = Query(SecondEntry);

export const SECOND_ENTRY_DATABASE_ID = new InjectionToken<string>('[@x-lt/common] Second Entry Database Id');

@Injectable({providedIn: 'root'})
export class SecondEntryRepository extends NotionRepository<SecondEntry> {

  constructor(
    @Inject(NOTION_ACCESS_TOKEN) token: string,
    @Inject(SECOND_ENTRY_DATABASE_ID) protected databaseId: string,
  ) { super(token); }

  protected converter: NotionConverter<SecondEntry>  = createConverter(SecondEntry);

  async listByEditedAtAfter(datetime: dayjs.Dayjs): Promise<SecondEntry[]> {
    return this.query(Filter('last_edited_time', '>', datetime.format()));
  }
}
