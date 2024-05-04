import { BankAccount } from "@x-lt/common/domain/models/notion/bank-account";
import { Inject, Injectable, InjectionToken } from "@nx-ddd/core/di";
import { createConverter, NotionRepository, NOTION_ACCESS_TOKEN, Query } from "@nx-ddd/notion";
import dayjs from "dayjs";

const { Filter } = Query(BankAccount);

export const BANK_ACCOUNT_DATABASE_ID = new InjectionToken<string>('[@x-lt/common] Bank Account Database Id');


@Injectable({ providedIn: 'root' })
export class BankAccountRepository extends NotionRepository<BankAccount> {

  constructor(
    @Inject(NOTION_ACCESS_TOKEN) token: string,
    @Inject(BANK_ACCOUNT_DATABASE_ID) protected databaseId: string,
  ) { super(token); }

  protected converter = createConverter(BankAccount);

  listByEditedAtAfter(datetime: dayjs.Dayjs): Promise<BankAccount[]> {
    return this.query(Filter('last_edited_time', '>', datetime.format()));
  }
}
