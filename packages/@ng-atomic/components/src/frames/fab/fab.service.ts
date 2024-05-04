import { Injectable } from '@angular/core';
import { Action } from '@ng-atomic/common/models';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FabService {
  private _actions: Action[] = [];
  private actionSubject = new Subject<Action>();

  get actions(): Action[] {
    return this._actions;
  }

  action$ = this.actionSubject.asObservable();

  onAction(action: Action) {
    this.actionSubject.next(action);
  }

  setActions(actions: Action[]) {
    this._actions = actions;
  }
}