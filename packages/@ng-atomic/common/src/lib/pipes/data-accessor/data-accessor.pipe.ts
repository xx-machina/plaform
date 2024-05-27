import { InjectionToken, Pipe, inject, PipeTransform } from "@angular/core";
import { get } from 'lodash-es';

export type DataAccessor<T> = (obj: T, key: string) => string;
export const DATA_ACCESSOR = new InjectionToken<DataAccessor<any>>('DATA_ACCESSOR');
export const defaultDataAccessor: DataAccessor<any> = (obj, key) => get(obj, key) ?? '';
export function provideDataAccessor<T>(useFactory: () => DataAccessor<T> = () => defaultDataAccessor) {
  return { provide: DATA_ACCESSOR, useFactory };
}

export function injectDataAccessor<T>(): DataAccessor<T> {
  return inject(DATA_ACCESSOR, {optional: true}) ?? defaultDataAccessor;
}

@Pipe({
  name: 'dataAccessor',
  pure: true,
  standalone: true,
})
export class DataAccessorPipe<T> implements PipeTransform {
  protected dataAccessor = inject(DATA_ACCESSOR, {optional: true}) ?? defaultDataAccessor;

  transform(data: T, key: string) {
    return this.dataAccessor(data, key);
  }
}

