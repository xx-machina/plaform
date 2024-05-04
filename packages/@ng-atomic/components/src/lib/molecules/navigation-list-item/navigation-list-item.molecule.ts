import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Directive, inject, InjectionToken } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InjectableComponent } from '@ng-atomic/common/core';
import { Action } from '@ng-atomic/common/models';
import { IconAtom } from '@ng-atomic/components/atoms/icon';

@Directive({ standalone: true, selector: 'molecules-navigation-list-item' })
export class NavigationListItemMoleculeStore extends InjectableComponent {
  static TOKEN = new InjectionToken('NavigationListItemMoleculeStore');
  @Input('action') _action: Action;
  @Input() selected = false;
}

@Component({
  selector: 'molecules-navigation-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    IconAtom,
  ],
  template: `
    <mat-list-item>
      <atoms-icon
        matListItemIcon
        [name]="store._action?.icon"
        [color]="store._action?.color"
        matListItemMeta
      ></atoms-icon>
      <div matListItemTitle>{{ store._action.name }}</div>
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
export class NavigationListItemMolecule {
  protected store = inject(NavigationListItemMoleculeStore);
}
