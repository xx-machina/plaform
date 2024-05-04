import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface SortFormValue {
  key?: string,
  order?: 'asc' | 'desc',
}

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor(private fb: FormBuilder) { }

  build({key= null, order = 'asc'}: Partial<SortFormValue> = {}) {
    return this.fb.group({
      key: [key],
      order: [order as 'asc' | 'desc'],
    });
  }

  toggle(form: ReturnType<typeof this.build>, name: string) {
    if (form.get('key').value === name) {
      form.get('order').setValue(form.get('order').value === 'asc' ? 'desc' : 'asc');
    } else {
      form.get('order').setValue('asc');
      form.get('key').setValue(name);
    }
  }
}
