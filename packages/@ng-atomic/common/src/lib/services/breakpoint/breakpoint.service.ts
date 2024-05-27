import { computed, inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';

export type Breakpoint = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' | 'handset' | 'tablet' | 'web';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
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
