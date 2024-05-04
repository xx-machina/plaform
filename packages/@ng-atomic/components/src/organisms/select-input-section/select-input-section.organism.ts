import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'organisms-select-input-section',
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
