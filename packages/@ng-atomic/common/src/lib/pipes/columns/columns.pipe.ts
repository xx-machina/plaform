import { Pipe, PipeTransform } from '@angular/core';
import { Column } from '@ng-atomic/common/models';

@Pipe({name: 'columns', standalone: true, pure: true})
export class ColumnsPipe implements PipeTransform {
  transform<T>(columns: Column[]): Column[] {
    return columns.filter(item => item.visible).map((column, i) => ({
      ...column,
      name: ['checkbox', 'actions'].includes(column.type) ? `${column.name}_${i}` : column.name,
    }));
  }
}
