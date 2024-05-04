import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Action } from '@ng-atomic/common/models';

@Component({
  selector: 'organisms-action-buttons-section',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './action-buttons-section.organism.html',
  styleUrls: ['./action-buttons-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism section'},
})
export class ActionButtonsSectionOrganism {
  @Input()
  actions: Action[] = [];

  @Output()
  action = new EventEmitter<Action>();

  trackById = (item: Action) => item.id;
}
