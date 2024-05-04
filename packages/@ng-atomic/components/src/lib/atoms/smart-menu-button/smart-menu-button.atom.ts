import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Action } from '@ng-atomic/common/models';

@Component({
  selector: 'atoms-smart-menu-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './smart-menu-button.atom.html',
  styleUrls: ['./smart-menu-button.atom.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SmartMenuButtonAtom {
  @Input()
  items: Action[] = [];

  @Output()
  action = new EventEmitter<Action>();

  trackByItemId = (index: number, item: Action): string => item.id;
}
