import { Injectable, Pipe, PipeTransform, inject } from '@angular/core';
import { QueryResolverService } from '@ng-atomic/common/services/query-resolver';

export function defaultQueryTransformer<T>(items: T[], query: string): T[] {
  return items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
}

export function injectQueryTransformer<T>() {
  const resolver = inject(QueryResolverService);
  return (items: T[], query: string) => resolver.resolve(items, query);
}

@Injectable({ providedIn: 'any' })
@Pipe({
  name: 'query',
  standalone: true,
  pure: true,
})
export class QueryPipe<T> implements PipeTransform {

  protected transformer = injectQueryTransformer<T>();

  transform(items: T[], query: string): T[] {
    return this.transformer(items, query);
  }

}
