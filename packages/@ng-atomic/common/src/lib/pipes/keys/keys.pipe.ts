import { Pipe } from "@angular/core";

@Pipe({
  name: 'keys',
  standalone: true,
  pure: true,
})
export class KeysPipe {
  transform(obj: { [id: string]: any }) {
    return Object.keys(obj);
  }
}
