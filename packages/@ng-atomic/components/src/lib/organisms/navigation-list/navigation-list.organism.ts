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
  template: `
  <mat-selection-list [multiple]="false">
    <molecules-navigation-list-item
      *ngFor="let _action of actions" 
      [action]="_action"
      (click)="action.emit(_action)"
    ></molecules-navigation-list-item>
  </mat-selection-list>
  `,
  styleUrls: ['./navigation-list.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationListOrganism {
  @Input()
  actions: Action<string>[] = [];

  @Output()
  action = new EventEmitter<Action>();
}
