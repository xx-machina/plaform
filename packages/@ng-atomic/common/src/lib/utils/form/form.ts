import { Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AbstractControl } from "@angular/forms";
import { Observable, map, merge, of, startWith } from "rxjs";
import { computedAsync } from "ngxtension/computed-async";
import { computeFake } from "@ng-atomic/core";

export function getValue$<T>(control: AbstractControl<T>): Observable<T> {
  return merge(of(control.value), control.valueChanges);
}

export function getValue<T>(control: AbstractControl<T>): Signal<T> {
  return toSignal(getValue$(control));
}

export function getRawValue$<T>(control: AbstractControl<T>): Observable<T> {
  return merge(of(control.getRawValue()), control.valueChanges.pipe(map(() => control.getRawValue())));
}

export function getRawValue<T>(control: AbstractControl<T>): Signal<T> {
  return toSignal(getRawValue$(control));
}

export function computedRawValue<T>(controlFactory: () => AbstractControl<T>): Signal<T> {
  return computedAsync(() => controlFactory().valueChanges.pipe(
    startWith(null),
    map(() => controlFactory().getRawValue()),
  ), { initialValue: computeFake(controlFactory()).getRawValue() });
}

export function getInvalid$<T>(control: AbstractControl<T>): Observable<boolean> {
  return control.statusChanges.pipe(
    startWith(null),
    map(() => control.invalid),
  );
}

export function getInvalid<T>(form: AbstractControl<T>): Signal<boolean> {
  return toSignal(getInvalid$(form));
}

