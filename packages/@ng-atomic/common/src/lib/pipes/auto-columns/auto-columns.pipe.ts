import { Pipe, PipeTransform } from '@angular/core';
import { flattenExcludeDayjs } from '@nx-ddd/core/util/walk-obj';

@Pipe({name: 'autoColumns', standalone: true, pure: true})
export class AutoColumnsPipe<T> implements PipeTransform {
  transform(items: T[]): string[] {
    const keys = new Set<string>();
    items.slice(0, 1).forEach(item => {
      const obj = flattenExcludeDayjs(item);
      Object.keys(obj).forEach(key => keys.add(key));
    })
    return [...keys, '__actions'];
  }
}