import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash-es';

@Pipe({name: 'map', standalone: true, pure: true})
export class MapPipe<T> implements PipeTransform {
  transform(itemOrItems: T | T[], path: string): any | any[] {
    if (Array.isArray(itemOrItems)) return itemOrItems.map(item => get(item, path));
    return get(itemOrItems, path);
  }
}