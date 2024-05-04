import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Action } from '@ng-atomic/common/models';

@Component({
  selector: 'organisms-navigation-list',
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
