import { SelectionModel } from "@angular/cdk/collections";
import { Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable, map, startWith } from "rxjs";

export function getSelected$<T>(selection: SelectionModel<T>): Observable<T[]> {
  return selection.changed.pipe(
    startWith(null),
    map(() => selection.selected),
  );
}

export function getSelected<T>(selection: SelectionModel<T>): Signal<T[]> {
  return toSignal(getSelected$(selection));
}
