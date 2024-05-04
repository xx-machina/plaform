import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Action } from '@ng-atomic/common/models';
import { NavigationListItemMolecule } from '@ng-atomic/components/molecules/navigation-list-item';

@Component({
  selector: 'organisms-navigation-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    NavigationListItemMolecule,
  ],
  templateUrl: './navigation-list.organism.html',
  styleUrls: ['./navigation-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListOrganism {
  @Input()
  actions: Action<string>[] = [];

  @Output()
  action = new EventEmitter<Action>();
}
