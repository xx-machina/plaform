import { NotionBaseQuery } from "../query";

export class NotionQueryBuilder {
  constructor() { }

  build(filterQuery?: NotionBaseQuery, sortQuery?: NotionBaseQuery) {
    return {
      ...(filterQuery ? this.buildFilterQuery(filterQuery) : {}),
      ...(sortQuery ? this.buildSortQuery(sortQuery) : {}),
    }
  }

  protected buildSortQuery(query: NotionBaseQuery) {
    if (query.type === 'sort') {
      return { sorts: [query.build()]};
    } else {
      return {};
    }
  }

  protected buildFilterQuery(query: NotionBaseQuery) {
    if (query.type === 'filter') {
      return { filter: { and: [query.build()] } };
    } else if (['and', 'or'].includes(query.type)) {
      return { filter: query.build() };
    } else {
      return {};
    }
  }
}
