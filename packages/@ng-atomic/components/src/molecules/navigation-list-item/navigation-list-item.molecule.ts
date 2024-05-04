import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { Action } from '@ng-atomic/common/models';

@Component({
  selector: 'molecules-navigation-list-item',
  templateUrl: './navigation-list-item.molecule.html',
  styleUrls: ['./navigation-list-item.molecule.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListItemMolecule {

  @Input()
  action!: Action;

  @Input()
  selected = false;

}
