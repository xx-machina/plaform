import { ElementRef, Injectable, inject } from '@angular/core';
import { Action, NgAtomicRootActionStore } from '@ng-atomic/core';
import { fromEvent, map } from 'rxjs';

export function getWindow(ref: ElementRef<HTMLIFrameElement>): Window {
  return ref.nativeElement.contentWindow;
}

@Injectable({providedIn: 'root'})
export class MessageService<T> {
  protected actionStore = inject(NgAtomicRootActionStore);
  protected message$ = fromEvent<MessageEvent<T>>(window, 'message').pipe(
    map(event => event.data),
  );

  constructor() {
    this.message$.subscribe(message => this.onMessage(message));
  }

  protected onMessage(message: T) {
    if (typeof message['id'] !== 'string') return;
    // if ($event.origin !== 'http://expected-origin') {
    //   return;
    // }
    this.actionStore.dispatch(message as Action);
  }

  postMessage(window_: Window, message: object, targetOrigin = 'http://localhost:4201') {
    window_.postMessage(message, targetOrigin);
  }

  postAction(window_: Window, action: Action) {
    this.postMessage(window_, action);
  }

  postActionV2(target: {origin: string, window: Window}, action: Action) {
    this.postMessage(target.window, action, target.origin);
  }
}
