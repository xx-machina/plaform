
import { Injectable, PLATFORM_ID, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { RouterService } from '@ng-atomic/common/services/router';
import { Breakpoint, BreakpointService } from '@ng-atomic/common/services/breakpoint';

export interface UIContext {
  breakpoint: Breakpoint;
  paths: any[];
}

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly breakpoint = inject(BreakpointService);
  readonly router = inject(RouterService);
  readonly platformId = inject(PLATFORM_ID);

  readonly paths$ = this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    map((event: NavigationStart) => event.url),
    startWith(isPlatformBrowser(this.platformId) ? window?.location?.pathname : ''),
    map(url => this.router.parseUrl(url)),
    map(urlTree => urlTree.root.children?.primary?.segments ?? []),
  );
  readonly paths = toSignal(this.paths$);

  readonly snapshot$ = this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    map(() => this.router.routerState.snapshot.root),
  );
  readonly snapshot = toSignal(this.snapshot$);

  readonly uiContext = computed(() => ({
    breakpoint: this.breakpoint.breakpoint(),
    paths: this.paths(),
  }));
}
