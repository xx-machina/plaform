import { Pipe, PipeTransform } from '@angular/core';
import { Column, Sort } from '@ng-atomic/common/models';

@Pipe({name: 'sort', standalone: true, pure: true})
export class SortPipe implements PipeTransform {
  transform<T>(column: Column, sort: Sort): 'asc' | 'desc' | 'none' {
    return sort.key === column.name ? sort.order : 'none';
  }
}
