import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Directive, ENVIRONMENT_INITIALIZER, ElementRef, Injectable, PLATFORM_ID, Provider, effect, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { Observable, delay, filter, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RootPropertyService {
  static readonly Config = makeConfig(() => {
    return (_, context) => {
      switch (context.breakpoint) {
        case 'xSmall': return {
          '--primary-color': '#404040',
          '--on-primary-color': '#f0f0f0',
          '--surface-color': '#fff',
          '--on-surface-color': '#404040',
          '--background-color': '#fff',
          '--menu-width': '220px',
          '--page-width-lv1': '100vw',
          '--page-width-lv2': '100vw',
          '--page-width-lv3': '100vw',
          '--page-width-lv4': '100vw',
          '--page-height-lv1': '100vh',
        };
        case 'small':
        case 'medium': return {
          '--primary-color': '#404040',
          '--on-primary-color': '#f0f0f0',
          '--surface-color': '#fff',
          '--on-surface-color': '#404040',
          '--background-color': '#fff',
          '--menu-width': '64px',
          '--page-width-lv1': '360px',
          '--page-width-lv2': 'max(calc(min(100vw, 1600px) - 360px - 64px), 360px)',
          '--page-width-lv3': 'max(calc(min(100vw, 1600px) - 64px), 360px)',
          '--page-width-lv4': '100vw',
          '--page-height-lv1': '100vh',
        };
        case 'large':
        case 'xLarge': return {
          '--primary-color': '#404040',
          '--on-primary-color': '#f0f0f0',
          '--surface-color': '#fff',
          '--on-surface-color': '#404040',
          '--background-color': '#fff',
          '--menu-width': '220px',
          '--page-width-lv1': '360px',
          '--page-width-lv2': 'max(calc(min(100vw, 1600px) - 360px - 220px), 360px)',
          '--page-width-lv3': 'max(calc(min(100vw, 1600px) - 220px), 360px)',
          '--page-width-lv4': '100vw',
          '--page-height-lv1': '100vh',
        };
      }
    };
  }, ['root', 'properties']);
  readonly config = RootPropertyService.Config.inject();

  readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        for (const [key, value] of Object.entries(this.config?.() ?? {})) {
          document.documentElement.style.setProperty(key, value);
        }
      }
    });
  }
}

export function provideRootProperty(
  resolverFactoryFactory?: Parameters<typeof RootPropertyService.Config.provide>[0],
): Provider[] {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      useFactory: () => {
        return () => inject(RootPropertyService);
      },
      multi: true,
    },
    RootPropertyService.Config.provide(resolverFactoryFactory),
  ]
}

@Directive({ standalone: true, selector: '[atomicStyle]' })
export class NgAtomicStyleDirective {
  readonly #el = inject(ElementRef);
  readonly platformId = inject(PLATFORM_ID);

  constructor(private rootPropertyService: RootPropertyService) {
    effect(() => {
      for (const [key, value] of Object.entries(this.rootPropertyService.config?.() ?? {})) {
        this.#el.nativeElement.style.setProperty(key, value);
      }
    });
  }
}


@Injectable({providedIn: 'root'})
export class RootPropertyGuard {
	readonly properties = RootPropertyService.Config.inject();
	readonly properties$ = toObservable(this.properties);
	readonly platformId = inject(PLATFORM_ID);

	canActivate(): Observable<boolean> {
		if (isPlatformServer(this.platformId)) return of(null);	
		return this.properties$.pipe(
			filter(properties => properties['--background-color']  === '#f0f0f0'),
			delay(500),
			map(() => true),
		);
	}
}