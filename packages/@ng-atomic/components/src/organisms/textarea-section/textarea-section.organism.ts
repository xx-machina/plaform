import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';

@Component({
  selector: 'organisms-textarea-section',
  templateUrl: './textarea-section.organism.html',
  styleUrls: ['./textarea-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaSectionOrganism {

  @Input()
  label = 'label';

  @Input()
  rows = 10;

  @Input()
  control = new FormControl('');

  @Output()
  action = new EventEmitter<Action>();

}
