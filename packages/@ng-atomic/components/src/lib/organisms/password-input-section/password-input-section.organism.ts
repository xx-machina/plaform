import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmartMenuButtonAtomStore } from '@ng-atomic/components/atoms/smart-menu-button';
import { TextInputFieldMoleculeStore } from '@ng-atomic/components/molecules/text-input-field';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-password-input-section' })
export class PasswordInputSectionOrganismStore extends InjectableComponent {
  readonly label = input('label');
  readonly placeholder = input('placeholder');
  readonly hint = input<string>();
  readonly control = input(new FormControl(''));
  readonly autoComplete = input<string[]>([]);
  readonly actions = input<Action[]>([]);
  readonly actionButtonType = input<'button' | 'icon-button'>('icon-button');
}


@Component({
  selector: 'organisms-password-input-section',
  standalone: true,
  imports: [
    TextInputFieldMoleculeStore,
    SmartMenuButtonAtomStore,
  ],
  template: `
    <molecules-text-input-field injectable
      [type]="'password'"
      [control]="store.control()"
      [label]="store.label()"
      [placeholder]="store.placeholder()"
      [hint]="store.hint()"
      [autoComplete]="store.autoComplete()"
    />
  @if (store.actions()?.length) {
    <atoms-smart-menu-button injectable
      [actions]="store.actions()"
      [type]="store.actionButtonType()"
      (action)="dispatch($event)"
    />
  }`,
  styleUrl: './password-input-section.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: PasswordInputSectionOrganismStore,
      inputs: ['label', 'placeholder', 'hint', 'control', 'autoComplete', 'actions', 'actionButtonType'],
    },
  ],
})
export class PasswordInputSectionOrganism extends NgAtomicComponent {
  protected store = inject(PasswordInputSectionOrganismStore);
}
