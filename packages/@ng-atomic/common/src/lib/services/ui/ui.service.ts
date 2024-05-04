import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NestedGetType, PathKeys, get } from '@ng-atomic/common/utils';
import { Observable, combineLatest, distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs';

export interface UIConfig {
  root: {
   properties: {
    '--page-width-lv1': string,
    '--page-width-lv2': string,
    '--page-width-lv3': string,
    '--menu-width': string,
   },
  },
  frames: {
    sideNav: {
      frameType: 'lineup' | 'drawer',
      menuType: 'icon-button-menu' | 'menu',
    },
    router: {
      type: 'lineup' | 'overlay',
    },
  }
  templates: {
    index: {
      type: 'list' | 'table';
      width: string;
    };
    crud: {
      type: 'form' | 'table';
      width: string;
    };
    menu: {
      type: 'list' | 'table';
      width: string;
    };
  }
}
type Breakpoint = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' | 'handset' | 'tablet' | 'web';

function resolveUiConfig(
  breakpoint: Breakpoint,
): UIConfig {
  switch (breakpoint) {
    case 'xSmall':
      return {
        root: {
          properties: {
            '--menu-width': '220px',  
            '--page-width-lv1': '100vw',
            '--page-width-lv2': '100vw',
            '--page-width-lv3': '100vw',
          },
         },
        frames: {
          sideNav: {
            frameType: 'drawer',
            menuType: 'menu',
          },
          router: {
            type: 'overlay',
          },
        },
        templates: {
          index: {
            type: 'list',
            width: 'var(--page-width-lv1)',
          },
          crud: {
            type: 'form',
            width: 'var(--page-width-lv1)',
          },
          menu: {
            type: 'list',
            width: '220px',
          },
        },
      };
    case 'small':
    case 'medium':
      return {
        root: {
          properties: {
            '--menu-width': '64px',
            '--page-width-lv1': '360px',
            '--page-width-lv2': 'max(calc(min(100vw, 1440px) - 360px - 64px), 360px)',
            '--page-width-lv3': 'max(calc(min(100vw, 1440px) - 64px), 360px)',
          },
         },
        frames: {
          sideNav: {
            frameType: 'lineup',
            menuType: 'icon-button-menu',
          },
          router: {
            type: 'lineup',
          },
        },
        templates: {
          index: {
            type: 'table',
            width: 'var(--page-width-lv2)',
          },
          crud: {
            type: 'form',
            width: 'var(--page-width-lv1)',
          },
          menu: {
            type: 'list',
            width: '220px',
          },
        },
      };
    case 'large': 
    case 'xLarge':
    return {
      root: {
        properties: {
          '--menu-width': '220px',
          '--page-width-lv1': '360px',
          '--page-width-lv2': 'max(calc(min(100vw, 1440px) - 360px - 220px), 360px)',
          '--page-width-lv3': 'max(calc(min(100vw, 1440px) - 220px), 360px)',
        },
       },
      frames: {
        sideNav: {
          frameType: 'lineup',
          menuType: 'menu',
        },
        router: {
          type: 'lineup',
        },
      },
      templates: {
        index: {
          type: 'table',
          width: 'var(--page-width-lv2)',
        },
        crud: {
          type: 'form',
          width: 'var(--page-width-lv1)',
        },
        menu: {
          type: 'list',
          width: '220px',
        },
      },
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class UiService {

  protected readonly breakpointObserver = inject(BreakpointObserver);
  private readonly breakpoint$: Observable<Breakpoint> = combineLatest({
    xSmall: this.breakpointObserver.observe(Breakpoints.XSmall),
    small: this.breakpointObserver.observe(Breakpoints.Small),
    medium: this.breakpointObserver.observe(Breakpoints.Medium),
    large: this.breakpointObserver.observe(Breakpoints.Large),
    xLarge: this.breakpointObserver.observe(Breakpoints.XLarge),
    handset: this.breakpointObserver.observe(Breakpoints.Handset),
    tablet: this.breakpointObserver.observe(Breakpoints.Tablet),
    web: this.breakpointObserver.observe(Breakpoints.Web),
  }).pipe(
    map((results) => ({
      xSmall: results.xSmall.matches,
      small: results.small.matches,
      medium: results.medium.matches,
      large: results.large.matches,
      xLarge: results.xLarge.matches,
      handset: results.handset.matches,
      tablet: results.tablet.matches,
      web: results.web.matches,
    })),
    startWith({
      xSmall: this.breakpointObserver.isMatched(Breakpoints.XSmall),
      small: this.breakpointObserver.isMatched(Breakpoints.Small),
      medium: this.breakpointObserver.isMatched(Breakpoints.Medium),
      large: this.breakpointObserver.isMatched(Breakpoints.Large),
      xLarge: this.breakpointObserver.isMatched(Breakpoints.XLarge),
      handset: this.breakpointObserver.isMatched(Breakpoints.Handset),
      tablet: this.breakpointObserver.isMatched(Breakpoints.Tablet),
      web: this.breakpointObserver.isMatched(Breakpoints.Web),
    }),
    map((results) => {
      if (results.xSmall) return 'xSmall';
      if (results.small) return 'small';
      if (results.medium) return 'medium';
      if (results.large) return 'large';
      if (results.xLarge) return 'xLarge';
      if (results.handset) return 'handset';
      if (results.tablet) return 'tablet';
      if (results.web) return 'web';
    }),
  );

  readonly ui$: Observable<UIConfig> = this.breakpoint$.pipe(
    map((breakpoint) => resolveUiConfig(breakpoint)),
    filter((ui) => !!ui),
    distinctUntilChanged(),
    shareReplay(1),
  );
  readonly ui = toSignal(this.ui$);

  mapTo(path: string) {
    return this.ui$.pipe(map((ui) => get(ui, path as any)));
  }

  /**@deprecated */
  getSignal<P extends (keyof any)[], T = UIConfig>(path: [...P]): Signal<NestedGetType<T, P>> {
    return computed(() => get(this.ui(), path as any) as any);
  }

  get$<T, P extends PathKeys<T>>(path: P): Observable<NestedGetType<T, P>> {
    return this.ui$.pipe(map((ui) => get<T, P>(ui as T, path)));
  }

  get<T, P extends PathKeys<T>>(path: P): Signal<NestedGetType<T, P>> {
    return computed(() => get<T, P>(this.ui() as T, path));
  }
 
  constructor() {
    this.ui$.subscribe((ui) => {
      for (const [key, value] of Object.entries(ui.root.properties)) {
        document.documentElement.style.setProperty(key, value);
      }
    })
  }
}

export function injectUiConfig$<T extends UIConfig, P extends PathKeys<T>>(path: P): Observable<NestedGetType<T, P>> {
  return inject(UiService).get$(path);
}

export function injectUiConfig<T extends UIConfig, P extends PathKeys<T>>(path: P): Signal<NestedGetType<T, P>> {
  return inject(UiService).get(path);
}
