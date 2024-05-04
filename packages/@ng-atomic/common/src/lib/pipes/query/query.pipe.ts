import { Injectable, Pipe, PipeTransform, inject } from '@angular/core';
import { QueryResolverService } from '@ng-atomic/common/services/query-resolver';

@Injectable({ providedIn: 'any' })
@Pipe({
  name: 'query',
  standalone: true,
  pure: true,
})
export class QueryPipe<E> implements PipeTransform {

  protected resolver = inject(QueryResolverService);

  transform(items: E[], query: string): E[] {
    return this.resolver.resolve(items, query);
  }

}
