import { ChangeDetectionStrategy, Component, Directive, inject, Input, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { SelectInputFieldMolecule } from '@ng-atomic/components/molecules/select-input-field';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-select-input-section' })
export class SelectInputSectionOrganismStore<T> extends InjectableComponent {
  readonly actions = input<Action[]>([]);
  readonly hint = input(null);
  readonly placeholder = input(null);
  readonly label = input('label');
  readonly control = input(new FormControl<T>({} as T));
  readonly options = input<{name: string, value: T}[]>([]);
  readonly multiple = input(false);
}

@Component({
  selector: 'organisms-select-input-section',
  standalone: true,
  imports: [
    SelectInputFieldMolecule,
    SmartMenuButtonAtom,
  ],
  template: `
  <molecules-select-input-field
    [label]="store.label()"
    [control]="store.control()"
    [options]="store.options()"
    [hint]="store.hint()"
    [placeholder]="store.placeholder()"
    [multiple]="store.multiple()"
  ></molecules-select-input-field>
  @if (store.actions()?.length) {
    <atoms-smart-menu-button
      [actions]="store.actions()"
      (action)="dispatch($event)"
    />
  }`,
  styleUrls: ['./select-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: SelectInputSectionOrganismStore,
      inputs: ['actions', 'hint', 'placeholder', 'label', 'control', 'options', 'multiple'],
    }
  ]
})
export class SelectInputSectionOrganism<T> extends NgAtomicComponent {
  protected readonly store = inject(SelectInputSectionOrganismStore<T>);
}
