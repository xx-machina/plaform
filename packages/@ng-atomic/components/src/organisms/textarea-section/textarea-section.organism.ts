import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';
import { TextareaFieldMolecule } from '@ng-atomic/components/molecules/textarea-field';

@Component({
  selector: 'organisms-textarea-section',
  standalone: true,
  imports: [
    CommonModule,
    TextareaFieldMolecule,
  ],
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
