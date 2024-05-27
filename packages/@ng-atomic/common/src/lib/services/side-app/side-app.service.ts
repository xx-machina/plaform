import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideAppService {
  readonly opened = signal(false);

  toggle() {
    this.opened.set(!this.opened());
  }

  collapse() {
    this.opened.set(false);
  }

  expand() {
    this.opened.set(true);
  }
}
