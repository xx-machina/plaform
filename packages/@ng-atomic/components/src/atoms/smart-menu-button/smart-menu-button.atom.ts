import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '@ng-atomic/common/models';

@Component({
  selector: 'atoms-smart-menu-button',
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
