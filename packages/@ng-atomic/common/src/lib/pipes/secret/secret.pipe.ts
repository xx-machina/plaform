import { Pipe, PipeTransform, inject } from '@angular/core';
import { SecretService } from '@ng-atomic/common/services/secret';

@Pipe({
  name: 'secret',
  standalone: true
})
export class SecretPipe implements PipeTransform {
  private secret = inject(SecretService);

  transform(value: string) {
    return this.secret.isSecret() ? value.replace(/./g, '*') : value;
  }

}
