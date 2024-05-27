import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, HostBinding, WritableSignal, inject, input, signal } from '@angular/core';
import { Breakpoint } from '@ng-atomic/common/services/breakpoint';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { DrawerFrame } from '@ng-atomic/components/frames/drawer';
import { LineUpFrame } from '@ng-atomic/components/frames/line-up';
import { MenuTemplateStore } from '@ng-atomic/components/templates/menu';
import { NgAtomicComponent, TokenizedType, _computed } from '@ng-atomic/core';
import { IconButtonMenuTemplateStore } from '@ng-atomic/components/templates/icon-button-menu';
import { InjectableComponent } from '@ng-atomic/core';

export function injectSideNavMode(): WritableSignal<'collapsed' | 'expanded'> {
  return signal<'collapsed' | 'expanded'>('collapsed');
}

@TokenizedType()
@Directive({ standalone: true, selector: 'frames-side-nav' })
export class SideNavFrameStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    const getFrameType = (breakpoint: Breakpoint) => {
      switch (breakpoint) {
        case 'xSmall': return 'drawer';
        default: return 'lineup';
      }
    }

    const getMenuType = (breakpoint: Breakpoint) => {
      switch (breakpoint) {
        case 'xSmall': return 'menu';
        case 'small':
        case 'medium': return 'icon-button-menu';
        default: return 'menu';
      }
    }

    const getMode = (breakpoint: Breakpoint) => {
      switch (breakpoint) {
        case 'xSmall': return 'collapsed';
        default: return 'expanded';
      }
    }

    return (_, context) => ({
      actions: [],
      menuType: getMenuType(context.breakpoint),
      menuTitle: undefined as string,
      mode: getMode(context.breakpoint),
      frameType: getFrameType(context.breakpoint) as 'lineup' | 'drawer',
    });
  }, ['components', 'frames', 'sideNav']);

  readonly config = SideNavFrameStore.Config.inject();
  readonly actions = input(_computed(() => this.config().actions));
  readonly menuType = input(_computed(() => this.config().menuType));
  readonly menuTitle = input(_computed(() => this.config().menuTitle));
  readonly mode = input(_computed(() => this.config().mode));
  readonly frameType = input(_computed(() => this.config().frameType));

  @HostBinding('attr.frame')
  get attrFrame() {
    return this.frameType();
  }
}


@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet,
    DrawerFrame,
    LineUpFrame,
    IconButtonMenuTemplateStore,
    MenuTemplateStore,
  ],
  selector: 'frames-side-nav',
  template: `
  @switch (store.frameType()) {
    @case ('drawer') {
      @defer {
        <frames-drawer [opened]="store.mode() === 'expanded'">
          <ng-container *ngTemplateOutlet="menu" drawer/>
          <ng-container *ngTemplateOutlet="contents" contents/>
        </frames-drawer>
      }
    }
    @default {
      <!-- @defer { -->
        <frames-line-up [hasNext]="true" [scope]="'nav'">
          <ng-container *ngTemplateOutlet="menu" main/>
          <div class="content" next><ng-container *ngTemplateOutlet="contents"/></div>
        </frames-line-up>
      <!-- } -->
    }
  }

  <ng-template #menu>
    @switch (store.menuType()) {
      @case ('icon-button-menu') {
        <!-- @defer { -->
          <templates-icon-button-menu injectable
            [actions]="store.actions()"
            (action)="dispatch($event)"
          />
        <!-- } -->
      }
      @default {
        <!-- @defer { -->
          <templates-menu injectable
            [title]="store.menuTitle()"
            [actions]="store.actions()"
            (action)="dispatch($event)"
          />
        <!-- } -->
      }
    }
  </ng-template>
  <ng-template #contents><ng-content/></ng-template>
  `,
  styleUrls: ['./side-nav.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SideNavFrameStore,
      inputs: ['actions', 'menuType', 'menuTitle', 'mode', 'frameType'],
    },
  ],
})
export class SideNavFrame extends NgAtomicComponent {
  protected store = inject(SideNavFrameStore);
}
