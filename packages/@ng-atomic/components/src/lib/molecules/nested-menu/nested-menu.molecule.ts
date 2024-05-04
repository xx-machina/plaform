import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action } from '@ng-atomic/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'molecules-nested-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
  ],
  template: `
    <mat-menu #childMenu="matMenu" [overlapTrigger]="false">
    <span *ngFor="let _action of actions">
      <span *ngIf="_action?.children">
        <button mat-menu-item [matMenuTriggerFor]="menu.childMenu">
          <mat-icon>{{_action.icon}}</mat-icon>
          <span>{{ _action.name }}</span>
        </button>
        <molecules-nested-menu
          #menu
          [actions]="_action.children"
          (action)="action.emit($event)"
        ></molecules-nested-menu>
      </span>
      
      <span *ngIf="!_action?.children">
        <button mat-menu-item (click)="action.emit(_action)">
          <mat-icon>{{ _action.icon }}</mat-icon>
          <span>{{ _action.name }}</span>
        </button>
      </span>
    </span>
  </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestedMenuMolecule {
  @Input()
  actions: Action[];

  @ViewChild('childMenu')
  childMenu;

  @Output()
  action = new EventEmitter<Action>();
}
