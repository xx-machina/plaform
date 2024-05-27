import { Component, Directive, InjectionToken, Input, inject, input } from '@angular/core';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { RouterOutletFrame } from '@ng-atomic/components/frames/router-outlet';
import { TermTemplate } from '@ng-atomic/components/templates/term';
import { InjectableComponent, NgAtomicComponent, _computed } from '@ng-atomic/core';

enum ActionId {
  BACK = '[@ng-atomic/components/pages/terms] Back',
}
@Directive({
  standalone: true,
  selector: 'templates-term',
})
export class TermsPageStore extends InjectableComponent {
  static readonly ActionId = ActionId;
  static readonly Config = makeConfig(() => {
    return () => ({
      navStartActions: [
        {
          id: ActionId.BACK,
          name: '戻る',
          icon: 'arrow_back',
        },
      ],
      navEndActions: [],
      title: 'title',
      src: 'src',
      data: undefined,
    });
  }, ['components', 'pages', 'terms']);

  readonly config = TermsPageStore.Config.inject();
  readonly navStartActions = input(_computed(() => this.config().navStartActions));
  readonly navEndActions = input(_computed(() => this.config().navEndActions));
  readonly title = input(_computed(() => this.config().title));
  readonly src = input(_computed(() => this.config().src));
  readonly data = input(_computed(() => this.config().data));
}

@Component({
  selector: 'pages-terms',
  standalone: true,
  imports: [
    RouterOutletFrame,
    TermTemplate,
  ],
  template: `
    <frames-router-outlet>
      <templates-term
        [data]="store.data()"
        [src]="store.src()"
        [title]="store.title()"
        [navStartActions]="store.navStartActions()"
        [navEndActions]="store.navEndActions()"
        (action)="dispatch($event)"
      />
    </frames-router-outlet>
  `,
  styleUrl: './terms.page.scss',
  hostDirectives: [TermsPageStore]
})
export class TermsPage extends NgAtomicComponent {
  protected readonly store = inject(TermsPageStore);
}
