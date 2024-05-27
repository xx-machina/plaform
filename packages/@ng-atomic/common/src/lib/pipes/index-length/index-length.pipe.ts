import { Pipe, PipeTransform } from '@angular/core';
import { Index } from '@ng-atomic/common/models';
import { injectQueryTransformer } from '@ng-atomic/common/pipes/query';
import { injectSortByTransformer } from '@ng-atomic/common/pipes/sort-by';

@Pipe({name: 'indexLength', standalone: true, pure: true})
export class IndexLengthPipe<T> implements PipeTransform {
  protected query = injectQueryTransformer<T>();
  protected sortBy = injectSortByTransformer<T>();

  transform(items: T[], prams: Partial<Index>): number {
    items = this.query(items, prams?.query ?? '');
    items = this.sortBy(items, prams?.sort);
    return items.length;
  }
}
