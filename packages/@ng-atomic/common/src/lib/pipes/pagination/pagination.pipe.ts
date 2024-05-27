import { Inject, Injectable, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';
import { sortByTransformer } from '@ng-atomic/common/pipes/sort-by';

interface Page {
  start: number;
  end: number;
  key: string;
  order: 'asc' | 'desc';
}

export const PAGINATION_TRANSFORMER = new InjectionToken('[@ng-atomic/pipes] Pagination Transformer');
export type PaginationTransformer<E> = (items: E[], page: Page) => E[];
export function paginationTransformer<E>(items: E[], page: Page): E[] {
  return sortByTransformer(items, page).slice(page.start, page.end) as E[];
}

@Injectable({ providedIn: 'root' })
@Pipe({standalone: true, name: 'pagination', pure: true})
export class PaginationPipe<E> implements PipeTransform {

  constructor(
    @Optional()
    @Inject(PAGINATION_TRANSFORMER)
    private transformer: PaginationTransformer<E>,
  ) {
    this.transformer ??= paginationTransformer;
  }

  transform(items: E[], {
    sortKey = null, 
    sortOrder = 'asc',
    start = 0,
    end = 0
  }: {sortKey?: string, sortOrder?: 'asc' | 'desc', start?: number, end?: number} = {}) {
    return this.transformer(items, { key: sortKey, order: sortOrder, start, end });
  }
}
