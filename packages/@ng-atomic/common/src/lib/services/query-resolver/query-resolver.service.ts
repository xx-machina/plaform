import { Inject, Injectable, Optional } from "@angular/core";
import { DOMAIN_LANG_MAP } from "@ng-atomic/common/pipes/domain";
import { filterByQuery, SmartExpTransformer, smartExpTransformer, SMART_EXP_TRANSFORMER } from '@ng-atomic/common/utils';


@Injectable({ providedIn: 'any' })
export class QueryResolverService {
  constructor(
    @Optional() @Inject(SMART_EXP_TRANSFORMER) private transformer?: SmartExpTransformer,
    @Optional() @Inject(DOMAIN_LANG_MAP) private map?: Record<string, string>,
  ) {
    this.transformer ??= smartExpTransformer;
    this.map ??= {};
  }

  resolve<T>(items: T[], query: string, map: Record<string, string> = this.map): T[] {
    const filtered = filterByQuery(items, query, map, this.transformer);
    return filtered;
  }
}