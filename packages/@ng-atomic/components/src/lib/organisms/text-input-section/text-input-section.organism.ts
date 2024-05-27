import { Component, Directive, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmartMenuButtonAtomStore } from '@ng-atomic/components/atoms/smart-menu-button';
import { TextInputFieldMoleculeStore } from '@ng-atomic/components/molecules/text-input-field';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-text-input-section' })
export class TextInputSectionOrganismStore extends InjectableComponent {
  readonly label = input('label');
  readonly placeholder = input('placeholder');
  readonly type = input<'text' | 'number' | 'password'>('text');
  readonly hint = input<string>();
  readonly control = input(new FormControl(''));
  readonly autoComplete = input<string[]>([]);
  readonly actions = input<Action[]>([]);
}

@Component({
  selector: 'organisms-text-input-section',
  standalone: true,
  imports: [
    TextInputFieldMoleculeStore,
    SmartMenuButtonAtomStore,
  ],
  template: `
  <molecules-text-input-field injectable
    [type]="store.type()"
    [control]="store.control()"
    [label]="store.label()"
    [placeholder]="store.placeholder()"
    [hint]="store.hint()"
    [autoComplete]="store.autoComplete()"
  />
  @if (store.actions()?.length) {
    <atoms-smart-menu-button injectable
      [actions]="store.actions()"
      (action)="dispatch($event)"
    />
  }
  `,
  styleUrls: ['./text-input-section.organism.scss'],
  hostDirectives: [
    {
      directive: TextInputSectionOrganismStore,
      inputs: ['label', 'placeholder', 'type', 'hint', 'control', 'autoComplete', 'actions'],
    }
  ]
})
export class TextInputSectionOrganism extends NgAtomicComponent {
  protected store = inject(TextInputSectionOrganismStore);
}
