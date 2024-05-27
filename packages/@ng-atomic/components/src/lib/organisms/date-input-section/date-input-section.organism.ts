import { ChangeDetectionStrategy, Component, Directive, inject, Input, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';
import { DateInputFieldMolecule } from '@ng-atomic/components/molecules/date-input-field';
import { Action, InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import dayjs from 'dayjs';

@TokenizedType()
@Directive({ standalone: true, selector: 'organisms-date-input-section' })
export class DateInputSectionOrganismStore extends InjectableComponent {
  readonly control = input(new FormControl<dayjs.Dayjs>(dayjs()));
  readonly label = input('');
  readonly placeholder = input('');
  readonly hint = input(null);
  readonly actions = input<Action[]>([]);
}


@Component({
  selector: 'organisms-date-input-section',
  standalone: true,
  imports: [
    DateInputFieldMolecule,
    SmartMenuButtonAtom,
  ],
  template: `
  <molecules-date-input-field
    [control]="store.control()"
    [label]="store.label()"
    [placeholder]="store.placeholder()"
    [hint]="store.hint()"
  />
  @if (store.actions()?.length) {
    <atoms-smart-menu-button injectable
      [actions]="store.actions()"
      (action)="dispatch($event)"
    />
  }
  `,
  styleUrls: ['./date-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: DateInputSectionOrganismStore,
      inputs: ['control', 'label', 'placeholder', 'hint', 'actions'],
    }
  ],
  host: {class: 'organism section'},
})
export class DateInputSectionOrganism extends NgAtomicComponent {
  protected store = inject(DateInputSectionOrganismStore);
}
