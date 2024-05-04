import { Client } from '@notionhq/client';
import { Entity } from '@nx-ddd/common/domain/models';
import { Repository } from '@nx-ddd/common/domain/repository';
import { Inject, Injectable, InjectionToken } from '@nx-ddd/core/di';
import { NotionConverter } from '../converter';
import { NotionBaseQuery } from '../query';
import { NotionQueryBuilder } from '../query-builder';

export const NOTION_ACCESS_TOKEN = new InjectionToken('[@nx-ddd/notion] Notion Access Token');
export const NOTION_DATABASE_ID = new InjectionToken('[@nx-ddd/notion] Notion Database Id');

@Injectable()
export abstract class NotionRepository<E extends Entity> extends Repository<E> {
  protected abstract databaseId: string;
  protected abstract converter: NotionConverter<E>;

  protected client = new Client({auth: this.token});
  protected queryBuilder = new NotionQueryBuilder();
  protected get parent(): {type: 'database_id', database_id: string} {
    return { type: 'database_id', database_id: this.databaseId };
  }
  
  constructor(@Inject(NOTION_ACCESS_TOKEN) protected token: string) {
    super();
  }

  protected async query(
    filterQuery?: NotionBaseQuery, 
    sortQuery?: NotionBaseQuery,
  ) {
    try {
      const obj = this.queryBuilder.build(filterQuery, sortQuery);
      const {results} = await this.client.databases.query({
        database_id: this.databaseId, ...obj,
      });
      return results.map(result => this.converter.fromRecord(result));
    } catch (error) {
      throw error;
    }
  }

  async list(): Promise<E[]> {
    return this.query();
  }

  async get({id}: {id: string}): Promise<E> {
    const data = await this.client.pages.retrieve({page_id: id});
    return this.converter.fromRecord(data);
  }

  async create(entity: Partial<E>) {
    try {

      const res = await this.client.pages.create({
        parent: this.parent,
        properties: {...this.converter.toRecord(entity)},
      }); 
      return this.converter.fromRecord(res);
    } catch (error) {
      throw error;
    }
  }

  async update(entity: Partial<E>) {
    const data = {
      page_id: (entity as any).id,
      properties: {...this.converter.toRecord(entity)},
    };
    await this.client.pages.update(data);
  }

  async delete({id}: {id: string}) {
    throw new Error('NotionRepository.delete() is not implemented');
  }
}
