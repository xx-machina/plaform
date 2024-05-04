import { NxModule } from "@nx-ddd/core";
import { FIRST_ENTRY_DATABASE_ID } from "./first-entry";
import { BANK_ACCOUNT_DATABASE_ID } from "./bank-account";
import { ENTRY_DATABASE_ID } from "./entry";
import { SCHOLARSHIP_DATABASE_ID } from "./scholarship";
import { SECOND_ENTRY_DATABASE_ID } from "./second-entry";
import { NOTION_ACCESS_TOKEN } from "@nx-ddd/notion";

export interface NotionRepositoryConfig {
  notionAccessToken: string;
  bankAccountDatabaseId: string;
  entryDatabaseId: string;
  firstEntryDatabaseId: string;
  scholarshipDatabaseId: string;
  secondEntryDatabaseId: string;
}

@NxModule({})
export class NotionModule {
  static forRoot(config: NotionRepositoryConfig) {
    return  {
      module: NotionModule,
      providers: [
        { provide: NOTION_ACCESS_TOKEN, useValue: config.notionAccessToken },
        { provide: BANK_ACCOUNT_DATABASE_ID, useValue: config.bankAccountDatabaseId },
        { provide: ENTRY_DATABASE_ID, useValue: config.entryDatabaseId },
        { provide: FIRST_ENTRY_DATABASE_ID, useValue: config.firstEntryDatabaseId },
        { provide: SCHOLARSHIP_DATABASE_ID, useValue: config.scholarshipDatabaseId },
        { provide: SECOND_ENTRY_DATABASE_ID, useValue:  config.secondEntryDatabaseId },
      ],
    }
  }
}
