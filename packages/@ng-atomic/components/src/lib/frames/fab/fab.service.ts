import { Injectable } from '@angular/core';
import { Action } from '@ng-atomic/core';

@Injectable({providedIn: 'root'})
export class FabService {
  private actionMap = new Map<string, Action[]>;
  private contexts: string[] = [];
  get actions(): Action[] {
    return this.actionMap.get(this.contexts.at(-1)) ?? [];
  }

  set(name, actions: Action[]) {
    return this.actionMap.set(name, actions);
  }

  push(name: string) {
    return this.contexts.push(name);
  }

  pop() {
    return this.contexts.pop();
  }
}
