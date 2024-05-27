import { InjectionToken, Pipe, PipeTransform, inject } from '@angular/core';
import { Sort } from '@ng-atomic/common/models';
import { DataAccessor, defaultDataAccessor, injectDataAccessor } from '@ng-atomic/common/pipes/data-accessor';
import { sortBy } from 'lodash-es';

export function sortByTransformer<T>(
  items: T[], 
  {key = '', order = 'asc'}: Partial<Sort> = {},
  dataAccessor: DataAccessor<T> = defaultDataAccessor
): T[] {
  const entries = (items ?? []).map(item => ({item, value: dataAccessor(item, key)}));  
  const sorted = (sortBy(entries, 'value') ?? []).map(({item}) => item);
  return order === 'asc' ? sorted : sorted.reverse();
}

export function sortByTransformerFactory<T>(dataAccessor: DataAccessor<T>) {
  return (items, params) => sortByTransformer(items, params, dataAccessor);
}

export const SMART_SORT_BY_TRANSFORMER = new InjectionToken<typeof sortByTransformer>('[@ng-atomic/common] Sort By Transformer');

export function injectSortByTransformer<T>(): typeof sortByTransformer<T> {
  const dataAccessor = injectDataAccessor<T>();
  return inject(SMART_SORT_BY_TRANSFORMER, {optional: true}) ?? sortByTransformerFactory(dataAccessor);
}

@Pipe({name: 'sortBy', standalone: true, pure: true})
export class SortByPipe<T> implements PipeTransform {
  protected transformer = injectSortByTransformer<T>();

  transform(items: T[], params: {key?: string, order?: 'asc' | 'desc'} = {}): T[] {
    return this.transformer(items, params);
  }
}
