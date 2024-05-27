import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, PLATFORM_ID, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart } from '@angular/router';
import { combineLatest, filter, map, startWith, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { RouterService } from '@ng-atomic/common/services/router';

export interface UIContext {
  breakpoint: Breakpoint;
  paths: any[];
}

export type Breakpoint = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' | 'handset' | 'tablet' | 'web';

@Injectable({ providedIn: 'root' })
export class BreakPointService {
  protected readonly breakpointObserver = inject(BreakpointObserver);
  readonly breakpointMap$ = combineLatest({
    xSmall: this.breakpointObserver.observe(Breakpoints.XSmall),
    small: this.breakpointObserver.observe(Breakpoints.Small),
    medium: this.breakpointObserver.observe(Breakpoints.Medium),
    large: this.breakpointObserver.observe(Breakpoints.Large),
    xLarge: this.breakpointObserver.observe(Breakpoints.XLarge),
    handset: this.breakpointObserver.observe(Breakpoints.Handset),
    tablet: this.breakpointObserver.observe(Breakpoints.Tablet),
    web: this.breakpointObserver.observe(Breakpoints.Web),
  });
  readonly breakpointMap = toSignal(this.breakpointMap$);
  readonly breakpoint = computed<Breakpoint>(() => {
    const map = this.breakpointMap();
    const test = {
      xSmall: map.xSmall.matches ?? this.breakpointObserver.isMatched(Breakpoints.XSmall),
      small: map.small.matches ?? this.breakpointObserver.isMatched(Breakpoints.Small),
      medium: map.medium.matches ?? this.breakpointObserver.isMatched(Breakpoints.Medium),
      large: map.large.matches ?? this.breakpointObserver.isMatched(Breakpoints.Large),
      xLarge: map.xLarge.matches ?? this.breakpointObserver.isMatched(Breakpoints.XLarge),
      handset: map.handset.matches ?? this.breakpointObserver.isMatched(Breakpoints.Handset),
      tablet: map.tablet.matches ?? this.breakpointObserver.isMatched(Breakpoints.Tablet),
      web: map.web.matches ?? this.breakpointObserver.isMatched(Breakpoints.Web),
    };

    if (test.xSmall) return 'xSmall';
    if (test.small) return 'small';
    if (test.medium) return 'medium';
    if (test.large) return 'large';
    if (test.xLarge) return 'xLarge';
    if (test.handset) return 'handset';
    if (test.tablet) return 'tablet';
    if (test.web) return 'web';
  });
}

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly breakpoint = inject(BreakPointService);
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
