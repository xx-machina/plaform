import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Action, Actions } from '@ng-atomic/common/models';

@Component({
  selector: 'atoms-smart-menu-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
  <ng-container [ngSwitch]="actions?.length ?? 0">
    <ng-container *ngSwitchCase="0"></ng-container>
    <ng-container *ngSwitchCase="1">
      <button mat-icon-button (click)="action.emit(actions[0])" [disabled]="actions[0].disabled">
        <mat-icon>{{ actions[0]?.icon }}</mat-icon>
      </button>
    </ng-container>
    <ng-container *ngSwitchDefault>
      <button mat-icon-button [matMenuTriggerFor]="menu" [disabled]="action.disabled" *ngIf="actions.length">
        <mat-icon>more_vert</mat-icon>
      </button>
    </ng-container>
  </ng-container>

  <mat-menu #menu="matMenu">
    <button 
      *ngFor="let _action of actions; trackBy: trackByItemId"
      mat-menu-item 
      (click)="action.emit(_action)"
    >{{ _action.name }}</button>
  </mat-menu>
  `,
  styleUrls: ['./smart-menu-button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SmartMenuButtonAtom {
  @Input()
  actions: Actions = [];

  @Output()
  action = new EventEmitter<Action>();

  trackByItemId = (index: number, item: Action): string => item.id;
}
