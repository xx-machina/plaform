import { Pipe } from "@angular/core";
import { resolveActions } from "@ng-atomic/core";

@Pipe({
  standalone: true,
  name: 'resolveActions',
  pure: true
})
export class ActionsPipe {
  transform(value: any, ...args: any[]): any {
    return resolveActions(value, ...args);
  }
}