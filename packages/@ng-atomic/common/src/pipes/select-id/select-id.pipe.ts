import { Inject, InjectionToken, Pipe } from "@angular/core";

export type SelectId = (entity: object) => string | number;
export const SELECT_ID = new InjectionToken<SelectId>('[@ng-atomic/common] Select Id');
export const defaultSelectId: SelectId = (entity: any) => entity.Id;

@Pipe({
  name: 'selectId',
  pure: true,
  standalone: true,
})
export class SelectIdPipe {
  constructor(
    @Inject(SELECT_ID) protected selectId: SelectId
  ) {}

  transform(entity: any): string | number {
    return this.selectId(entity);
  }
}
