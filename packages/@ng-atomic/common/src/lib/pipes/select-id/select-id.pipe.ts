import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from "@angular/core";

export type SelectId = (entity: object) => string | number;
export const SELECT_ID = new InjectionToken<SelectId>('[@ng-atomic/common] Select Id');
export const defaultSelectId: SelectId = (entity: any) => entity.id;

@Pipe({
  name: 'selectId',
  pure: true,
  standalone: true,
})
export class SelectIdPipe implements PipeTransform {
  constructor(
    @Optional() @Inject(SELECT_ID) protected selectId: SelectId
  ) {
    this.selectId ??= defaultSelectId;
  }

  transform(entity: any): string | number {
    return this.selectId(entity);
  }
}
