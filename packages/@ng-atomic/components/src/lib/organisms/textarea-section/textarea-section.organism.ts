import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/core';
import { TextareaFieldMolecule } from '@ng-atomic/components/molecules/textarea-field';

@Component({
  selector: 'organisms-textarea-section',
  standalone: true,
  imports: [
    CommonModule,
    TextareaFieldMolecule,
  ],
  template: `
  <molecules-textarea-field
    [control]="control"
    [label]="label"
    [hint]="hint"
    [rows]="rows"
    [placeholder]="placeholder"
    (action)="action.emit($event)"
  ></molecules-textarea-field>`,
  styleUrls: ['./textarea-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaSectionOrganism {

  @Input()
  label = 'label';

  @Input()
  rows = 10;

  @Input()
  placeholder = 'placeholder';

  @Input()
  hint?: string;

  @Input()
  control = new FormControl('');

  @Output()
  action = new EventEmitter<Action>();

}
