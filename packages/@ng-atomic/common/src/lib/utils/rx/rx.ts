import { AbstractControl } from "@angular/forms";
import { startWith } from "rxjs";

export function startWithValueChanges(form: AbstractControl) {
  return form.valueChanges.pipe(startWith(() => form.value));
}
