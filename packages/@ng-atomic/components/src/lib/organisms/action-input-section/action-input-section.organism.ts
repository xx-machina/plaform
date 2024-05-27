import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { ActionInputFieldMolecule } from '@ng-atomic/components/molecules/action-input-field';
import { FormControl } from '@angular/forms';
import { Action, InjectableComponent, TokenizedType } from '@ng-atomic/core';
import { NgAtomicComponent } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-action-input-section' })
export class ActionInputSectionOrganismStore extends InjectableComponent {
  readonly control = input(new FormControl<string | number>(''));
  readonly label = input('label');
  readonly placeholder = input('placeholder');
  readonly actions = input<Action[]>([]);
  readonly hint = input(null);
}

@Component({
  selector: 'organisms-action-input-section',
  standalone: true,
  imports: [
    ActionInputFieldMolecule,
  ],
  template: `
    <molecules-action-input-field
      [actions]="store.actions()"
      [control]="store.control()"
      [label]="store.label()"
      [placeholder]="store.placeholder()"
      [hint]="store.hint()"
      (action)="dispatch($event)"
    ></molecules-action-input-field>
  `,
  styleUrls: ['./action-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ActionInputSectionOrganismStore,
      inputs: ['control', 'label', 'placeholder', 'actions', 'hint'],
    }
  ]
})
export class ActionInputSectionOrganism extends NgAtomicComponent {
  protected readonly store = inject(ActionInputSectionOrganismStore);
}
