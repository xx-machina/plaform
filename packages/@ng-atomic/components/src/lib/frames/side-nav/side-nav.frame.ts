import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, HostBinding, InjectionToken, Input, Signal, computed, inject, isSignal, signal } from '@angular/core';
import { injectUiConfig } from '@ng-atomic/common/services/ui';
import { DrawerFrame } from '@ng-atomic/components/frames/drawer';
import { LineUpFrame } from '@ng-atomic/components/frames/line-up';
import { MenuTemplateStore } from '@ng-atomic/components/templates/menu';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';
import { signalize } from '@ng-atomic/common/pipes/signal';
import { IconButtonMenuTemplateStore } from '@ng-atomic/components/templates/icon-button-menu';
import { Action } from '@ng-atomic/common/models';
import { InjectableComponent } from '@ng-atomic/common/core';

@Directive({ standalone: true, selector: 'frames-side-nav' })
export class SideNavFrameStore extends InjectableComponent {
  static TOKEN = new InjectionToken('side-nav-frame-store');

  @Input()
  readonly actions: Action[] = [];

  @Input({transform: (v: any) => signalize(v)})
  readonly menuType = injectUiConfig(['frames', 'sideNav', 'menuType']);

  @Input()
  readonly mode: 'expanded' | 'collapsed' = 'expanded';

  @Input({transform: (v: any) => signalize(v)})
  readonly frameType = injectUiConfig(['frames', 'sideNav', 'frameType']);

  @HostBinding('attr.frame')
  get attrFrame() {
    return this.frameType();
  }
}


@Component({
  standalone: true,
  imports: [
    CommonModule,
    DrawerFrame,
    LineUpFrame,
    IconButtonMenuTemplateStore,
    MenuTemplateStore,
  ],
  selector: 'frames-side-nav',
  template: `
  <ng-container [ngSwitch]="store.frameType()">
    <frames-drawer *ngSwitchCase="'drawer'" [isOpen]="store.mode === 'expanded'">
      <ng-container drawer *ngTemplateOutlet="menu"></ng-container>
      <ng-container contents *ngTemplateOutlet="contents"></ng-container>
    </frames-drawer>
    <frames-line-up *ngSwitchCase="'lineup'" [hasNext]="true" [scope]="'nav'">
      <ng-container main *ngTemplateOutlet="menu"></ng-container>
      <div class="content" next><ng-container *ngTemplateOutlet="contents"></ng-container></div>
    </frames-line-up>
  </ng-container>

  <ng-template #menu>
    <ng-container [ngSwitch]="store.menuType()">
      <templates-icon-button-menu injectable
        *ngSwitchCase="'icon-button-menu'"
        [actions]="store.actions"
        (action)="dispatch($event)"
      ></templates-icon-button-menu>
      <templates-menu injectable
        *ngSwitchCase="'menu'"
        [actions]="store.actions"
        (action)="dispatch($event)"
      ></templates-menu>
    </ng-container>
  </ng-template>
  <ng-template #contents>
    <ng-content select="[contents]"></ng-content>
  </ng-template>
  `,
  styleUrls: ['./side-nav.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SideNavFrameStore,
      inputs: ['actions', 'menuType', 'mode', 'frameType'],
    },
  ],
})
export class SideNavFrame extends NgAtomicComponent {
  protected store = inject(SideNavFrameStore);
}
