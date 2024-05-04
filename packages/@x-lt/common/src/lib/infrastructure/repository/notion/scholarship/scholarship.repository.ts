import { Scholarship } from "@x-lt/common/domain/models/notion";
import { Inject, Injectable, InjectionToken } from "@nx-ddd/core/di";
import { createConverter, NotionConverter } from "@nx-ddd/notion/converter";
import { NotionRepository, NOTION_ACCESS_TOKEN } from "@nx-ddd/notion/repository";

export class ScholarshipConverter extends NotionConverter<Scholarship> {
  protected Entity = Scholarship;
}

export const SCHOLARSHIP_DATABASE_ID = new InjectionToken<string>('[@x-lt/common] Scholarship Database Id');

@Injectable({providedIn: 'root'})
export class ScholarshipRepository extends NotionRepository<Scholarship> {

  constructor(
    @Inject(NOTION_ACCESS_TOKEN) token: string,
    @Inject(SCHOLARSHIP_DATABASE_ID) protected databaseId: string,
  ) { super(token); }

  protected converter: NotionConverter<Scholarship> = createConverter(Scholarship);
  
}