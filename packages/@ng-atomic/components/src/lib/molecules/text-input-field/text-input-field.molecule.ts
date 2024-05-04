import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'molecules-text-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './text-input-field.molecule.html',
  styleUrls: ['./text-input-field.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'molecule field'},
})
export class TextInputFieldMolecule {

  @Input()
  appearance: 'outline' | 'fill' = 'outline';

  @Input()
  type: 'text' | 'number' | 'password' = 'text';

  @Input()
  name?: string;

  @Input()
  label = 'label';

  @Input()
  control = new FormControl<string | number>('');

  @Input()
  placeholder = 'placeholder';

  @Input()
  hint?: string;

}
