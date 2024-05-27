import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { Action, TokenizedType } from '@ng-atomic/core';
import { InjectableComponent } from '@ng-atomic/core';
import { NgAtomicComponent } from '@ng-atomic/core';
import { NavigationListOrganismStore } from '@ng-atomic/components/organisms/navigation-list';
import { MenuFooterOrganismStore } from '@ng-atomic/components/organisms/menu-footer';
import { MenuHeaderOrganismStore } from '@ng-atomic/components/organisms/menu-header';

@TokenizedType()
@Directive({ standalone: true, selector: 'templates-menu' })
export class MenuTemplateStore extends InjectableComponent {
  readonly actions = input<Action[]>([]);
  readonly title = input<string>();
}

@Component({
  standalone: true,
  imports: [
    MenuHeaderOrganismStore,
    NavigationListOrganismStore,
    MenuFooterOrganismStore,
  ],
  selector: 'templates-menu',
  template: `
  <div class="top">
    <organisms-menu-header [title]="store.title()" injectable/>
    <organisms-navigation-list injectable
      [actions]="store.actions()"
      (action)="dispatch($event)"
    />
  </div>
  <organisms-menu-footer injectable/>
  `,
  styleUrls: ['./menu.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MenuTemplateStore,
      inputs: ['actions', 'title'],
    },
  ]
})
export class MenuTemplate extends NgAtomicComponent {
  protected store = inject(MenuTemplateStore);
}
