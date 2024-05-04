import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, InjectionToken, Input, Type, inject } from '@angular/core';
import { Action } from '@ng-atomic/core';
import { InjectableComponent } from '@ng-atomic/core';
import { NgAtomicComponent } from '@ng-atomic/core';
import { NavigationListOrganismStore } from '@ng-atomic/components/organisms/navigation-list';
import { MenuFooterOrganismStore } from '@ng-atomic/components/organisms/menu-footer';
import { MenuHeaderOrganismStore } from '@ng-atomic/components/organisms/menu-header';

@Directive({ standalone: true, selector: 'templates-menu' })
export class MenuTemplateStore extends InjectableComponent {
  static readonly TOKEN = new InjectionToken<Type<MenuTemplateStore>>('[@ng-atomic/components] MenuTemplateStore');
  @Input() actions: Action<string>[] = [];
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MenuHeaderOrganismStore,
    NavigationListOrganismStore,
    MenuFooterOrganismStore
  ],
  selector: 'templates-menu',
  template: `
  <div class="top">
    <organisms-menu-header injectable></organisms-menu-header>
    <organisms-navigation-list injectable
      [actions]="store.actions"
      (action)="dispatch($event)"
    ></organisms-navigation-list>
  </div>
  <organisms-menu-footer injectable></organisms-menu-footer>
  `,
  styleUrls: ['./menu.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MenuTemplateStore,
      inputs: ['actions'],
    },
  ]
})
export class MenuTemplate extends NgAtomicComponent {
  protected store = inject(MenuTemplateStore);
}
