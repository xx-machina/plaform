import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';
import { smartSortByTransformer } from '@ng-atomic/common/pipes/smart-sort-by';

interface Page {
  start: number;
  end: number;
  key: string;
  order: 'asc' | 'desc';
}

export const PAGINATION_TRANSFORMER = new InjectionToken('[@ng-atomic/pipes] Pagination Transformer');
export type PaginationTransformer<E> = (items: E[], page: Page) => E[];
export function paginationTransformer<E>(items: E[], page: Page): E[] {
  return smartSortByTransformer(items, page.key, page.order).slice(page.start, page.end);
}

@Pipe({
  standalone: true,
  name: 'pagination',
  pure: true,
})
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
