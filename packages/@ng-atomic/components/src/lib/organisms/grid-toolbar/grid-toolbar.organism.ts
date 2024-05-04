import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Action } from '@ng-atomic/common/models';
import { NestedMenuMolecule } from '@ng-atomic/components/molecules/nested-menu';

export enum ActionId {
  COLUMNS = '[@ng-atomic/components/organisms/grid-toolbar] Columns',
  FILTERS = '[@ng-atomic/components/organisms/grid-toolbar] Filters',
  EXPORT = '[@ng-atomic/components/organisms/grid-toolbar] Export',
}

@Component({
  selector: 'organisms-grid-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NestedMenuMolecule,
  ],
  template: `
    <ng-container *ngFor="let _action of actions">
      <ng-container *ngIf="_action?.children">
        <button
          mat-button
          color="basic"
          [matMenuTriggerFor]="menu.childMenu"
        ><mat-icon>{{ _action.icon }}</mat-icon> <span>{{ _action.name }}</span></button>
        <molecules-nested-menu
          #menu
          [actions]="_action.children"
          (action)="action.emit($event)"
        ></molecules-nested-menu>
      </ng-container>
      <button
        *ngIf="!_action?.children"
        mat-button
        color="basic"
        (click)="action.emit(_action)"
      ><mat-icon>{{ _action.icon }}</mat-icon>  <span>{{ _action.name }}</span></button>
    </ng-container>
  `,
  styleUrls: ['./grid-toolbar.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridToolbarOrganism {
  @Input()
  actions: Action[] = [
    {
      id: ActionId.COLUMNS,
      icon: 'view_column',
      name: 'Columns',
    },
    {
      id: ActionId.FILTERS,
      icon: 'filter_list',
      name: 'Filters',
    },
    {
      id: 'Display',
      icon: 'display_settings',
      name: 'Display',
      children: [
        {
          id: 'Flat',
          name: 'Flat',
        },
        {
          id: 'Tree',
          name: 'Tree',
          children: [
            {
              id: 'A',
              name: 'A',
            },
            {
              id: 'B',
              name: 'B',
            }
          ]
        },
      ],
    },
    {
      id: ActionId.EXPORT,
      icon: 'download',
      name: 'Export'
    },
  ];

  @Output()
  action = new EventEmitter<Action>();

}
