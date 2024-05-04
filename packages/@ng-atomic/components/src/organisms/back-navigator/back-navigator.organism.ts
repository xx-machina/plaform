import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Action } from '@ng-atomic/common/models';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';

@Component({
  selector: 'organisms-back-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SmartMenuButtonAtom,
  ],
  templateUrl: './back-navigator.organism.html',
  styleUrls: ['./back-navigator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackNavigatorOrganism {

  @Input()
  canBack = true;

  @Input()
  title?: string;

  @Input()
  description?: string;

  @Input()
  items: Action[] = [];

  @Output()
  backButtonClick = new EventEmitter<void>();

  @Output()
  action = new EventEmitter<Action>();

}
