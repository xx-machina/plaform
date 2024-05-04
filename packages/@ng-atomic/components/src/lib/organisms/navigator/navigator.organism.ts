import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Action } from '@ng-atomic/common/models';
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
  templateUrl: './navigator.organism.html',
  styleUrls: ['./navigator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorOrganism {
  @Input()
  startActions: Action[] = [];

  @Input()
  endActions: Action[] = [];

  @Output()
  action = new EventEmitter<Action>();
}
