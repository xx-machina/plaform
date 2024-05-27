import { Pipe, PipeTransform } from '@angular/core';
import { Index } from '@ng-atomic/common/models';
import { injectSortByTransformer } from '@ng-atomic/common/pipes/sort-by';
import { injectQueryTransformer } from '@ng-atomic/common/pipes/query';
import { injectPageTransformer } from '@ng-atomic/common/pipes/page';

@Pipe({
  name: 'index',
  standalone: true,
  pure: true,
})
export class IndexPipe<T> implements PipeTransform {
  protected query = injectQueryTransformer<T>();
  protected sortBy = injectSortByTransformer<T>();
  protected page = injectPageTransformer<T>();

  transform(items: T[], params: Partial<Index>): T[] {
    items = this.query(items, params?.query ?? '');
    items = this.sortBy(items, params?.sort);
    items = this.page(items, params?.page);
    return items;
  }
}
