import { ChangeDetectionStrategy, Component, Directive, inject, input, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { OverlayFrame } from '@ng-atomic/components/frames/overlay';
import { LineUpFrame } from '@ng-atomic/components/frames/line-up';
import { PRIMARY_OUTLET, RouterOutlet } from '@angular/router';
import { Breakpoint, makeConfig } from '@ng-atomic/common/services/ui';
import { InjectableComponent, NgAtomicComponent, _computed } from '@ng-atomic/core';
import { combineLatest, map, of, startWith } from 'rxjs';
import { computedAsync } from 'ngxtension/computed-async';

function isBlankRoute(outlet: RouterOutlet): boolean {
  return !!(outlet?.activatedRouteData) && !(outlet.activatedRouteData?.['isBlank']);
}

@Directive({standalone: true, selector: 'frames-router-outlet'})
export class RouterOutletFrameStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    const getFrame = (breakpoint: Breakpoint) => {
      switch(breakpoint) {
        case 'xSmall': return 'overlay' as 'lineup' | 'overlay';
        default: return 'lineup' as 'lineup' | 'overlay';
      }
    }
    return (_, context) => {
      return ({
        frame: getFrame(context.breakpoint),
        name: PRIMARY_OUTLET as string,
        isActivated: (outlet: RouterOutlet) => isBlankRoute(outlet),
      });
    }
  }, ['components', 'frames', 'router-outlet']);

  static provideExperimental() {
    return RouterOutletFrameStore.Config.provide(() => {
      return (config) => ({ ...config, isActivated: (outlet) => !!outlet.isActivated });
    });
  }

  readonly config = RouterOutletFrameStore.Config.inject();
  readonly frame = input(_computed(() => this.config().frame));
  readonly name = input(_computed(() => this.config().name, { equal: (a, b) => a === b }));
  readonly isActivated = input(_computed(() => this.config().isActivated));
} 

@Component({
  selector: 'frames-router-outlet',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    OverlayFrame,
    LineUpFrame,
    RouterOutlet,
  ],
  template: `
    @switch (store.frame()) {
      @case ('lineup') {
        <frames-line-up [hasNext]="isActivated()" [scope]="store.name()">
          <ng-container *ngTemplateOutlet="main" main/>
          <ng-container *ngTemplateOutlet="next" next/>
        </frames-line-up>
      }
      @default {
        <frames-overlay [hasNext]="isActivated()">
          <ng-container *ngTemplateOutlet="main" main/>
          <ng-container *ngTemplateOutlet="next" next/>
        </frames-overlay>
      }
    }
    <ng-template #main><ng-content main /></ng-template>
    <ng-template #next><router-outlet [name]="store.name()"/></ng-template>
  `,
  styleUrls: ['./router-outlet.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: RouterOutletFrameStore,
      inputs: ['frame', 'name'],
    },
  ],
})
export class RouterOutletFrame extends NgAtomicComponent {
  protected store = inject(RouterOutletFrameStore);
  readonly outlet = viewChild(RouterOutlet);
  readonly isActivated = computedAsync(() => {
    const outlet = this.outlet();
    if (!outlet) return of(false);
    return combineLatest([
      outlet.activateEvents.pipe(startWith(null)), 
      outlet.deactivateEvents.pipe(startWith(null)),
    ]).pipe(
      map(() => this.store.isActivated()(outlet)),
    )
  })
}
