import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'keys',
  standalone: true,
  pure: true,
})
export class KeysPipe implements PipeTransform {
  transform(obj: { [id: string]: any }) {
    return Object.keys(obj);
  }
}
