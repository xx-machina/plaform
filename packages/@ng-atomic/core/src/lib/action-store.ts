import { EventEmitter, Injectable } from "@angular/core";
import { Action } from "./action";

@Injectable({providedIn: 'root'})
export class NgAtomicRootActionStore {
  readonly actions$ = new EventEmitter<Action>();

  constructor() {
    this.actions$.subscribe(action => this.log(action, 'root'));
  }

  dispatch(action: Action) {
    this.actions$.emit(action);
  }

  log(action: Action, scope: string = 'default') {
    console.debug(action, scope);
  }
}
