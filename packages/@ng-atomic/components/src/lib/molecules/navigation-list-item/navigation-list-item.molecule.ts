import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Action } from '@ng-atomic/common/models';
import { IconAtom } from '@ng-atomic/components/atoms/icon';

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
        [name]="action?.icon"
        [color]="action?.color"
      ></atoms-icon>
      <div matListItemTitle>{{ action.name }}</div>
    </mat-list-item>
  `,
  styleUrls: ['./navigation-list-item.molecule.scss'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListItemMolecule {

  @Input()
  action!: Action;

  @Input()
  selected = false;

}
