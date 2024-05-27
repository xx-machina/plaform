import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SideNavModeService {
  readonly sideNavMode = signal('collapsed');

  /** @deprecated use toggle() instead */
  toggleSideNav() {
    this.sideNavMode.set(this.sideNavMode() === 'expanded' ? 'collapsed' : 'expanded');
  }

  toggle() {
    this.sideNavMode.set(this.sideNavMode() === 'expanded' ? 'collapsed' : 'expanded');
  }

  collapse() {
    this.sideNavMode.set('collapsed');
  }

  expand() {
    this.sideNavMode.set('expanded');
  }
}
