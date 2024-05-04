import { Pipe, PipeTransform } from '@angular/core';
import { yenTransform } from '@ng-atomic/common/utils';

@Pipe({
  standalone: true,
  name: 'yen'
})
export class YenPipe implements PipeTransform {

  transform(value?: number | null, _unit?: string): string {
    if (value === null || typeof value === 'undefined') return '';
    return yenTransform(value, _unit);
  }

}
