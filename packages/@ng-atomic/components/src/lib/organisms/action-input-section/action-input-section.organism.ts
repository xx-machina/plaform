import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionInputFieldMolecule } from '@ng-atomic/components/molecules/action-input-field';
import { FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';

@Component({
  selector: 'organisms-action-input-section',
  standalone: true,
  imports: [
    CommonModule,
    ActionInputFieldMolecule,
  ],
  template: `
    <molecules-action-input-field
      [actions]="actions"
      [control]="control"
      [label]="label"
      [placeholder]="placeholder"
      (action)="dispatch($event)"
    ></molecules-action-input-field>
  `,
  styleUrls: ['./action-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionInputSectionOrganism extends NgAtomicComponent {
  @Input()
  control = new FormControl<string | number>('');

  @Input()
  label = 'label';

  @Input()
  placeholder = 'placeholder';

  @Input()
  actions: Action[] = [];
}
