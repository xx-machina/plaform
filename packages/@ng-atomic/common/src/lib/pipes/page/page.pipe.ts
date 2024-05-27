import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '@ng-atomic/common/models';

export function defaultPageTransformer<T>(items: T[], {pageIndex = 0, pageSize = 100}: Partial<Page> = {}): T[] {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
}

export function injectPageTransformer<T>() {
  return defaultPageTransformer;
}

@Pipe({name: 'page', standalone: true, pure: true})
export class PagePipe<T> implements PipeTransform {
  protected transformer = injectPageTransformer<T>();

  transform(items: T[], params: Partial<Page> = {}): T[] {
    return this.transformer(items, params);
  }
}
