import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '@ng-atomic/common/models';
import { NavigationListOrganism } from '@ng-atomic/components/organisms/navigation-list';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NavigationListOrganism,
  ],
  selector: 'templates-menu',
  templateUrl: './menu.template.html',
  styleUrls: ['./menu.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuTemplate {

  @Input()
  actions: Action<string>[] = [];

  @Output()
  action = new EventEmitter<Action>();

}
