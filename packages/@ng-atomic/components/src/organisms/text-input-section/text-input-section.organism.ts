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
  templateUrl: './text-input-section.organism.html',
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

}
