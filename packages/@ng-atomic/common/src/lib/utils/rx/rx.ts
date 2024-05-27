import { toSignal } from "@angular/core/rxjs-interop";
import { AbstractControl } from "@angular/forms";
import { map, startWith } from "rxjs";

export function startWithValueChanges(form: AbstractControl) {
  return form.valueChanges.pipe(startWith(form.value));
}

export function startWithRawValueChanges$(form: AbstractControl) {
  return form.valueChanges.pipe(startWith(null)).pipe(
    map(() => form.getRawValue()),
  );
}

export function startWithValueChanges$(form: AbstractControl) {
  return form.valueChanges.pipe(startWith(() => form.value));
}

export function startWithRawValueChanges(form: AbstractControl) {
  return toSignal(startWithRawValueChanges$(form));
}
