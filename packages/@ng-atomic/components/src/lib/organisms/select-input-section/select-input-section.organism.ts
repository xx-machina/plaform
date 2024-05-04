import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectInputFieldMolecule } from '@ng-atomic/components/molecules/select-input-field';

@Component({
  selector: 'organisms-select-input-section',
  standalone: true,
  imports: [
    CommonModule,
    SelectInputFieldMolecule,
  ],
  templateUrl: './select-input-section.organism.html',
  styleUrls: ['./select-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputSectionOrganism<T> {

  @Input()
  label: string = '';

  @Input()
  control = new FormControl<T>({} as T);

  @Input()
  options: {name: string, value: T}[] = [];
  
}
