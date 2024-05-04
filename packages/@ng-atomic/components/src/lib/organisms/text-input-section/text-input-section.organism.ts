import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TextInputFieldMolecule } from '@ng-atomic/components/molecules/text-input-field';

@Component({
  selector: 'organisms-text-input-section',
  standalone: true,
  imports: [
    CommonModule,
    TextInputFieldMolecule,
  ],
  template: `
  <molecules-text-input-field
    [type]="type"
    [control]="control"
    [label]="label"
    [placeholder]="placeholder"
    [hint]="hint"
    [autoComplete]="autoComplete"
  ></molecules-text-input-field>`,
  styleUrls: ['./text-input-section.organism.scss']
})
export class TextInputSectionOrganism {
  
  @Input()
  label = 'label';

  @Input()
  placeholder = 'placeholder';

  @Input()
  type: 'text' | 'number' | 'password' = 'text';

  @Input()
  hint?: string;

  @Input()
  control = new FormControl('');

  @Input()
  autoComplete: string[] = [];

}
