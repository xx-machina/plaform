import { Component, ChangeDetectionStrategy, Directive, inject, input, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { Action } from '@ng-atomic/core';
import { IconAtom } from '@ng-atomic/components/atoms/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { BadgeAtom } from '@ng-atomic/components/atoms/badge';

@TokenizedType()
@Directive({ standalone: true, selector: 'molecules-navigation-list-item' })
export class NavigationListItemMoleculeStore extends InjectableComponent {
  readonly action = input<Action>(null, {alias: 'action'});
  readonly selected = input(false);
}

@Component({
  selector: 'molecules-navigation-list-item',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    IconAtom,
    BadgeAtom,
  ],
  template: `
    <mat-list-item>
      <atoms-icon
        matListItemIcon
        matListItemMeta
        [name]="store.action()?.icon"
        [color]="store.action()?.color"
      />
      <div matListItemTitle>
        <span>{{ store.action()?.name }}</span>
        @if (store.action()?.meta?.badge) {
          <atoms-badge [value]="store.action()?.meta?.badge"/>
        }
      </div>
    </mat-list-item>
  `,
  styleUrls: ['./navigation-list-item.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NavigationListItemMoleculeStore,
      inputs: ['action', 'selected'],
    },
  ]
})
export class NavigationListItemMolecule extends NgAtomicComponent {
  protected store = inject(NavigationListItemMoleculeStore);
}
