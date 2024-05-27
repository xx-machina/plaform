import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'resolveColumns', standalone: true, pure: true})
export class ResolveColumnsPipe implements PipeTransform {
  transform(columns: string[]): {type: 'key' | 'actions' | 'checkbox', name: string, payload?: any}[] {
    const data = columns.map((column, i) => {
      if (typeof column === 'string') {
        if (column === '__checkbox') return {type: 'checkbox', name: `__checkbox_${i}`};
        if (column === '__actions') return {type: 'actions', name: `__actions_${i}`};
        return {type: 'key', name: column};
      }
      return {type: 'actions', name: `__actions_${i}`, payload: column};
    });
    return data as any;
  }
}
