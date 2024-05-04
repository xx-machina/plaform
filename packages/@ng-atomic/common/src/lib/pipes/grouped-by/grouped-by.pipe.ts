import { Pipe, inject } from "@angular/core";
import { DATA_ACCESSOR, defaultDataAccessor } from "@ng-atomic/common/pipes/data-accessor";

@Pipe({
  name: 'groupedBy',
  standalone: true,
  pure: true,
})
export class GroupedByPipe {
  private dataAccessor = inject(DATA_ACCESSOR) ?? defaultDataAccessor;

  transform<T>(items: T[], groupedBy: string): { [id: string]: T[] } {
    return (items ?? []).reduce((acc, item) => {
      const key = this.dataAccessor(item, groupedBy);
      acc[key] ??= [],
      acc[key].push(item);
      return acc;
    }, {} as { [id: string]: T[] });
  }
}
