import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comma',
  standalone: true,
  pure: true,
})
export class CommaPipe implements PipeTransform {
  transform(value: number): unknown {
    return value.toLocaleString();
  }
}
