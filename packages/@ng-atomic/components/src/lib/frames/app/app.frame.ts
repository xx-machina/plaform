import { ChangeDetectionStrategy, Component, PLATFORM_ID, effect, input } from '@angular/core';
import { Directive, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingFrame } from '@ng-atomic/components/frames/loading';
import { SideNavFrame } from '@ng-atomic/components/frames/side-nav';
import { EntranceFrame } from '@ng-atomic/components/frames/entrance';
import { Action, InjectableComponent, NgAtomicComponent, _computed } from '@ng-atomic/core';
import { FormBuilder } from '@angular/forms';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BackgroundTemplateStore } from '@ng-atomic/components/templates/background';
import { DrawerFrame } from '@ng-atomic/components/frames/drawer';
import { FabFrame } from '@ng-atomic/components/frames/fab';

enum ActionId {
  SIGN_IN_WITH_GOOGLE = '[@temokari/scheduler] Sign In With Google',
  NAVIGATE = '[@temokari/scheduler] Navigate',
  SIGN_OUT = '[@temokari/scheduler] Sign Out',
}

@Directive({ standalone: true, selector: 'frames-app' })
export class AppFrameStore extends InjectableComponent {
  static readonly ActionId = ActionId;
  static readonly Config = makeConfig(() => {
    return () => ({
      fabActions: [],
      fabHide: true,
      isEntrance: true,
      isLoading: false,
      sideAppOpened: false,
      title: 'title',
      form: inject(FormBuilder).group({}),
      entranceActions: [
        { id: ActionId.SIGN_IN_WITH_GOOGLE, name: 'Googleでサインイン', icon: '' },
      ],
      sideNavActions: [
        { id: ActionId.SIGN_OUT, name: 'ログアウト', icon: 'exit_to_app' },
      ],
      sideNavMode: 'collapsed' as 'expanded' | 'collapsed',
      sideAppOutletName: 'side-app',
    });
  }, ['components', 'frames', 'app'])

  readonly config = AppFrameStore.Config.inject();
  readonly isLoading = input(_computed(() => this.config().isLoading));
  readonly isEntrance = input(_computed(() => this.config().isEntrance));
  readonly sideAppOpened = input(_computed(() => this.config().sideAppOpened));
  readonly title = input(_computed(() => this.config().title));
  readonly form = input(_computed(() => this.config().form));
  readonly entranceActions = input(_computed(() => this.config().entranceActions));
  readonly sideNavActions = input(_computed(() => this.config().sideNavActions));
  readonly sideNavMode = input(_computed(() => this.config().sideNavMode));
  readonly sideAppOutletName = input(_computed(() => this.config().sideAppOutletName));
  readonly fabActions = input(_computed(() => this.config().fabActions));
  readonly fabHide = input(_computed(() => this.config().fabHide));

  constructor() {
    super();
    effect(() => {
      console.debug('this.title:', this.title());
    })
  }
}


@Component({
  selector: 'frames-app',
  standalone: true,
  imports: [
    FabFrame,
    LoadingFrame,
    SideNavFrame,
    RouterOutlet,
    EntranceFrame,
    // DrawerFrameStore,
    DrawerFrame,
    BackgroundTemplateStore,
  ],
  template: `
  <router-outlet/>
  @if (isPlatformBrowser()) {
    @defer {
      <templates-background injectable/>
    }
  }
  <frames-loading [isLoading]="store.isLoading()">
    <frames-fab [actions]="store.fabActions()" [hide]="store.fabHide()">
      <frames-entrance
        [isEntrance]="store.isEntrance()"
        [form]="store.form()"
        [title]="store.title()"
        [actions]="store.entranceActions()"
        (action)="dispatch($event)"
      >
        <frames-drawer
          [opened]="store.sideAppOpened()"
          [position]="'end'"
          [hasBackdrop]="false"
        >
          <frames-side-nav
            [actions]="store.sideNavActions()"
            [mode]="store.sideNavMode()"
            [menuTitle]="store.title()"
            (action)="dispatch($event)"
            contents
          >
            <router-outlet contents/>
          </frames-side-nav>
          <div drawer style="width: var(--page-width-lv1);height: 100%;">
            <router-outlet [name]="store.sideAppOutletName()" />
        </div>
        </frames-drawer>
      </frames-entrance>
    </frames-fab>
  </frames-loading>
  `,
  styleUrl: './app.frame.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    AppFrameStore,
  ],
})
export class AppFrame extends NgAtomicComponent {
  protected store = inject(AppFrameStore);
  readonly platformId = inject(PLATFORM_ID);

  protected isPlatformServer() {
    return isPlatformServer(this.platformId);
  }

  protected isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  dispatch(action: Action<any>, scope?: string, componentId?: string | number): Promise<void> {
    return super.dispatch(action, scope, componentId);
  }
}
