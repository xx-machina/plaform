import { Injectable, inject } from "@angular/core";
import { DOMAIN_LANG_MAP } from "@ng-atomic/common/pipes/domain";
import { toObject } from '@ng-atomic/common/utils';
import { smartExpTransformer, SMART_EXP_TRANSFORMER } from '@ng-atomic/common/utils';
import { flattenExcludeDayjs as flatten } from '@nx-ddd/core/util/walk-obj';
import dayjs from 'dayjs';
import { DATA_ACCESSOR, defaultDataAccessor } from "@ng-atomic/common/pipes/data-accessor";

interface Query {
  key: string;
  operator: ':' | '>' | '<' | '=';
  value: string;
  not: boolean;
}

@Injectable({ providedIn: 'any' })
export class QueryParserService {
  parse(query: string): Query[] {
    return query.split(' ').filter(q => q.length).map(str => {
      const not = str.startsWith('-');
      if (not) str = str.slice(1);

      for (const operator of ['=', '>', '<', ':'] as const) {
        if (str.includes(operator)) {
          const [key, value] = str.split(operator);
          return { key, operator, value, not };
        }
      }
      return { key: '*', operator: ':', value: str, not };
    });
  }
}

@Injectable({ providedIn: 'any' })
export class QueryResolverService<T extends object> {
  protected parser = inject(QueryParserService);
  protected dataAccessor = inject(DATA_ACCESSOR, {optional: true}) ?? defaultDataAccessor;
  protected transformer = inject(SMART_EXP_TRANSFORMER, {optional: true}) ?? smartExpTransformer;
  protected map = inject(DOMAIN_LANG_MAP, {optional: true}) ?? {};
  protected reversedMap = Object.entries(this.map).reduce((p, [k, v]) => ({...p, [v]: k}), {} as Record<string, string>);

  resolve(items: T[], queryStr: string = ''): T[] {
    return this.parser.parse(queryStr).reduce((_items, query) => this.executeQuery(_items, query), items);
  }

  protected executeQuery(items: T[], query: Query): T[] {
    if (query.key === '*' && query.operator === ':')
      return items.filter(item => this.operateByAllKey(item, in_, query));
    switch (query.operator) {
      case ':': return items.filter(item => this.operateByKey(item, in_, query));
      case '=': return items.filter(item => this.operateByKey(item, eq, query));
      case '>': return items.filter(item => this.operateByKey(item, gt, query));
      case '<': return items.filter(item => this.operateByKey(item, lt, query));
    }
  }

  protected operateByKey(item: T, operator: QueryOperator, {key, value, not}: Query): boolean {
    let itemValue: any;
    itemValue = this.dataAccessor(item, key);
    itemValue = this.transformer(itemValue, key);
    return not ? !operator(itemValue, value) : operator(itemValue, value);
  }

  protected operateByAllKey(item: T, operator: QueryOperator, query: Query) {
    const flattenObj = flatten(toObject(item));
    return Object.keys(flattenObj).some((key) => this.operateByKey(item, operator, {...query, key}));
  }
}

type QueryOperator = (_value: any, query: string) => boolean;

function in_(value: any, query: string): boolean {
  return typeof value === 'string' ? value?.includes(query) : false;
}

function eq(value: any, query: string): boolean {
  return typeof value === 'string' ? value === query : false;
}

function gt(value: any, query: string): boolean {
  // const value = dayjs.isDayjs(v) ? v : this.transformer(v, k);
  return typeof value === 'string' 
    ? parseFloat(value) > parseFloat(query) 
    : typeof value === 'number'
    ? value > parseFloat(query)
    : dayjs.isDayjs(value)
    ? dayjs(query).isBefore(value)
    : false;
}

function lt(value: any, query: string): boolean {
  // const value = dayjs.isDayjs(v) ? v : this.transformer(v, k);
  return typeof value === 'string' 
    ? parseFloat(value) < parseFloat(query) 
    : typeof value === 'number'
    ? value < parseFloat(query)
    : dayjs.isDayjs(value)
    ? dayjs(query).isAfter(value)
    : false;
}
