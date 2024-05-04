import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Action, Actions } from '@ng-atomic/common/models';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';

@Component({
  selector: 'organisms-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SmartMenuButtonAtom,
  ],
  template: `
  <mat-toolbar color="primary">
    <div>
      <atoms-smart-menu-button
        *ngIf="startActions.length"
        [actions]="startActions"
        (action)="action.emit($event)"
      ></atoms-smart-menu-button>
      <ng-content></ng-content>
    </div>
    <div>
      <atoms-smart-menu-button
        *ngIf="endActions.length"
        [actions]="endActions"
        (action)="action.emit($event)"
      ></atoms-smart-menu-button>
    </div>
  </mat-toolbar>
  `,
  styleUrls: ['./navigator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorOrganism {
  @Input()
  startActions: Actions = [];

  @Input()
  endActions: Actions = [];

  @Output()
  action = new EventEmitter<Action>();
}
